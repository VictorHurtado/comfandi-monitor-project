import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

interface ComplianceRow {
  readonly metric: string;
  readonly value: string;
  readonly trend: "ok" | "warning" | "danger";
}

const complianceRows: readonly ComplianceRow[] = [
  { metric: "Cobertura de código", value: "82.4%", trend: "ok" },
  { metric: "Complejidad ciclomática", value: "14.2", trend: "warning" },
  { metric: "Deuda técnica", value: "4.2d", trend: "ok" },
  { metric: "Hotspots de seguridad", value: "3 detectados", trend: "danger" }
];

function TrendIcon({ trend }: { readonly trend: ComplianceRow["trend"] }) {
  if (trend === "ok") return <CheckCircle2 className="size-4 text-status-success" aria-label="Cumple" />;
  if (trend === "warning") return <TrendingUp className="size-4 text-status-warning" aria-label="Atención" />;
  return <AlertTriangle className="size-4 text-status-danger" aria-label="Riesgo" />;
}

function valueClassName(trend: ComplianceRow["trend"]) {
  if (trend === "danger") return "text-status-danger";
  return "text-brand-900";
}

export function ComplianceSummaryTable() {
  return (
    <section aria-label="Resumen de cumplimiento" className="space-y-4">
      <h3 className="text-h3 text-brand-900">Resumen de cumplimiento</h3>
      <div className="ui-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-50">
            <tr className="border-b border-brand-border">
              <th className="px-5 py-3 text-caption uppercase text-brand-muted">Métrica</th>
              <th className="px-5 py-3 text-caption uppercase text-brand-muted">Estado</th>
              <th className="px-5 py-3 text-caption uppercase text-brand-muted">Valor</th>
            </tr>
          </thead>
          <tbody>
            {complianceRows.map((row) => (
              <tr key={row.metric} className="border-b border-brand-100 last:border-b-0">
                <td className="px-5 py-3 text-body text-brand-900">{row.metric}</td>
                <td className="px-5 py-3">
                  <TrendIcon trend={row.trend} />
                </td>
                <td className={`px-5 py-3 text-button ${valueClassName(row.trend)}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-1 text-button text-brand-600 hover:text-brand-700" type="button">
          Ver reporte detallado
        </button>
      </div>
    </section>
  );
}
