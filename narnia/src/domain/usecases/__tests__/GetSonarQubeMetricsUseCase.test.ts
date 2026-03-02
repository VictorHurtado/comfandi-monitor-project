import { GetSonarQubeMetricsUseCase } from "@/domain/usecases/GetSonarQubeMetricsUseCase";
import type { ISonarQubeRepository } from "@/domain/repositories/ISonarQubeRepository";
import type { SonarQubeHealthData } from "@/domain/models/SonarQubeMetrics";
import { InternalServerError, ValidationError } from "@/utils/errors/domain-errors";

const MOCK_HEALTH_DATA: SonarQubeHealthData = {
  projectName: "Proyecto Alfa",
  status: "ok",
  metrics: {
    qualityGateStatus: "passed",
    coverage: 82.4,
    bugs: 12,
    vulnerabilities: 0
  },
  lastCheckedAt: "2026-01-01T00:00:00.000Z"
};

const createRepositoryMock = (): jest.Mocked<ISonarQubeRepository> => ({
  getSonarQubeHealth: jest.fn()
});

describe("GetSonarQubeMetricsUseCase", () => {
  it("returns SonarQube health data from repository", async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.getSonarQubeHealth.mockResolvedValue(MOCK_HEALTH_DATA);
    const useCase = new GetSonarQubeMetricsUseCase(repositoryMock);

    const result = await useCase.execute();

    expect(result).toEqual(MOCK_HEALTH_DATA);
    expect(repositoryMock.getSonarQubeHealth).toHaveBeenCalledTimes(1);
  });

  it("re-throws AppError subclasses without wrapping", async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.getSonarQubeHealth.mockRejectedValue(
      new ValidationError("invalid config")
    );
    const useCase = new GetSonarQubeMetricsUseCase(repositoryMock);

    await expect(useCase.execute()).rejects.toThrow(ValidationError);
  });

  it("wraps unknown errors in InternalServerError", async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.getSonarQubeHealth.mockRejectedValue(new Error("network failure"));
    const useCase = new GetSonarQubeMetricsUseCase(repositoryMock);

    await expect(useCase.execute()).rejects.toThrow(InternalServerError);
  });

  it("wraps non-Error throwables in InternalServerError", async () => {
    const repositoryMock = createRepositoryMock();
    repositoryMock.getSonarQubeHealth.mockRejectedValue("unexpected string error");
    const useCase = new GetSonarQubeMetricsUseCase(repositoryMock);

    await expect(useCase.execute()).rejects.toThrow(InternalServerError);
  });
});
