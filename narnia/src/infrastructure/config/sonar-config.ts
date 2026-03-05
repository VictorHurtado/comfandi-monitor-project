const readEnv = (key: string): string => process.env[key] ?? "";

export interface SonarConfig {
  baseUrl: string;
  token: string;
  projectKeyMap: Record<string, string>;
}

function parseProjectKeyMap(raw: string): Record<string, string> {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

export function getSonarConfig(): SonarConfig {
  return {
    baseUrl: readEnv("SONAR_BASE_URL").replace(/\/$/, "") || "https://sonarcloud.io",
    token: readEnv("SONAR_TOKEN"),
    projectKeyMap: parseProjectKeyMap(readEnv("SONAR_PROJECT_KEY_MAP"))
  };
}

export function isSonarConfigured(config: SonarConfig): boolean {
  return Boolean(config.baseUrl && config.token);
}
