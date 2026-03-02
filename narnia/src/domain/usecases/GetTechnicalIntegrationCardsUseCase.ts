import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";
import type { ITechnicalIntegrationRepository } from "@/domain/repositories/ITechnicalIntegrationRepository";
import { AppError, InternalServerError } from "@/utils/errors/domain-errors";

export class GetTechnicalIntegrationCardsUseCase {
  constructor(
    private readonly technicalIntegrationRepository: ITechnicalIntegrationRepository
  ) {}

  async execute(): Promise<TechnicalIntegrationCard[]> {
    try {
      return await this.technicalIntegrationRepository.getTechnicalIntegrationCards();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError("Unable to get technical integration cards", error);
    }
  }
}
