import { container } from "@/infrastructure/ioc/container";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarIntegrationUseCase } from "@/domain/usecases/GetSonarIntegrationUseCase";
import { GetSonarQubeMetricsUseCase } from "@/domain/usecases/GetSonarQubeMetricsUseCase";
import { GetTechnicalIntegrationCardsUseCase } from "@/domain/usecases/GetTechnicalIntegrationCardsUseCase";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";

describe("IoC container", () => {
  it("resolves configured use case", () => {
    const useCase = container.get<GetPlatformHealthStatusUseCase>(
      USECASE_TYPES.GetPlatformHealthStatusUseCase
    );

    expect(useCase).toBeInstanceOf(GetPlatformHealthStatusUseCase);
  });

  it("resolves GetSonarQubeMetricsUseCase", () => {
    const useCase = container.get<GetSonarQubeMetricsUseCase>(
      USECASE_TYPES.GetSonarQubeMetricsUseCase
    );

    expect(useCase).toBeInstanceOf(GetSonarQubeMetricsUseCase);
  });

  it("resolves GetSonarIntegrationUseCase", () => {
    const useCase = container.get<GetSonarIntegrationUseCase>(
      USECASE_TYPES.GetSonarIntegrationUseCase
    );

    expect(useCase).toBeInstanceOf(GetSonarIntegrationUseCase);
  });

  it("resolves technical integration cards use case", () => {
    const useCase = container.get<GetTechnicalIntegrationCardsUseCase>(
      USECASE_TYPES.GetTechnicalIntegrationCardsUseCase
    );

    expect(useCase).toBeInstanceOf(GetTechnicalIntegrationCardsUseCase);
  });

  it("exports symbols for service and repository contracts", () => {
    expect(String(REPOSITORY_TYPES.IStatusRepository)).toContain("IStatusRepository");
    expect(String(REPOSITORY_TYPES.ISonarRepository)).toContain("ISonarRepository");
    expect(String(REPOSITORY_TYPES.ISonarQubeRepository)).toContain("ISonarQubeRepository");
    expect(String(REPOSITORY_TYPES.ITechnicalIntegrationRepository)).toContain(
      "ITechnicalIntegrationRepository"
    );
    expect(String(SERVICE_TYPES.ExternalApiService)).toContain("ExternalApiService");
  });
});
