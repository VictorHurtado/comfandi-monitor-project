import { NextRequest, NextResponse } from "next/server";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { USECASE_TYPES, container } from "@/infrastructure/ioc";
import { AppError } from "@/utils/errors/domain-errors";

interface RouteContext {
  params: Promise<{ provider: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { provider } = await context.params;

  const getPlatformHealthStatusUseCase = container.get<GetPlatformHealthStatusUseCase>(
    USECASE_TYPES.GetPlatformHealthStatusUseCase
  );

  try {
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
