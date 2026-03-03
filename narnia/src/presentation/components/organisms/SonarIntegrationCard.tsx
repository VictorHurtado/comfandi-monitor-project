import { ShieldCheck } from "lucide-react";
import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";

interface SonarIntegrationCardProps {
  readonly projectName: string;
  readonly sonarStatus: SonarProjectStatus;
}

interface SonarIntegrationCardLoadingProps {
  readonly projectName: string;
}

interface QualityGateUiState {
  readonly badgeClassName: string;
  readonly dotClassName: string;
  readonly label: string;
}

function getQualityGateUiState(
  qualityGate: SonarProjectStatus["qualityGate"]
): QualityGateUiState {
  if (qualityGate === "passed") {
    return {
      badgeClassName: "bg-status-success/20 text-status-success",
      dotClassName: "bg-status-success",
      label: "passed"
    };
  }

  if (qualityGate === "failed") {
    return {
      badgeClassName: "bg-status-danger/20 text-status-danger",
      dotClassName: "bg-status-danger",
      label: "failed"
    };
  }

  return {
    badgeClassName: "bg-status-warning/20 text-status-warning",
    dotClassName: "bg-status-warning",
    label: "unknown"
  };
}

function formatCoverage(coverage?: number): string {
  if (coverage === undefined) {
    return "sin dato";
  }

  return Number.isInteger(coverage) ? `${coverage} %` : `${coverage.toFixed(1)} %`;
}

function formatCount(value?: number): string {
  if (value === undefined) {
    return "sin dato";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function SonarIntegrationCard({ projectName, sonarStatus }: SonarIntegrationCardProps) {
  const qualityGateUiState = getQualityGateUiState(sonarStatus.qualityGate);
  const formattedCheckedAt = new Date(sonarStatus.checkedAt).toLocaleString();

  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube - {projectName}</h3>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-caption uppercase ${qualityGateUiState.badgeClassName}`}
        >
          {qualityGateUiState.label}
        </span>
      </header>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex size-3 rounded-full ${qualityGateUiState.dotClassName}`}
            aria-hidden
          />
          <p className="text-body text-slate-300">
            Quality Gate: <strong className="uppercase">{qualityGateUiState.label}</strong>
          </p>
        </div>

        <p className="text-body text-slate-400">{sonarStatus.message}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-input border border-brand-200/30 bg-brand-50/5 p-3">
            <p className="text-caption uppercase text-brand-300">Coverage</p>
            <p className="text-button text-slate-100">{formatCoverage(sonarStatus.coverage)}</p>
          </div>
          <div className="rounded-input border border-brand-200/30 bg-brand-50/5 p-3">
            <p className="text-caption uppercase text-brand-300">Bugs</p>
            <p className="text-button text-slate-100">{formatCount(sonarStatus.bugs)}</p>
          </div>
          <div className="rounded-input border border-brand-200/30 bg-brand-50/5 p-3">
            <p className="text-caption uppercase text-brand-300">Vulnerabilities</p>
            <p className="text-button text-slate-100">{formatCount(sonarStatus.vulnerabilities)}</p>
          </div>
        </div>

        <div className="rounded-input border border-dashed border-slate-700 bg-slate-950/40 p-3">
          <p className="text-caption uppercase text-slate-500">Project key</p>
          <p className="text-button text-slate-100">{sonarStatus.projectKey || "sin configurar"}</p>
        </div>

        <p className="text-caption text-slate-500">Ultima consulta: {formattedCheckedAt}</p>
      </div>
    </article>
  );
}

export function SonarIntegrationCardLoading({ projectName }: SonarIntegrationCardLoadingProps) {
  return (
    <article className="rounded-card border border-slate-800 bg-slate-900 p-5">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-h3 text-slate-100">SonarQube - {projectName}</h3>
        </div>
        <span className="rounded-full bg-status-warning/20 px-2 py-1 text-caption uppercase text-status-warning">
          cargando
        </span>
      </header>

      <div className="space-y-3">
        <p className="text-body text-slate-400">Cargando datos de Sonar...</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-input border border-brand-200/30 bg-brand-50/5 p-3">
            <p className="text-caption uppercase text-brand-300">Coverage</p>
            <p className="text-button text-slate-100">sin dato</p>
          </div>
          <div className="rounded-input border border-brand-200/30 bg-brand-50/5 p-3">
            <p className="text-caption uppercase text-brand-300">Bugs</p>
            <p className="text-button text-slate-100">sin dato</p>
          </div>
          <div className="rounded-input border border-brand-200/30 bg-brand-50/5 p-3">
            <p className="text-caption uppercase text-brand-300">Vulnerabilities</p>
            <p className="text-button text-slate-100">sin dato</p>
          </div>
        </div>
      </div>
    </article>
  );
}
