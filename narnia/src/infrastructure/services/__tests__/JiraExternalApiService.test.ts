import type { AppEnvironment } from "@/infrastructure/config/environment";
import { JiraExternalApiService } from "@/infrastructure/services/JiraExternalApiService";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError
} from "@/utils/errors/domain-errors";

interface MockedResponseConfig {
  status?: number;
  payload?: unknown;
}

const createEnvironment = (overrides: Partial<AppEnvironment> = {}): AppEnvironment => ({
  bffBaseUrl: "",
  keycloakIssuer: "",
  keycloakClientId: "",
  keycloakClientSecret: "",
  jiraBaseUrl: "https://acme.atlassian.net",
  jiraApiEmail: "jira.user@acme.com",
  jiraApiToken: "jira-token",
  jiraProjectKeyMap: "{\"afiliaciones\":\"AFI\"}",
  authDisabled: true,
  ...overrides
});

const createResponse = ({ status = 200, payload = {} }: MockedResponseConfig = {}): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(payload)
  }) as unknown as Response;

describe("JiraExternalApiService", () => {
  it("returns Jira metrics using TOKEN_API_JIRA credentials server-side", async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce(createResponse({ payload: { total: 12, issues: [] } }))
      .mockResolvedValueOnce(createResponse({ payload: { total: 3, issues: [] } }))
      .mockResolvedValueOnce(createResponse({ payload: { total: 8, issues: [] } }))
      .mockResolvedValueOnce(
        createResponse({
          payload: {
            total: 2,
            issues: [
              {
                fields: {
                  resolutiondate: "2026-03-02T18:00:00.000Z"
                },
                changelog: {
                  histories: [
                    {
                      created: "2026-03-02T12:00:00.000Z",
                      items: [
                        {
                          field: "status",
                          fromString: "To Do",
                          toString: "In Progress"
                        }
                      ]
                    },
                    {
                      created: "2026-03-02T18:00:00.000Z",
                      items: [
                        {
                          field: "status",
                          fromString: "In Progress",
                          toString: "Done"
                        }
                      ]
                    }
                  ]
                }
              },
              {
                fields: {
                  resolutiondate: "2026-03-02T23:00:00.000Z"
                },
                changelog: {
                  histories: [
                    {
                      created: "2026-03-02T19:00:00.000Z",
                      items: [
                        {
                          field: "status",
                          fromString: "To Do",
                          toString: "In Progress"
                        }
                      ]
                    },
                    {
                      created: "2026-03-02T23:00:00.000Z",
                      items: [
                        {
                          field: "status",
                          fromString: "In Progress",
                          toString: "Done"
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        })
      );

    const service = new JiraExternalApiService(fetcher, createEnvironment());
    const result = await service.getProjectMetrics("afiliaciones");

    expect(result.openIssues).toBe(12);
    expect(result.blockedIssues).toBe(3);
    expect(result.closedIssuesLast7Days).toBe(8);
    expect(result.avgInProgressHours).toBe(5);
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(fetcher.mock.calls[0][0]).toContain("project+%3D+%22AFI%22");
    expect(fetcher.mock.calls[0][1]?.headers).toMatchObject({
      Accept: "application/json"
    });
  });

  it("throws InternalServerError when Jira env credentials are missing", async () => {
    const service = new JiraExternalApiService(
      jest.fn(),
      createEnvironment({
        jiraApiToken: ""
      })
    );

    await expect(service.getProjectMetrics("afiliaciones")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });

  it("maps 401 responses to UnauthorizedError", async () => {
    const service = new JiraExternalApiService(
      jest.fn().mockResolvedValue(createResponse({ status: 401 })),
      createEnvironment()
    );

    await expect(service.getProjectMetrics("afiliaciones")).rejects.toBeInstanceOf(
      UnauthorizedError
    );
  });

  it("maps 400 responses to BadRequestError", async () => {
    const service = new JiraExternalApiService(
      jest.fn().mockResolvedValue(createResponse({ status: 400 })),
      createEnvironment()
    );

    await expect(service.getProjectMetrics("afiliaciones")).rejects.toBeInstanceOf(
      BadRequestError
    );
  });
});
