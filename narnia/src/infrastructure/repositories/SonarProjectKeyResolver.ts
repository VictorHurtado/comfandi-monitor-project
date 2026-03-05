import type { IProjectKeyResolver } from "@/domain/repositories/IProjectKeyResolver";
import { getSonarConfig } from "@/infrastructure/config/sonar-config";

export class SonarProjectKeyResolver implements IProjectKeyResolver {
  getSonarProjectKey(projectId: string): string | null {
    const config = getSonarConfig();
    const key = config.projectKeyMap[projectId];
    return key && typeof key === "string" ? key : null;
  }
}
