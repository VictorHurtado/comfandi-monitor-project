import type { SonarQualityGateResult } from "@/domain/models/SonarQualityGate";
import type { IProjectKeyResolver } from "@/domain/repositories/IProjectKeyResolver";
import type { ISonarRepository } from "@/domain/repositories/ISonarRepository";
import { AppError, InternalServerError, ValidationError } from "@/utils/errors/domain-errors";

export interface GetSonarQualityGateInput {
  projectId: string;
  projectName: string;
}

export class GetSonarQualityGateUseCase {
  constructor(
    private readonly sonarRepository: ISonarRepository,
    private readonly projectKeyResolver: IProjectKeyResolver
  ) {}

  async execute(input: GetSonarQualityGateInput): Promise<SonarQualityGateResult> {
    try {
      if (!input.projectId?.trim()) {
        throw new ValidationError("projectId is required");
      }

      const sonarProjectKey = this.projectKeyResolver.getSonarProjectKey(input.projectId);

      if (!sonarProjectKey) {
        return {
          status: "unknown",
          sonarProjectKey: "",
          projectName: input.projectName,
          message: "Proyecto sin mapeo en Sonar"
        };
      }

      const result = await this.sonarRepository.getQualityGate(sonarProjectKey);
      return { ...result, projectName: input.projectName };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError("Error al obtener Quality Gate de Sonar", error);
    }
  }
}
