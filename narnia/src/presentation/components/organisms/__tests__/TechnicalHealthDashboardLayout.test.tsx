import { fireEvent, render, screen } from "@testing-library/react";
import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

describe("TechnicalHealthDashboardLayout", () => {
  it("renders empty integration-ready sections and collapsible sidebar", () => {
    render(<TechnicalHealthDashboardLayout projectId="afiliaciones" projectName="Proyecto Afiliaciones" />);

    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar métrica")).toBeInTheDocument();
    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Jira")).toBeInTheDocument();
    expect(screen.getByText("Proteo")).toBeInTheDocument();
    expect(screen.getAllByText("Sin métricas conectadas")).toHaveLength(3);
    expect(screen.getByText("Sin alertas integradas")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Colapsar sidebar"));

    expect(screen.getByLabelText("Expandir sidebar")).toBeInTheDocument();
  });

  it("keeps only available navigation enabled", () => {
    render(<TechnicalHealthDashboardLayout projectId="afiliaciones" projectName="Proyecto Afiliaciones" />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard/technical-health/afiliaciones");
    expect(screen.getByRole("link", { name: /proyectos/i })).toHaveAttribute("href", "/project-selector");
    expect(screen.getByRole("button", { name: /alertas/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /configuración/i })).toBeDisabled();
  });
});
