import type { SonarQubeHealthData } from "@/domain/models/SonarQubeMetrics";
import type { ISonarQubeRepository } from "@/domain/repositories/ISonarQubeRepository";
import { AppError, InternalServerError } from "@/utils/errors/domain-errors";

export class GetSonarQubeMetricsUseCase {
  constructor(private readonly sonarQubeRepository: ISonarQubeRepository) {}

  async execute(): Promise<SonarQubeHealthData> {
    try {
      return await this.sonarQubeRepository.getSonarQubeHealth();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError(
        "Unable to get SonarQube metrics",
        error
      );
    }
  }
}
