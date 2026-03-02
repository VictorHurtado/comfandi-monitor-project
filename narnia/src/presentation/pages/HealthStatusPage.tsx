import { GetTechnicalIntegrationCardsUseCase } from "@/domain/usecases/GetTechnicalIntegrationCardsUseCase";
import { USECASE_TYPES, container } from "@/infrastructure/ioc";
import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";

export async function HealthStatusPage() {
  const getTechnicalIntegrationCardsUseCase = container.get<GetTechnicalIntegrationCardsUseCase>(
    USECASE_TYPES.GetTechnicalIntegrationCardsUseCase
  );
  const integrationCards = await getTechnicalIntegrationCardsUseCase.execute();

  return <TechnicalHealthDashboardLayout integrationCards={integrationCards} />;
}
