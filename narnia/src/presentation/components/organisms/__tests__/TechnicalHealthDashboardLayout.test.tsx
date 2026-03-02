import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";
import type { SonarQubeHealthData } from "@/domain/models/SonarQubeMetrics";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

const MOCK_SONAR_DATA: SonarQubeHealthData = {
  projectName: "Proyecto Alfa",
  status: "ok",
  metrics: {
    qualityGateStatus: "passed",
    coverage: 82.4,
    bugs: 12,
    vulnerabilities: 0
  },
  lastCheckedAt: "2026-01-01T00:00:00.000Z"
};

const mockExecute = jest.fn().mockResolvedValue(MOCK_SONAR_DATA);

jest.mock("@/infrastructure/ioc", () => ({
  container: {
    get: () => ({ execute: mockExecute })
  },
  USECASE_TYPES: {
    GetSonarQubeMetricsUseCase: Symbol.for("GetSonarQubeMetricsUseCase")
  }
}));

describe("TechnicalHealthDashboardLayout", () => {
  it("renders integration sections with SonarQube card and collapsible sidebar", async () => {
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar métrica")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("SonarQube")).toBeInTheDocument();
    });

    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sentry")).toBeInTheDocument();
    expect(screen.getByText("Proteo")).toBeInTheDocument();
    expect(screen.getAllByText("Sin métricas conectadas")).toHaveLength(3);
    expect(screen.getByText("Sin alertas integradas")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Colapsar sidebar"));

    expect(screen.getByLabelText("Expandir sidebar")).toBeInTheDocument();
  });

  it("keeps only available navigation enabled", () => {
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard/technical-health");
    expect(screen.getByRole("link", { name: /proyectos/i })).toHaveAttribute("href", "/project-selector");
    expect(screen.getByRole("button", { name: /alertas/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /configuración/i })).toBeDisabled();
  });

  it("renders SonarQube mock metrics in the dashboard", async () => {
    render(<TechnicalHealthDashboardLayout />);

    await waitFor(() => {
      expect(screen.getByText("PASSED")).toBeInTheDocument();
    });

    expect(screen.getByText("82.4%")).toBeInTheDocument();
    expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
  });
});
