import type { SonarQubeHealthData } from "@/domain/models/SonarQubeMetrics";

export interface ISonarQubeRepository {
  getSonarQubeHealth(): Promise<SonarQubeHealthData>;
}
