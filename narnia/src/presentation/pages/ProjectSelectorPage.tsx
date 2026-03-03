import { ProjectSelectorLayout } from "@/presentation/components/organisms/ProjectSelectorLayout";
import type { ProjectListItem } from "@/presentation/components/organisms/ProjectSelectorLayout";

const projectMocks: ProjectListItem[] = [
  {
    id: "afiliaciones",
    href: "/dashboard/technical-health/afiliaciones",
    name: "Afiliaciones",
    description: "Plataforma para la gestion integral del proceso de afiliaciones.",
    updatedAtLabel: "hace 10m",
    area: "Frontend",
    healthLabel: "Saludable",
    healthScore: 96,
    health: "healthy",
    teamMembers: ["AF", "TI", "+1"],
    owner: "equipo.afiliaciones@comfandi.com.co",
    unit: "Afiliaciones",
    stack: "Next.js + BFF",
    status: "Activo"
  }
];

export function ProjectSelectorPage() {
  return <ProjectSelectorLayout projects={projectMocks} />;
}
