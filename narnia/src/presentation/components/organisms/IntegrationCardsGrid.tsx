import type { ComponentType } from "react";
import { GitBranch, ShieldCheck, Siren, Workflow } from "lucide-react";
import type { IntegrationProvider } from "@/domain/models/PlatformHealthStatus";
import type {
  TechnicalIntegrationCard,
  TechnicalIntegrationStatus
} from "@/domain/models/TechnicalIntegrationCard";

interface IntegrationCardsGridProps {
  integrationCards: readonly TechnicalIntegrationCard[];
}

const providerIconByType: Record<
  IntegrationProvider,
  ComponentType<{ className?: string }>
> = {
  sonar: ShieldCheck,
  github: GitBranch,
  sentry: Siren,
  proteo: Workflow
};

const statusAppearance: Record<
  TechnicalIntegrationStatus,
  {
    badgeClassName: string;
    label: string;
  }
> = {
  healthy: {
    badgeClassName: "bg-emerald-500/20 text-emerald-300",
    label: "healthy"
  },
  warning: {
    badgeClassName: "bg-amber-500/20 text-amber-300",
    label: "warning"
  },
  critical: {
    badgeClassName: "bg-rose-500/20 text-rose-300",
    label: "critical"
  },
  unknown: {
    badgeClassName: "bg-slate-700 text-slate-300",
    label: "unknown"
  }
};

function formatCoverage(coverage: number): string {
  return `${coverage.toFixed(1)}%`;
}

export function IntegrationCardsGrid({ integrationCards }: IntegrationCardsGridProps) {
  return (
    <section aria-label="Integraciones técnicas" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {integrationCards.map((card) => {
        const Icon = providerIconByType[card.provider];
        const statusConfig = statusAppearance[card.status];
        const hasSonarMetrics = card.provider === "sonar" && Boolean(card.sonarMetrics);

        return (
          <article
            key={card.provider}
            className="rounded-card border border-slate-800 bg-slate-900 p-5"
            data-testid={card.provider === "sonar" ? "sonarqube-card" : undefined}
          >
            <header className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-h3 text-slate-100">{card.providerLabel}</h3>
                  <p className="text-caption text-slate-500">Proyecto: {card.projectName}</p>
                </div>
              </div>
              <span
                aria-label={`Estado ${card.providerLabel}: ${statusConfig.label}`}
                className={`rounded-full px-2 py-1 text-caption uppercase ${statusConfig.badgeClassName}`}
              >
                {statusConfig.label}
              </span>
            </header>

            <div className="space-y-3">
              {hasSonarMetrics ? (
                <>
                  <p className="text-body text-slate-400">{card.summary}</p>
                  <div className="flex items-center justify-between rounded-input border border-slate-700 bg-slate-950/40 p-3">
                    <span className="text-caption text-slate-500">Quality Gate</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-caption font-semibold text-emerald-300">
                      {card.sonarMetrics?.qualityGateStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-input border border-slate-700 bg-slate-950/40 p-2">
                      <p className="text-caption text-slate-500">Coverage</p>
                      <p className="text-button text-slate-100">
                        {formatCoverage(card.sonarMetrics?.coverage ?? 0)}
                      </p>
                    </div>
                    <div className="rounded-input border border-slate-700 bg-slate-950/40 p-2">
                      <p className="text-caption text-slate-500">Bugs</p>
                      <p className="text-button text-slate-100">{card.sonarMetrics?.bugs ?? 0}</p>
                    </div>
                    <div className="rounded-input border border-slate-700 bg-slate-950/40 p-2">
                      <p className="text-caption text-slate-500">Vulnerabilities</p>
                      <p className="text-button text-slate-100">
                        {card.sonarMetrics?.vulnerabilities ?? 0}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-input border border-dashed border-slate-700 p-3 text-center text-caption text-slate-400">
                  {card.summary}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
