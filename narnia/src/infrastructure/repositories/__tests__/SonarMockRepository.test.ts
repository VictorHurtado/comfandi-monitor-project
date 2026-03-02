import { SonarMockRepository } from "@/infrastructure/repositories/SonarMockRepository";

describe("SonarMockRepository", () => {
  let repository: SonarMockRepository;

  beforeEach(() => {
    repository = new SonarMockRepository();
  });

  it("returns an IntegrationHealth with provider sonar", async () => {
    const result = await repository.getSonarIntegrationHealth();
    expect(result.provider).toBe("sonar");
  });

  it("returns warning status as mock state", async () => {
    const result = await repository.getSonarIntegrationHealth();
    expect(result.status).toBe("warning");
  });

  it("includes sonarMetrics with all required fields", async () => {
    const result = await repository.getSonarIntegrationHealth();
    expect(result.sonarMetrics).toBeDefined();
    expect(result.sonarMetrics?.qualityGateStatus).toBe("WARN");
    expect(typeof result.sonarMetrics?.coverage).toBe("number");
    expect(typeof result.sonarMetrics?.bugs).toBe("number");
    expect(typeof result.sonarMetrics?.vulnerabilities).toBe("number");
  });

  it("returns a recent checkedAt timestamp", async () => {
    const before = new Date().getTime();
    const result = await repository.getSonarIntegrationHealth();
    const after = new Date().getTime();
    const checkedAtMs = new Date(result.checkedAt).getTime();
    expect(checkedAtMs).toBeGreaterThanOrEqual(before);
    expect(checkedAtMs).toBeLessThanOrEqual(after);
  });

  it("returns a non-empty message", async () => {
    const result = await repository.getSonarIntegrationHealth();
    expect(result.message.length).toBeGreaterThan(0);
  });

  it("returns coverage within valid percentage range", async () => {
    const result = await repository.getSonarIntegrationHealth();
    const coverage = result.sonarMetrics?.coverage ?? -1;
    expect(coverage).toBeGreaterThanOrEqual(0);
    expect(coverage).toBeLessThanOrEqual(100);
  });
});
