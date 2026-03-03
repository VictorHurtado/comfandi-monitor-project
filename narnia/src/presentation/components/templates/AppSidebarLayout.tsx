"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BarChart3, Bell, ChevronRight, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Search, Settings } from "lucide-react";
import { useState } from "react";

type SidebarSection = "dashboard" | "projects";

interface AppSidebarLayoutProps {
  readonly activeSection: SidebarSection;
  readonly dashboardHref?: string;
  readonly currentProjectName?: string;
  readonly breadcrumbSection: string;
  readonly breadcrumbCurrent: string;
  readonly topSearchLabel: string;
  readonly topSearchPlaceholder: string;
  readonly pageTitle: string;
  readonly pageDescription: ReactNode;
  readonly pageActions?: ReactNode;
  readonly children: ReactNode;
}

function getNavItemStateClass(active: boolean): string {
  return active ? "bg-[#137fec]/15 text-[#6aa8ff]" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100";
}

interface ProjectDashboardNavProps {
  readonly dashboardHref?: string;
  readonly currentProjectName?: string;
  readonly isSidebarCollapsed: boolean;
  readonly navItemClassName: string;
  readonly activeSection: SidebarSection;
  readonly showLabelsClassName: string;
}

function ProjectDashboardNav({
  dashboardHref,
  currentProjectName,
  isSidebarCollapsed,
  navItemClassName,
  activeSection,
  showLabelsClassName
}: ProjectDashboardNavProps) {
  if (!dashboardHref) return null;

  const projectName = currentProjectName ?? "Proyecto seleccionado";
  const dashboardNavClassName = `${navItemClassName} text-button ${getNavItemStateClass(activeSection === "dashboard")} ${
    isSidebarCollapsed ? "" : "ml-3 w-[calc(100%-0.75rem)]"
  }`;

  return (
    <div className={isSidebarCollapsed ? "pt-1" : "space-y-1 pt-2"}>
      {isSidebarCollapsed ? null : <p className="px-3 text-caption uppercase tracking-wide text-slate-500">{projectName}</p>}
      <Link
        aria-label="Dashboard"
        className={dashboardNavClassName}
        href={dashboardHref}
        title={`Dashboard de ${projectName}`}
      >
        <LayoutDashboard className="size-4" aria-hidden />
        <span className={showLabelsClassName}>Dashboard</span>
      </Link>
    </div>
  );
}

export function AppSidebarLayout({
  activeSection,
  dashboardHref,
  currentProjectName,
  breadcrumbSection,
  breadcrumbCurrent,
  topSearchLabel,
  topSearchPlaceholder,
  pageTitle,
  pageDescription,
  pageActions,
  children
}: AppSidebarLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: session } = useSession();

  const displayName = session?.user?.name ?? "Usuario";
  const displayEmail = session?.user?.email ?? "usuario@comfandi.com.co";

  const sidebarWidthClassName = isSidebarCollapsed ? "w-[5.5rem]" : "w-64";
  const sidebarBodyClassName = isSidebarCollapsed ? "flex h-full w-full flex-col items-center gap-6 p-3" : "flex h-full w-full flex-col gap-8 p-6";
  const sidebarHeaderClassName = isSidebarCollapsed ? "flex w-full flex-col items-center gap-3" : "flex items-center justify-between gap-2";
  const navItemClassName = isSidebarCollapsed
    ? "flex w-full items-center justify-center rounded-input px-0 py-2.5"
    : "flex w-full items-center gap-3 rounded-input px-3 py-2";
  const showLabelsClassName = isSidebarCollapsed ? "hidden" : "inline";

  return (
    <div className="flex min-h-screen bg-[#101922] text-slate-100">
      <aside className={`hidden shrink-0 border-r border-slate-800 bg-[#101922] transition-all duration-300 lg:flex ${sidebarWidthClassName}`}>
        <div className={sidebarBodyClassName}>
          <div className={sidebarHeaderClassName}>
            <div className="flex items-center gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-input bg-[#137fec] text-white">
                <LayoutDashboard className="size-5" aria-hidden />
              </div>
              <div className={showLabelsClassName}>
                <h1 className="text-h3 text-white">Salud Técnica</h1>
                <p className="text-caption text-slate-400">Plataforma Interna</p>
              </div>
            </div>
            <button
              aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              className="inline-flex size-8 items-center justify-center rounded-input text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              onClick={() => setIsSidebarCollapsed((prevState) => !prevState)}
              type="button"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          </div>

          <nav aria-label="Navegación principal" className="w-full space-y-1">
            <Link
              aria-label="Proyectos"
              className={`${navItemClassName} text-button ${getNavItemStateClass(activeSection === "projects")}`}
              href="/project-selector"
              title="Proyectos"
            >
              <BarChart3 className="size-4" aria-hidden />
              <span className={showLabelsClassName}>Proyectos</span>
            </Link>
            <ProjectDashboardNav
              activeSection={activeSection}
              currentProjectName={currentProjectName}
              dashboardHref={dashboardHref}
              isSidebarCollapsed={isSidebarCollapsed}
              navItemClassName={navItemClassName}
              showLabelsClassName={showLabelsClassName}
            />
            <button
              aria-label="Alertas"
              className={`${navItemClassName} cursor-not-allowed text-button text-slate-500`}
              disabled
              title="Alertas"
              type="button"
            >
              <Bell className="size-4" aria-hidden />
              <span className={showLabelsClassName}>Alertas</span>
            </button>
            <button
              aria-label="Configuración"
              className={`${navItemClassName} cursor-not-allowed text-button text-slate-500`}
              disabled
              title="Configuración"
              type="button"
            >
              <Settings className="size-4" aria-hidden />
              <span className={showLabelsClassName}>Configuración</span>
            </button>
          </nav>

          {isSidebarCollapsed ? null : (
            <article className="mt-auto rounded-card border border-slate-800 bg-slate-900 p-4">
              <p className="text-button text-slate-100">{displayName}</p>
              <p className="text-caption text-slate-400">{displayEmail}</p>
            </article>
          )}
        </div>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#101922]/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="hidden items-center gap-2 text-caption text-slate-400 sm:flex">
              <span>{breadcrumbSection}</span>
              <ChevronRight className="size-4" aria-hidden />
              <span className="text-slate-100">{breadcrumbCurrent}</span>
            </div>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-input border border-slate-800 bg-slate-900 px-3 py-2">
              <Search className="size-4 text-slate-500" aria-hidden />
              <input
                aria-label={topSearchLabel}
                className="w-full bg-transparent text-body text-slate-100 placeholder:text-slate-500 focus:outline-none"
                placeholder={topSearchPlaceholder}
                type="text"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
          <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <h2 className="mb-2 text-h1 text-white">{pageTitle}</h2>
              <div className="text-body text-slate-400">{pageDescription}</div>
            </div>
            {pageActions ?? null}
          </section>
          {children}
        </div>
      </main>
    </div>
  );
}
