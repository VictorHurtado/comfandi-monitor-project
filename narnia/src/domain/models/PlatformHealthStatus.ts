import type { SonarMetrics } from "@/domain/models/SonarMetrics";

export type IntegrationProvider = "sonar" | "github" | "sentry" | "proteo";

export type IntegrationStatus = "ok" | "warning" | "error" | "unknown";

export interface IntegrationHealth {
  provider: IntegrationProvider;
  status: IntegrationStatus;
  message: string;
  checkedAt: string;
  sonarMetrics?: SonarMetrics;
}

export interface PlatformHealthStatus {
  status: IntegrationStatus;
  checkedAt: string;
  integrations: IntegrationHealth[];
}
