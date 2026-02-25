import { render, screen } from "@testing-library/react";
import { ProjectSelectorPage } from "@/presentation/pages/ProjectSelectorPage";

describe("ProjectSelectorPage", () => {
  it("renders selector shell with filters and project cards", () => {
    render(<ProjectSelectorPage />);

    expect(screen.getByText("Seleccionar Proyecto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre, ID o responsable...")).toBeInTheDocument();
    expect(screen.getByText("Core API Alpha")).toBeInTheDocument();
    expect(screen.getByText("Legacy Gamma")).toBeInTheDocument();
    expect(screen.getByText("Nuevo Proyecto")).toBeInTheDocument();
  });
});
