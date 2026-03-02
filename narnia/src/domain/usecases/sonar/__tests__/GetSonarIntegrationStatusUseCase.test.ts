import { GetSonarIntegrationStatusUseCase } from "@/domain/usecases/sonar/GetSonarIntegrationStatusUseCase";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { AppError } from "@/utils/errors/domain-errors";

describe("GetSonarIntegrationStatusUseCase", () => {
  const mockStatus = {
    status: "healthy" as const,
    qualityGateStatus: "PASSED" as const,
    coverage: 82.4,
    bugs: 12,
    vulnerabilities: 0,
    projectName: "Proyecto Alfa"
  };

  it("returns sonar status from repository", async () => {
    const mockRepo: ISonarRepository = {
      getIntegrationStatus: jest.fn().mockResolvedValue(mockStatus)
    };
    const useCase = new GetSonarIntegrationStatusUseCase(mockRepo);

    const result = await useCase.execute();

    expect(mockRepo.getIntegrationStatus).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockStatus);
  });

  it("propagates AppError from repository", async () => {
    const error = new AppError("Repo error", new Error("cause"));
    const mockRepo: ISonarRepository = {
      getIntegrationStatus: jest.fn().mockRejectedValue(error)
    };
    const useCase = new GetSonarIntegrationStatusUseCase(mockRepo);

    await expect(useCase.execute()).rejects.toThrow(AppError);
    await expect(useCase.execute()).rejects.toThrow("Repo error");
  });

  it("wraps non-AppError in AppError", async () => {
    const mockRepo: ISonarRepository = {
      getIntegrationStatus: jest.fn().mockRejectedValue(new Error("network"))
    };
    const useCase = new GetSonarIntegrationStatusUseCase(mockRepo);

    await expect(useCase.execute()).rejects.toThrow(AppError);
    await expect(useCase.execute()).rejects.toThrow("Error al obtener estado de SonarQube");
  });
});
