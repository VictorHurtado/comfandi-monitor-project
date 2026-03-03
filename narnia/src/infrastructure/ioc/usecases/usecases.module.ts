import { ContainerModule } from "inversify";
import type { IJiraMetricsRepository } from "@/domain/repositories/IJiraMetricsRepository";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetJiraMetricsByProjectUseCase } from "@/domain/usecases/GetJiraMetricsByProjectUseCase";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

export const usecasesModule = new ContainerModule(({ bind }) => {
  bind<GetPlatformHealthStatusUseCase>(USECASE_TYPES.GetPlatformHealthStatusUseCase).toDynamicValue(
    (context) =>
      new GetPlatformHealthStatusUseCase(
        context.get<IStatusRepository>(REPOSITORY_TYPES.IStatusRepository)
      )
  );

  bind<GetJiraMetricsByProjectUseCase>(USECASE_TYPES.GetJiraMetricsByProjectUseCase).toDynamicValue(
    (context) =>
      new GetJiraMetricsByProjectUseCase(
        context.get<IJiraMetricsRepository>(REPOSITORY_TYPES.IJiraMetricsRepository)
      )
  );
});
