type ProjectHealth = "healthy" | "warning" | "critical";

export interface ProjectCardModel {
  id: string;
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
  project: ProjectCardModel;
}

const healthStyles: Record<ProjectHealth, { chip: string; dot: string; gradient: string }> = {
  healthy: {
    chip: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    gradient: "from-brand-200 to-emerald-300"
  },
  warning: {
    chip: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    gradient: "from-brand-200 to-amber-300"
  },
  critical: {
    chip: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
    gradient: "from-brand-200 to-rose-300"
  }
};

export function ProjectCard({ project }: ProjectCardProps) {
  const style = healthStyles[project.health];

  return (
    <article className="ui-card group overflow-hidden transition-all duration-200 hover:border-brand-300 hover:shadow-interactive">
      <div className={`relative h-40 bg-gradient-to-br ${style.gradient}`}>
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
              className="inline-flex size-8 items-center justify-center rounded-full border-2 border-brand-surface bg-brand-100 text-caption font-semibold text-brand-700"
            >
              {member}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <header className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-h3 text-brand-900">{project.name}</h3>
          <span aria-hidden className="text-brand-600 transition-colors group-hover:text-brand-800">{"->"}</span>
        </header>

        <p className="mb-4 min-h-12 text-body text-brand-muted">{project.description}</p>

        <footer className="flex items-center justify-between border-t border-brand-100 pt-4">
          <span className="text-caption text-brand-muted">Actualizado {project.updatedAtLabel}</span>
          <span className="rounded-full bg-brand-100 px-2 py-1 text-caption font-semibold text-brand-800">
            {project.area}
          </span>
        </footer>
      </div>
    </article>
  );
}
