import type {
  IntegrationProvider,
  PlatformHealthStatus
} from "@/domain/models/PlatformHealthStatus";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import {
  AppError,
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

export class GetPlatformHealthStatusUseCase {
  constructor(private readonly statusRepository: IStatusRepository) {}

  async execute(provider?: IntegrationProvider): Promise<PlatformHealthStatus> {
    try {
      if (provider) {
        return await this.statusRepository.getIntegrationStatus(provider);
      }

      return await this.statusRepository.getPlatformHealthStatus();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError("Unable to get platform health status", error);
    }
  }

  validateProvider(provider: string): IntegrationProvider {
    const providers: IntegrationProvider[] = ["sonar", "github", "sentry", "proteo"];

    if (!providers.includes(provider as IntegrationProvider)) {
      throw new ValidationError("Unsupported provider");
    }

    return provider as IntegrationProvider;
  }
}
