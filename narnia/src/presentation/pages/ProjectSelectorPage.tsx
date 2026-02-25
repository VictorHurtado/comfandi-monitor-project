import { ProjectSelectorLayout } from "@/presentation/components/organisms/ProjectSelectorLayout";
import type { ProjectCardModel } from "@/presentation/components/molecules/ProjectCard";

const projectMocks: ProjectCardModel[] = [
  {
    id: "core-api-alpha",
    name: "Core API Alpha",
    description: "Microservicios de backend optimizados con latencia menor a 50ms.",
    updatedAtLabel: "hace 2h",
    area: "Backend",
    healthLabel: "Saludable",
    healthScore: 98,
    health: "healthy",
    teamMembers: ["AR", "LC", "+3"]
  },
  {
    id: "portal-beta",
    name: "Portal Beta",
    description: "Nueva interfaz para clientes empresariales con deuda de accesibilidad pendiente.",
    updatedAtLabel: "hace 5h",
    area: "Frontend",
    healthLabel: "Atencion",
    healthScore: 72,
    health: "warning",
    teamMembers: ["PD", "MN"]
  },
  {
    id: "legacy-gamma",
    name: "Legacy Gamma",
    description: "Sistema heredado de facturacion con alertas de seguridad abiertas.",
    updatedAtLabel: "hace 10m",
    area: "Infra",
    healthLabel: "Critico",
    healthScore: 45,
    health: "critical",
    teamMembers: ["ET", "+1"]
  },
  {
    id: "delta-devops",
    name: "Delta DevOps",
    description: "Pipeline de CI/CD automatizado para servicios internos.",
    updatedAtLabel: "ayer",
    area: "DevOps",
    healthLabel: "Saludable",
    healthScore: 92,
    health: "healthy",
    teamMembers: ["CD", "RK"]
  },
  {
    id: "epsilon-mobile",
    name: "Epsilon Mobile",
    description: "Aplicacion movil en revision por fallos en dispositivos antiguos.",
    updatedAtLabel: "hace 3h",
    area: "Mobile",
    healthLabel: "Atencion",
    healthScore: 68,
    health: "warning",
    teamMembers: ["SP", "JM"]
  }
];

export function ProjectSelectorPage() {
  return <ProjectSelectorLayout projects={projectMocks} />;
}
