import type {
  IntegrationHealth,
  IntegrationProvider,
  IntegrationStatus,
  PlatformHealthStatus
} from "@/domain/models/PlatformHealthStatus";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import { ExternalApiService } from "@/infrastructure/services/ExternalApiService";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";

export class StatusRepository implements IStatusRepository {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly keycloakService: KeycloakService
  ) {}

  async getPlatformHealthStatus(): Promise<PlatformHealthStatus> {
    const providers: IntegrationProvider[] = ["sonar", "github", "sentry", "proteo"];

    const integrations = await Promise.all(
      providers.map((provider) => this.safeIntegrationHealth(provider))
    );

    return {
      status: this.calculateGlobalStatus(integrations),
      checkedAt: new Date().toISOString(),
      integrations
    };
  }

  async getIntegrationStatus(provider: IntegrationProvider): Promise<PlatformHealthStatus> {
    const integration = await this.safeIntegrationHealth(provider);

    return {
      status: integration.status,
      checkedAt: new Date().toISOString(),
      integrations: [integration]
    };
  }

  private async safeIntegrationHealth(provider: IntegrationProvider): Promise<IntegrationHealth> {
    if (provider === "proteo" && !this.keycloakService.isConfigured()) {
      return {
        provider,
        status: "unknown",
        message: "Keycloak is not configured",
        checkedAt: new Date().toISOString()
      };
    }

    try {
      return await this.externalApiService.getIntegrationHealth(provider);
    } catch {
      return {
        provider,
        status: "unknown",
        message: `${provider} integration not connected yet`,
        checkedAt: new Date().toISOString()
      };
    }
  }

  private calculateGlobalStatus(integrations: IntegrationHealth[]): IntegrationStatus {
    if (integrations.some((integration) => integration.status === "error")) {
      return "error";
    }

    if (integrations.some((integration) => integration.status === "warning")) {
      return "warning";
    }

    if (integrations.every((integration) => integration.status === "ok")) {
      return "ok";
    }

    return "unknown";
  }
}
