"use client";

import { useSession } from "next-auth/react";
import { FolderPlus, Plus } from "lucide-react";
import { ProjectCard, type ProjectCardModel } from "@/presentation/components/molecules/ProjectCard";
import { ProjectFilters } from "@/presentation/components/molecules/ProjectFilters";

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
  const displayEmail = session?.user?.email ?? "usuario@comfandi.com.co";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "US";

  return (
    <div className="flex min-h-screen flex-col bg-[#101922] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#101922]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-[#137fec]/70 bg-[#137fec] text-h3 font-bold text-white"
              >
                C
              </div>
              <p className="text-h3 text-white">Comfandi TechHealth</p>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <span className="text-button text-[#137fec]">Proyectos</span>
              <span className="text-button text-slate-400">Configuracion</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-caption font-semibold text-slate-100">{displayEmail}</p>
              <p className="text-caption text-slate-400">Cuenta plataforma</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-button text-slate-200">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <section className="mb-10">
          <h1 className="mb-2 text-h1 text-white">Seleccionar Proyecto</h1>
          <p className="max-w-3xl text-body text-slate-400">
            Bienvenido, {displayName}. Selecciona un proyecto para monitorear salud tecnica y avance operativo.
          </p>
        </section>

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
      </main>

      <footer className="border-t border-slate-800 bg-[#101922]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-4 text-caption text-slate-500">
          <p>(c) 2026 Comfandi TechHealth</p>
          <span>Selector de proyectos</span>
        </div>
      </footer>
    </div>
  );
}
