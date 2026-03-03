import { container } from "@/infrastructure/ioc/container";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { GetJiraMetricsByProjectUseCase } from "@/domain/usecases/GetJiraMetricsByProjectUseCase";
import { REPOSITORY_TYPES } from "@/infrastructure/ioc/repositories/repositories.types";
import { SERVICE_TYPES } from "@/infrastructure/ioc/services/services.types";

describe("IoC container", () => {
  it("resolves configured use case", () => {
    const useCase = container.get<GetPlatformHealthStatusUseCase>(
      USECASE_TYPES.GetPlatformHealthStatusUseCase
    );
    const jiraUseCase = container.get<GetJiraMetricsByProjectUseCase>(
      USECASE_TYPES.GetJiraMetricsByProjectUseCase
    );

    expect(useCase).toBeInstanceOf(GetPlatformHealthStatusUseCase);
    expect(jiraUseCase).toBeInstanceOf(GetJiraMetricsByProjectUseCase);
  });

  it("exports symbols for service and repository contracts", () => {
    expect(String(REPOSITORY_TYPES.IStatusRepository)).toContain("IStatusRepository");
    expect(String(REPOSITORY_TYPES.IJiraMetricsRepository)).toContain("IJiraMetricsRepository");
    expect(String(SERVICE_TYPES.ExternalApiService)).toContain("ExternalApiService");
    expect(String(SERVICE_TYPES.JiraMetricsService)).toContain("JiraMetricsService");
    expect(String(SERVICE_TYPES.JiraExternalApiService)).toContain("JiraExternalApiService");
  });
});
