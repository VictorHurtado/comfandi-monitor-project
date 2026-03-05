/**
 * Resuelve la clave de proyecto de SonarCloud a partir del ID interno del proyecto.
 * La implementación lee el mapeo desde variables de entorno (SONAR_PROJECT_KEY_MAP).
 */
export interface IProjectKeyResolver {
  getSonarProjectKey(projectId: string): string | null;
}
