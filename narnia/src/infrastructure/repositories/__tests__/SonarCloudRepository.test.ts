describe("SonarCloudRepository", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  it("returns unknown when Sonar is not configured", async () => {
    delete process.env.SONAR_TOKEN;
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result).toEqual({
      status: "unknown",
      sonarProjectKey: "ComfandiTD_test",
      projectName: "",
      message: "Sonar no disponible",
      coverage: null,
      bugs: null,
      vulnerabilities: null
    });
  });

  it("returns unknown on fetch error", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result.status).toBe("unknown");
    expect(result.message).toBe("Sonar no disponible");
    expect(result.coverage).toBeNull();
    expect(result.bugs).toBeNull();
    expect(result.vulnerabilities).toBeNull();
  });

  it("returns unknown when response is not ok", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false });

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result).toEqual({
      status: "unknown",
      sonarProjectKey: "ComfandiTD_test",
      projectName: "",
      message: "Sonar no disponible",
      coverage: null,
      bugs: null,
      vulnerabilities: null
    });
  });

  it("maps OK status to passed", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ projectStatus: { status: "OK" } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ component: { measures: [] } })
      });

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result.status).toBe("passed");
    expect(result.coverage).toBeNull();
    expect(result.bugs).toBeNull();
    expect(result.vulnerabilities).toBeNull();
  });

  it("maps ERROR status to failed", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ projectStatus: { status: "ERROR" } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ component: { measures: [] } })
      });

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result.status).toBe("failed");
  });

  it("parses coverage bugs and vulnerabilities from measures", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ projectStatus: { status: "OK" } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            component: {
              measures: [
                { metric: "coverage", value: "85.3" },
                { metric: "bugs", value: "2" },
                { metric: "vulnerabilities", value: "0" }
              ]
            }
          })
      });

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result.coverage).toBe(85.3);
    expect(result.bugs).toBe(2);
    expect(result.vulnerabilities).toBe(0);
  });
});
