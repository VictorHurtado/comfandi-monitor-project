import type { JiraProjectMetricsSnapshot } from "@/domain/models/JiraProjectMetrics";

export interface IJiraMetricsRepository {
  getByProject(projectId: string): Promise<JiraProjectMetricsSnapshot>;
}
