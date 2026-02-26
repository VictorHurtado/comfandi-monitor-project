import { ProjectSelectorLayout } from "@/presentation/components/organisms/ProjectSelectorLayout";
import type { ProjectListItem } from "@/presentation/components/organisms/ProjectSelectorLayout";

const projectMocks: ProjectListItem[] = [
  {
    id: "pf-cartera",
    name: "PF Cartera",
    description: "Plataforma financiera de cartera para procesos internos de recaudo.",
    updatedAtLabel: "hace 2h",
    area: "Backend",
    healthLabel: "Saludable",
    healthScore: 94,
    health: "healthy",
    teamMembers: ["CA", "PF", "+2"],
    owner: "equipo.cartera@comfandi.com.co",
    unit: "Cartera",
    stack: "Next.js + NestJS",
    status: "Activo"
  },
  {
    id: "pqrs-proteo",
    name: "PQRS Proteo",
    description: "Servicio de gestion de PQRS integrado con canales de atencion.",
    updatedAtLabel: "hace 5h",
    area: "API",
    healthLabel: "Atencion",
    healthScore: 73,
    health: "warning",
    teamMembers: ["PQ", "SR", "+1"],
    owner: "equipo.pqrs@comfandi.com.co",
    unit: "Servicio al cliente",
    stack: "NestJS API",
    status: "En revision"
  },
  {
    id: "talento-humano",
    name: "Talento Humano",
    description: "Modulo de gestion humana para procesos internos de talento.",
    updatedAtLabel: "hace 1d",
    area: "Frontend",
    healthLabel: "Atencion",
    healthScore: 69,
    health: "warning",
    teamMembers: ["TH", "GH"],
    owner: "equipo.th@comfandi.com.co",
    unit: "Gestion humana",
    stack: "Next.js",
    status: "Pendiente"
  },
  {
    id: "riesgo-operacional",
    name: "Riesgo Operacional",
    description: "Monitoreo operativo para cumplimiento y seguimiento de riesgo.",
    updatedAtLabel: "hace 40m",
    area: "BFF",
    healthLabel: "Saludable",
    healthScore: 89,
    health: "healthy",
    teamMembers: ["RO", "CO", "+3"],
    owner: "equipo.riesgo@comfandi.com.co",
    unit: "Riesgo",
    stack: "React + BFF",
    status: "Activo"
  }
];

export function ProjectSelectorPage() {
  return <ProjectSelectorLayout projects={projectMocks} />;
}
