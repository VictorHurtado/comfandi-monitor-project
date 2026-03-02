import { fireEvent, render, screen } from "@testing-library/react";
import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

jest.mock("@/presentation/hooks/useSonarCard", () => ({
  useSonarCard: jest.fn()
}));

const { useSonarCard } = jest.requireMock("@/presentation/hooks/useSonarCard") as {
  useSonarCard: jest.MockedFunction<() => { sonarData: IntegrationHealth | null; isLoading: boolean; error: string | null }>;
};

const mockSonarData: IntegrationHealth = {
  provider: "sonar",
  status: "warning",
  message: "Quality gate: WARN.",
  checkedAt: "2026-01-01T00:00:00.000Z",
  sonarMetrics: {
    qualityGateStatus: "WARN",
    coverage: 72.5,
    bugs: 3,
    vulnerabilities: 1
  }
};

describe("TechnicalHealthDashboardLayout", () => {
  beforeEach(() => {
    useSonarCard.mockReturnValue({ sonarData: null, isLoading: false, error: null });
  });

  it("renders all integration provider cards", () => {
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar métrica")).toBeInTheDocument();
    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sentry")).toBeInTheDocument();
    expect(screen.getByText("Proteo")).toBeInTheDocument();
  });

  it("renders 3 static cards with 'Sin métricas conectadas'", () => {
    render(<TechnicalHealthDashboardLayout />);
    expect(screen.getAllByText("Sin métricas conectadas")).toHaveLength(3);
    expect(screen.getByText("Sin alertas integradas")).toBeInTheDocument();
  });

  it("shows SonarQube metrics when hook returns data", () => {
    useSonarCard.mockReturnValue({ sonarData: mockSonarData, isLoading: false, error: null });
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByText("Quality Gate")).toBeInTheDocument();
    expect(screen.getByText("WARN")).toBeInTheDocument();
    expect(screen.getByText("72.5%")).toBeInTheDocument();
    expect(screen.getByText("Atención")).toBeInTheDocument();
  });

  it("shows loading state for SonarQube when hook is loading", () => {
    useSonarCard.mockReturnValue({ sonarData: null, isLoading: true, error: null });
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByText("Cargando")).toBeInTheDocument();
  });

  it("shows error fallback when hook returns error", () => {
    useSonarCard.mockReturnValue({
      sonarData: null,
      isLoading: false,
      error: "No se pudo cargar los datos de SonarQube"
    });
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByText("No se pudo cargar los datos de SonarQube")).toBeInTheDocument();
  });

  it("renders collapsible sidebar", () => {
    render(<TechnicalHealthDashboardLayout />);

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
});
