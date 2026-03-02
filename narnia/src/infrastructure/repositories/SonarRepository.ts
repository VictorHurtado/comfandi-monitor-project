import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import type { SonarIntegrationStatus } from "@/domain/models/SonarIntegrationStatus";

export class SonarRepository implements ISonarRepository {
  async getIntegrationStatus(): Promise<SonarIntegrationStatus> {
    return this.getMockStatus();
  }

  private getMockStatus(): SonarIntegrationStatus {
    return {
      status: "healthy",
      qualityGateStatus: "PASSED",
      coverage: 82.4,
      bugs: 12,
      vulnerabilities: 0,
      projectName: "Proyecto Alfa"
    };
  }
}
