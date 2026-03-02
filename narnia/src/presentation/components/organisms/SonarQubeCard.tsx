"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { SonarQubeHealthData, QualityGateStatus } from "@/domain/models/SonarQubeMetrics";
import type { IntegrationStatus } from "@/domain/models/PlatformHealthStatus";
import { GetSonarQubeMetricsUseCase } from "@/domain/usecases/GetSonarQubeMetricsUseCase";
import { container, USECASE_TYPES } from "@/infrastructure/ioc";

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; className: string }> = {
  ok: {
    label: "healthy",
    className: "bg-emerald-500/20 text-emerald-400"
  },
  warning: {
    label: "warning",
    className: "bg-amber-500/20 text-amber-400"
  },
  error: {
    label: "critical",
    className: "bg-red-500/20 text-red-400"
  },
  unknown: {
    label: "unknown",
    className: "bg-slate-700 text-slate-400"
  }
};

const QUALITY_GATE_CONFIG: Record<QualityGateStatus, { label: string; className: string }> = {
  passed: {
    label: "PASSED",
    className: "bg-emerald-500/20 text-emerald-400"
  },
  failed: {
    label: "FAILED",
    className: "bg-red-500/20 text-red-400"
  },
  none: {
    label: "N/A",
    className: "bg-slate-700 text-slate-400"
  }
};

export function SonarQubeCard() {
  const [data, setData] = useState<SonarQubeHealthData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadMetrics = useCallback(async () => {
    try {
      const useCase = container.get<GetSonarQubeMetricsUseCase>(
        USECASE_TYPES.GetSonarQubeMetricsUseCase
      );
      const result = await useCase.execute();
      setData(result);
      setStatus("ready");
    } catch {
      setData(null);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  if (status === "loading") {
    return <SonarQubeCardSkeleton />;
  }

  if (status === "error" || !data) {
    return <SonarQubeCardUnknown />;
  }

  const statusConfig = STATUS_CONFIG[data.status];
  const hasMetrics = data.metrics !== null;

  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5" data-testid="sonarqube-card">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube</h3>
        </div>
        <span className={`rounded-full px-2 py-1 text-caption font-semibold uppercase ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </header>

      {hasMetrics ? (
        <div className="space-y-3">
          <p className="text-caption text-slate-400">{data.projectName}</p>

          <div className="flex items-center justify-between">
            <span className="text-caption text-slate-500">Quality Gate</span>
            <span className={`rounded-full px-2 py-0.5 text-caption font-semibold ${QUALITY_GATE_CONFIG[data.metrics!.qualityGateStatus].className}`}>
              {QUALITY_GATE_CONFIG[data.metrics!.qualityGateStatus].label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MetricTile label="Coverage" value={`${data.metrics!.coverage}%`} />
            <MetricTile label="Bugs" value={String(data.metrics!.bugs)} />
          </div>

          <MetricTile label="Vulnerabilities" value={String(data.metrics!.vulnerabilities)} />
        </div>
      ) : (
        <SonarQubeNoMetrics />
      )}
    </article>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input bg-slate-800 p-2">
      <p className="text-caption text-slate-500">{label}</p>
      <p className="text-h3 text-slate-100">{value}</p>
    </div>
  );
}

function SonarQubeNoMetrics() {
  return (
    <div className="rounded-input border border-dashed border-slate-700 p-3 text-center text-caption text-slate-500">
      Sin métricas disponibles
    </div>
  );
}

function SonarQubeCardSkeleton() {
  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5 animate-pulse" data-testid="sonarqube-card-skeleton">
      <div className="mb-5 flex items-center gap-3">
        <div className="size-9 rounded-input bg-slate-800" />
        <div className="h-5 w-24 rounded bg-slate-800" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-14 rounded-input bg-slate-800" />
          <div className="h-14 rounded-input bg-slate-800" />
        </div>
      </div>
    </article>
  );
}

function SonarQubeCardUnknown() {
  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5" data-testid="sonarqube-card-unknown">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube</h3>
        </div>
        <span className="rounded-full bg-slate-700 px-2 py-1 text-caption font-semibold uppercase text-slate-400">
          unknown
        </span>
      </header>
      <div className="rounded-input border border-dashed border-slate-700 p-3 text-center text-caption text-slate-500">
        No se pudo obtener información de SonarQube
      </div>
    </article>
  );
}
