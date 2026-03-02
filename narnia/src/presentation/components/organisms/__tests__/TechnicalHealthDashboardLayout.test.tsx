import { render, screen } from "@testing-library/react";
import { TechnicalHealthDashboardLayout } from "@/presentation/components/organisms/TechnicalHealthDashboardLayout";

describe("TechnicalHealthDashboardLayout", () => {
  it("renders sidebar, header and dashboard content placeholders", () => {
    render(<TechnicalHealthDashboardLayout />);

    expect(screen.getByLabelText("Navegación principal")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar métrica")).toBeInTheDocument();
    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sentry")).toBeInTheDocument();
    expect(screen.getByText("Proteo")).toBeInTheDocument();
    expect(screen.getByText("Ver reporte detallado")).toBeInTheDocument();
  });
});
