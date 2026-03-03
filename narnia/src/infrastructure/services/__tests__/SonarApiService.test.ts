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

  it("returns passed when quality gate status is OK", async () => {
    const httpClientMock = {
      get: jest.fn().mockResolvedValue({
        data: {
          projectStatus: {
            status: "OK"
          }
        }
      })
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectQualityGate("monitor_afiliaciones");

    expect(result).toBe("passed");
    expect(httpClientMock.get).toHaveBeenCalledWith("/api/qualitygates/project_status", {
      params: { projectKey: "monitor_afiliaciones" }
    });
  });

  it("returns failed when quality gate status is ERROR", async () => {
    const httpClientMock = {
      get: jest.fn().mockResolvedValue({
        data: {
          projectStatus: {
            status: "ERROR"
          }
        }
      })
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectQualityGate("monitor_afiliaciones");

    expect(result).toBe("failed");
  });

  it("returns unknown when quality gate status is not recognized", async () => {
    const httpClientMock = {
      get: jest.fn().mockResolvedValue({
        data: {
          projectStatus: {
            status: "WARN"
          }
        }
      })
    };

    const service = new SonarApiService(httpClientMock as never);
    const result = await service.getProjectQualityGate("monitor_afiliaciones");

    expect(result).toBe("unknown");
  });

  it("throws ValidationError when project key is empty", async () => {
    const httpClientMock = {
      get: jest.fn()
    };

    const service = new SonarApiService(httpClientMock as never);

    await expect(service.getProjectQualityGate(" ")).rejects.toBeInstanceOf(
      ValidationError
    );
  });

  it("throws InternalServerError when Sonar is not configured", async () => {
    delete process.env.SONAR_BASE_URL;

    const httpClientMock = {
      get: jest.fn()
    };

    const service = new SonarApiService(httpClientMock as never);

    await expect(service.getProjectQualityGate("monitor_afiliaciones")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });

  it("maps technical errors to InternalServerError", async () => {
    const httpClientMock = {
      get: jest.fn().mockRejectedValue(new Error("timeout"))
    };

    const service = new SonarApiService(httpClientMock as never);

    await expect(
      service.getProjectQualityGate("monitor_afiliaciones")
    ).rejects.toBeInstanceOf(InternalServerError);
  });
});
