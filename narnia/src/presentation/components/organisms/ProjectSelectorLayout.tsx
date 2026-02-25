import { ProjectCard, type ProjectCardModel } from "@/presentation/components/molecules/ProjectCard";
import { ProjectFilters } from "@/presentation/components/molecules/ProjectFilters";

interface ProjectSelectorLayoutProps {
  projects: ProjectCardModel[];
}

export function ProjectSelectorLayout({ projects }: ProjectSelectorLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-8 items-center justify-center rounded-button bg-brand-500 text-brand-surface">
                +
              </div>
              <p className="text-h3 text-brand-900">TechHealth</p>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <span className="text-button text-brand-700">Proyectos</span>
              <span className="text-button text-brand-muted">Reportes</span>
              <span className="text-button text-brand-muted">Equipos</span>
              <span className="text-button text-brand-muted">Configuracion</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="ui-control px-3 py-2 text-brand-700" type="button">
              Notificaciones
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-caption font-semibold text-brand-900">Alex Rivera</p>
              <p className="text-caption text-brand-muted">Tech Lead</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-brand-100 text-button text-brand-800">
              AR
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <section className="mb-10">
          <h1 className="mb-2 text-h1 text-brand-900">Seleccionar Proyecto</h1>
          <p className="max-w-3xl text-body text-brand-muted">
            Bienvenido de nuevo. Elige un proyecto para monitorear su salud tecnica, metricas de rendimiento y deuda
            tecnologica.
          </p>
        </section>

        <ProjectFilters />

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <article className="ui-card flex min-h-80 flex-col items-center justify-center gap-3 border-dashed p-8 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-100 text-h2 text-brand-700">
              +
            </span>
            <h3 className="text-h3 text-brand-900">Nuevo Proyecto</h3>
            <p className="text-body text-brand-muted">Registra un nuevo proyecto para monitoreo.</p>
          </article>
        </section>

        <div className="mt-10 flex justify-center">
          <button className="ui-control rounded-full px-6 py-2 text-button text-brand-800" type="button">
            Ver mas proyectos
          </button>
        </div>
      </main>

      <footer className="mt-12 border-t border-brand-border bg-brand-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-caption text-brand-muted md:flex-row">
          <p>(c) 2024 TechHealth Monitor S.A.</p>
          <div className="flex items-center gap-5">
            <span>Estado del sistema</span>
            <span>Documentacion</span>
            <span>Soporte tecnico</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
