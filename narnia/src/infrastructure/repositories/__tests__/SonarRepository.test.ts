import { SonarRepository } from "@/infrastructure/repositories/SonarRepository";

describe("SonarRepository", () => {
  it("returns mock sonar status with expected fields", async () => {
    const repo = new SonarRepository();
    const result = await repo.getIntegrationStatus();

    expect(result).toMatchObject({
      status: "healthy",
      qualityGateStatus: "PASSED",
      coverage: expect.any(Number),
      bugs: expect.any(Number),
      vulnerabilities: expect.any(Number),
      projectName: expect.any(String)
    });
    expect(result.coverage).toBe(82.4);
    expect(result.bugs).toBe(12);
    expect(result.vulnerabilities).toBe(0);
    expect(result.projectName).toBe("Proyecto Alfa");
  });
});
