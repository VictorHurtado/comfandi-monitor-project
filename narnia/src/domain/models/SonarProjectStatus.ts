export type SonarQualityGate = "passed" | "failed" | "unknown";

export interface SonarProjectStatus {
  qualityGate: SonarQualityGate;
  projectKey: string;
  projectSlug: string;
  message: string;
  checkedAt: string;
}
