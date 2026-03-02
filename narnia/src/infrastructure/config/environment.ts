interface AppEnvironment {
  bffBaseUrl: string;
  keycloakIssuer: string;
  keycloakClientId: string;
  keycloakClientSecret: string;
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
  authDisabled: readFlag("AUTH_DISABLED") && process.env.NODE_ENV !== "production"
});
