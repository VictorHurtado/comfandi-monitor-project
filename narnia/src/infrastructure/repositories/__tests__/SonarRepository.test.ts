import { SonarRepository } from "@/infrastructure/repositories/SonarRepository";
import { SonarApiService } from "@/infrastructure/services/SonarApiService";

describe("SonarRepository", () => {
  it("returns unknown when project mapping does not exist", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectQualityGate: jest.fn()
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {});
    const result = await repository.getProjectStatus("afiliaciones");

    expect(result.qualityGate).toBe("unknown");
    expect(result.projectKey).toBe("");
    expect(sonarApiServiceMock.getProjectQualityGate).not.toHaveBeenCalled();
  });

  it("returns unknown when Sonar integration is not configured", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(false),
      getProjectQualityGate: jest.fn()
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {
      afiliaciones: "monitor_afiliaciones"
    });

    const result = await repository.getProjectStatus("afiliaciones");

    expect(result.qualityGate).toBe("unknown");
    expect(result.message).toContain("no disponible");
    expect(sonarApiServiceMock.getProjectQualityGate).not.toHaveBeenCalled();
  });

  it("returns passed when Sonar API responds with a valid quality gate", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectQualityGate: jest.fn().mockResolvedValue("passed")
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {
      afiliaciones: "monitor_afiliaciones"
    });

    const result = await repository.getProjectStatus(" Afiliaciones ");

    expect(result.qualityGate).toBe("passed");
    expect(result.projectKey).toBe("monitor_afiliaciones");
    expect(result.projectSlug).toBe("afiliaciones");
    expect(sonarApiServiceMock.getProjectQualityGate).toHaveBeenCalledWith(
      "monitor_afiliaciones"
    );
  });

  it("returns unknown when Sonar API fails", async () => {
    const sonarApiServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true),
      getProjectQualityGate: jest.fn().mockRejectedValue(new Error("network error"))
    } as unknown as SonarApiService;

    const repository = new SonarRepository(sonarApiServiceMock, {
      afiliaciones: "monitor_afiliaciones"
    });

    const result = await repository.getProjectStatus("afiliaciones");

    expect(result.qualityGate).toBe("unknown");
    expect(result.message).toContain("No fue posible");
  });
});
