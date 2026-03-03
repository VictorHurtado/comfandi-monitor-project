import type { AppEnvironment } from "@/infrastructure/config/environment";
import { getEnvironment } from "@/infrastructure/config/environment";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError
} from "@/utils/errors/domain-errors";

import type { JiraMetricsDto } from "@/infrastructure/services/JiraMetricsService";

interface JiraSearchIssueField {
  resolutiondate: string | null;
}

interface JiraStatusHistoryItem {
  field: string;
  fromString?: string | null;
  toString?: string | null;
}

interface JiraStatusHistory {
  created: string;
  items: JiraStatusHistoryItem[];
}

interface JiraSearchIssue {
  fields: JiraSearchIssueField;
  changelog?: {
    histories: JiraStatusHistory[];
  };
}

interface JiraSearchResponse {
  total: number;
  issues: JiraSearchIssue[];
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const IN_PROGRESS_STATUS = "in progress";
const SEARCH_ENDPOINT = "/rest/api/3/search";

export class JiraExternalApiService {
  constructor(
    private readonly fetcher: FetchLike = fetch,
    private readonly environment: AppEnvironment = getEnvironment()
  ) {}

  async getProjectMetrics(projectId: string): Promise<JiraMetricsDto> {
    const normalizedProjectId = projectId.trim();

    if (!normalizedProjectId) {
      throw new ValidationError("Project id is required");
    }

    if (!this.isConfigured()) {
      throw new InternalServerError("Jira integration is not configured");
    }

    const projectKey = this.resolveProjectKey(normalizedProjectId);

    const [openIssues, blockedIssues, closedIssuesLast7Days, avgInProgressHours] =
      await Promise.all([
        this.getIssueCount(`project = "${projectKey}" AND statusCategory != Done`),
        this.getIssueCount(`project = "${projectKey}" AND status = "Blocked"`),
        this.getIssueCount(`project = "${projectKey}" AND statusCategory = Done AND resolved >= -7d`),
        this.getAverageInProgressHours(projectKey)
      ]);

    return {
      openIssues,
      blockedIssues,
      closedIssuesLast7Days,
      avgInProgressHours,
      checkedAt: new Date().toISOString()
    };
  }

  private isConfigured(): boolean {
    return Boolean(
      this.environment.jiraBaseUrl && this.environment.jiraApiEmail && this.environment.jiraApiToken
    );
  }

  private resolveProjectKey(projectId: string): string {
    const projectMap = this.parseProjectMap();
    const fromMap = projectMap[projectId] ?? projectMap[projectId.toLowerCase()];

    if (fromMap) {
      return fromMap;
    }

    const fallbackKey = projectId.toUpperCase().replace(/[^A-Z0-9_]/g, "");

    if (!fallbackKey) {
      throw new ValidationError("Project id cannot be mapped to Jira project key");
    }

    return fallbackKey;
  }

  private parseProjectMap(): Record<string, string> {
    const rawMap = this.environment.jiraProjectKeyMap.trim();

    if (!rawMap) {
      return {};
    }

    try {
      const parsed = JSON.parse(rawMap);
      if (!parsed || typeof parsed !== "object") {
        return {};
      }

      return Object.entries(parsed).reduce<Record<string, string>>((accumulator, [key, value]) => {
        if (typeof value !== "string" || !key.trim() || !value.trim()) {
          return accumulator;
        }

        accumulator[key.trim()] = value.trim();
        return accumulator;
      }, {});
    } catch {
      return {};
    }
  }

  private async getIssueCount(jql: string): Promise<number> {
    const response = await this.search(jql, {
      maxResults: 0,
      fields: ["status"]
    });

    return response.total;
  }

  private async getAverageInProgressHours(projectKey: string): Promise<number> {
    const response = await this.search(`project = "${projectKey}" ORDER BY updated DESC`, {
      maxResults: 50,
      fields: ["resolutiondate"],
      expand: "changelog"
    });

    const durations: number[] = [];

    for (const issue of response.issues) {
      durations.push(...this.extractInProgressDurations(issue));
    }

    if (durations.length === 0) {
      return 0;
    }

    const totalHours = durations.reduce((accumulator, duration) => accumulator + duration, 0);
    return Number((totalHours / durations.length).toFixed(1));
  }

  private extractInProgressDurations(issue: JiraSearchIssue): number[] {
    const durations: number[] = [];
    const histories = issue.changelog?.histories ?? [];
    const sortedHistories = [...histories].sort(
      (current, next) => new Date(current.created).getTime() - new Date(next.created).getTime()
    );

    let inProgressStart: Date | null = null;

    for (const history of sortedHistories) {
      for (const item of history.items) {
        if (item.field !== "status") {
          continue;
        }

        const changedAt = new Date(history.created);
        const fromStatus = item.fromString?.toLowerCase() ?? "";
        const toStatus = item.toString?.toLowerCase() ?? "";

        if (toStatus === IN_PROGRESS_STATUS) {
          inProgressStart = changedAt;
        }

        if (fromStatus === IN_PROGRESS_STATUS && inProgressStart) {
          const hours = this.diffHours(inProgressStart, changedAt);
          if (hours > 0) {
            durations.push(hours);
          }
          inProgressStart = null;
        }
      }
    }

    if (inProgressStart) {
      const fallbackEnd = issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : new Date();
      const hours = this.diffHours(inProgressStart, fallbackEnd);
      if (hours > 0) {
        durations.push(hours);
      }
    }

    return durations;
  }

  private diffHours(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  private async search(
    jql: string,
    options: { maxResults: number; fields: string[]; expand?: string }
  ): Promise<JiraSearchResponse> {
    const searchUrl = new URL(SEARCH_ENDPOINT, this.environment.jiraBaseUrl);
    searchUrl.searchParams.set("jql", jql);
    searchUrl.searchParams.set("maxResults", String(options.maxResults));
    searchUrl.searchParams.set("fields", options.fields.join(","));

    if (options.expand) {
      searchUrl.searchParams.set("expand", options.expand);
    }

    let response: Response;
    try {
      response = await this.fetcher(searchUrl.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.getBasicAuthHeader()
        }
      });
    } catch (error) {
      throw new InternalServerError("Unable to fetch Jira metrics", error);
    }

    if (!response.ok) {
      this.throwByStatusCode(response.status);
    }

    const payload = (await response.json()) as JiraSearchResponse;
    return payload;
  }

  private getBasicAuthHeader(): string {
    const token = Buffer.from(
      `${this.environment.jiraApiEmail}:${this.environment.jiraApiToken}`,
      "utf-8"
    ).toString("base64");

    return `Basic ${token}`;
  }

  private throwByStatusCode(statusCode: number): never {
    if (statusCode === 401) {
      throw new UnauthorizedError("Jira credentials are invalid");
    }

    if (statusCode === 403) {
      throw new ForbiddenError("Jira credentials are not authorized");
    }

    if (statusCode === 404) {
      throw new NotFoundError("Jira project was not found");
    }

    throw new InternalServerError("Unable to fetch Jira metrics");
  }
}
