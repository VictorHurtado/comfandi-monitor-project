import { act, render, screen, waitFor } from "@testing-library/react";
import { SonarIntegrationCard } from "@/presentation/components/molecules/SonarIntegrationCard";
import { container } from "@/infrastructure/ioc";

const mockExecute = jest.fn();

jest.mock("@/infrastructure/ioc", () => ({
  container: { get: jest.fn() },
  USECASE_TYPES: { GetSonarIntegrationStatusUseCase: Symbol.for("GetSonarIntegrationStatusUseCase") }
}));

beforeEach(() => {
  jest.clearAllMocks();
  (container.get as jest.Mock).mockReturnValue({ execute: mockExecute });
});

describe("SonarIntegrationCard", () => {
  it("renders loading state initially", () => {
    mockExecute.mockImplementation(() => new Promise(() => {}));
    render(<SonarIntegrationCard />);

    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("Cargando métricas…")).toBeInTheDocument();
  });

  it("renders metrics when data is loaded", async () => {
    mockExecute.mockResolvedValue({
      status: "healthy",
      qualityGateStatus: "PASSED",
      coverage: 82.4,
      bugs: 12,
      vulnerabilities: 0,
      projectName: "Proyecto Alfa"
    });

    render(<SonarIntegrationCard />);

    await waitFor(
      () => {
        expect(screen.getByText("Proyecto Alfa")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(screen.getByText("PASSED")).toBeInTheDocument();
    expect(screen.getByText("82.4%")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("renders unknown state when load fails", async () => {
    mockExecute.mockRejectedValue(new Error("fail"));

    render(<SonarIntegrationCard />);

    await waitFor(() => {
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
    expect(
      screen.getByText(/No hay datos disponibles/)
    ).toBeInTheDocument();
  });

  it("renders warning status correctly", async () => {
    mockExecute.mockResolvedValue({
      status: "warning",
      qualityGateStatus: "FAILED",
      coverage: 65,
      bugs: 25,
      vulnerabilities: 2,
      projectName: "Proyecto Beta"
    });

    render(<SonarIntegrationCard />);

    await waitFor(() => {
      expect(screen.getByText("Warning")).toBeInTheDocument();
    });
    expect(screen.getByText("Proyecto Beta")).toBeInTheDocument();
    expect(screen.getByText("FAILED")).toBeInTheDocument();
  });
});
