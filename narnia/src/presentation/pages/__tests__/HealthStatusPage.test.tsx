import { render, screen, waitFor } from "@testing-library/react";
import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

const mockExecute = jest.fn().mockResolvedValue({
  projectName: "Proyecto Alfa",
  status: "ok",
  metrics: {
    qualityGateStatus: "passed",
    coverage: 82.4,
    bugs: 12,
    vulnerabilities: 0
  },
  lastCheckedAt: "2026-01-01T00:00:00.000Z"
});

jest.mock("@/infrastructure/ioc", () => ({
  container: {
    get: () => ({ execute: mockExecute })
  },
  USECASE_TYPES: {
    GetSonarQubeMetricsUseCase: Symbol.for("GetSonarQubeMetricsUseCase")
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
