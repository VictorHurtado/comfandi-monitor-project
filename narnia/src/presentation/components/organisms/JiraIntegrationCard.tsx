"use client";

import { useEffect, useMemo, useState } from "react";
import { Siren } from "lucide-react";
import type {
  JiraProjectMetrics,
  JiraRiskLevel
} from "@/domain/models/JiraProjectMetrics";
import { GetJiraMetricsByProjectUseCase } from "@/domain/usecases/GetJiraMetricsByProjectUseCase";
import { USECASE_TYPES, container } from "@/infrastructure/ioc";

interface JiraIntegrationCardProps {
  readonly projectId: string;
  readonly projectName: string;
  readonly getJiraMetricsByProjectUseCase?: GetJiraMetricsByProjectUseCase;
}

const statusStyles = {
  ok: {
    label: "conectado",
    className: "rounded-full bg-emerald-500/20 px-2 py-1 text-caption uppercase text-emerald-300"
  },
  pending: {
    label: "pendiente",
    className: "rounded-full bg-amber-500/20 px-2 py-1 text-caption uppercase text-amber-300"
  },
  unknown: {
    label: "no disponible",
    className: "rounded-full bg-slate-700 px-2 py-1 text-caption uppercase text-slate-300"
  }
} as const;

const riskStyles: Record<JiraRiskLevel, { label: string; className: string }> = {
  low: {
    label: "Riesgo bajo",
    className: "text-emerald-300"
  },
  medium: {
    label: "Riesgo medio",
    className: "text-amber-300"
  },
  high: {
    label: "Riesgo alto",
    className: "text-rose-300"
  }
};

const createFallbackMetrics = (
  projectId: string,
  status: JiraProjectMetrics["status"],
  message: string
): JiraProjectMetrics => ({
  projectId,
  status,
  message,
  checkedAt: new Date().toISOString(),
  openIssues: 0,
  blockedIssues: 0,
  closedIssuesLast7Days: 0,
  avgInProgressHours: 0,
  riskLevel: "low"
});

const defaultGetJiraMetricsByProjectUseCase = (): GetJiraMetricsByProjectUseCase =>
  container.get<GetJiraMetricsByProjectUseCase>(USECASE_TYPES.GetJiraMetricsByProjectUseCase);

const formatHours = (hours: number): string => {
  if (Number.isInteger(hours)) {
    return `${hours} h`;
  }

  return `${hours.toFixed(1)} h`;
};

const hasNoIssues = (metrics: JiraProjectMetrics): boolean =>
  metrics.openIssues === 0 && metrics.blockedIssues === 0 && metrics.closedIssuesLast7Days === 0;

export function JiraIntegrationCard({
  projectId,
  projectName,
  getJiraMetricsByProjectUseCase
}: JiraIntegrationCardProps) {
  const useCase = useMemo(
    () => getJiraMetricsByProjectUseCase ?? defaultGetJiraMetricsByProjectUseCase(),
    [getJiraMetricsByProjectUseCase]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<JiraProjectMetrics>(() =>
    createFallbackMetrics(projectId, "pending", "Pendiente de sincronización")
  );

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    const loadMetrics = async () => {
      try {
        const response = await useCase.execute(projectId);
        if (!isMounted) {
          return;
        }

        setMetrics(response);
      } catch {
        if (!isMounted) {
          return;
        }

        setMetrics(createFallbackMetrics(projectId, "unknown", "No disponible temporalmente"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadMetrics();

    return () => {
      isMounted = false;
    };
  }, [projectId, useCase]);

  const statusStyle = statusStyles[metrics.status];
  const riskStyle = riskStyles[metrics.riskLevel];
  const showEmptyState = metrics.status === "ok" && hasNoIssues(metrics);

  const metricValue = (value: number, formatter?: (metric: number) => string): string => {
    if (metrics.status !== "ok") {
      return "--";
    }

    if (formatter) {
      return formatter(value);
    }

    return String(value);
  };

  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-brand-500/20 text-brand-200">
            <Siren className="size-5" />
          </div>
          <h3 className="text-h3 text-slate-100">Jira</h3>
        </div>
        <span className={statusStyle.className}>{statusStyle.label}</span>
      </header>

      <div className="mb-4 rounded-input border border-brand-500/30 bg-brand-500/10 p-3">
        <p className="text-caption uppercase text-brand-200">Proyecto</p>
        <p className="text-button text-brand-50">{projectName}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Cargando métricas de Jira">
          <p className="text-body text-slate-300">Cargando métricas de Jira...</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 animate-pulse rounded-input bg-slate-800" />
            <div className="h-16 animate-pulse rounded-input bg-slate-800" />
            <div className="h-16 animate-pulse rounded-input bg-slate-800" />
            <div className="h-16 animate-pulse rounded-input bg-slate-800" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-caption uppercase text-slate-500">
              {showEmptyState ? "Sin issues activas" : metrics.message}
            </p>
            <p className={`text-caption uppercase ${riskStyle.className}`}>{riskStyle.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3">
              <p className="text-caption uppercase text-slate-500">Issues abiertas</p>
              <p className="text-h3 text-slate-100">{metricValue(metrics.openIssues)}</p>
            </div>
            <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3">
              <p className="text-caption uppercase text-slate-500">Issues bloqueadas</p>
              <p className="text-h3 text-slate-100">{metricValue(metrics.blockedIssues)}</p>
            </div>
            <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3">
              <p className="text-caption uppercase text-slate-500">Cerradas (7d)</p>
              <p className="text-h3 text-slate-100">{metricValue(metrics.closedIssuesLast7Days)}</p>
            </div>
            <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3">
              <p className="text-caption uppercase text-slate-500">In Progress (prom.)</p>
              <p className="text-h3 text-slate-100">
                {metricValue(metrics.avgInProgressHours, formatHours)}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
