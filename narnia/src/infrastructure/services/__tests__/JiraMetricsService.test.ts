import { JiraMetricsService } from "@/infrastructure/services/JiraMetricsService";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

describe("JiraMetricsService", () => {
  it("loads jira metrics using project context", async () => {
    const http = {
      get: jest.fn().mockResolvedValue({
        data: {
          openIssues: 10,
          blockedIssues: 2,
          closedIssuesLast7Days: 7,
          avgInProgressHours: 21,
          checkedAt: "2026-01-01T00:00:00.000Z"
        }
      })
    };

    const service = new JiraMetricsService(http as never);
    const result = await service.getProjectMetrics("  afiliaciones ");

    expect(http.get).toHaveBeenCalledWith("/jira/metrics", {
      params: {
        projectId: "afiliaciones"
      }
    });
    expect(result.openIssues).toBe(10);
  });

  it("throws ValidationError when project id is missing", async () => {
    const service = new JiraMetricsService({ get: jest.fn() } as never);

    await expect(service.getProjectMetrics("   ")).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps timeout failures to InternalServerError", async () => {
    const http = {
      get: jest.fn().mockRejectedValue({
        isAxiosError: true,
        code: "ECONNABORTED"
      })
    };

    const service = new JiraMetricsService(http as never);

    await expect(service.getProjectMetrics("afiliaciones")).rejects.toBeInstanceOf(InternalServerError);
    await expect(service.getProjectMetrics("afiliaciones")).rejects.toThrow(
      "Jira metrics request timeout"
    );
  });

  it("maps generic failures to InternalServerError", async () => {
    const http = {
      get: jest.fn().mockRejectedValue(new Error("jira unavailable"))
    };

    const service = new JiraMetricsService(http as never);

    await expect(service.getProjectMetrics("afiliaciones")).rejects.toBeInstanceOf(InternalServerError);
    await expect(service.getProjectMetrics("afiliaciones")).rejects.toThrow("Error loading Jira metrics");
  });
});
