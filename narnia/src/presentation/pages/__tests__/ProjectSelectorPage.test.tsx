import { render, screen } from "@testing-library/react";
import { ProjectSelectorPage } from "@/presentation/pages/ProjectSelectorPage";

describe("ProjectSelectorPage", () => {
  it("renders selector shell with comfandi branding and mock list", () => {
    render(<ProjectSelectorPage />);

    expect(screen.getByText("Seleccionar Proyecto")).toBeInTheDocument();
    expect(screen.getByText("Comfandi TechHealth")).toBeInTheDocument();
    expect(screen.getByText("Cuenta Keycloak")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre, ID o responsable de proyecto...")).toBeInTheDocument();
    expect(screen.getByText("PF Cartera")).toBeInTheDocument();
    expect(screen.getByText("Listado mock de proyectos")).toBeInTheDocument();
  });
});
