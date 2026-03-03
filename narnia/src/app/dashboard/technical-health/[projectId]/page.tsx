import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";
import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";
import { GetSonarProjectStatusUseCase } from "@/domain/usecases/GetSonarProjectStatusUseCase";
import { USECASE_TYPES, container } from "@/infrastructure/ioc";

interface TechnicalHealthDashboardProjectRouteProps {
  readonly params: Promise<{ projectId: string }>;
}

const projectNameById: Record<string, string> = {
  afiliaciones: "Proyecto Afiliaciones"
};

function getProjectName(projectId: string): string {
  return projectNameById[projectId] ?? `Proyecto ${projectId}`;
}

function createUnavailableSonarStatus(projectId: string): SonarProjectStatus {
  return {
    qualityGate: "unknown",
    projectKey: "",
    projectSlug: projectId,
    message: "Sonar no disponible para este proyecto",
    checkedAt: new Date().toISOString()
  };
}

export default async function TechnicalHealthDashboardProjectRoute({
  params
}: TechnicalHealthDashboardProjectRouteProps) {
  const { projectId } = await params;
  let sonarStatus = createUnavailableSonarStatus(projectId);

  try {
    const getSonarProjectStatusUseCase = container.get<GetSonarProjectStatusUseCase>(
      USECASE_TYPES.GetSonarProjectStatusUseCase
    );
    sonarStatus = await getSonarProjectStatusUseCase.execute(projectId);
  } catch {
    sonarStatus = createUnavailableSonarStatus(projectId);
  }

  return (
    <HealthStatusPage
      projectId={projectId}
      projectName={getProjectName(projectId)}
      sonarStatus={sonarStatus}
    />
  );
}
