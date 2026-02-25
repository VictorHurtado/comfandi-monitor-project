import Image from "next/image";
import { ProjectFilters } from "@/presentation/components/molecules/ProjectFilters";

interface ProjectSelectorLayoutProps {
  projects: ProjectListItem[];
}

export interface ProjectListItem {
  id: string;
  name: string;
  owner: string;
  unit: string;
  stack: string;
  status: "Activo" | "En revision" | "Pendiente";
}

export function ProjectSelectorLayout({ projects }: ProjectSelectorLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-8 items-center justify-center rounded-button border border-brand-border bg-brand-surface p-1">
                <Image alt="Next icon" height={18} src="/next.svg" width={18} />
              </div>
              <p className="text-h3 text-brand-900">Comfandi TechHealth</p>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <span className="text-button text-brand-700">Proyectos</span>
              <span className="text-button text-brand-muted">Configuracion</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-caption font-semibold text-brand-900">kc-monitor@comfandi.com.co</p>
              <p className="text-caption text-brand-muted">Cuenta Keycloak</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-brand-100 text-button text-brand-800">
              KC
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <section className="mb-10">
          <h1 className="mb-2 text-h1 text-brand-900">Seleccionar Proyecto</h1>
          <p className="max-w-3xl text-body text-brand-muted">
            Vista de proyectos Comfandi para seleccionar el proyecto a consultar.
          </p>
        </section>

        <ProjectFilters />

        <section className="ui-card overflow-hidden">
          <header className="border-b border-brand-border px-5 py-4">
            <h2 className="text-h3 text-brand-900">Listado mock de proyectos</h2>
          </header>
          <ul className="divide-y divide-brand-border">
            {projects.map((project) => (
              <li key={project.id} className="grid gap-3 px-5 py-4 md:grid-cols-5 md:items-center">
                <p className="text-body font-semibold text-brand-900">{project.name}</p>
                <p className="text-caption text-brand-muted">{project.owner}</p>
                <p className="text-caption text-brand-muted">{project.unit}</p>
                <p className="text-caption text-brand-muted">{project.stack}</p>
                <span className="w-fit rounded-full bg-brand-100 px-3 py-1 text-caption font-semibold text-brand-800">
                  {project.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mt-12 border-t border-brand-border bg-brand-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-6 text-caption text-brand-muted">
          <p>(c) 2024 Comfandi Monitor</p>
          <span>Selector de proyectos</span>
        </div>
      </footer>
    </div>
  );
}
