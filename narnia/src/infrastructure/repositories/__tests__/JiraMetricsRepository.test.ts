import { JiraMetricsRepository } from "@/infrastructure/repositories/JiraMetricsRepository";
import { JiraMetricsService } from "@/infrastructure/services/JiraMetricsService";
import { InternalServerError } from "@/utils/errors/domain-errors";

describe("JiraMetricsRepository", () => {
  it("maps jira data to domain snapshot", async () => {
    const jiraMetricsServiceMock = {
      getProjectMetrics: jest.fn().mockResolvedValue({
        openIssues: 8,
        blockedIssues: 1,
        closedIssuesLast7Days: 12,
        avgInProgressHours: 17,
        checkedAt: "2026-01-01T00:00:00.000Z"
      })
    } as unknown as JiraMetricsService;

    const repository = new JiraMetricsRepository(jiraMetricsServiceMock);
    const result = await repository.getByProject("afiliaciones");

    expect(result.status).toBe("ok");
    expect(result.message).toBe("Sincronizado con Jira");
    expect(result.openIssues).toBe(8);
  });

  it("returns empty-state message when all issue counters are zero", async () => {
    const jiraMetricsServiceMock = {
      getProjectMetrics: jest.fn().mockResolvedValue({
        openIssues: 0,
        blockedIssues: 0,
        closedIssuesLast7Days: 0,
        avgInProgressHours: 0,
        checkedAt: "2026-01-01T00:00:00.000Z"
      })
    } as unknown as JiraMetricsService;

    const repository = new JiraMetricsRepository(jiraMetricsServiceMock);
    const result = await repository.getByProject("afiliaciones");

    expect(result.status).toBe("ok");
    expect(result.message).toBe("Sin issues registradas");
  });

  it("returns pending state when jira request times out", async () => {
    const jiraMetricsServiceMock = {
      getProjectMetrics: jest
        .fn()
        .mockRejectedValue(new InternalServerError("Jira metrics request timeout"))
    } as unknown as JiraMetricsService;

    const repository = new JiraMetricsRepository(jiraMetricsServiceMock);
    const result = await repository.getByProject("afiliaciones");

    expect(result.status).toBe("pending");
    expect(result.message).toBe("Pendiente de sincronización");
    expect(result.openIssues).toBe(0);
  });

  it("returns unknown state for generic jira failures", async () => {
    const jiraMetricsServiceMock = {
      getProjectMetrics: jest.fn().mockRejectedValue(new Error("jira down"))
    } as unknown as JiraMetricsService;

    const repository = new JiraMetricsRepository(jiraMetricsServiceMock);
    const result = await repository.getByProject("afiliaciones");

    expect(result.status).toBe("unknown");
    expect(result.message).toBe("No disponible temporalmente");
  });
});
