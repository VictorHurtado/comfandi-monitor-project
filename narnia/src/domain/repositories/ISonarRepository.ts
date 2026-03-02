import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

export interface ISonarRepository {
  getSonarIntegrationHealth(): Promise<IntegrationHealth>;
}
