import { StatusRepository } from "@/infrastructure/repositories/StatusRepository";
import { ExternalApiService } from "@/infrastructure/services/ExternalApiService";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

function makeHealth(
  provider: IntegrationHealth["provider"],
  status: IntegrationHealth["status"]
): IntegrationHealth {
  return { provider, status, message: status, checkedAt: "2026-01-01T00:00:00.000Z" };
}

function makeRepo(
  responses: Record<string, IntegrationHealth>,
  keycloakConfigured = true
) {
  return new StatusRepository(
    {
      getIntegrationHealth: jest.fn(async (p: string) => responses[p])
    } as unknown as ExternalApiService,
    { isConfigured: jest.fn().mockReturnValue(keycloakConfigured) } as unknown as KeycloakService
  );
}

describe("StatusRepository", () => {
  it("returns unknown for proteo when keycloak is not configured", async () => {
    const repo = new StatusRepository(
      { getIntegrationHealth: jest.fn() } as unknown as ExternalApiService,
      { isConfigured: jest.fn().mockReturnValue(false) } as unknown as KeycloakService
    );
    const result = await repo.getIntegrationStatus("proteo");

    expect(result.integrations[0].status).toBe("unknown");
    expect(result.integrations[0].message).toContain("Keycloak");
  });

  it("calculates global 'warning' status when any integration has warning", async () => {
    const repo = makeRepo({
      sonar: makeHealth("sonar", "ok"),
      github: makeHealth("github", "warning"),
      sentry: makeHealth("sentry", "ok"),
      proteo: makeHealth("proteo", "ok")
    });
    const result = await repo.getPlatformHealthStatus();
    expect(result.status).toBe("warning");
    expect(result.integrations).toHaveLength(4);
  });

  it("calculates global 'error' status when any integration has error", async () => {
    const repo = makeRepo({
      sonar: makeHealth("sonar", "error"),
      github: makeHealth("github", "ok"),
      sentry: makeHealth("sentry", "ok"),
      proteo: makeHealth("proteo", "ok")
    });
    const result = await repo.getPlatformHealthStatus();
    expect(result.status).toBe("error");
  });

  it("calculates global 'ok' status when all integrations are ok", async () => {
    const repo = makeRepo({
      sonar: makeHealth("sonar", "ok"),
      github: makeHealth("github", "ok"),
      sentry: makeHealth("sentry", "ok"),
      proteo: makeHealth("proteo", "ok")
    });
    const result = await repo.getPlatformHealthStatus();
    expect(result.status).toBe("ok");
  });

  it("calculates global 'unknown' status when no error/warning but not all ok", async () => {
    const repo = makeRepo({
      sonar: makeHealth("sonar", "ok"),
      github: makeHealth("github", "unknown"),
      sentry: makeHealth("sentry", "ok"),
      proteo: makeHealth("proteo", "ok")
    });
    const result = await repo.getPlatformHealthStatus();
    expect(result.status).toBe("unknown");
  });

  it("returns unknown when ExternalApiService throws", async () => {
    const repo = new StatusRepository(
      {
        getIntegrationHealth: jest.fn().mockRejectedValue(new Error("timeout"))
      } as unknown as ExternalApiService,
      { isConfigured: jest.fn().mockReturnValue(true) } as unknown as KeycloakService
    );
    const result = await repo.getIntegrationStatus("sonar");
    expect(result.integrations[0].status).toBe("unknown");
    expect(result.integrations[0].message).toContain("sonar");
  });

  it("returns integration status for a single provider", async () => {
    const repo = makeRepo({ sonar: makeHealth("sonar", "ok") });
    const result = await repo.getIntegrationStatus("sonar");
    expect(result.integrations[0].provider).toBe("sonar");
    expect(result.integrations[0].status).toBe("ok");
  });
});
