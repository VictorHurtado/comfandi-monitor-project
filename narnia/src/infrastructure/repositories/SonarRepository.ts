import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { getEnvironment } from "@/infrastructure/config/environment";
import { SonarApiService } from "@/infrastructure/services/SonarApiService";

export class SonarRepository implements ISonarRepository {
  constructor(
    private readonly sonarApiService: SonarApiService,
    private readonly sonarProjectKeyMap: Record<string, string> = getEnvironment().sonarProjectKeyMap
  ) {}

  async getProjectStatus(projectSlug: string): Promise<SonarProjectStatus> {
    const normalizedProjectSlug = projectSlug.trim().toLowerCase();
    const checkedAt = new Date().toISOString();
    const projectKey = this.resolveProjectKey(normalizedProjectSlug);

    if (!projectKey || !this.sonarApiService.isConfigured()) {
      return this.buildUnknownStatus(
        normalizedProjectSlug,
        projectKey,
        "Sonar no disponible para este proyecto",
        checkedAt
      );
    }

    try {
      const qualityGate = await this.sonarApiService.getProjectQualityGate(projectKey);

      return {
        qualityGate,
        projectKey,
        projectSlug: normalizedProjectSlug,
        message: this.mapQualityGateMessage(qualityGate),
        checkedAt
      };
    } catch {
      return this.buildUnknownStatus(
        normalizedProjectSlug,
        projectKey,
        "No fue posible consultar Sonar",
        checkedAt
      );
    }
  }

  private resolveProjectKey(projectSlug: string): string {
    return this.sonarProjectKeyMap[projectSlug] ?? "";
  }

  private mapQualityGateMessage(qualityGate: SonarProjectStatus["qualityGate"]): string {
    if (qualityGate === "passed") {
      return "Quality Gate passed";
    }

    if (qualityGate === "failed") {
      return "Quality Gate failed";
    }

    return "Sin datos de Quality Gate";
  }

  private buildUnknownStatus(
    projectSlug: string,
    projectKey: string,
    message: string,
    checkedAt: string
  ): SonarProjectStatus {
    return {
      qualityGate: "unknown",
      projectKey,
      projectSlug,
      message,
      checkedAt
    };
  }
}
