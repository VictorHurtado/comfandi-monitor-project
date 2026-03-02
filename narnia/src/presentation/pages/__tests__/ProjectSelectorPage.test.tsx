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
  it("renders selector shell with user context and afiliaciones project", () => {
    render(<ProjectSelectorPage />);

    expect(screen.getByText("Seleccionar Proyecto")).toBeInTheDocument();
    expect(screen.getByText("Comfandi TechHealth")).toBeInTheDocument();
    expect(screen.getByText("keycloak.user@comfandi.com.co")).toBeInTheDocument();
    expect(screen.getByText("Cuenta plataforma")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre, ID o responsable de proyecto...")).toBeInTheDocument();
    expect(screen.getAllByText("Afiliaciones").length).toBeGreaterThan(0);
    expect(screen.getByText("Saludable (96%)")).toBeInTheDocument();
    expect(screen.getByLabelText("Abrir dashboard de Afiliaciones")).toHaveAttribute(
      "href",
      "/dashboard/technical-health"
    );
    expect(screen.getByText("Agregar nuevo proyecto")).toBeInTheDocument();
  });
});
