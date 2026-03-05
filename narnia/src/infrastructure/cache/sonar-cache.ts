import type { SonarQualityGateResult } from "@/domain/models/SonarQualityGate";
import { getSonarConfig } from "@/infrastructure/config/sonar-config";

interface CacheEntry {
  result: SonarQualityGateResult & { fetchedAt: string };
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCacheKey(projectId: string): string {
  return `sonar:${projectId}`;
}

export function getCachedSonarResult(
  projectId: string
): (SonarQualityGateResult & { fetchedAt: string }) | null {
  const config = getSonarConfig();
  if (config.cacheTtlMinutes <= 0) return null;

  const key = getCacheKey(projectId);
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    if (entry) cache.delete(key);
    return null;
  }

  return entry.result;
}

export function setCachedSonarResult(
  projectId: string,
  result: SonarQualityGateResult
): void {
  const config = getSonarConfig();
  if (config.cacheTtlMinutes <= 0) return;

  const key = getCacheKey(projectId);
  const fetchedAt = new Date().toISOString();
  const expiresAt = Date.now() + config.cacheTtlMinutes * 60 * 1000;

  cache.set(key, {
    result: { ...result, fetchedAt },
    expiresAt
  });
}
