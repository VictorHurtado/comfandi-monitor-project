import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";
import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";

interface HealthStatusPageProps {
  readonly projectId: string;
  readonly projectName: string;
  readonly sonarStatus: SonarProjectStatus;
}

export async function HealthStatusPage({
  projectId,
  projectName,
  sonarStatus
}: HealthStatusPageProps) {
  return (
    <TechnicalHealthDashboardLayout
      projectId={projectId}
      projectName={projectName}
      sonarStatus={sonarStatus}
    />
  );
}
