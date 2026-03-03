import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";
import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";

interface TechnicalHealthDashboardProjectRouteProps {
  readonly params: Promise<{ projectId: string }>;
}

const projectNameById: Record<string, string> = {
  afiliaciones: "Proyecto Afiliaciones"
};

function getProjectName(projectId: string): string {
  return projectNameById[projectId] ?? `Proyecto ${projectId}`;
}

function createLoadingSonarStatus(projectId: string): SonarProjectStatus {
  return {
    qualityGate: "unknown",
    projectKey: "",
    projectSlug: projectId,
    coverage: undefined,
    bugs: undefined,
    vulnerabilities: undefined,
    message: "Cargando datos de Sonar...",
    checkedAt: new Date().toISOString()
  };
}

export default async function TechnicalHealthDashboardProjectRoute({
  params
}: TechnicalHealthDashboardProjectRouteProps) {
  const { projectId } = await params;
  const sonarStatus = createLoadingSonarStatus(projectId);

  return (
    <HealthStatusPage
      projectId={projectId}
      projectName={getProjectName(projectId)}
      sonarStatus={sonarStatus}
    />
  );
}
