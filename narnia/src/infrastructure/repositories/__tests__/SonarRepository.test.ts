import { SonarRepository } from "@/infrastructure/repositories/SonarRepository";
import { SonarApiService } from "@/infrastructure/services/SonarApiService";

describe("SonarRepository", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns unknown when project mapping does not exist", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectSnapshot: jest.fn()
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {});
    const result = await repository.getProjectStatus("afiliaciones");

    expect(result.qualityGate).toBe("unknown");
    expect(result.projectKey).toBe("");
    expect(sonarApiServiceMock.getProjectSnapshot).not.toHaveBeenCalled();
  });

  it("returns unknown when Sonar integration is not configured", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(false),
      getProjectSnapshot: jest.fn()
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {
      afiliaciones: "monitor_afiliaciones"
    });

    const result = await repository.getProjectStatus("afiliaciones");

    expect(result.qualityGate).toBe("unknown");
    expect(result.message).toContain("no disponible");
    expect(sonarApiServiceMock.getProjectSnapshot).not.toHaveBeenCalled();
  });

  it("returns quality gate and metrics when Sonar API responds successfully", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectSnapshot: jest.fn().mockResolvedValue({
        qualityGate: "passed",
        coverage: 87.2,
        bugs: 2,
        vulnerabilities: 1
      })
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {
      afiliaciones: "monitor_afiliaciones"
    });

    const result = await repository.getProjectStatus(" Afiliaciones ");

    expect(result.qualityGate).toBe("passed");
    expect(result.coverage).toBe(87.2);
    expect(result.bugs).toBe(2);
    expect(result.vulnerabilities).toBe(1);
    expect(result.projectKey).toBe("monitor_afiliaciones");
    expect(result.projectSlug).toBe("afiliaciones");
    expect(sonarApiServiceMock.getProjectSnapshot).toHaveBeenCalledWith(
      "monitor_afiliaciones"
    );
  });

  it("returns unknown when Sonar API fails", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectSnapshot: jest.fn().mockRejectedValue(new Error("network error"))
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {
      afiliaciones: "monitor_afiliaciones"
    });

    const result = await repository.getProjectStatus("afiliaciones");

    expect(result.qualityGate).toBe("unknown");
    expect(result.message).toContain("No fue posible");
  });

  it("reuses cache within TTL and refreshes when TTL expires", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectSnapshot: jest
        .fn()
        .mockResolvedValueOnce({
          qualityGate: "passed",
          coverage: 90,
          bugs: 0,
          vulnerabilities: 0
        })
        .mockResolvedValueOnce({
          qualityGate: "failed",
          coverage: 65,
          bugs: 5,
          vulnerabilities: 3
        })
    } as unknown as SonarApiService;

    const repository = new SonarRepository(
      sonarApiServiceMock,
      { afiliaciones: "monitor_afiliaciones" },
      5 * 60 * 1000
    );

    const firstStatus = await repository.getProjectStatus("afiliaciones");
    const cachedStatus = await repository.getProjectStatus("afiliaciones");

    expect(firstStatus.qualityGate).toBe("passed");
    expect(cachedStatus.qualityGate).toBe("passed");
    expect(sonarApiServiceMock.getProjectSnapshot).toHaveBeenCalledTimes(1);

    jest.setSystemTime(new Date("2026-01-01T00:05:01.000Z"));
    const refreshedStatus = await repository.getProjectStatus("afiliaciones");

    expect(refreshedStatus.qualityGate).toBe("failed");
    expect(sonarApiServiceMock.getProjectSnapshot).toHaveBeenCalledTimes(2);
  });
});
