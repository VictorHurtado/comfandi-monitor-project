"use client";

import { CalendarDays } from "lucide-react";
import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";
import { ComplianceSummaryTable } from "@/presentation/components/organisms/ComplianceSummaryTable";
import { IntegrationCardsGrid } from "@/presentation/components/organisms/IntegrationCardsGrid";
import { RecentAlertsPanel } from "@/presentation/components/organisms/RecentAlertsPanel";
import { AppSidebarLayout } from "@/presentation/components/templates/AppSidebarLayout";

interface TechnicalHealthDashboardLayoutProps {
  integrationCards: readonly TechnicalIntegrationCard[];
}

export function TechnicalHealthDashboardLayout({
  integrationCards
}: TechnicalHealthDashboardLayoutProps) {
  return (
    <AppSidebarLayout
      activeSection="dashboard"
      breadcrumbCurrent="Proyecto Alfa"
      breadcrumbSection="Proyectos"
      topSearchLabel="Buscar métrica"
      topSearchPlaceholder="Buscar métrica..."
      pageActions={
        <div className="inline-flex items-center gap-1 rounded-card border border-slate-800 bg-slate-900 p-1">
          <button className="rounded-button px-4 py-2 text-button text-slate-400 hover:bg-slate-800 hover:text-slate-100" type="button">
            24h
          </button>
          <button className="rounded-button bg-slate-800 px-4 py-2 text-button text-slate-100 shadow-card" type="button">
            7 días
          </button>
          <button className="rounded-button px-4 py-2 text-button text-slate-400 hover:bg-slate-800 hover:text-slate-100" type="button">
            30 días
          </button>
          <button className="inline-flex items-center gap-1 rounded-button px-4 py-2 text-button text-slate-400 hover:bg-slate-800 hover:text-slate-100" type="button">
            Personalizado
            <CalendarDays className="size-4" aria-hidden />
          </button>
        </div>
      }
      pageDescription="Estructura base preparada para integrar datos reales por equipos durante el taller."
      pageTitle="Estado General: Proyecto Alfa"
    >
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-card border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-h3 text-slate-100">Historial de Salud General</h3>
            <p className="text-caption uppercase tracking-wider text-slate-500">Health Index</p>
          </div>
          <div className="flex h-52 items-center justify-center rounded-input border border-dashed border-slate-700 bg-slate-950/40 text-body text-slate-500">
            Gráfico vacío - pendiente integración de series históricas
          </div>
        </article>

        <article className="rounded-card border border-slate-800 bg-slate-900 p-6 text-center">
          <p className="text-button text-slate-400">Technical Health Score</p>
          <div className="mx-auto mt-4 inline-flex size-32 items-center justify-center rounded-full border-[10px] border-dashed border-slate-700 text-h2 text-slate-500">
            --
          </div>
          <p className="mt-4 text-button text-slate-500">Pendiente cálculo de score técnico</p>
        </article>
      </section>

      <IntegrationCardsGrid integrationCards={integrationCards} />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentAlertsPanel />
        <ComplianceSummaryTable />
      </section>
    </AppSidebarLayout>
  );
}
