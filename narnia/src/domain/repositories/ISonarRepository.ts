import type { SonarIntegrationStatus } from "@/domain/models/SonarIntegrationStatus";

export interface ISonarRepository {
  getIntegrationStatus(): Promise<SonarIntegrationStatus>;
}
