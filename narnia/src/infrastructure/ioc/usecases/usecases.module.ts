import { ContainerModule } from "inversify";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarProjectStatusUseCase } from "@/domain/usecases/GetSonarProjectStatusUseCase";
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

  bind<GetSonarProjectStatusUseCase>(USECASE_TYPES.GetSonarProjectStatusUseCase).toDynamicValue(
    (context) =>
      new GetSonarProjectStatusUseCase(
        context.get<ISonarRepository>(REPOSITORY_TYPES.ISonarRepository)
      )
  );
});
