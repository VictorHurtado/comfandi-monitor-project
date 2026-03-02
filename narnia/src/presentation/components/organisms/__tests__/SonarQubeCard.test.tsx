import { render, screen, waitFor } from "@testing-library/react";
import { SonarQubeCard } from "@/presentation/components/organisms/SonarQubeCard";
import type { SonarQubeHealthData } from "@/domain/models/SonarQubeMetrics";

const MOCK_HEALTH_DATA: SonarQubeHealthData = {
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

const MOCK_WARNING_DATA: SonarQubeHealthData = {
  projectName: "Proyecto Beta",
  status: "warning",
  metrics: {
    qualityGateStatus: "failed",
    coverage: 45.0,
    bugs: 28,
    vulnerabilities: 5
  },
  lastCheckedAt: "2026-01-01T00:00:00.000Z"
};

const MOCK_NULL_METRICS: SonarQubeHealthData = {
  projectName: "Proyecto Gamma",
  status: "unknown",
  metrics: null,
  lastCheckedAt: "2026-01-01T00:00:00.000Z"
};

const mockExecute = jest.fn();

jest.mock("@/infrastructure/ioc", () => ({
  container: {
    get: () => ({ execute: mockExecute })
  },
  USECASE_TYPES: {
    GetSonarQubeMetricsUseCase: Symbol.for("GetSonarQubeMetricsUseCase")
  }
}));

describe("SonarQubeCard", () => {
  beforeEach(() => {
    mockExecute.mockReset();
  });

  it("shows skeleton while loading", () => {
    mockExecute.mockReturnValue(new Promise(() => {}));
    render(<SonarQubeCard />);

    expect(screen.getByTestId("sonarqube-card-skeleton")).toBeInTheDocument();
  });

  it("renders healthy state with metrics", async () => {
    mockExecute.mockResolvedValue(MOCK_HEALTH_DATA);
    render(<SonarQubeCard />);

    await waitFor(() => {
      expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
    });

    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("healthy")).toBeInTheDocument();
    expect(screen.getByText("Proyecto Alfa")).toBeInTheDocument();
    expect(screen.getByText("PASSED")).toBeInTheDocument();
    expect(screen.getByText("82.4%")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders warning state with failed quality gate", async () => {
    mockExecute.mockResolvedValue(MOCK_WARNING_DATA);
    render(<SonarQubeCard />);

    await waitFor(() => {
      expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
    });

    expect(screen.getByText("warning")).toBeInTheDocument();
    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders unknown state when metrics are null", async () => {
    mockExecute.mockResolvedValue(MOCK_NULL_METRICS);
    render(<SonarQubeCard />);

    await waitFor(() => {
      expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
    });

    expect(screen.getByText("unknown")).toBeInTheDocument();
    expect(screen.getByText("Sin métricas disponibles")).toBeInTheDocument();
  });

  it("renders unknown card when use case throws error", async () => {
    mockExecute.mockRejectedValue(new Error("network error"));
    render(<SonarQubeCard />);

    await waitFor(() => {
      expect(screen.getByTestId("sonarqube-card-unknown")).toBeInTheDocument();
    });

    expect(screen.getByText("No se pudo obtener información de SonarQube")).toBeInTheDocument();
  });

  it("displays all four metric labels", async () => {
    mockExecute.mockResolvedValue(MOCK_HEALTH_DATA);
    render(<SonarQubeCard />);

    await waitFor(() => {
      expect(screen.getByTestId("sonarqube-card")).toBeInTheDocument();
    });

    expect(screen.getByText("Quality Gate")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText("Vulnerabilities")).toBeInTheDocument();
  });
});
