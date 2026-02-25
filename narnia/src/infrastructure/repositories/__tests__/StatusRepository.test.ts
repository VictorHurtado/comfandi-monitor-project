import { StatusRepository } from "@/infrastructure/repositories/StatusRepository";
import { ExternalApiService } from "@/infrastructure/services/ExternalApiService";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

describe("StatusRepository", () => {
  it("returns unknown for proteo when keycloak is not configured", async () => {
    const externalApiServiceMock = {
      getIntegrationHealth: jest.fn()
    } as unknown as ExternalApiService;

    const keycloakServiceMock = {
      isConfigured: jest.fn().mockReturnValue(false)
    } as unknown as KeycloakService;

    const repository = new StatusRepository(externalApiServiceMock, keycloakServiceMock);
    const result = await repository.getIntegrationStatus("proteo");

    expect(result.integrations[0].status).toBe("unknown");
    expect(result.integrations[0].message).toContain("Keycloak");
  });

  it("calculates global status based on integration severities", async () => {
    const responses: Record<string, IntegrationHealth> = {
      sonar: {
        provider: "sonar",
        status: "ok",
        message: "healthy",
        checkedAt: "2026-01-01T00:00:00.000Z"
      },
      github: {
        provider: "github",
        status: "warning",
        message: "degraded",
        checkedAt: "2026-01-01T00:00:00.000Z"
      },
      sentry: {
        provider: "sentry",
        status: "ok",
        message: "healthy",
        checkedAt: "2026-01-01T00:00:00.000Z"
      },
      proteo: {
        provider: "proteo",
        status: "ok",
        message: "healthy",
        checkedAt: "2026-01-01T00:00:00.000Z"
      }
    };

    const externalApiServiceMock = {
      getIntegrationHealth: jest.fn(async (provider: keyof typeof responses) => responses[provider])
    } as unknown as ExternalApiService;

    const keycloakServiceMock = {
      isConfigured: jest.fn().mockReturnValue(true)
    } as unknown as KeycloakService;

    const repository = new StatusRepository(externalApiServiceMock, keycloakServiceMock);
    const result = await repository.getPlatformHealthStatus();

    expect(result.status).toBe("warning");
    expect(result.integrations).toHaveLength(4);
  });
});
