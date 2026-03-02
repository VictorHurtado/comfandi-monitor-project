import { MockSonarQubeRepository } from "@/infrastructure/repositories/MockSonarQubeRepository";

describe("MockSonarQubeRepository", () => {
  it("returns valid SonarQube health data with all required fields", async () => {
    const repository = new MockSonarQubeRepository();
    const result = await repository.getSonarQubeHealth();

    expect(result.projectName).toBe("Proyecto Alfa");
    expect(result.status).toBe("ok");
    expect(result.lastCheckedAt).toBeTruthy();
    expect(result.metrics).not.toBeNull();
  });

  it("returns expected mock metrics values", async () => {
    const repository = new MockSonarQubeRepository();
    const result = await repository.getSonarQubeHealth();

    expect(result.metrics!.qualityGateStatus).toBe("passed");
    expect(result.metrics!.coverage).toBe(82.4);
    expect(result.metrics!.bugs).toBe(12);
    expect(result.metrics!.vulnerabilities).toBe(0);
  });

  it("returns a valid ISO date string for lastCheckedAt", async () => {
    const repository = new MockSonarQubeRepository();
    const result = await repository.getSonarQubeHealth();

    expect(() => new Date(result.lastCheckedAt)).not.toThrow();
    expect(new Date(result.lastCheckedAt).toISOString()).toBe(result.lastCheckedAt);
  });
});
