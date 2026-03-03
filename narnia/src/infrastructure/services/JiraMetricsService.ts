import axios, { type AxiosInstance } from "axios";
import {
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

export interface JiraMetricsDto {
  openIssues: number;
  blockedIssues: number;
  closedIssuesLast7Days: number;
  avgInProgressHours: number;
  checkedAt: string;
}

export class JiraMetricsService {
  constructor(private readonly http: AxiosInstance) {}

  async getProjectMetrics(projectId: string): Promise<JiraMetricsDto> {
    const normalizedProjectId = projectId.trim();

    if (!normalizedProjectId) {
      throw new ValidationError("Project id is required");
    }

    try {
      const response = await this.http.get<JiraMetricsDto>("/api/v1/jira/metrics", {
        params: { projectId: normalizedProjectId }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new InternalServerError("Jira metrics request timeout", error);
      }

      throw new InternalServerError("Error loading Jira metrics", error);
    }
  }
}
