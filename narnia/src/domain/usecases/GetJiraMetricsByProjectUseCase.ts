import type {
  JiraProjectMetrics,
  JiraProjectMetricsSnapshot,
  JiraRiskLevel
} from "@/domain/models/JiraProjectMetrics";
import type { IJiraMetricsRepository } from "@/domain/repositories/IJiraMetricsRepository";
import {
  AppError,
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

export class GetJiraMetricsByProjectUseCase {
  constructor(private readonly jiraMetricsRepository: IJiraMetricsRepository) {}

  async execute(projectId: string): Promise<JiraProjectMetrics> {
    try {
      const normalizedProjectId = this.validateProjectId(projectId);
      const metrics = await this.jiraMetricsRepository.getByProject(normalizedProjectId);

      return {
        ...metrics,
        riskLevel: this.calculateRiskLevel(metrics)
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError("Unable to get Jira project metrics", error);
    }
  }

  private validateProjectId(projectId: string): string {
    const normalizedProjectId = projectId.trim();

    if (!normalizedProjectId) {
      throw new ValidationError("Project id is required");
    }

    return normalizedProjectId;
  }

  private calculateRiskLevel(metrics: JiraProjectMetricsSnapshot): JiraRiskLevel {
    if (metrics.status !== "ok") {
      return "low";
    }

    if (metrics.blockedIssues >= 5 || metrics.avgInProgressHours >= 72) {
      return "high";
    }

    if (metrics.blockedIssues > 0 || metrics.openIssues >= 20 || metrics.avgInProgressHours >= 36) {
      return "medium";
    }

    return "low";
  }
}
