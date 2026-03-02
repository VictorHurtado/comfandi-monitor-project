"use client";

import { ShieldCheck } from "lucide-react";
import { useSonarIntegrationStatus } from "@/presentation/hooks/useSonarIntegrationStatus";
import type { SonarHealthStatus } from "@/domain/models/SonarIntegrationStatus";

function getStatusStyles(status: SonarHealthStatus): {
  badge: string;
  label: string;
} {
  switch (status) {
    case "healthy":
      return {
        badge: "bg-emerald-500/20 text-emerald-500",
        label: "Healthy"
      };
    case "warning":
      return {
        badge: "bg-amber-500/20 text-amber-500",
        label: "Warning"
      };
    case "critical":
      return {
        badge: "bg-red-500/20 text-red-500",
        label: "Critical"
      };
    default:
      return {
        badge: "bg-slate-500/20 text-slate-400",
        label: "Unknown"
      };
  }
}

export function SonarIntegrationCard() {
  const { data, isLoading, error } = useSonarIntegrationStatus();

  if (isLoading) {
    return (
      <article
        className="rounded-card border border-slate-800 bg-slate-900 p-5"
        aria-label="Tarjeta SonarQube"
      >
        <header className="mb-4 flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-orange-500/20 text-orange-500">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube</h3>
        </header>
        <div className="rounded-input border border-dashed border-slate-700 p-4 text-center text-caption text-slate-500">
          Cargando métricas…
        </div>
      </article>
    );
  }

  if (error || !data) {
    const styles = getStatusStyles("unknown");
    return (
      <article
        className="rounded-card border border-slate-800 bg-slate-900 p-5"
        aria-label="Tarjeta SonarQube"
      >
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-9 items-center justify-center rounded-input bg-orange-500/20 text-orange-500">
              <ShieldCheck className="size-5" aria-hidden />
            </div>
            <h3 className="text-h3 text-slate-100">SonarQube</h3>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-caption font-bold uppercase ${styles.badge}`}
          >
            {styles.label}
          </span>
        </header>
        <div className="rounded-input border border-dashed border-slate-700 bg-slate-950/40 p-4 text-center">
          <p className="text-body text-slate-400">
            No hay datos disponibles. La integración con SonarQube se configurará próximamente.
          </p>
        </div>
      </article>
    );
  }

  const styles = getStatusStyles(data.status);
  const qualityGateBadge =
    data.qualityGateStatus === "PASSED"
      ? "bg-emerald-500/20 text-emerald-500"
      : "bg-red-500/20 text-red-500";

  return (
    <article
      className="rounded-card border border-slate-800 bg-slate-900 p-5"
      aria-label="Tarjeta SonarQube"
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-orange-500/20 text-orange-500">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube</h3>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-caption font-bold uppercase ${styles.badge}`}
        >
          {styles.label}
        </span>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-body text-slate-500">Proyecto</span>
          <span className="text-button text-slate-100">{data.projectName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body text-slate-500">Quality Gate</span>
          <span
            className={`rounded-full px-2 py-1 text-caption font-bold ${qualityGateBadge}`}
          >
            {data.qualityGateStatus}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-input bg-slate-800 p-3">
            <p className="text-caption text-slate-500">Cobertura</p>
            <p className="text-h3 text-slate-100">{data.coverage}%</p>
          </div>
          <div className="rounded-input bg-slate-800 p-3">
            <p className="text-caption text-slate-500">Bugs</p>
            <p className="text-h3 text-slate-100">{data.bugs}</p>
          </div>
          <div className="rounded-input bg-slate-800 p-3">
            <p className="text-caption text-slate-500">Vulnerab.</p>
            <p className="text-h3 text-slate-100">{data.vulnerabilities}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
