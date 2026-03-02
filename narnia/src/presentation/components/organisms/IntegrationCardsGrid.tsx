import type { ComponentType } from "react";
import { GitBranch, ShieldCheck, Siren, Workflow } from "lucide-react";

interface IntegrationCard {
  readonly id: string;
  readonly title: string;
  readonly metricLabel: string;
  readonly metricValue: string;
  readonly detailLabel: string;
  readonly detailValue: string;
  readonly statusTag: string;
  readonly statusTone: "success" | "warning" | "danger";
  readonly icon: ComponentType<{ className?: string }>;
}

const integrationCards: readonly IntegrationCard[] = [
  {
    id: "sonar",
    title: "SonarQube",
    metricLabel: "Quality Gate",
    metricValue: "PASSED",
    detailLabel: "Bugs / Vulnerabilities",
    detailValue: "12 / 0",
    statusTag: "estable",
    statusTone: "success",
    icon: ShieldCheck
  },
  {
    id: "github",
    title: "GitHub",
    metricLabel: "PRs abiertas",
    metricValue: "7",
    detailLabel: "Commits (7 días)",
    detailValue: "142",
    statusTag: "activo",
    statusTone: "success",
    icon: GitBranch
  },
  {
    id: "sentry",
    title: "Sentry",
    metricLabel: "Error rate",
    metricValue: "0.82%",
    detailLabel: "Incidentes críticos",
    detailValue: "2",
    statusTag: "atención",
    statusTone: "danger",
    icon: Siren
  },
  {
    id: "proteo",
    title: "Proteo",
    metricLabel: "Cumplimiento",
    metricValue: "94%",
    detailLabel: "Meta objetivo",
    detailValue: "95%",
    statusTag: "en seguimiento",
    statusTone: "warning",
    icon: Workflow
  }
];

const toneStyles: Record<IntegrationCard["statusTone"], string> = {
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  danger: "bg-status-danger/10 text-status-danger"
};

const iconToneStyles: Record<IntegrationCard["statusTone"], string> = {
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  danger: "bg-status-danger/10 text-status-danger"
};

export function IntegrationCardsGrid() {
  return (
    <section aria-label="Integraciones técnicas" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {integrationCards.map((card) => {
        const Icon = card.icon;

        return (
          <article key={card.id} className="ui-card p-5">
            <header className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`inline-flex size-9 items-center justify-center rounded-input ${iconToneStyles[card.statusTone]}`}>
                  <Icon className="size-5" />
                </div>
                <h3 className="text-h3 text-brand-900">{card.title}</h3>
              </div>
              <span className={`rounded-full px-2 py-1 text-caption uppercase ${toneStyles[card.statusTone]}`}>
                {card.statusTag}
              </span>
            </header>

            <dl className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-body text-brand-muted">{card.metricLabel}</dt>
                <dd className="text-button text-brand-900">{card.metricValue}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-body text-brand-muted">{card.detailLabel}</dt>
                <dd className="text-button text-brand-800">{card.detailValue}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </section>
  );
}
