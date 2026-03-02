import { ContainerModule } from "inversify";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarIntegrationStatusUseCase } from "@/domain/usecases/sonar/GetSonarIntegrationStatusUseCase";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

export const usecasesModule = new ContainerModule(({ bind }) => {
  bind<GetPlatformHealthStatusUseCase>(USECASE_TYPES.GetPlatformHealthStatusUseCase).toDynamicValue(
    (context) =>
      new GetPlatformHealthStatusUseCase(
        context.get<IStatusRepository>(REPOSITORY_TYPES.IStatusRepository)
      )
  );

  bind<GetSonarIntegrationStatusUseCase>(USECASE_TYPES.GetSonarIntegrationStatusUseCase).toDynamicValue(
    (context) =>
      new GetSonarIntegrationStatusUseCase(
        context.get<ISonarRepository>(REPOSITORY_TYPES.ISonarRepository)
      )
  );
});
