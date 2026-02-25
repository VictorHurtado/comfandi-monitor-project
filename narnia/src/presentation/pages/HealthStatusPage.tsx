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
        <section className="ui-card w-full max-w-3xl p-6 text-brand-900">
          <h1 className="mb-2 text-h2 text-brand-800">Narnia technical status</h1>
          <p className="text-body text-brand-700">{message}</p>
        </section>
      </main>
    );
  }
}
