import axios, { type AxiosInstance } from "axios";
import type { SonarQualityGate } from "@/domain/models/SonarProjectStatus";
import { getEnvironment } from "@/infrastructure/config/environment";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

interface SonarQualityGateResponse {
  projectStatus?: {
    status?: string;
  };
}

interface SonarMeasuresResponse {
  component?: {
    measures?: Array<{
      metric?: string;
      value?: string;
    }>;
  };
}

export interface SonarProjectSnapshot {
  qualityGate: SonarQualityGate;
  coverage?: number;
  bugs?: number;
  vulnerabilities?: number;
}

export class SonarApiService {
  private readonly environment = getEnvironment();
  private readonly httpClient: AxiosInstance;

  constructor(httpClient?: AxiosInstance) {
    this.httpClient =
      httpClient ??
      axios.create({
        baseURL: this.environment.sonarBaseUrl,
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${this.environment.sonarToken}`,
          "Content-Type": "application/json"
        }
      });
  }

  isConfigured(): boolean {
    return Boolean(this.environment.sonarBaseUrl && this.environment.sonarToken);
  }

  async getProjectSnapshot(projectKey: string): Promise<SonarProjectSnapshot> {
    if (!projectKey.trim()) {
      throw new ValidationError("Project key is required");
    }

    if (!this.isConfigured()) {
      throw new InternalServerError("Sonar integration is not configured");
    }

    try {
      const qualityGateResponse = await this.httpClient.get<SonarQualityGateResponse>(
        "/api/qualitygates/project_status",
        {
          params: { projectKey }
        }
      );

      const measures = await this.loadMeasuresSafely(projectKey);

      return {
        qualityGate: this.mapQualityGate(qualityGateResponse.data.projectStatus?.status),
        coverage: measures.coverage,
        bugs: measures.bugs,
        vulnerabilities: measures.vulnerabilities
      };
    } catch (error) {
      throw new InternalServerError("Unable to load Sonar quality gate", error);
    }
  }

  private mapQualityGate(rawStatus?: string): SonarQualityGate {
    if (rawStatus === "OK") {
      return "passed";
    }

    if (rawStatus === "ERROR") {
      return "failed";
    }

    return "unknown";
  }

  private async loadMeasuresSafely(
    projectKey: string
  ): Promise<Pick<SonarProjectSnapshot, "coverage" | "bugs" | "vulnerabilities">> {
    try {
      const response = await this.httpClient.get<SonarMeasuresResponse>("/api/measures/component", {
        params: {
          component: projectKey,
          metricKeys: "coverage,bugs,vulnerabilities"
        }
      });

      return {
        coverage: this.readMeasure(response.data, "coverage"),
        bugs: this.readMeasure(response.data, "bugs"),
        vulnerabilities: this.readMeasure(response.data, "vulnerabilities")
      };
    } catch {
      return {
        coverage: undefined,
        bugs: undefined,
        vulnerabilities: undefined
      };
    }
  }

  private readMeasure(response: SonarMeasuresResponse, metricKey: string): number | undefined {
    const rawValue = response.component?.measures?.find(
      (measure) => measure.metric === metricKey
    )?.value;

    if (rawValue === undefined) {
      return undefined;
    }

    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }
}
