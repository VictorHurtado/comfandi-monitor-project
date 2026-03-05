describe("sonar-cache", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when cache is empty", async () => {
    process.env.SONAR_CACHE_TTL_MINUTES = "5";

    const { getCachedSonarResult } = await import("../sonar-cache");

    expect(getCachedSonarResult("afiliaciones")).toBeNull();
  });

  it("returns null when cacheTtl is 0", async () => {
    process.env.SONAR_CACHE_TTL_MINUTES = "0";

    const { getCachedSonarResult, setCachedSonarResult } = await import("../sonar-cache");

    setCachedSonarResult("afiliaciones", {
      status: "passed",
      sonarProjectKey: "key",
      projectName: "Test"
    });

    expect(getCachedSonarResult("afiliaciones")).toBeNull();
  });

  it("stores and retrieves cached result within TTL", async () => {
    process.env.SONAR_CACHE_TTL_MINUTES = "5";

    const { getCachedSonarResult, setCachedSonarResult } = await import("../sonar-cache");

    const result = {
      status: "passed" as const,
      sonarProjectKey: "key",
      projectName: "Test"
    };
    setCachedSonarResult("afiliaciones", result);

    const cached = getCachedSonarResult("afiliaciones");
    expect(cached).not.toBeNull();
    expect(cached!.status).toBe("passed");
    expect(cached!.fetchedAt).toBeDefined();
  });
});
