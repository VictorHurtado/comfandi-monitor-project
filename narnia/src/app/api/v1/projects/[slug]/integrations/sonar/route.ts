import { NextRequest, NextResponse } from "next/server";
import { GetSonarProjectStatusUseCase } from "@/domain/usecases/GetSonarProjectStatusUseCase";
import { SERVICE_TYPES, USECASE_TYPES, container } from "@/infrastructure/ioc";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import { parseBearerToken } from "@/infrastructure/services/auth-header";
import { AppError } from "@/utils/errors/domain-errors";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const getSonarProjectStatusUseCase = container.get<GetSonarProjectStatusUseCase>(
    USECASE_TYPES.GetSonarProjectStatusUseCase
  );
  const keycloakService = container.get<KeycloakService>(SERVICE_TYPES.KeycloakService);

  try {
    if (!keycloakService.isAuthDisabled()) {
      const accessToken = parseBearerToken(request.headers.get("authorization"));
      await keycloakService.validateAccessToken(accessToken);
    }

    const { slug } = await context.params;
    const sonarProjectStatus = await getSonarProjectStatusUseCase.execute(slug);

    return NextResponse.json(sonarProjectStatus, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
