import { AlertCircle, BellDot, CircleCheckBig } from "lucide-react";

interface RecentAlert {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly ageLabel: string;
  readonly actionLabel: string;
  readonly tone: "danger" | "warning" | "info";
}

const recentAlerts: readonly RecentAlert[] = [
  {
    id: "sentry-500",
    title: "Sentry: error crítico en checkout",
    detail: "Se detectó incremento de errores 500 en /api/v1/checkout.",
    ageLabel: "Hace 15 minutos",
    actionLabel: "Resolver",
    tone: "danger"
  },
  {
    id: "github-pr",
    title: "GitHub: PR #452 requiere revisión",
    detail: "La PR de refactor auth quedó bloqueada por tests fallidos.",
    ageLabel: "Hace 2 horas",
    actionLabel: "Ver PR",
    tone: "warning"
  },
  {
    id: "sonar-complete",
    title: "SonarQube: análisis finalizado",
    detail: "Nueva rama feature/payment-v2 analizada satisfactoriamente.",
    ageLabel: "Hace 5 horas",
    actionLabel: "Detalles",
    tone: "info"
  }
];

const toneStyles: Record<RecentAlert["tone"], string> = {
  danger: "border-status-danger bg-status-danger/5",
  warning: "border-status-warning bg-status-warning/5",
  info: "border-brand-500 bg-brand-500/5"
};

const iconStyles: Record<RecentAlert["tone"], string> = {
  danger: "text-status-danger",
  warning: "text-status-warning",
  info: "text-brand-600"
};

function AlertIcon({ tone }: { readonly tone: RecentAlert["tone"] }) {
  if (tone === "danger") return <AlertCircle className={`mt-0.5 size-5 ${iconStyles[tone]}`} aria-hidden />;
  if (tone === "warning") return <BellDot className={`mt-0.5 size-5 ${iconStyles[tone]}`} aria-hidden />;
  return <CircleCheckBig className={`mt-0.5 size-5 ${iconStyles[tone]}`} aria-hidden />;
}

export function RecentAlertsPanel() {
  return (
    <section aria-label="Alertas recientes" className="space-y-4">
      <h3 className="text-h3 text-brand-900">Alertas recientes</h3>
      <div className="space-y-3">
        {recentAlerts.map((alert) => (
          <article key={alert.id} className={`rounded-input border-l-4 p-4 ${toneStyles[alert.tone]}`}>
            <div className="flex items-start gap-3">
              <AlertIcon tone={alert.tone} />
              <div className="flex-1">
                <h4 className="text-button text-brand-900">{alert.title}</h4>
                <p className="mt-1 text-body text-brand-muted">{alert.detail}</p>
                <p className="mt-2 text-caption uppercase tracking-wide text-brand-muted">{alert.ageLabel}</p>
              </div>
              <button className="text-button text-brand-600 hover:text-brand-700" type="button">
                {alert.actionLabel}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
