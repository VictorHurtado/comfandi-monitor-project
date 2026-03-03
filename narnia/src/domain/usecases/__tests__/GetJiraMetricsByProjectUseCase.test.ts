import type { IJiraMetricsRepository } from "@/domain/repositories/IJiraMetricsRepository";
import { GetJiraMetricsByProjectUseCase } from "@/domain/usecases/GetJiraMetricsByProjectUseCase";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

const createRepositoryMock = (): jest.Mocked<IJiraMetricsRepository> => ({
  getByProject: jest.fn()
});

describe("GetJiraMetricsByProjectUseCase", () => {
  it("returns low risk metrics when project is stable", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetJiraMetricsByProjectUseCase(repositoryMock);

    repositoryMock.getByProject.mockResolvedValue({
      projectId: "afiliaciones",
      status: "ok",
      message: "Sincronizado con Jira",
      checkedAt: "2026-01-01T00:00:00.000Z",
      openIssues: 4,
      blockedIssues: 0,
      closedIssuesLast7Days: 11,
      avgInProgressHours: 14
    });

    const result = await useCase.execute("  afiliaciones  ");

    expect(repositoryMock.getByProject).toHaveBeenCalledWith("afiliaciones");
    expect(result.riskLevel).toBe("low");
  });

  it("returns high risk when blocked issues and in-progress time are critical", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetJiraMetricsByProjectUseCase(repositoryMock);

    repositoryMock.getByProject.mockResolvedValue({
      projectId: "afiliaciones",
      status: "ok",
      message: "Sincronizado con Jira",
      checkedAt: "2026-01-01T00:00:00.000Z",
      openIssues: 31,
      blockedIssues: 6,
      closedIssuesLast7Days: 2,
      avgInProgressHours: 84
    });

    const result = await useCase.execute("afiliaciones");

    expect(result.riskLevel).toBe("high");
  });

  it("throws ValidationError when project id is empty", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetJiraMetricsByProjectUseCase(repositoryMock);

    await expect(useCase.execute("   ")).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps unexpected errors to InternalServerError", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetJiraMetricsByProjectUseCase(repositoryMock);

    repositoryMock.getByProject.mockRejectedValue(new Error("network down"));

    await expect(useCase.execute("afiliaciones")).rejects.toBeInstanceOf(InternalServerError);
  });
});
