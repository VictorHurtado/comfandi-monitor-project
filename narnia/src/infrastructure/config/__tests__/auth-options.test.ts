const originalEnv = process.env;

describe("auth-options", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("detects keycloak configuration", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer.example.com/realms/narnia";
    process.env.KEYCLOAK_CLIENT_ID = "narnia-client";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";

    const { isKeycloakConfigured } = await import("@/infrastructure/config/auth-options");
    expect(isKeycloakConfigured()).toBe(true);
  });

  it("returns refresh error when token or env is missing", async () => {
    const { refreshAccessToken } = await import("@/infrastructure/config/auth-options");
    const result = await refreshAccessToken({});

    expect(result.error).toBe("RefreshAccessTokenError");
  });

  it("refreshes token with keycloak endpoint", async () => {
    process.env.KEYCLOAK_ISSUER = "https://issuer.example.com/realms/narnia";
    process.env.KEYCLOAK_CLIENT_ID = "narnia-client";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "new-access",
        id_token: "new-id",
        refresh_token: "new-refresh",
        expires_in: 300
      })
    });

    global.fetch = fetchMock as unknown as typeof fetch;

    const { refreshAccessToken } = await import("@/infrastructure/config/auth-options");
    const result = await refreshAccessToken({
      refresh_token: "old-refresh",
      id_token: "old-id"
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(result.access_token).toBe("new-access");
    expect(result.refresh_token).toBe("new-refresh");
    expect(result.error).toBeUndefined();
  });
});
