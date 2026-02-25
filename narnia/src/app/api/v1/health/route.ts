import { NextResponse } from "next/server";
import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { USECASE_TYPES, container } from "@/infrastructure/ioc";
import { AppError } from "@/utils/errors/domain-errors";

export async function GET() {
  const getPlatformHealthStatusUseCase = container.get<GetPlatformHealthStatusUseCase>(
    USECASE_TYPES.GetPlatformHealthStatusUseCase
  );

  try {
    const healthStatus = await getPlatformHealthStatusUseCase.execute();
    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
