describe("KeycloakService", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.AUTH_DISABLED;
  });

  afterAll(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  it("returns false when keycloak env vars are missing", async () => {
    delete process.env.KEYCLOAK_ISSUER;
    delete process.env.KEYCLOAK_CLIENT_ID;
    delete process.env.KEYCLOAK_CLIENT_SECRET;

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const service = new KeycloakService();

    expect(service.isConfigured()).toBe(false);
  });

  it("returns configured values", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer";
    process.env.KEYCLOAK_CLIENT_ID = "client";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const service = new KeycloakService();

    expect(service.isConfigured()).toBe(true);
    expect(service.getIssuer()).toBe("https://issuer");
    expect(service.getClientId()).toBe("client");
    expect(service.getClientSecret()).toBe("secret");
  });

  it("validates token through Keycloak userinfo endpoint", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer";
    process.env.KEYCLOAK_CLIENT_ID = "client";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";

    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock as typeof fetch;

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const service = new KeycloakService();

    await expect(service.validateAccessToken("valid-token")).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://issuer/protocol/openid-connect/userinfo",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer valid-token"
        })
      })
    );
  });

  it("throws UnauthorizedError when token is invalid", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer";
    process.env.KEYCLOAK_CLIENT_ID = "client";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";

    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false }) as typeof fetch;

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const { UnauthorizedError } = await import("@/utils/errors/domain-errors");
    const service = new KeycloakService();

    await expect(service.validateAccessToken("expired-token")).rejects.toBeInstanceOf(
      UnauthorizedError
    );
  });

  it("throws InternalServerError when keycloak is not configured", async () => {
    delete process.env.KEYCLOAK_ISSUER;
    delete process.env.KEYCLOAK_CLIENT_ID;
    delete process.env.KEYCLOAK_CLIENT_SECRET;

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const { InternalServerError } = await import("@/utils/errors/domain-errors");
    const service = new KeycloakService();

    await expect(service.validateAccessToken("any-token")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });

  it("detects auth disabled from environment", async () => {
    process.env.AUTH_DISABLED = "true";
    process.env.NODE_ENV = "development";

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const service = new KeycloakService();

    expect(service.isAuthDisabled()).toBe(true);
  });

  it("skips token validation when auth is disabled", async () => {
    process.env.AUTH_DISABLED = "true";
    process.env.NODE_ENV = "development";
    delete process.env.KEYCLOAK_ISSUER;
    delete process.env.KEYCLOAK_CLIENT_ID;
    delete process.env.KEYCLOAK_CLIENT_SECRET;

    const fetchMock = jest.fn();
    globalThis.fetch = fetchMock as typeof fetch;

    const { KeycloakService } = await import("@/infrastructure/services/KeycloakService");
    const service = new KeycloakService();

    await expect(service.validateAccessToken("any-token")).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
