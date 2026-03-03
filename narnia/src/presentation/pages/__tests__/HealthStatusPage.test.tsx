import { render, screen } from "@testing-library/react";
import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

describe("HealthStatusPage", () => {
  it("renders technical dashboard shell sections", async () => {
    const ui = await HealthStatusPage({
      projectId: "afiliaciones",
      projectName: "Proyecto Afiliaciones",
      sonarStatus: {
        qualityGate: "passed",
        projectKey: "monitor_afiliaciones",
        projectSlug: "afiliaciones",
        message: "Quality Gate passed",
        checkedAt: "2026-01-01T00:00:00.000Z"
      }
    });
    render(ui);

    expect(screen.getByText("Estado General: Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("Historial de Salud General")).toBeInTheDocument();
    expect(screen.getByText("Technical Health Score")).toBeInTheDocument();
    expect(screen.getByLabelText("Integraciones técnicas")).toBeInTheDocument();
    expect(screen.getByText(/SonarQube/i)).toBeInTheDocument();
    expect(screen.getByText("Alertas recientes")).toBeInTheDocument();
    expect(screen.getByText("Resumen de cumplimiento")).toBeInTheDocument();
  });
});
