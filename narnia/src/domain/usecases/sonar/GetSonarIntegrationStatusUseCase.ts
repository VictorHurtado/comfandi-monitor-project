import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import type { SonarIntegrationStatus } from "@/domain/models/SonarIntegrationStatus";
import { AppError } from "@/utils/errors/domain-errors";

export class GetSonarIntegrationStatusUseCase {
  constructor(private readonly sonarRepository: ISonarRepository) {}

  async execute(): Promise<SonarIntegrationStatus> {
    try {
      return await this.sonarRepository.getIntegrationStatus();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error al obtener estado de SonarQube",
        500,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}
