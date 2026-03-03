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

  it("reads jira credentials and mapping from env", async () => {
    process.env.JIRA_BASE_URL = "https://acme.atlassian.net";
    process.env.EMAIL_API_JIRA = "jira.user@acme.com";
    process.env.TOKEN_API_JIRA = "jira-token";
    process.env.JIRA_PROJECT_KEY_MAP = "{\"afiliaciones\":\"AFI\"}";

    const { getEnvironment } = await import("@/infrastructure/config/environment");
    const env = getEnvironment();

    expect(env.jiraBaseUrl).toBe("https://acme.atlassian.net");
    expect(env.jiraApiEmail).toBe("jira.user@acme.com");
    expect(env.jiraApiToken).toBe("jira-token");
    expect(env.jiraProjectKeyMap).toBe("{\"afiliaciones\":\"AFI\"}");
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
