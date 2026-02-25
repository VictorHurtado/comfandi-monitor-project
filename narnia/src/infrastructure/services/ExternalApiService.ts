import type { AxiosInstance } from "axios";
import type {
  IntegrationHealth,
  IntegrationProvider
} from "@/domain/models/PlatformHealthStatus";
import { InternalServerError } from "@/utils/errors/domain-errors";

export class ExternalApiService {
  constructor(private readonly http: AxiosInstance) {}

  async getIntegrationHealth(provider: IntegrationProvider): Promise<IntegrationHealth> {
    try {
      const response = await this.http.get<IntegrationHealth>(`/integrations/${provider}`);
      return response.data;
    } catch (error) {
      throw new InternalServerError(`Error loading integration: ${provider}`, error);
    }
  }
}
