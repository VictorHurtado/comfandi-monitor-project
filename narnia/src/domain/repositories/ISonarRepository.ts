import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";

export interface ISonarRepository {
  getProjectStatus(projectSlug: string): Promise<SonarProjectStatus>;
}
