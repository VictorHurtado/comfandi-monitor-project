import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

interface TechnicalHealthDashboardProjectRouteProps {
  readonly params: Promise<{ projectId: string }>;
}

const projectNameById: Record<string, string> = {
  afiliaciones: "Proyecto Afiliaciones"
};

function getProjectName(projectId: string): string {
  return projectNameById[projectId] ?? `Proyecto ${projectId}`;
}

export default async function TechnicalHealthDashboardProjectRoute({
  params
}: TechnicalHealthDashboardProjectRouteProps) {
  const { projectId } = await params;
  return <HealthStatusPage projectId={projectId} projectName={getProjectName(projectId)} />;
}
