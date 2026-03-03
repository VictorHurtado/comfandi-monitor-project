import { BellRing } from "lucide-react";

export function RecentAlertsPanel() {
  return (
    <section aria-label="Alertas recientes" className="space-y-4">
      <h3 className="text-h3 text-slate-100">Alertas recientes</h3>
      <article className="rounded-card border border-dashed border-slate-700 bg-slate-900 p-6">
        <div className="flex items-start gap-3">
          <BellRing className="mt-0.5 size-5 text-slate-300" aria-hidden />
          <div className="space-y-2">
            <h4 className="text-button text-slate-100">Sin alertas integradas</h4>
            <p className="text-body text-slate-400">
              Este bloque queda vacío para que el equipo conecte reglas y eventos desde Jira/GitHub durante el taller.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
