import { render, screen, waitFor } from "@testing-library/react";
import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

const mockExecute = jest.fn().mockResolvedValue([
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
]);

jest.mock("@/infrastructure/ioc", () => ({
  container: {
    get: () => ({ execute: mockExecute })
  },
  USECASE_TYPES: {
    GetTechnicalIntegrationCardsUseCase: Symbol.for("GetTechnicalIntegrationCardsUseCase")
  }
}));

describe("HealthStatusPage", () => {
  it("renders technical dashboard shell sections", async () => {
    const ui = await HealthStatusPage();
    render(ui);

    expect(screen.getByText("Estado General: Proyecto Alfa")).toBeInTheDocument();
    expect(screen.getByText("Historial de Salud General")).toBeInTheDocument();
    expect(screen.getByText("Technical Health Score")).toBeInTheDocument();
    expect(screen.getByLabelText("Integraciones técnicas")).toBeInTheDocument();
    expect(screen.getByText("Alertas recientes")).toBeInTheDocument();
    expect(screen.getByText("Resumen de cumplimiento")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
    });
  });
});
