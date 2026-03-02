"use client";

import { useSession } from "next-auth/react";
import { FolderPlus, Plus } from "lucide-react";
import { ProjectCard, type ProjectCardModel } from "@/presentation/components/molecules/ProjectCard";
import { ProjectFilters } from "@/presentation/components/molecules/ProjectFilters";
import { AppSidebarLayout } from "@/presentation/components/templates/AppSidebarLayout";

interface ProjectSelectorLayoutProps {
  readonly projects: readonly ProjectListItem[];
}

export interface ProjectListItem extends ProjectCardModel {
  owner: string;
  unit: string;
  stack: string;
  status: "Activo" | "En revision" | "Pendiente";
}

export function ProjectSelectorLayout({ projects }: ProjectSelectorLayoutProps) {
  const { data: session } = useSession();
  const displayName = session?.user?.name ?? "Usuario";

  return (
    <AppSidebarLayout
      activeSection="projects"
      breadcrumbCurrent="Selector"
      breadcrumbSection="Proyectos"
      topSearchLabel="Buscar proyecto"
      topSearchPlaceholder="Buscar proyecto..."
      pageDescription={`Bienvenido, ${displayName}. Selecciona un proyecto para monitorear salud técnica y avance operativo.`}
      pageTitle="Seleccionar Proyecto"
    >
      <div>
        <ProjectFilters />

        <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <button
            className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-6 text-center transition-colors hover:border-[#137fec] hover:bg-[#137fec]/10"
            type="button"
          >
            <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full border-2 border-dashed border-slate-600 text-slate-300">
              <Plus aria-hidden size={24} strokeWidth={2.5} />
            </span>
            <p className="inline-flex items-center gap-2 text-h3 text-white">
              <FolderPlus aria-hidden size={18} strokeWidth={2.25} />
              Agregar nuevo proyecto
            </p>
            <p className="mt-2 max-w-xs text-body text-slate-400">
              Crea un nuevo proyecto para incluirlo en el monitoreo de salud tecnica.
            </p>
          </button>
        </section>
      </div>
    </AppSidebarLayout>
  );
}
