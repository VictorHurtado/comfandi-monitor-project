import type { SonarQualityGateResult } from "../models/SonarQualityGate";

export interface ISonarRepository {
  /**
   * Obtiene el estado del Quality Gate de un proyecto en SonarCloud.
   * Si Sonar no está configurado o falla, retorna status "unknown".
   */
  getQualityGate(sonarProjectKey: string): Promise<SonarQualityGateResult>;
}
