import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type ProjectHealth = "healthy" | "warning" | "critical";

export interface ProjectCardModel {
  id: string;
  href?: string;
  name: string;
  description: string;
  updatedAtLabel: string;
  area: string;
  healthLabel: string;
  healthScore: number;
  health: ProjectHealth;
  teamMembers: string[];
}

interface ProjectCardProps {
  readonly project: ProjectCardModel;
}

const healthStyles: Record<ProjectHealth, { chip: string; dot: string; gradient: string }> = {
  healthy: {
    chip: "bg-emerald-900/50 text-emerald-300",
    dot: "bg-emerald-500",
    gradient: "from-sky-500/30 to-emerald-500/30"
  },
  warning: {
    chip: "bg-amber-900/50 text-amber-300",
    dot: "bg-amber-500",
    gradient: "from-sky-500/30 to-amber-500/30"
  },
  critical: {
    chip: "bg-rose-900/50 text-rose-300",
    dot: "bg-rose-500",
    gradient: "from-sky-500/30 to-rose-500/30"
  }
};

export function ProjectCard({ project }: ProjectCardProps) {
  const style = healthStyles[project.health];
  const cardContent = (
    <article className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/95 transition-all duration-300 hover:border-[#137fec]/60 hover:shadow-xl">
      <div className={`relative h-40 bg-slate-900 bg-gradient-to-br ${style.gradient}`}>
        <div className="absolute right-4 top-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-caption font-semibold ${style.chip}`}
          >
            <span className={`size-2 rounded-full ${style.dot}`} />
            {project.healthLabel} ({project.healthScore}%)
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex -space-x-2">
          {project.teamMembers.map((member) => (
            <span
              key={`${project.id}-${member}`}
              className="inline-flex size-8 items-center justify-center rounded-full border-2 border-slate-800 bg-slate-700 text-caption font-semibold text-slate-200"
            >
              {member}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <header className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-h3 text-white">{project.name}</h3>
          <span
            aria-hidden
            className="inline-flex rounded-full p-1 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-slate-700 group-hover:text-[#137fec]"
          >
            <ArrowUpRight size={16} strokeWidth={2.25} />
          </span>
        </header>

        <p className="mb-4 min-h-12 text-body text-slate-400">{project.description}</p>

        <footer className="flex items-center justify-between border-t border-slate-700 pt-4">
          <span className="text-caption text-slate-500">Actualizado {project.updatedAtLabel}</span>
          <span className="rounded-full bg-[#137fec]/15 px-2 py-1 text-caption font-semibold text-[#60a5fa]">
            {project.area}
          </span>
        </footer>
      </div>
    </article>
  );

  if (!project.href) {
    return cardContent;
  }

  return (
    <Link aria-label={`Abrir dashboard de ${project.name}`} className="block" href={project.href}>
      {cardContent}
    </Link>
  );
}
