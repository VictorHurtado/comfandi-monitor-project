import type { AxiosInstance } from "axios";
import type {
  IntegrationHealth,
  IntegrationProvider
} from "@/domain/models/PlatformHealthStatus";
import { InternalServerError } from "@/utils/errors/domain-errors";

export class ExternalApiService {
  constructor(private readonly http: AxiosInstance) {}

  async getIntegrationHealth(provider: IntegrationProvider): Promise<IntegrationHealth> {
    const baseUrl = this.http.defaults?.baseURL ?? "";
    if (this.isSelfReferencingBff(baseUrl)) {
      return {
        provider,
        status: "unknown",
        message: "External integration endpoint is not configured",
        checkedAt: new Date().toISOString()
      };
    }

    try {
      const response = await this.http.get<IntegrationHealth>(`/integrations/${provider}`);
      return response.data;
    } catch (error) {
      throw new InternalServerError(`Error loading integration: ${provider}`, error);
    }
  }

  private isSelfReferencingBff(baseUrl: string): boolean {
    return (
      (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) &&
      baseUrl.includes("/api/v1")
    );
  }
}
