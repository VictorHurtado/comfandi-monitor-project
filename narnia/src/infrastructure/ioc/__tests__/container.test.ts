import { container } from "@/infrastructure/ioc/container";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarQualityGateUseCase } from "@/domain/usecases/sonar/GetSonarQualityGateUseCase";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";

describe("IoC container", () => {
  it("resolves GetPlatformHealthStatusUseCase", () => {
    const useCase = container.get<GetPlatformHealthStatusUseCase>(
      USECASE_TYPES.GetPlatformHealthStatusUseCase
    );

    expect(useCase).toBeInstanceOf(GetPlatformHealthStatusUseCase);
  });

  it("resolves GetSonarQualityGateUseCase", () => {
    const useCase = container.get<GetSonarQualityGateUseCase>(
      USECASE_TYPES.GetSonarQualityGateUseCase
    );

    expect(useCase).toBeInstanceOf(GetSonarQualityGateUseCase);
  });

  it("exports symbols for service and repository contracts", () => {
    expect(String(REPOSITORY_TYPES.IStatusRepository)).toContain("IStatusRepository");
    expect(String(SERVICE_TYPES.ExternalApiService)).toContain("ExternalApiService");
  });
});
