import { ContainerModule } from "inversify";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarQubeMetricsUseCase } from "@/domain/usecases/GetSonarQubeMetricsUseCase";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import type { ISonarQubeRepository } from "@/domain/repositories/ISonarQubeRepository";
import { GetTechnicalIntegrationCardsUseCase } from "@/domain/usecases/GetTechnicalIntegrationCardsUseCase";
import type { ITechnicalIntegrationRepository } from "@/domain/repositories/ITechnicalIntegrationRepository";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

export const usecasesModule = new ContainerModule(({ bind }) => {
  bind<GetPlatformHealthStatusUseCase>(USECASE_TYPES.GetPlatformHealthStatusUseCase).toDynamicValue(
    (context) =>
      new GetPlatformHealthStatusUseCase(
        context.get<IStatusRepository>(REPOSITORY_TYPES.IStatusRepository)
      )
  );

  bind<GetSonarQubeMetricsUseCase>(USECASE_TYPES.GetSonarQubeMetricsUseCase).toDynamicValue(
    (context) =>
      new GetSonarQubeMetricsUseCase(
        context.get<ISonarQubeRepository>(REPOSITORY_TYPES.ISonarQubeRepository)
      )
  );

  bind<GetTechnicalIntegrationCardsUseCase>(
    USECASE_TYPES.GetTechnicalIntegrationCardsUseCase
  ).toDynamicValue(
    (context) =>
      new GetTechnicalIntegrationCardsUseCase(
        context.get<ITechnicalIntegrationRepository>(
          REPOSITORY_TYPES.ITechnicalIntegrationRepository
        )
      )
  );
});
