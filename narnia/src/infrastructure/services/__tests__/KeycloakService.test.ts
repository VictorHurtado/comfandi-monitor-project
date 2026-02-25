describe("KeycloakService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
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
});
