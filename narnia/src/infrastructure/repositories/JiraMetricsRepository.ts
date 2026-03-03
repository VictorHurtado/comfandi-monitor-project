import type { JiraProjectMetricsSnapshot } from "@/domain/models/JiraProjectMetrics";
import type { IJiraMetricsRepository } from "@/domain/repositories/IJiraMetricsRepository";
import { JiraMetricsService } from "@/infrastructure/services/JiraMetricsService";
import { InternalServerError } from "@/utils/errors/domain-errors";

export class JiraMetricsRepository implements IJiraMetricsRepository {
  constructor(private readonly jiraMetricsService: JiraMetricsService) {}

  async getByProject(projectId: string): Promise<JiraProjectMetricsSnapshot> {
    try {
      const metrics = await this.jiraMetricsService.getProjectMetrics(projectId);

      return {
        projectId,
        status: "ok",
        message: this.resolveOkMessage(metrics.openIssues, metrics.blockedIssues, metrics.closedIssuesLast7Days),
        checkedAt: metrics.checkedAt,
        openIssues: metrics.openIssues,
        blockedIssues: metrics.blockedIssues,
        closedIssuesLast7Days: metrics.closedIssuesLast7Days,
        avgInProgressHours: metrics.avgInProgressHours
      };
    } catch (error) {
      if (this.isTimeoutError(error)) {
        return this.createFallback(projectId, "pending", "Pendiente de sincronización");
      }

      return this.createFallback(projectId, "unknown", "No disponible temporalmente");
    }
  }

  private resolveOkMessage(openIssues: number, blockedIssues: number, closedIssuesLast7Days: number): string {
    if (openIssues === 0 && blockedIssues === 0 && closedIssuesLast7Days === 0) {
      return "Sin issues registradas";
    }

    return "Sincronizado con Jira";
  }

  private isTimeoutError(error: unknown): boolean {
    return error instanceof InternalServerError && error.message.toLowerCase().includes("timeout");
  }

  private createFallback(
    projectId: string,
    status: JiraProjectMetricsSnapshot["status"],
    message: string
  ): JiraProjectMetricsSnapshot {
    return {
      projectId,
      status,
      message,
      checkedAt: new Date().toISOString(),
      openIssues: 0,
      blockedIssues: 0,
      closedIssuesLast7Days: 0,
      avgInProgressHours: 0
    };
  }
}
