import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { getEnvironment } from "@/infrastructure/config/environment";
import { SonarApiService } from "@/infrastructure/services/SonarApiService";

interface SonarCacheEntry {
  readonly expiresAt: number;
  readonly status: SonarProjectStatus;
}

export class SonarRepository implements ISonarRepository {
  private readonly cacheByProjectSlug = new Map<string, SonarCacheEntry>();

  constructor(
    private readonly sonarApiService: SonarApiService,
    private readonly sonarProjectKeyMap: Record<string, string> = getEnvironment().sonarProjectKeyMap,
    private readonly cacheTtlMs = 5 * 60 * 1000
  ) {}

  async getProjectStatus(projectSlug: string): Promise<SonarProjectStatus> {
    const normalizedProjectSlug = projectSlug.trim().toLowerCase();
    const cachedStatus = this.getCachedStatus(normalizedProjectSlug);

    if (cachedStatus) {
      return cachedStatus;
    }

    const projectKey = this.resolveProjectKey(normalizedProjectSlug);

    if (!projectKey || !this.sonarApiService.isConfigured()) {
      const unavailableStatus = this.buildUnknownStatus(
        normalizedProjectSlug,
        projectKey,
        "Sonar no disponible para este proyecto",
        new Date().toISOString()
      );

      this.setCache(normalizedProjectSlug, unavailableStatus);
      return unavailableStatus;
    }

    try {
      const sonarSnapshot = await this.sonarApiService.getProjectSnapshot(projectKey);
      const status: SonarProjectStatus = {
        qualityGate: sonarSnapshot.qualityGate,
        coverage: sonarSnapshot.coverage,
        bugs: sonarSnapshot.bugs,
        vulnerabilities: sonarSnapshot.vulnerabilities,
        projectKey,
        projectSlug: normalizedProjectSlug,
        message: this.mapQualityGateMessage(sonarSnapshot.qualityGate),
        checkedAt: new Date().toISOString()
      };

      this.setCache(normalizedProjectSlug, status);
      return status;
    } catch {
      const unknownStatus = this.buildUnknownStatus(
        normalizedProjectSlug,
        projectKey,
        "No fue posible consultar Sonar",
        new Date().toISOString()
      );

      this.setCache(normalizedProjectSlug, unknownStatus);
      return unknownStatus;
    }
  }

  private resolveProjectKey(projectSlug: string): string {
    return this.sonarProjectKeyMap[projectSlug] ?? "";
  }

  private getCachedStatus(projectSlug: string): SonarProjectStatus | null {
    const cachedEntry = this.cacheByProjectSlug.get(projectSlug);

    if (!cachedEntry) {
      return null;
    }

    if (Date.now() >= cachedEntry.expiresAt) {
      this.cacheByProjectSlug.delete(projectSlug);
      return null;
    }

    return cachedEntry.status;
  }

  private setCache(projectSlug: string, status: SonarProjectStatus): void {
    this.cacheByProjectSlug.set(projectSlug, {
      status,
      expiresAt: Date.now() + this.cacheTtlMs
    });
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
