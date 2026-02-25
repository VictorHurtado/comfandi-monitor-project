import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import { USECASE_TYPES, container } from "@/infrastructure/ioc";
import { HealthStatusCard } from "@/presentation/components/organisms/HealthStatusCard";
import { AppError } from "@/utils/errors/domain-errors";

export async function HealthStatusPage() {
  const getPlatformHealthStatusUseCase = container.get<GetPlatformHealthStatusUseCase>(
    USECASE_TYPES.GetPlatformHealthStatusUseCase
  );

  try {
    const healthStatus = await getPlatformHealthStatusUseCase.execute();

    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <HealthStatusCard healthStatus={healthStatus} />
      </main>
    );
  } catch (error) {
    const message =
      error instanceof AppError ? error.message : "Unexpected error loading project status";

    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-3xl rounded-xl border border-brand-200 bg-white p-6 text-brand-900">
          <h1 className="mb-2 text-2xl font-semibold">Narnia technical status</h1>
          <p className="text-sm text-brand-700">{message}</p>
        </section>
      </main>
    );
  }
}
