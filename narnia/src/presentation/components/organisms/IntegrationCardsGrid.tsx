import type { ComponentType } from "react";
import { GitBranch, ShieldCheck, Siren, Workflow } from "lucide-react";
import type { IntegrationHealth, IntegrationStatus } from "@/domain/models/PlatformHealthStatus";
import type { SonarMetrics, SonarQualityGateStatus } from "@/domain/models/SonarMetrics";

interface StaticCard {
  readonly id: string;
  readonly title: string;
  readonly workshopOwner: string;
  readonly icon: ComponentType<{ className?: string }>;
}

const staticCards: readonly StaticCard[] = [
  { id: "github", title: "GitHub", workshopOwner: "Equipo 2", icon: GitBranch },
  { id: "sentry", title: "Sentry", workshopOwner: "Equipo 3", icon: Siren },
  { id: "proteo", title: "Proteo", workshopOwner: "Equipo 4", icon: Workflow }
];

const statusStyles: Record<IntegrationStatus, { badge: string; label: string }> = {
  ok: { badge: "bg-status-success/10 text-status-success", label: "Saludable" },
  warning: { badge: "bg-status-warning/10 text-status-warning", label: "Atención" },
  error: { badge: "bg-status-danger/10 text-status-danger", label: "Crítico" },
  unknown: { badge: "bg-slate-800 text-slate-300", label: "Desconocido" }
};

const qualityGateStyles: Record<SonarQualityGateStatus, { badge: string; label: string }> = {
  OK: { badge: "bg-status-success/10 text-status-success", label: "PASSED" },
  WARN: { badge: "bg-status-warning/10 text-status-warning", label: "WARN" },
  ERROR: { badge: "bg-status-danger/10 text-status-danger", label: "FAILED" },
  NONE: { badge: "bg-slate-800 text-slate-300", label: "—" }
};

interface SonarCardProps {
  sonarIntegration: IntegrationHealth | null;
  isLoading: boolean;
  error: string | null;
}

function SonarCard({ sonarIntegration, isLoading, error }: SonarCardProps) {
  const statusStyle = sonarIntegration
    ? statusStyles[sonarIntegration.status]
    : statusStyles.unknown;

  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube</h3>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-caption uppercase ${statusStyle.badge}`}
        >
          {isLoading ? "Cargando" : statusStyle.label}
        </span>
      </header>

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 rounded-input bg-slate-800" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-input bg-slate-800" />
            <div className="h-12 rounded-input bg-slate-800" />
          </div>
        </div>
      )}

      {!isLoading && (error || !sonarIntegration?.sonarMetrics) && (
        <div className="space-y-3">
          <div className="rounded-input border border-dashed border-slate-700 bg-slate-950/40 p-3 text-center text-caption text-slate-500">
            {error ?? "Sin datos disponibles"}
          </div>
          <p className="text-caption text-slate-500">
            {sonarIntegration?.message ?? "No se pudieron obtener datos de SonarQube."}
          </p>
        </div>
      )}

      {!isLoading && !error && sonarIntegration?.sonarMetrics && (
        <SonarMetricsDisplay
          metrics={sonarIntegration.sonarMetrics}
          message={sonarIntegration.message}
        />
      )}
    </article>
  );
}

interface SonarMetricsDisplayProps {
  metrics: SonarMetrics;
  message: string;
}

function SonarMetricsDisplay({ metrics, message }: SonarMetricsDisplayProps) {
  const qgStyle = qualityGateStyles[metrics.qualityGateStatus];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-caption text-slate-400">Quality Gate</span>
        <span className={`rounded-full px-2 py-0.5 text-caption font-semibold ${qgStyle.badge}`}>
          {qgStyle.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-input border border-slate-700 bg-slate-950/40 p-2 text-center">
          <p className="text-caption text-slate-500">Cobertura</p>
          <p className="text-button text-slate-100">{metrics.coverage.toFixed(1)}%</p>
        </div>
        <div className="rounded-input border border-slate-700 bg-slate-950/40 p-2 text-center">
          <p className="text-caption text-slate-500">Bugs</p>
          <p className="text-button text-slate-100">{metrics.bugs}</p>
        </div>
        <div className="rounded-input border border-slate-700 bg-slate-950/40 p-2 text-center">
          <p className="text-caption text-slate-500">Vuln.</p>
          <p className="text-button text-slate-100">{metrics.vulnerabilities}</p>
        </div>
      </div>

      <p className="text-caption text-slate-500 line-clamp-2">{message}</p>
    </div>
  );
}

interface IntegrationCardsGridProps {
  sonarIntegration?: IntegrationHealth | null;
  sonarIsLoading?: boolean;
  sonarError?: string | null;
}

export function IntegrationCardsGrid({
  sonarIntegration = null,
  sonarIsLoading = false,
  sonarError = null
}: IntegrationCardsGridProps) {
  return (
    <section aria-label="Integraciones técnicas" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <SonarCard
        sonarIntegration={sonarIntegration}
        isLoading={sonarIsLoading}
        error={sonarError}
      />

      {staticCards.map((card) => {
        const Icon = card.icon;

        return (
          <article key={card.id} className="rounded-card border border-slate-800 bg-slate-900 p-5">
            <header className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-h3 text-slate-100">{card.title}</h3>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-caption uppercase text-slate-300">pendiente</span>
            </header>

            <div className="space-y-3">
              <p className="text-body text-slate-400">Módulo listo para conectar datos reales en el taller.</p>
              <div className="rounded-input border border-dashed border-slate-700 bg-slate-950/40 p-3">
                <p className="text-caption uppercase text-slate-500">Responsable</p>
                <p className="text-button text-slate-100">{card.workshopOwner}</p>
              </div>
              <div className="rounded-input border border-dashed border-slate-700 p-3 text-center text-caption text-slate-500">
                Sin métricas conectadas
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
