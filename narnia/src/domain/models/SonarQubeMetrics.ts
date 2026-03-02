import type { IntegrationStatus } from "@/domain/models/PlatformHealthStatus";

export type QualityGateStatus = "passed" | "failed" | "none";

export interface SonarQubeMetrics {
  qualityGateStatus: QualityGateStatus;
  coverage: number;
  bugs: number;
  vulnerabilities: number;
}

export interface SonarQubeHealthData {
  projectName: string;
  status: IntegrationStatus;
  metrics: SonarQubeMetrics | null;
  lastCheckedAt: string;
}
