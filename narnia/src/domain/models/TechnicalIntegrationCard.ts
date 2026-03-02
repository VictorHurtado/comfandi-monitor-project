import type { IntegrationProvider } from "@/domain/models/PlatformHealthStatus";

export type TechnicalIntegrationStatus = "healthy" | "warning" | "critical" | "unknown";

export type SonarQualityGateStatus = "PASSED" | "FAILED" | "WARN" | "UNKNOWN";

export interface SonarTechnicalMetrics {
  qualityGateStatus: SonarQualityGateStatus;
  coverage: number;
  bugs: number;
  vulnerabilities: number;
}

export interface TechnicalIntegrationCard {
  provider: IntegrationProvider;
  providerLabel: string;
  projectName: string;
  status: TechnicalIntegrationStatus;
  summary: string;
  sonarMetrics?: SonarTechnicalMetrics;
}
