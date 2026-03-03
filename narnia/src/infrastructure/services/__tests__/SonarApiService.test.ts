import { SonarApiService } from "@/infrastructure/services/SonarApiService";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

describe("SonarApiService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "test-token";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns quality gate and measures when Sonar responses are successful", async () => {
    const httpClientMock = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            projectStatus: {
              status: "OK"
            }
          }
        })
        .mockResolvedValueOnce({
          data: {
            component: {
              measures: [
                { metric: "coverage", value: "82.5" },
                { metric: "bugs", value: "3" },
                { metric: "vulnerabilities", value: "1" }
              ]
            }
          }
        })
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectSnapshot("monitor_afiliaciones");

    expect(result.qualityGate).toBe("passed");
    expect(result.coverage).toBe(82.5);
    expect(result.bugs).toBe(3);
    expect(result.vulnerabilities).toBe(1);
    expect(httpClientMock.get).toHaveBeenCalledWith("/api/qualitygates/project_status", {
      params: { projectKey: "monitor_afiliaciones" }
    });
    expect(httpClientMock.get).toHaveBeenCalledWith("/api/measures/component", {
      params: {
        component: "monitor_afiliaciones",
        metricKeys: "coverage,bugs,vulnerabilities"
      }
    });
  });

  it("returns failed quality gate when status is ERROR", async () => {
    const httpClientMock = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            projectStatus: {
              status: "ERROR"
            }
          }
        })
        .mockResolvedValueOnce({
          data: {
            component: {
              measures: []
            }
          }
        })
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectSnapshot("monitor_afiliaciones");

    expect(result.qualityGate).toBe("failed");
  });

  it("returns unknown quality gate when status is not recognized", async () => {
    const httpClientMock = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            projectStatus: {
              status: "WARN"
            }
          }
        })
        .mockResolvedValueOnce({
          data: {
            component: {
              measures: []
            }
          }
        })
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectSnapshot("monitor_afiliaciones");

    expect(result.qualityGate).toBe("unknown");
  });

  it("throws ValidationError when project key is empty", async () => {
    const httpClientMock = {
      get: jest.fn()
    };

    const service = new SonarApiService(httpClientMock as never);

    await expect(service.getProjectSnapshot(" ")).rejects.toBeInstanceOf(
      ValidationError
    );
  });

  it("throws InternalServerError when Sonar is not configured", async () => {
    delete process.env.SONAR_BASE_URL;

    const httpClientMock = {
      get: jest.fn()
    };

    const service = new SonarApiService(httpClientMock as never);

    await expect(service.getProjectSnapshot("monitor_afiliaciones")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });

  it("maps quality gate technical errors to InternalServerError", async () => {
    const httpClientMock = {
      get: jest.fn().mockRejectedValue(new Error("timeout"))
    };

    const service = new SonarApiService(httpClientMock as never);

    await expect(service.getProjectSnapshot("monitor_afiliaciones")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });

  it("returns undefined metrics when measures endpoint fails", async () => {
    const httpClientMock = {
      get: jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            projectStatus: {
              status: "OK"
            }
          }
        })
        .mockRejectedValueOnce(new Error("measures unavailable"))
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectSnapshot("monitor_afiliaciones");

    expect(result.qualityGate).toBe("passed");
    expect(result.coverage).toBeUndefined();
    expect(result.bugs).toBeUndefined();
    expect(result.vulnerabilities).toBeUndefined();
  });
});
