import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";
import { AppError, InternalServerError } from "@/utils/errors/domain-errors";

export class GetSonarIntegrationUseCase {
  constructor(private readonly sonarRepository: ISonarRepository) {}

  async execute(): Promise<IntegrationHealth> {
    try {
      return await this.sonarRepository.getSonarIntegrationHealth();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(
        "Error al obtener datos de SonarQube",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}
