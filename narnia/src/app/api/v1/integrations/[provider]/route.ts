import { NextRequest, NextResponse } from "next/server";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { SERVICE_TYPES, USECASE_TYPES, container } from "@/infrastructure/ioc";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import { parseBearerToken } from "@/infrastructure/services/auth-header";
import { AppError } from "@/utils/errors/domain-errors";

interface RouteContext {
  params: Promise<{ provider: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { provider } = await context.params;

  const getPlatformHealthStatusUseCase = container.get<GetPlatformHealthStatusUseCase>(
    USECASE_TYPES.GetPlatformHealthStatusUseCase
  );
  const keycloakService = container.get<KeycloakService>(SERVICE_TYPES.KeycloakService);

  try {
    const accessToken = parseBearerToken(request.headers.get("authorization"));
    await keycloakService.validateAccessToken(accessToken);

    const validatedProvider = getPlatformHealthStatusUseCase.validateProvider(provider);
    const response = await getPlatformHealthStatusUseCase.execute(validatedProvider);

    return NextResponse.json(response.integrations[0], { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
