import type { SonarQualityGateResult, SonarQualityGateStatus } from "@/domain/models/SonarQualityGate";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { getSonarConfig, isSonarConfigured } from "@/infrastructure/config/sonar-config";

interface SonarApiProjectStatus {
  projectStatus?: {
    status?: string;
  };
}

interface SonarMeasure {
  metric?: string;
  value?: string;
}

interface SonarApiMeasures {
  component?: {
    measures?: SonarMeasure[];
  };
}

function mapApiStatusToDomain(apiStatus: string | undefined): SonarQualityGateStatus {
  if (apiStatus === "OK") return "passed";
  if (apiStatus === "ERROR") return "failed";
  return "unknown";
}

function parseMeasures(data: SonarApiMeasures): {
  coverage: number | null;
  bugs: number | null;
  vulnerabilities: number | null;
} {
  const measures = data.component?.measures ?? [];
  const byMetric: Record<string, string> = {};
  for (const m of measures) {
    if (m.metric && m.value !== undefined) byMetric[m.metric] = m.value;
  }

  const parseNum = (v: string | undefined): number | null => {
    if (v === undefined || v === "") return null;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    coverage: parseNum(byMetric.coverage),
    bugs: parseNum(byMetric.bugs),
    vulnerabilities: parseNum(byMetric.vulnerabilities)
  };
}

export class SonarCloudRepository implements ISonarRepository {
  async getQualityGate(sonarProjectKey: string): Promise<SonarQualityGateResult> {
    const config = getSonarConfig();

    if (!isSonarConfigured(config)) {
      return {
        status: "unknown",
        sonarProjectKey,
        projectName: "",
        message: "Sonar no disponible",
        coverage: null,
        bugs: null,
        vulnerabilities: null
      };
    }

    const baseUrl = config.baseUrl;
    const auth = config.token ? Buffer.from(`${config.token}:`).toString("base64") : "";
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(auth && { Authorization: `Basic ${auth}` })
    };

    const statusUrl = `${baseUrl}/api/qualitygates/project_status?projectKey=${encodeURIComponent(sonarProjectKey)}`;
    const measuresUrl = `${baseUrl}/api/measures/component?component=${encodeURIComponent(sonarProjectKey)}&metricKeys=coverage,bugs,vulnerabilities`;

    try {
      const [statusRes, measuresRes] = await Promise.all([
        fetch(statusUrl, { method: "GET", headers }),
        fetch(measuresUrl, { method: "GET", headers })
      ]);

      if (!statusRes.ok) {
        return {
          status: "unknown",
          sonarProjectKey,
          projectName: "",
          message: "Sonar no disponible",
          coverage: null,
          bugs: null,
          vulnerabilities: null
        };
      }

      const statusData = (await statusRes.json()) as SonarApiProjectStatus;
      const apiStatus = statusData.projectStatus?.status;

      let coverage: number | null = null;
      let bugs: number | null = null;
      let vulnerabilities: number | null = null;
      if (measuresRes.ok) {
        const measuresData = (await measuresRes.json()) as SonarApiMeasures;
        const parsed = parseMeasures(measuresData);
        coverage = parsed.coverage;
        bugs = parsed.bugs;
        vulnerabilities = parsed.vulnerabilities;
      }

      return {
        status: mapApiStatusToDomain(apiStatus),
        sonarProjectKey,
        projectName: "",
        coverage,
        bugs,
        vulnerabilities
      };
    } catch {
      return {
        status: "unknown",
        sonarProjectKey,
        projectName: "",
        message: "Sonar no disponible",
        coverage: null,
        bugs: null,
        vulnerabilities: null
      };
    }
  }
}
