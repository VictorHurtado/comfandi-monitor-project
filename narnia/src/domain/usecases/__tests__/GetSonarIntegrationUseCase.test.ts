import { GetSonarIntegrationUseCase } from "@/domain/usecases/GetSonarIntegrationUseCase";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";
import { AppError, InternalServerError } from "@/utils/errors/domain-errors";

const mockIntegrationHealth: IntegrationHealth = {
  provider: "sonar",
  status: "warning",
  message: "Quality gate: WARN.",
  checkedAt: "2026-01-01T00:00:00.000Z",
  sonarMetrics: {
    qualityGateStatus: "WARN",
    coverage: 72.5,
    bugs: 3,
    vulnerabilities: 1
  }
};

function makeMockRepository(
  impl: Partial<ISonarRepository> = {}
): ISonarRepository {
  return {
    getSonarIntegrationHealth: jest.fn().mockResolvedValue(mockIntegrationHealth),
    ...impl
  };
}

describe("GetSonarIntegrationUseCase", () => {
  it("returns sonar integration health from repository", async () => {
    const repo = makeMockRepository();
    const useCase = new GetSonarIntegrationUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual(mockIntegrationHealth);
    expect(repo.getSonarIntegrationHealth).toHaveBeenCalledTimes(1);
  });

  it("re-throws AppError instances without wrapping", async () => {
    const original = new AppError("sonar down", 503);
    const repo = makeMockRepository({
      getSonarIntegrationHealth: jest.fn().mockRejectedValue(original)
    });
    const useCase = new GetSonarIntegrationUseCase(repo);

    await expect(useCase.execute()).rejects.toThrow(original);
  });

  it("wraps unknown errors in InternalServerError", async () => {
    const repo = makeMockRepository({
      getSonarIntegrationHealth: jest.fn().mockRejectedValue(new Error("network error"))
    });
    const useCase = new GetSonarIntegrationUseCase(repo);

    await expect(useCase.execute()).rejects.toBeInstanceOf(InternalServerError);
  });

  it("wraps non-Error thrown values in InternalServerError", async () => {
    const repo = makeMockRepository({
      getSonarIntegrationHealth: jest.fn().mockRejectedValue("string error")
    });
    const useCase = new GetSonarIntegrationUseCase(repo);

    await expect(useCase.execute()).rejects.toBeInstanceOf(InternalServerError);
  });

  it("returns result with sonarMetrics when repository provides them", async () => {
    const repo = makeMockRepository();
    const useCase = new GetSonarIntegrationUseCase(repo);

    const result = await useCase.execute();

    expect(result.sonarMetrics).toBeDefined();
    expect(result.sonarMetrics?.coverage).toBe(72.5);
    expect(result.sonarMetrics?.bugs).toBe(3);
    expect(result.sonarMetrics?.vulnerabilities).toBe(1);
    expect(result.sonarMetrics?.qualityGateStatus).toBe("WARN");
  });
});
