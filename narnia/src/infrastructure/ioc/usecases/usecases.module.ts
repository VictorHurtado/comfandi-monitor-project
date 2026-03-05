import { ContainerModule } from "inversify";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarQualityGateUseCase } from "@/domain/usecases/sonar/GetSonarQualityGateUseCase";
import type { IProjectKeyResolver } from "@/domain/repositories/IProjectKeyResolver";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
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

  bind<GetSonarQualityGateUseCase>(USECASE_TYPES.GetSonarQualityGateUseCase).toDynamicValue(
    (context) =>
      new GetSonarQualityGateUseCase(
        context.get<ISonarRepository>(REPOSITORY_TYPES.ISonarRepository),
        context.get<IProjectKeyResolver>(REPOSITORY_TYPES.IProjectKeyResolver)
      )
  );
});
