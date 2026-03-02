import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/presentation/components/molecules/ProjectCard";

describe("ProjectCard", () => {
  it("renders static project information", () => {
    render(
      <ProjectCard
        project={{
          id: "core-api-alpha",
          name: "Core API Alpha",
          description: "Microservicios de backend optimizados con latencia menor a 50ms.",
          updatedAtLabel: "hace 2h",
          area: "Backend",
          healthLabel: "Saludable",
          healthScore: 98,
          health: "healthy",
          teamMembers: ["AR", "LC"]
        }}
      />
    );

    expect(screen.getByText("Core API Alpha")).toBeInTheDocument();
    expect(screen.getByText("Saludable (98%)")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });
});
