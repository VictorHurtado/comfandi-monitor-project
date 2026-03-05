import type { ComponentType } from "react";
import { GitBranch, ShieldCheck, Siren, Workflow } from "lucide-react";
import { SonarIntegrationCard } from "./SonarIntegrationCard";

interface IntegrationCard {
  readonly id: string;
  readonly title: string;
  readonly workshopOwner: string;
  readonly icon: ComponentType<{ className?: string }>;
}

const integrationCards: readonly IntegrationCard[] = [
  {
    id: "sonar",
    title: "SonarQube",
    workshopOwner: "Equipo 1",
    icon: ShieldCheck
  },
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

interface IntegrationCardsGridProps {
  readonly projectId: string;
  readonly projectName: string;
}

export function IntegrationCardsGrid({ projectId, projectName }: IntegrationCardsGridProps) {
  return (
    <section aria-label="Integraciones técnicas" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {integrationCards.map((card) => {
        if (card.id === "sonar") {
          return (
            <SonarIntegrationCard
              key={card.id}
              projectId={projectId}
              projectName={projectName}
            />
          );
        }

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
