import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import {
  AppError,
  InternalServerError,
  ValidationError
} from "@/utils/errors/domain-errors";

export class GetSonarProjectStatusUseCase {
  constructor(private readonly sonarRepository: ISonarRepository) {}

  async execute(projectSlug: string): Promise<SonarProjectStatus> {
    try {
      const normalizedProjectSlug = this.validateProjectSlug(projectSlug);
      return await this.sonarRepository.getProjectStatus(normalizedProjectSlug);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError("Unable to get Sonar project status", error);
    }
  }

  private validateProjectSlug(projectSlug: string): string {
    const normalizedProjectSlug = projectSlug.trim().toLowerCase();

    if (!normalizedProjectSlug) {
      throw new ValidationError("Project slug is required");
    }

    return normalizedProjectSlug;
  }
}
