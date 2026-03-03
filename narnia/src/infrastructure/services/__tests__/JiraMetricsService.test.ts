import { JiraMetricsService } from "@/infrastructure/services/JiraMetricsService";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

describe("JiraMetricsService", () => {
  it("loads jira metrics using project context", async () => {
    const http = {
      defaults: {},
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

    expect(http.get).toHaveBeenCalledWith("/api/v1/jira/metrics", {
      params: {
        projectId: "afiliaciones"
      }
    });
    expect(result.openIssues).toBe(10);
  });

  it("avoids duplicating api prefix when baseURL already contains /api/v1", async () => {
    const http = {
      defaults: {
        baseURL: "https://example.internal/api/v1"
      },
      get: jest.fn().mockResolvedValue({
        data: {
          openIssues: 5,
          blockedIssues: 1,
          closedIssuesLast7Days: 2,
          avgInProgressHours: 9,
          checkedAt: "2026-01-01T00:00:00.000Z"
        }
      })
    };

    const service = new JiraMetricsService(http as never);
    await service.getProjectMetrics("afiliaciones");

    expect(http.get).toHaveBeenCalledWith("/jira/metrics", {
      params: {
        projectId: "afiliaciones"
      }
    });
  });

  it("throws ValidationError when project id is missing", async () => {
    const service = new JiraMetricsService({ defaults: {}, get: jest.fn() } as never);

    await expect(service.getProjectMetrics("   ")).rejects.toBeInstanceOf(ValidationError);
  });

  it("maps timeout failures to InternalServerError", async () => {
    const http = {
      defaults: {},
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
      defaults: {},
      get: jest.fn().mockRejectedValue(new Error("jira unavailable"))
    };

    const service = new JiraMetricsService(http as never);

    await expect(service.getProjectMetrics("afiliaciones")).rejects.toBeInstanceOf(InternalServerError);
    await expect(service.getProjectMetrics("afiliaciones")).rejects.toThrow("Error loading Jira metrics");
  });
});
