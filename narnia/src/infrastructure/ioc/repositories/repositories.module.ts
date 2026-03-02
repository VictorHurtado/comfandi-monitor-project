import { ContainerModule } from "inversify";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { StatusRepository } from "@/infrastructure/repositories/StatusRepository";
import { SonarRepository } from "@/infrastructure/repositories/SonarRepository";
import { ExternalApiService } from "@/infrastructure/services/ExternalApiService";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";

export const repositoriesModule = new ContainerModule(({ bind }) => {
  bind<IStatusRepository>(REPOSITORY_TYPES.IStatusRepository)
    .toDynamicValue(
      (context) =>
        new StatusRepository(
          context.get<ExternalApiService>(SERVICE_TYPES.ExternalApiService),
          context.get<KeycloakService>(SERVICE_TYPES.KeycloakService)
        )
    )
    .inSingletonScope();

  bind<ISonarRepository>(REPOSITORY_TYPES.ISonarRepository)
    .toDynamicValue(() => new SonarRepository())
    .inSingletonScope();
});
