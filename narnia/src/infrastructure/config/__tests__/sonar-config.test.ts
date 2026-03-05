describe("sonar-config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns default baseUrl when not set", async () => {
    delete process.env.SONAR_BASE_URL;
    delete process.env.SONAR_TOKEN;
    delete process.env.SONAR_PROJECT_KEY_MAP;

    const { getSonarConfig } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(config.baseUrl).toBe("https://sonarcloud.io");
    expect(config.token).toBe("");
    expect(config.projectKeyMap).toEqual({});
  });

  it("reads SONAR_BASE_URL and strips trailing slash", async () => {
    process.env.SONAR_BASE_URL = "https://custom.sonar.io/";
    process.env.SONAR_TOKEN = "token123";

    const { getSonarConfig } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(config.baseUrl).toBe("https://custom.sonar.io");
  });

  it("parses SONAR_PROJECT_KEY_MAP JSON", async () => {
    process.env.SONAR_PROJECT_KEY_MAP = '{"afiliaciones":"ComfandiTD_afiliaciones"}';

    const { getSonarConfig } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(config.projectKeyMap).toEqual({
      afiliaciones: "ComfandiTD_afiliaciones"
    });
  });

  it("returns empty map for invalid JSON", async () => {
    process.env.SONAR_PROJECT_KEY_MAP = "invalid";

    const { getSonarConfig } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(config.projectKeyMap).toEqual({});
  });

  it("isSonarConfigured returns true when baseUrl and token are set", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "abc";

    const { getSonarConfig, isSonarConfigured } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(isSonarConfigured(config)).toBe(true);
  });

  it("isSonarConfigured returns false when token is empty", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    delete process.env.SONAR_TOKEN;

    const { getSonarConfig, isSonarConfigured } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(isSonarConfigured(config)).toBe(false);
  });

  it("returns cacheTtlMinutes default 5 when not set", async () => {
    delete process.env.SONAR_CACHE_TTL_MINUTES;

    const { getSonarConfig } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(config.cacheTtlMinutes).toBe(5);
  });

  it("parses SONAR_CACHE_TTL_MINUTES from env", async () => {
    process.env.SONAR_CACHE_TTL_MINUTES = "10";

    const { getSonarConfig } = await import("../sonar-config");
    const config = getSonarConfig();

    expect(config.cacheTtlMinutes).toBe(10);
  });
});
