export type JiraIntegrationState = "ok" | "pending" | "unknown";

export type JiraRiskLevel = "low" | "medium" | "high";

export interface JiraProjectMetricsSnapshot {
  projectId: string;
  status: JiraIntegrationState;
  message: string;
  checkedAt: string;
  openIssues: number;
  blockedIssues: number;
  closedIssuesLast7Days: number;
  avgInProgressHours: number;
}

export interface JiraProjectMetrics extends JiraProjectMetricsSnapshot {
  riskLevel: JiraRiskLevel;
}
