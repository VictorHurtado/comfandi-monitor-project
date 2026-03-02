import type { ITechnicalIntegrationRepository } from "@/domain/repositories/ITechnicalIntegrationRepository";
import { GetTechnicalIntegrationCardsUseCase } from "@/domain/usecases/GetTechnicalIntegrationCardsUseCase";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

describe("GetTechnicalIntegrationCardsUseCase", () => {
  it("returns technical integration cards from repository", async () => {
    const repositoryMock: ITechnicalIntegrationRepository = {
      getTechnicalIntegrationCards: jest.fn().mockResolvedValue([
        {
          provider: "sonar",
          providerLabel: "SonarQube",
          projectName: "Proyecto Alfa",
          status: "healthy",
          summary: "Mock data",
          sonarMetrics: {
            qualityGateStatus: "PASSED",
            coverage: 82.4,
            bugs: 12,
            vulnerabilities: 0
          }
        }
      ])
    };

    const useCase = new GetTechnicalIntegrationCardsUseCase(repositoryMock);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].provider).toBe("sonar");
    expect(repositoryMock.getTechnicalIntegrationCards).toHaveBeenCalledTimes(1);
  });

  it("rethrows AppError instances", async () => {
    const repositoryMock: ITechnicalIntegrationRepository = {
      getTechnicalIntegrationCards: jest
        .fn()
        .mockRejectedValue(new ValidationError("Invalid mock data"))
    };

    const useCase = new GetTechnicalIntegrationCardsUseCase(repositoryMock);

    await expect(useCase.execute()).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps unknown errors to InternalServerError", async () => {
    const repositoryMock: ITechnicalIntegrationRepository = {
      getTechnicalIntegrationCards: jest.fn().mockRejectedValue(new Error("unexpected"))
    };

    const useCase = new GetTechnicalIntegrationCardsUseCase(repositoryMock);

    await expect(useCase.execute()).rejects.toBeInstanceOf(InternalServerError);
  });
});
