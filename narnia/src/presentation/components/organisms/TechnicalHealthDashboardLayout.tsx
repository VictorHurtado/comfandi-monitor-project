import { BarChart3, Bell, CalendarDays, ChevronRight, LayoutDashboard, Search, Settings } from "lucide-react";
import { ComplianceSummaryTable } from "@/presentation/components/organisms/ComplianceSummaryTable";
import { IntegrationCardsGrid } from "@/presentation/components/organisms/IntegrationCardsGrid";
import { RecentAlertsPanel } from "@/presentation/components/organisms/RecentAlertsPanel";

const historyBars = ["70%", "74%", "68%", "82%", "85%", "91%", "88%"] as const;

export function TechnicalHealthDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-brand-canvas">
      <aside className="hidden w-64 shrink-0 border-r border-brand-border bg-brand-surface lg:flex">
        <div className="flex h-full w-full flex-col gap-8 p-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-input bg-brand-500 text-brand-surface">
              <LayoutDashboard className="size-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-h3 text-brand-900">Salud Técnica</h1>
              <p className="text-caption text-brand-muted">Plataforma Interna</p>
            </div>
          </div>

          <nav aria-label="Navegación principal" className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-input bg-brand-100 px-3 py-2 text-button text-brand-700" type="button">
              <LayoutDashboard className="size-4" aria-hidden />
              Dashboard
            </button>
            <button className="flex w-full items-center gap-3 rounded-input px-3 py-2 text-button text-brand-muted hover:bg-brand-50 hover:text-brand-800" type="button">
              <BarChart3 className="size-4" aria-hidden />
              Proyectos
            </button>
            <button className="flex w-full items-center gap-3 rounded-input px-3 py-2 text-button text-brand-muted hover:bg-brand-50 hover:text-brand-800" type="button">
              <Bell className="size-4" aria-hidden />
              Alertas
            </button>
            <button className="flex w-full items-center gap-3 rounded-input px-3 py-2 text-button text-brand-muted hover:bg-brand-50 hover:text-brand-800" type="button">
              <Settings className="size-4" aria-hidden />
              Configuración
            </button>
          </nav>

          <article className="mt-auto rounded-card border border-brand-border bg-brand-50 p-4">
            <p className="text-button text-brand-900">Juan Pérez</p>
            <p className="text-caption text-brand-muted">Tech Lead</p>
          </article>
        </div>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-surface/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="hidden items-center gap-2 text-caption text-brand-muted sm:flex">
              <span>Proyectos</span>
              <ChevronRight className="size-4" aria-hidden />
              <span className="text-brand-900">Proyecto Alfa</span>
            </div>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-input border border-brand-border bg-brand-canvas px-3 py-2">
              <Search className="size-4 text-brand-muted" aria-hidden />
              <input
                aria-label="Buscar métrica"
                className="w-full bg-transparent text-body text-brand-900 placeholder:text-brand-muted focus:outline-none"
                placeholder="Buscar métrica..."
                type="text"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
          <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <h2 className="mb-2 text-h1 text-brand-900">Estado General: Proyecto Alfa</h2>
              <p className="text-body text-brand-muted">
                Métricas de calidad, estabilidad y seguridad sincronizadas en una sola vista.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-card border border-brand-border bg-brand-50 p-1">
              <button className="rounded-button px-4 py-2 text-button text-brand-muted hover:bg-brand-surface" type="button">
                24h
              </button>
              <button className="rounded-button bg-brand-surface px-4 py-2 text-button text-brand-800 shadow-card" type="button">
                7 días
              </button>
              <button className="rounded-button px-4 py-2 text-button text-brand-muted hover:bg-brand-surface" type="button">
                30 días
              </button>
              <button className="inline-flex items-center gap-1 rounded-button px-4 py-2 text-button text-brand-muted hover:bg-brand-surface" type="button">
                Personalizado
                <CalendarDays className="size-4" aria-hidden />
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="ui-card p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-h3 text-brand-900">Historial de Salud General</h3>
                <p className="text-caption uppercase tracking-wider text-brand-muted">Health Index</p>
              </div>
              <div className="flex h-52 items-end gap-2">
                {historyBars.map((height, index) => (
                  <div
                    key={`history-${height}-${index}`}
                    className="flex-1 rounded-t-input bg-brand-200 last:bg-brand-500"
                    style={{ height }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-caption text-brand-muted">
                <span>Hace 7 días</span>
                <span>Hoy</span>
              </div>
            </article>

            <article className="ui-card flex flex-col items-center justify-center p-6 text-center">
              <p className="text-button text-brand-muted">Technical Health Score</p>
              <div className="mt-4 inline-flex size-32 items-center justify-center rounded-full border-[10px] border-brand-100 border-t-brand-500 text-h1 text-brand-900">
                88
              </div>
              <p className="mt-4 text-button text-status-success">+2.4% vs semana pasada</p>
            </article>
          </section>

          <IntegrationCardsGrid />

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RecentAlertsPanel />
            <ComplianceSummaryTable />
          </section>
        </div>
      </main>
    </div>
  );
}
