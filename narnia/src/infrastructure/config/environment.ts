interface AppEnvironment {
  bffBaseUrl: string;
  keycloakIssuer: string;
  keycloakClientId: string;
  keycloakClientSecret: string;
  sonarBaseUrl: string;
  sonarToken: string;
  sonarProjectKeyMap: Record<string, string>;
  authDisabled: boolean;
}

const readEnv = (key: string): string => process.env[key] ?? "";
const readFlag = (key: string): boolean =>
  ["1", "true", "yes", "on"].includes(readEnv(key).toLowerCase());
const readJsonRecord = (key: string): Record<string, string> => {
  const rawValue = readEnv(key).trim();

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, unknown>;

    if (!parsedValue || Array.isArray(parsedValue) || typeof parsedValue !== "object") {
      return {};
    }

    return Object.entries(parsedValue).reduce<Record<string, string>>(
      (accumulator, [projectSlug, projectKey]) => {
        if (typeof projectKey === "string" && projectKey.trim()) {
          accumulator[projectSlug.toLowerCase()] = projectKey.trim();
        }

        return accumulator;
      },
      {}
    );
  } catch {
    return {};
  }
};

export const getEnvironment = (): AppEnvironment => ({
  bffBaseUrl: readEnv("NARNIA_BFF_BASE_URL") || "http://localhost:3000/api/v1",
  keycloakIssuer: readEnv("KEYCLOAK_ISSUER"),
  keycloakClientId: readEnv("KEYCLOAK_CLIENT_ID"),
  keycloakClientSecret: readEnv("KEYCLOAK_CLIENT_SECRET"),
  sonarBaseUrl: readEnv("SONAR_BASE_URL"),
  sonarToken: readEnv("SONAR_TOKEN"),
  sonarProjectKeyMap: readJsonRecord("SONAR_PROJECT_KEY_MAP"),
  authDisabled: readFlag("AUTH_DISABLED") && process.env.NODE_ENV !== "production"
});
