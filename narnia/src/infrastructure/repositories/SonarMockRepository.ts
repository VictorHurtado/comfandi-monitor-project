import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

export class SonarMockRepository implements ISonarRepository {
  async getSonarIntegrationHealth(): Promise<IntegrationHealth> {
    return {
      provider: "sonar",
      status: "warning",
      message: "Quality gate: WARN. Cobertura por debajo del umbral recomendado.",
      checkedAt: new Date().toISOString(),
      sonarMetrics: {
        qualityGateStatus: "WARN",
        coverage: 72.5,
        bugs: 3,
        vulnerabilities: 1
      }
    };
  }
}
