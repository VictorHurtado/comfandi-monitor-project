import { render, screen } from "@testing-library/react";
import { ProjectSelectorPage } from "@/presentation/pages/ProjectSelectorPage";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        name: "Cuenta Keycloak",
        email: "keycloak.user@comfandi.com.co"
      }
    }
  })
}));

describe("ProjectSelectorPage", () => {
  it("renders selector shell with keycloak user, cards and mock list", () => {
    render(<ProjectSelectorPage />);

    expect(screen.getByText("Seleccionar Proyecto")).toBeInTheDocument();
    expect(screen.getByText("Comfandi TechHealth")).toBeInTheDocument();
    expect(screen.getByText("keycloak.user@comfandi.com.co")).toBeInTheDocument();
    expect(screen.getByText("Cuenta Keycloak")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre, ID o responsable de proyecto...")).toBeInTheDocument();
    expect(screen.getByText("PF Cartera")).toBeInTheDocument();
    expect(screen.getByText("Saludable (94%)")).toBeInTheDocument();
    expect(screen.getByText("Listado mock de proyectos")).toBeInTheDocument();
  });
});
