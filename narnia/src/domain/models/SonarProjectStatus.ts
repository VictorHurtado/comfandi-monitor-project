export type SonarQualityGate = "passed" | "failed" | "unknown";

export interface SonarProjectStatus {
  qualityGate: SonarQualityGate;
  projectKey: string;
  projectSlug: string;
  coverage?: number;
  bugs?: number;
  vulnerabilities?: number;
  message: string;
  checkedAt: string;
}
