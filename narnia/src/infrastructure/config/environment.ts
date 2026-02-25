interface AppEnvironment {
  bffBaseUrl: string;
  keycloakIssuer: string;
  keycloakClientId: string;
  keycloakClientSecret: string;
}

const readEnv = (key: string): string => process.env[key] ?? "";

export const getEnvironment = (): AppEnvironment => ({
  bffBaseUrl: readEnv("NARNIA_BFF_BASE_URL") || "http://localhost:3000/api/v1",
  keycloakIssuer: readEnv("KEYCLOAK_ISSUER"),
  keycloakClientId: readEnv("KEYCLOAK_CLIENT_ID"),
  keycloakClientSecret: readEnv("KEYCLOAK_CLIENT_SECRET")
});
