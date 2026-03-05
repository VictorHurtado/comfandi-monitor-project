describe("SonarProjectKeyResolver", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns sonar project key when mapped", async () => {
    process.env.SONAR_PROJECT_KEY_MAP = '{"afiliaciones":"ComfandiTD_sucursal-afiliaciones"}';

    const { SonarProjectKeyResolver } = await import("../SonarProjectKeyResolver");
    const resolver = new SonarProjectKeyResolver();

    expect(resolver.getSonarProjectKey("afiliaciones")).toBe("ComfandiTD_sucursal-afiliaciones");
  });

  it("returns null when projectId is not in map", async () => {
    process.env.SONAR_PROJECT_KEY_MAP = '{"afiliaciones":"ComfandiTD_afiliaciones"}';

    const { SonarProjectKeyResolver } = await import("../SonarProjectKeyResolver");
    const resolver = new SonarProjectKeyResolver();

    expect(resolver.getSonarProjectKey("unknown")).toBeNull();
  });

  it("returns null when map is empty", async () => {
    delete process.env.SONAR_PROJECT_KEY_MAP;

    const { SonarProjectKeyResolver } = await import("../SonarProjectKeyResolver");
    const resolver = new SonarProjectKeyResolver();

    expect(resolver.getSonarProjectKey("afiliaciones")).toBeNull();
  });
});
