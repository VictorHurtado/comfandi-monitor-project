import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";

interface HealthStatusPageProps {
  readonly projectId: string;
  readonly projectName: string;
}

export async function HealthStatusPage({ projectId, projectName }: HealthStatusPageProps) {
  return <TechnicalHealthDashboardLayout projectId={projectId} projectName={projectName} />;
}
