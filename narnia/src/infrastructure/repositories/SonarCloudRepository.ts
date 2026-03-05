import type { SonarQualityGateResult, SonarQualityGateStatus } from "@/domain/models/SonarQualityGate";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { getSonarConfig, isSonarConfigured } from "@/infrastructure/config/sonar-config";

interface SonarApiProjectStatus {
  projectStatus?: {
    status?: string;
  };
}

function mapApiStatusToDomain(apiStatus: string | undefined): SonarQualityGateStatus {
  if (apiStatus === "OK") return "passed";
  if (apiStatus === "ERROR") return "failed";
  return "unknown";
}

export class SonarCloudRepository implements ISonarRepository {
  async getQualityGate(sonarProjectKey: string): Promise<SonarQualityGateResult> {
    const config = getSonarConfig();

    if (!isSonarConfigured(config)) {
      return {
        status: "unknown",
        sonarProjectKey,
        projectName: "",
        message: "Sonar no disponible"
      };
    }

    const url = `${config.baseUrl}/api/qualitygates/project_status?projectKey=${encodeURIComponent(sonarProjectKey)}`;
    const auth = config.token ? Buffer.from(`${config.token}:`).toString("base64") : "";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(auth && { Authorization: `Basic ${auth}` })
        }
      });

      if (!response.ok) {
        return {
          status: "unknown",
          sonarProjectKey,
          projectName: "",
          message: "Sonar no disponible"
        };
      }

      const data = (await response.json()) as SonarApiProjectStatus;
      const apiStatus = data.projectStatus?.status;

      return {
        status: mapApiStatusToDomain(apiStatus),
        sonarProjectKey,
        projectName: ""
      };
    } catch {
      return {
        status: "unknown",
        sonarProjectKey,
        projectName: "",
        message: "Sonar no disponible"
      };
    }
  }
}
