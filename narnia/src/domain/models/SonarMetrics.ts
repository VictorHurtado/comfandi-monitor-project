export type SonarQualityGateStatus = "OK" | "WARN" | "ERROR" | "NONE";

export interface SonarMetrics {
  qualityGateStatus: SonarQualityGateStatus;
  coverage: number;
  bugs: number;
  vulnerabilities: number;
}
