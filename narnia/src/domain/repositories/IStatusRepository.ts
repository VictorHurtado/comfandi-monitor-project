import type {
  IntegrationProvider,
  PlatformHealthStatus
} from "@/domain/models/PlatformHealthStatus";

export interface IStatusRepository {
  getPlatformHealthStatus(): Promise<PlatformHealthStatus>;
  getIntegrationStatus(provider: IntegrationProvider): Promise<PlatformHealthStatus>;
}
