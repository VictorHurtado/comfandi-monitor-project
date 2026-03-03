export interface AppEnvironment {
  bffBaseUrl: string;
  keycloakIssuer: string;
  keycloakClientId: string;
  keycloakClientSecret: string;
  jiraBaseUrl: string;
  jiraApiEmail: string;
  jiraApiToken: string;
  jiraProjectKeyMap: string;
  authDisabled: boolean;
}

const readEnv = (key: string): string => process.env[key] ?? "";
const readFlag = (key: string): boolean =>
  ["1", "true", "yes", "on"].includes(readEnv(key).toLowerCase());

export const getEnvironment = (): AppEnvironment => ({
  bffBaseUrl: readEnv("NARNIA_BFF_BASE_URL") || "http://localhost:3000/api/v1",
  keycloakIssuer: readEnv("KEYCLOAK_ISSUER"),
  keycloakClientId: readEnv("KEYCLOAK_CLIENT_ID"),
  keycloakClientSecret: readEnv("KEYCLOAK_CLIENT_SECRET"),
  jiraBaseUrl: readEnv("JIRA_BASE_URL"),
  jiraApiEmail: readEnv("EMAIL_API_JIRA"),
  jiraApiToken: readEnv("TOKEN_API_JIRA"),
  jiraProjectKeyMap: readEnv("JIRA_PROJECT_KEY_MAP"),
  authDisabled: readFlag("AUTH_DISABLED") && process.env.NODE_ENV !== "production"
});
