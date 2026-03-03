import { render, screen } from "@testing-library/react";
import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null })
}));

describe("HealthStatusPage", () => {
  it("renders technical dashboard shell sections", async () => {
    const ui = await HealthStatusPage({ projectId: "afiliaciones", projectName: "Proyecto Afiliaciones" });
    render(ui);

    expect(screen.getByText("Estado General: Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("Historial de Salud General")).toBeInTheDocument();
    expect(screen.getByText("Technical Health Score")).toBeInTheDocument();
    expect(screen.getByLabelText("Integraciones técnicas")).toBeInTheDocument();
    expect(screen.getByText("Alertas recientes")).toBeInTheDocument();
    expect(screen.getByText("Resumen de cumplimiento")).toBeInTheDocument();
  });
});
