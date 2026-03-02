import { render, screen } from "@testing-library/react";
import { IntegrationCardsGrid } from "@/presentation/components/organisms/IntegrationCardsGrid";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

const mockSonarWarning: IntegrationHealth = {
  provider: "sonar",
  status: "warning",
  message: "Quality gate: WARN. Cobertura por debajo del umbral.",
  checkedAt: "2026-01-01T00:00:00.000Z",
  sonarMetrics: {
    qualityGateStatus: "WARN",
    coverage: 72.5,
    bugs: 3,
    vulnerabilities: 1
  }
};

const mockSonarOk: IntegrationHealth = {
  provider: "sonar",
  status: "ok",
  message: "Quality gate: PASSED.",
  checkedAt: "2026-01-01T00:00:00.000Z",
  sonarMetrics: {
    qualityGateStatus: "OK",
    coverage: 85.0,
    bugs: 0,
    vulnerabilities: 0
  }
};

const mockSonarError: IntegrationHealth = {
  provider: "sonar",
  status: "error",
  message: "Quality gate: FAILED.",
  checkedAt: "2026-01-01T00:00:00.000Z",
  sonarMetrics: {
    qualityGateStatus: "ERROR",
    coverage: 40.0,
    bugs: 12,
    vulnerabilities: 5
  }
};

describe("IntegrationCardsGrid", () => {
  it("renders all 4 integration cards", () => {
    render(<IntegrationCardsGrid />);
    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sentry")).toBeInTheDocument();
    expect(screen.getByText("Proteo")).toBeInTheDocument();
  });

  it("shows 3 static cards with 'Sin métricas conectadas'", () => {
    render(<IntegrationCardsGrid />);
    expect(screen.getAllByText("Sin métricas conectadas")).toHaveLength(3);
  });

  it("shows loading skeleton for SonarQube when isLoading is true", () => {
    render(<IntegrationCardsGrid sonarIsLoading={true} />);
    expect(screen.getByText("Cargando")).toBeInTheDocument();
    expect(screen.queryByText("Quality Gate")).not.toBeInTheDocument();
  });

  it("shows fallback message when error is present", () => {
    render(
      <IntegrationCardsGrid
        sonarIsLoading={false}
        sonarError="No se pudo cargar los datos de SonarQube"
        sonarIntegration={null}
      />
    );
    expect(screen.getByText("No se pudo cargar los datos de SonarQube")).toBeInTheDocument();
  });

  it("shows unknown state when no sonar data and no error", () => {
    render(<IntegrationCardsGrid sonarIntegration={null} sonarIsLoading={false} sonarError={null} />);
    expect(screen.getByText("Sin datos disponibles")).toBeInTheDocument();
  });

  it("renders SonarQube metrics when sonarIntegration is provided with WARN status", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarWarning} />);
    expect(screen.getByText("Quality Gate")).toBeInTheDocument();
    expect(screen.getByText("WARN")).toBeInTheDocument();
    expect(screen.getByText("72.5%")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders SonarQube metrics with OK status showing PASSED", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarOk} />);
    expect(screen.getByText("PASSED")).toBeInTheDocument();
    expect(screen.getByText("85.0%")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("renders SonarQube metrics with ERROR status showing FAILED", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarError} />);
    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.getByText("40.0%")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows 'Saludable' badge for ok status", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarOk} />);
    expect(screen.getByText("Saludable")).toBeInTheDocument();
  });

  it("shows 'Atención' badge for warning status", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarWarning} />);
    expect(screen.getByText("Atención")).toBeInTheDocument();
  });

  it("shows 'Crítico' badge for error status", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarError} />);
    expect(screen.getByText("Crítico")).toBeInTheDocument();
  });

  it("shows 'Desconocido' badge when no sonar data", () => {
    render(<IntegrationCardsGrid sonarIntegration={null} sonarIsLoading={false} />);
    expect(screen.getByText("Desconocido")).toBeInTheDocument();
  });

  it("shows message text when metrics are displayed", () => {
    render(<IntegrationCardsGrid sonarIntegration={mockSonarWarning} />);
    expect(screen.getByText("Quality gate: WARN. Cobertura por debajo del umbral.")).toBeInTheDocument();
  });
});
