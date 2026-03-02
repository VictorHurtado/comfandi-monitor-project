import type { SonarQubeHealthData } from "@/domain/models/SonarQubeMetrics";
import type { ISonarQubeRepository } from "@/domain/repositories/ISonarQubeRepository";

export class MockSonarQubeRepository implements ISonarQubeRepository {
  async getSonarQubeHealth(): Promise<SonarQubeHealthData> {
    return {
      projectName: "Proyecto Alfa",
      status: "ok",
      metrics: {
        qualityGateStatus: "passed",
        coverage: 82.4,
        bugs: 12,
        vulnerabilities: 0
      },
      lastCheckedAt: new Date().toISOString()
    };
  }
}
