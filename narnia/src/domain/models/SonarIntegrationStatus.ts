export type SonarHealthStatus = "healthy" | "warning" | "critical" | "unknown";

export type QualityGateStatus = "PASSED" | "FAILED";

export interface SonarIntegrationStatus {
  readonly status: SonarHealthStatus;
  readonly qualityGateStatus: QualityGateStatus;
  readonly coverage: number;
  readonly bugs: number;
  readonly vulnerabilities: number;
  readonly projectName: string;
}
