import { ProjectSelectorLayout } from "@/presentation/components/organisms/ProjectSelectorLayout";
import type { ProjectListItem } from "@/presentation/components/organisms/ProjectSelectorLayout";

const projectMocks: ProjectListItem[] = [
  {
    id: "pf-cartera",
    name: "PF Cartera",
    owner: "equipo.cartera@comfandi.com.co",
    unit: "Cartera",
    stack: "Next.js + NestJS",
    status: "Activo"
  },
  {
    id: "pqrs-proteo",
    name: "PQRS Proteo",
    owner: "equipo.pqrs@comfandi.com.co",
    unit: "Servicio al cliente",
    stack: "NestJS API",
    status: "En revision"
  },
  {
    id: "talento-humano",
    name: "Talento Humano",
    owner: "equipo.th@comfandi.com.co",
    unit: "Gestion humana",
    stack: "Next.js",
    status: "Pendiente"
  },
  {
    id: "riesgo-operacional",
    name: "Riesgo Operacional",
    owner: "equipo.riesgo@comfandi.com.co",
    unit: "Riesgo",
    stack: "React + BFF",
    status: "Activo"
  }
];

export function ProjectSelectorPage() {
  return <ProjectSelectorLayout projects={projectMocks} />;
}
