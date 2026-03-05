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
      message: "Sonar no disponible"
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
      message: "Sonar no disponible"
    });
  });

  it("maps OK status to passed", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          projectStatus: { status: "OK" }
        })
    });

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result.status).toBe("passed");
  });

  it("maps ERROR status to failed", async () => {
    process.env.SONAR_BASE_URL = "https://sonarcloud.io";
    process.env.SONAR_TOKEN = "token";
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          projectStatus: { status: "ERROR" }
        })
    });

    const { SonarCloudRepository } = await import("../SonarCloudRepository");
    const repo = new SonarCloudRepository();

    const result = await repo.getQualityGate("ComfandiTD_test");

    expect(result.status).toBe("failed");
  });
});
