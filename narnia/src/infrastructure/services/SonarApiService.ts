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

  async getProjectQualityGate(projectKey: string): Promise<SonarQualityGate> {
    if (!projectKey.trim()) {
      throw new ValidationError("Project key is required");
    }

    if (!this.isConfigured()) {
      throw new InternalServerError("Sonar integration is not configured");
    }

    try {
      const response = await this.httpClient.get<SonarQualityGateResponse>(
        "/api/qualitygates/project_status",
        {
          params: { projectKey }
        }
      );

      return this.mapQualityGate(response.data.projectStatus?.status);
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
}
