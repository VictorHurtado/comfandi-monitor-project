"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { ProjectCard, type ProjectCardModel } from "@/presentation/components/molecules/ProjectCard";
import { ProjectFilters } from "@/presentation/components/molecules/ProjectFilters";

interface ProjectSelectorLayoutProps {
  projects: ProjectListItem[];
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
  const displayEmail = session?.user?.email ?? "cuenta.keycloak@comfandi.com.co";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "KC";

  return (
    <div className="min-h-screen bg-brand-canvas">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Image
                alt="Logo Comfandi"
                className="h-10 w-10 rounded-button border border-brand-border object-cover"
                height={40}
                src="/comfandi-renueva-su-identidad-como-simbolo-de-su-evolucion.webp"
                width={40}
              />
              <p className="text-h3 text-brand-900">Comfandi TechHealth</p>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <span className="text-button text-brand-700">Proyectos</span>
              <span className="text-button text-brand-muted">Configuracion</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-caption font-semibold text-brand-900">{displayEmail}</p>
              <p className="text-caption text-brand-muted">Cuenta Keycloak</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-brand-100 text-button text-brand-800">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <section className="mb-10">
          <h1 className="mb-2 text-h1 text-brand-900">Seleccionar Proyecto</h1>
          <p className="max-w-3xl text-body text-brand-muted">
            Bienvenido, {displayName}. Selecciona un proyecto para monitorear salud tecnica y avance operativo.
          </p>
        </section>

        <ProjectFilters />

        <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>

        <section className="ui-card overflow-hidden">
          <header className="border-b border-brand-border px-5 py-4">
            <h2 className="text-h3 text-brand-900">Listado mock de proyectos</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-brand-50 text-left">
                <tr>
                  <th className="px-5 py-3 text-caption text-brand-800">Proyecto</th>
                  <th className="px-5 py-3 text-caption text-brand-800">Owner</th>
                  <th className="px-5 py-3 text-caption text-brand-800">Unidad</th>
                  <th className="px-5 py-3 text-caption text-brand-800">Stack</th>
                  <th className="px-5 py-3 text-caption text-brand-800">Estado</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={`row-${project.id}`} className="border-t border-brand-border">
                    <td className="px-5 py-4 text-body font-semibold text-brand-900">{project.name}</td>
                    <td className="break-all px-5 py-4 text-caption text-brand-muted">{project.owner}</td>
                    <td className="px-5 py-4 text-caption text-brand-muted">{project.unit}</td>
                    <td className="px-5 py-4 text-caption text-brand-muted">{project.stack}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-caption font-semibold text-brand-800">
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
