import { GetSonarProjectStatusUseCase } from "@/domain/usecases/GetSonarProjectStatusUseCase";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

const createRepositoryMock = (): jest.Mocked<ISonarRepository> => ({
  getProjectStatus: jest.fn()
});

describe("GetSonarProjectStatusUseCase", () => {
  it("returns sonar status for a valid project slug", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetSonarProjectStatusUseCase(repositoryMock);

    repositoryMock.getProjectStatus.mockResolvedValue({
      qualityGate: "passed",
      projectKey: "monitor_afiliaciones",
      projectSlug: "afiliaciones",
      message: "Quality Gate passed",
      checkedAt: "2026-01-01T00:00:00.000Z"
    });

    const result = await useCase.execute(" Afiliaciones ");

    expect(result.qualityGate).toBe("passed");
    expect(repositoryMock.getProjectStatus).toHaveBeenCalledWith("afiliaciones");
  });

  it("throws ValidationError when project slug is empty", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetSonarProjectStatusUseCase(repositoryMock);

    await expect(useCase.execute("   ")).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps unknown errors to InternalServerError", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetSonarProjectStatusUseCase(repositoryMock);

    repositoryMock.getProjectStatus.mockRejectedValue(new Error("timeout"));

    await expect(useCase.execute("afiliaciones")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });
});
