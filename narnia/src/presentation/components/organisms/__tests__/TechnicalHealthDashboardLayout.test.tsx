import { fireEvent, render, screen } from "@testing-library/react";
import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";
import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

const integrationCardsMock: TechnicalIntegrationCard[] = [
  {
    provider: "sonar",
    providerLabel: "SonarQube",
    projectName: "Proyecto Alfa",
    status: "healthy",
    summary: "Análisis mock disponible para revisión rápida.",
    sonarMetrics: {
      qualityGateStatus: "PASSED",
      coverage: 82.4,
      bugs: 12,
      vulnerabilities: 0
    }
  },
  {
    provider: "github",
    providerLabel: "GitHub",
    projectName: "Proyecto Alfa",
    status: "warning",
    summary: "PRs pendientes de revisión en el último ciclo."
  },
  {
    provider: "sentry",
    providerLabel: "Sentry",
    projectName: "Proyecto Alfa",
    status: "critical",
    summary: "Incidencias críticas activas en monitoreo."
  },
  {
    provider: "proteo",
    providerLabel: "Proteo",
    projectName: "Proyecto Alfa",
    status: "unknown",
    summary: "Integración aún sin datos reales conectados."
  }
];

describe("TechnicalHealthDashboardLayout", () => {
  it("renders integration cards with sonar metrics and collapsible sidebar", () => {
    render(<TechnicalHealthDashboardLayout integrationCards={integrationCardsMock} />);

    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar métrica")).toBeInTheDocument();
    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sentry")).toBeInTheDocument();
    expect(screen.getByText("Proteo")).toBeInTheDocument();
    expect(screen.getAllByText("Proyecto: Proyecto Alfa")).toHaveLength(4);
    expect(screen.getByText("PASSED")).toBeInTheDocument();
    expect(screen.getByText("82.4%")).toBeInTheDocument();
    expect(screen.getByText("Integración aún sin datos reales conectados.")).toBeInTheDocument();
    expect(screen.getByText("Sin alertas integradas")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Colapsar sidebar"));

    expect(screen.getByLabelText("Expandir sidebar")).toBeInTheDocument();
  });

  it("keeps only available navigation enabled", () => {
    render(<TechnicalHealthDashboardLayout integrationCards={integrationCardsMock} />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard/technical-health");
    expect(screen.getByRole("link", { name: /proyectos/i })).toHaveAttribute("href", "/project-selector");
    expect(screen.getByRole("button", { name: /alertas/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /configuración/i })).toBeDisabled();
  });

  it("renders SonarQube card test id in the dashboard", () => {
    render(<TechnicalHealthDashboardLayout integrationCards={integrationCardsMock} />);

    expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
  });
});
