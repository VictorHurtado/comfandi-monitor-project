import { ContainerModule } from "inversify";
import type { AxiosInstance } from "axios";
import { axiosInstance } from "@/infrastructure/network/axiosInstance";
import { ExternalApiService } from "@/infrastructure/services/ExternalApiService";
import { JiraExternalApiService } from "@/infrastructure/services/JiraExternalApiService";
import { JiraMetricsService } from "@/infrastructure/services/JiraMetricsService";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";

export const servicesModule = new ContainerModule(({ bind }) => {
  bind<AxiosInstance>(SERVICE_TYPES.AxiosInstance).toConstantValue(axiosInstance);

  bind<ExternalApiService>(SERVICE_TYPES.ExternalApiService)
    .toDynamicValue((context) =>
      new ExternalApiService(context.get<AxiosInstance>(SERVICE_TYPES.AxiosInstance))
    )
    .inSingletonScope();

  bind<JiraMetricsService>(SERVICE_TYPES.JiraMetricsService)
    .toDynamicValue((context) => new JiraMetricsService(context.get<AxiosInstance>(SERVICE_TYPES.AxiosInstance)))
    .inSingletonScope();

  bind<JiraExternalApiService>(SERVICE_TYPES.JiraExternalApiService)
    .toDynamicValue(() => new JiraExternalApiService())
    .inSingletonScope();

  bind<KeycloakService>(SERVICE_TYPES.KeycloakService)
    .toDynamicValue(() => new KeycloakService())
    .inSingletonScope();
});
