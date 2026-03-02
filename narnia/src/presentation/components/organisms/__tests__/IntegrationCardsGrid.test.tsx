import { render, screen } from "@testing-library/react";
import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";
import { IntegrationCardsGrid } from "@/presentation/components/organisms/IntegrationCardsGrid";

const fullCardsMock: TechnicalIntegrationCard[] = [
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

describe("IntegrationCardsGrid", () => {
  it("renders sonar metrics in a legible format", () => {
    render(<IntegrationCardsGrid integrationCards={fullCardsMock} />);

    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("Quality Gate")).toBeInTheDocument();
    expect(screen.getByText("PASSED")).toBeInTheDocument();
    expect(screen.getByText("82.4%")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows visual states for healthy, warning, critical and unknown", () => {
    render(<IntegrationCardsGrid integrationCards={fullCardsMock} />);

    expect(screen.getByLabelText("Estado SonarQube: healthy")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado GitHub: warning")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado Sentry: critical")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado Proteo: unknown")).toBeInTheDocument();
  });

  it("renders unknown fallback message when sonar data is missing", () => {
    const unknownSonarMock: TechnicalIntegrationCard[] = [
      {
        provider: "sonar",
        providerLabel: "SonarQube",
        projectName: "Proyecto Alfa",
        status: "unknown",
        summary: "Sin métricas mock disponibles por ahora."
      }
    ];

    render(<IntegrationCardsGrid integrationCards={unknownSonarMock} />);

    expect(screen.getByText("Sin métricas mock disponibles por ahora.")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado SonarQube: unknown")).toBeInTheDocument();
  });
});
