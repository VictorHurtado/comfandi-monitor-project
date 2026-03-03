import { render, screen } from "@testing-library/react";
import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

describe("HealthStatusPage", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("renders technical dashboard shell sections", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        qualityGate: "passed",
        projectKey: "monitor_afiliaciones",
        projectSlug: "afiliaciones",
        coverage: 88.5,
        bugs: 1,
        vulnerabilities: 0,
        message: "Quality Gate passed",
        checkedAt: "2026-01-01T00:00:00.000Z"
      })
    }) as unknown as typeof fetch;

    const ui = await HealthStatusPage({
      projectId: "afiliaciones",
      projectName: "Proyecto Afiliaciones",
      sonarStatus: {
        qualityGate: "passed",
        projectKey: "monitor_afiliaciones",
        projectSlug: "afiliaciones",
        coverage: 88.5,
        bugs: 1,
        vulnerabilities: 0,
        message: "Quality Gate passed",
        checkedAt: "2026-01-01T00:00:00.000Z"
      }
    });
    render(ui);

    expect(screen.getByText("Estado General: Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("Historial de Salud General")).toBeInTheDocument();
    expect(screen.getByText("Technical Health Score")).toBeInTheDocument();
    expect(screen.getByLabelText("Integraciones técnicas")).toBeInTheDocument();
    expect(await screen.findByText(/SonarQube/i)).toBeInTheDocument();
    expect(await screen.findByText("88.5 %")).toBeInTheDocument();
    expect(screen.getByText("Alertas recientes")).toBeInTheDocument();
    expect(screen.getByText("Resumen de cumplimiento")).toBeInTheDocument();
  });
});
