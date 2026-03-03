import { container } from "@/infrastructure/ioc/container";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetSonarProjectStatusUseCase } from "@/domain/usecases/GetSonarProjectStatusUseCase";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";

describe("IoC container", () => {
  it("resolves configured use case", () => {
    const useCase = container.get<GetPlatformHealthStatusUseCase>(
      USECASE_TYPES.GetPlatformHealthStatusUseCase
    );

    expect(useCase).toBeInstanceOf(GetPlatformHealthStatusUseCase);
  });

  it("exports symbols for service and repository contracts", () => {
    expect(String(REPOSITORY_TYPES.IStatusRepository)).toContain("IStatusRepository");
    expect(String(REPOSITORY_TYPES.ISonarRepository)).toContain("ISonarRepository");
    expect(String(SERVICE_TYPES.ExternalApiService)).toContain("ExternalApiService");
    expect(String(SERVICE_TYPES.SonarApiService)).toContain("SonarApiService");
  });

  it("resolves sonar use case", () => {
    const useCase = container.get<GetSonarProjectStatusUseCase>(
      USECASE_TYPES.GetSonarProjectStatusUseCase
    );

    expect(useCase).toBeInstanceOf(GetSonarProjectStatusUseCase);
  });
});
