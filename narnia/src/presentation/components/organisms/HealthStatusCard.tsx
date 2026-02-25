import type { PlatformHealthStatus } from "@/domain/models/PlatformHealthStatus";

interface HealthStatusCardProps {
  healthStatus: PlatformHealthStatus;
}

export function HealthStatusCard({ healthStatus }: HealthStatusCardProps) {
  return (
    <section className="w-full max-w-3xl rounded-xl border border-brand-200 bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-800">Narnia technical status</h1>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium capitalize text-brand-800">
          {healthStatus.status}
        </span>
      </header>

      <p className="mb-4 text-sm text-brand-700">
        Last check: <strong>{new Date(healthStatus.checkedAt).toLocaleString()}</strong>
      </p>

      <ul className="grid gap-3">
        {healthStatus.integrations.map((integration) => (
          <li
            key={integration.provider}
            className="flex items-center justify-between rounded-lg border border-brand-100 bg-brand-50 px-4 py-3"
          >
            <div>
              <p className="font-medium capitalize text-brand-900">{integration.provider}</p>
              <p className="text-sm text-brand-700">{integration.message}</p>
            </div>
            <span className="text-sm font-semibold uppercase text-brand-800">{integration.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
