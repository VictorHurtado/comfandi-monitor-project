import { ContainerModule } from "inversify";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import type { ISonarQubeRepository } from "@/domain/repositories/ISonarQubeRepository";
import type { ITechnicalIntegrationRepository } from "@/domain/repositories/ITechnicalIntegrationRepository";
import { StatusRepository } from "@/infrastructure/repositories/StatusRepository";
import { MockSonarQubeRepository } from "@/infrastructure/repositories/MockSonarQubeRepository";
import { TechnicalIntegrationRepository } from "@/infrastructure/repositories/TechnicalIntegrationRepository";
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

  bind<ISonarQubeRepository>(REPOSITORY_TYPES.ISonarQubeRepository)
    .toDynamicValue(() => new MockSonarQubeRepository())
    .inSingletonScope();

  bind<ITechnicalIntegrationRepository>(REPOSITORY_TYPES.ITechnicalIntegrationRepository)
    .toDynamicValue(() => new TechnicalIntegrationRepository())
    .inSingletonScope();
});
