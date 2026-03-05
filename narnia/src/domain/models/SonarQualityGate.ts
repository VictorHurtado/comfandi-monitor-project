/**
 * Estado del semáforo del Quality Gate de SonarQube.
 * - passed: Quality Gate OK (verde)
 * - failed: Quality Gate ERROR (rojo)
 * - unknown: Sin análisis, fallo de conexión o no configurado (amarillo/neutro)
 */
export type SonarQualityGateStatus = "passed" | "failed" | "unknown";

export interface SonarQualityGateResult {
  /** Estado del Quality Gate para el semáforo */
  status: SonarQualityGateStatus;
  /** Clave del proyecto en SonarCloud (ej. ComfandiTD_sucursal-afiliaciones) */
  sonarProjectKey: string;
  /** Nombre legible del proyecto para la UI */
  projectName: string;
  /** Mensaje amigable cuando hay degradación (ej. "Sonar no disponible") */
  message?: string;
}
