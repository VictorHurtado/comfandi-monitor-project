describe("environment", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns default bff url when env is missing", async () => {
    delete process.env.NARNIA_BFF_BASE_URL;

    const { getEnvironment } = await import("@/infrastructure/config/environment");
    const env = getEnvironment();

    expect(env.bffBaseUrl).toBe("http://localhost:3000/api/v1");
  });

  it("reads keycloak values from env", async () => {
    process.env.KEYCLOAK_ISSUER = "https://kc.example.com";
    process.env.KEYCLOAK_CLIENT_ID = "narnia-client";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";

    const { getEnvironment } = await import("@/infrastructure/config/environment");
    const env = getEnvironment();

    expect(env.keycloakIssuer).toBe("https://kc.example.com");
    expect(env.keycloakClientId).toBe("narnia-client");
    expect(env.keycloakClientSecret).toBe("secret");
  });

  it("enables authDisabled when AUTH_DISABLED=true outside production", async () => {
    process.env.AUTH_DISABLED = "true";
    process.env.NODE_ENV = "development";

    const { getEnvironment } = await import("@/infrastructure/config/environment");
    const env = getEnvironment();

    expect(env.authDisabled).toBe(true);
  });

  it("keeps auth enabled in production even with AUTH_DISABLED=true", async () => {
    process.env.AUTH_DISABLED = "true";
    process.env.NODE_ENV = "production";

    const { getEnvironment } = await import("@/infrastructure/config/environment");
    const env = getEnvironment();

    expect(env.authDisabled).toBe(false);
  });
});
