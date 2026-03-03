"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useSession } from "next-auth/react";
import { GitBranch, Siren, Workflow } from "lucide-react";
import type { SonarProjectStatus } from "@/domain/models/SonarProjectStatus";
import {
  SonarIntegrationCard,
  SonarIntegrationCardLoading
} from "@/presentation/components/organisms/SonarIntegrationCard";

interface IntegrationCard {
  readonly id: string;
  readonly title: string;
  readonly workshopOwner: string;
  readonly icon: ComponentType<{ className?: string }>;
}

interface IntegrationCardsGridProps {
  readonly projectId: string;
  readonly projectName: string;
  readonly sonarStatus: SonarProjectStatus;
}

const integrationCards: readonly IntegrationCard[] = [
  {
    id: "github",
    title: "GitHub",
    workshopOwner: "Equipo 2",
    icon: GitBranch
  },
  {
    id: "jira",
    title: "Jira",
    workshopOwner: "Equipo 3",
    icon: Siren
  },
  {
    id: "proteo",
    title: "Proteo",
    workshopOwner: "Equipo 4",
    icon: Workflow
  }
];

function createUnavailableSonarStatus(projectSlug: string): SonarProjectStatus {
  return {
    qualityGate: "unknown",
    projectKey: "",
    projectSlug,
    coverage: undefined,
    bugs: undefined,
    vulnerabilities: undefined,
    message: "Sonar no disponible",
    checkedAt: new Date().toISOString()
  };
}

function shouldStartLoading(status: SonarProjectStatus): boolean {
  return status.message.toLowerCase().includes("cargando");
}

export function IntegrationCardsGrid({
  projectId,
  projectName,
  sonarStatus: initialSonarStatus
}: IntegrationCardsGridProps) {
  const [sonarStatus, setSonarStatus] = useState(initialSonarStatus);
  const [isLoading, setIsLoading] = useState(() => shouldStartLoading(initialSonarStatus));
  const { data: session } = useSession();

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadSonarStatus = async () => {
      setIsLoading(true);

      try {
        const accessToken = (
          session as
            | {
                access_token?: string;
              }
            | undefined
        )?.access_token;

        const response = await fetch(`/api/v1/projects/${projectId}/integrations/sonar`, {
          method: "GET",
          headers: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`
              }
            : undefined,
          cache: "no-store",
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error("unable to load sonar status");
        }

        const data = (await response.json()) as SonarProjectStatus;

        if (isMounted) {
          setSonarStatus(data);
        }
      } catch {
        if (isMounted) {
          setSonarStatus(createUnavailableSonarStatus(projectId));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSonarStatus();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [projectId, session]);

  return (
    <section aria-label="Integraciones técnicas" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {isLoading ? (
        <SonarIntegrationCardLoading projectName={projectName} />
      ) : (
        <SonarIntegrationCard projectName={projectName} sonarStatus={sonarStatus} />
      )}

      {integrationCards.map((card) => {
        const Icon = card.icon;

        return (
          <article key={card.id} className="rounded-card border border-slate-800 bg-slate-900 p-5">
            <header className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-input bg-slate-800 text-slate-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-h3 text-slate-100">{card.title}</h3>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-caption uppercase text-slate-300">pendiente</span>
            </header>

            <div className="space-y-3">
              <p className="text-body text-slate-400">Módulo listo para conectar datos reales en el taller.</p>
              <div className="rounded-input border border-dashed border-slate-700 bg-slate-950/40 p-3">
                <p className="text-caption uppercase text-slate-500">Responsable</p>
                <p className="text-button text-slate-100">{card.workshopOwner}</p>
              </div>
              <div className="rounded-input border border-dashed border-slate-700 p-3 text-center text-caption text-slate-500">
                Sin métricas conectadas
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
