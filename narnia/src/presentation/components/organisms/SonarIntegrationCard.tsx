"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { SonarQualityGateResult, SonarQualityGateStatus } from "@/domain/models/SonarQualityGate";

interface SonarIntegrationCardProps {
  readonly projectId: string;
  readonly projectName: string;
}

function getTrafficLightStyles(status: SonarQualityGateStatus): string {
  switch (status) {
    case "passed":
      return "bg-status-success text-white";
    case "failed":
      return "bg-status-danger text-white";
    default:
      return "bg-status-warning text-slate-900";
  }
}

function getTrafficLightLabel(status: SonarQualityGateStatus): string {
  switch (status) {
    case "passed":
      return "PASSED";
    case "failed":
      return "FAILED";
    default:
      return "SIN DATO";
  }
}

export function SonarIntegrationCard({ projectId, projectName }: SonarIntegrationCardProps) {
  const [data, setData] = useState<SonarQualityGateResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSonarStatus() {
      try {
        const res = await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/integrations/sonar`);
        if (cancelled) return;
        if (res.ok) {
          const json = (await res.json()) as SonarQualityGateResult;
          setData(json);
        } else {
          setData({
            status: "unknown",
            sonarProjectKey: "",
            projectName,
            message: "Sonar no disponible"
          });
        }
      } catch {
        if (!cancelled) {
          setData({
            status: "unknown",
            sonarProjectKey: "",
            projectName,
            message: "Sonar no disponible"
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSonarStatus();
    return () => {
      cancelled = true;
    };
  }, [projectId, projectName]);

  const status = data?.status ?? "unknown";
  const displayName = data?.projectName || projectName;
  const message = data?.message;

  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube</h3>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-caption font-semibold uppercase ${getTrafficLightStyles(status)}`}
        >
          {loading ? "..." : getTrafficLightLabel(status)}
        </span>
      </header>

      <div className="space-y-3">
        <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3">
          <p className="text-caption uppercase text-slate-500">Proyecto</p>
          <p className="text-button text-slate-100">{displayName}</p>
        </div>

        {loading ? (
          <div className="rounded-input border border-dashed border-slate-700 p-3 text-center text-caption text-slate-500">
            Cargando Quality Gate...
          </div>
        ) : message ? (
          <div className="rounded-input border border-slate-700 p-3 text-center text-caption text-slate-400">
            {message}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-input border border-slate-700 p-3">
              <span className="text-caption text-slate-500">Quality Gate</span>
              <span
                className={`size-3 shrink-0 rounded-full ${
                  status === "passed"
                    ? "bg-status-success"
                    : status === "failed"
                      ? "bg-status-danger"
                      : "bg-status-warning"
                }`}
                aria-label={getTrafficLightLabel(status)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3 text-center">
                <p className="text-caption uppercase text-slate-500">Coverage</p>
                <p className="text-button font-semibold text-slate-100">
                  {data?.coverage != null ? `${Math.round(data.coverage)}%` : "sin dato"}
                </p>
              </div>
              <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3 text-center">
                <p className="text-caption uppercase text-slate-500">Bugs</p>
                <p className="text-button font-semibold text-slate-100">
                  {data?.bugs != null ? String(data.bugs) : "sin dato"}
                </p>
              </div>
              <div className="rounded-input border border-slate-700 bg-slate-950/40 p-3 text-center">
                <p className="text-caption uppercase text-slate-500">Vulnerab.</p>
                <p className="text-button font-semibold text-slate-100">
                  {data?.vulnerabilities != null ? String(data.vulnerabilities) : "sin dato"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
