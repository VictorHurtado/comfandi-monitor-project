import { NextRequest, NextResponse } from "next/server";
import { GetSonarQualityGateUseCase } from "@/domain/usecases/sonar/GetSonarQualityGateUseCase";
import { SERVICE_TYPES, USECASE_TYPES, container } from "@/infrastructure/ioc";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import { parseBearerToken } from "@/infrastructure/services/auth-header";
import { AppError } from "@/utils/errors/domain-errors";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

const projectNameById: Record<string, string> = {
  afiliaciones: "Afiliaciones"
};

function getProjectName(projectId: string): string {
  return projectNameById[projectId] ?? projectId;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { projectId } = await context.params;

  const getSonarQualityGateUseCase = container.get<GetSonarQualityGateUseCase>(
    USECASE_TYPES.GetSonarQualityGateUseCase
  );
  const keycloakService = container.get<KeycloakService>(SERVICE_TYPES.KeycloakService);

  try {
    if (!keycloakService.isAuthDisabled()) {
      const accessToken = parseBearerToken(request.headers.get("authorization"));
      await keycloakService.validateAccessToken(accessToken);
    }

    const result = await getSonarQualityGateUseCase.execute({
      projectId,
      projectName: getProjectName(projectId)
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
