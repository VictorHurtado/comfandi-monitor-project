import { render, screen, waitFor } from "@testing-library/react";
import type { JiraProjectMetrics } from "@/domain/models/JiraProjectMetrics";
import { GetJiraMetricsByProjectUseCase } from "@/domain/usecases/GetJiraMetricsByProjectUseCase";
import { JiraIntegrationCard } from "@/presentation/components/organisms/JiraIntegrationCard";

const createUseCaseMock = () =>
  ({
    execute: jest.fn()
  }) as unknown as GetJiraMetricsByProjectUseCase;

const stableMetrics: JiraProjectMetrics = {
  projectId: "afiliaciones",
  status: "ok",
  message: "Sincronizado con Jira",
  checkedAt: "2026-01-01T00:00:00.000Z",
  openIssues: 4,
  blockedIssues: 0,
  closedIssuesLast7Days: 11,
  avgInProgressHours: 16,
  riskLevel: "low"
};

describe("JiraIntegrationCard", () => {
  it("renders jira metrics for a stable project", async () => {
    const useCase = createUseCaseMock();
    jest.spyOn(useCase, "execute").mockResolvedValue(stableMetrics);

    render(
      <JiraIntegrationCard
        projectId="afiliaciones"
        projectName="Proyecto Afiliaciones"
        getJiraMetricsByProjectUseCase={useCase}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Sincronizado con Jira")).toBeInTheDocument();
    });

    expect(screen.getByText("Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("Issues abiertas")).toBeInTheDocument();
    expect(screen.getByText("16 h")).toBeInTheDocument();
    expect(screen.getByText("Riesgo bajo")).toBeInTheDocument();
  });

  it("shows high-risk context when blocked issues are critical", async () => {
    const useCase = createUseCaseMock();
    jest.spyOn(useCase, "execute").mockResolvedValue({
      ...stableMetrics,
      blockedIssues: 6,
      openIssues: 24,
      avgInProgressHours: 80,
      riskLevel: "high"
    });

    render(
      <JiraIntegrationCard
        projectId="afiliaciones"
        projectName="Proyecto Afiliaciones"
        getJiraMetricsByProjectUseCase={useCase}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Riesgo alto")).toBeInTheDocument();
    });
  });

  it("renders unknown state with friendly message when jira is unavailable", async () => {
    const useCase = createUseCaseMock();
    jest.spyOn(useCase, "execute").mockResolvedValue({
      ...stableMetrics,
      status: "unknown",
      message: "No disponible temporalmente",
      openIssues: 0,
      blockedIssues: 0,
      closedIssuesLast7Days: 0,
      avgInProgressHours: 0
    });

    render(
      <JiraIntegrationCard
        projectId="afiliaciones"
        projectName="Proyecto Afiliaciones"
        getJiraMetricsByProjectUseCase={useCase}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("No disponible temporalmente")).toBeInTheDocument();
    });

    expect(screen.getAllByText("--")).toHaveLength(4);
  });

  it("loads data again when selected project changes", async () => {
    const useCase = createUseCaseMock();
    const executeSpy = jest.spyOn(useCase, "execute");
    executeSpy.mockResolvedValueOnce(stableMetrics);
    executeSpy.mockResolvedValueOnce({
      ...stableMetrics,
      projectId: "facturacion",
      openIssues: 9,
      blockedIssues: 2,
      closedIssuesLast7Days: 5,
      avgInProgressHours: 22,
      riskLevel: "medium"
    });

    const { rerender } = render(
      <JiraIntegrationCard
        projectId="afiliaciones"
        projectName="Proyecto Afiliaciones"
        getJiraMetricsByProjectUseCase={useCase}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("16 h")).toBeInTheDocument();
    });

    rerender(
      <JiraIntegrationCard
        projectId="facturacion"
        projectName="Proyecto Facturacion"
        getJiraMetricsByProjectUseCase={useCase}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("22 h")).toBeInTheDocument();
    });

    expect(executeSpy).toHaveBeenNthCalledWith(1, "afiliaciones");
    expect(executeSpy).toHaveBeenNthCalledWith(2, "facturacion");
  });

  it("shows loading feedback while jira metrics are being resolved", async () => {
    const useCase = createUseCaseMock();
    const executeSpy = jest.spyOn(useCase, "execute");

    let resolvePromise: ((value: JiraProjectMetrics) => void) | undefined;
    executeSpy.mockReturnValue(
      new Promise<JiraProjectMetrics>((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(
      <JiraIntegrationCard
        projectId="afiliaciones"
        projectName="Proyecto Afiliaciones"
        getJiraMetricsByProjectUseCase={useCase}
      />
    );

    expect(screen.getByText("Cargando métricas de Jira...")).toBeInTheDocument();

    resolvePromise?.(stableMetrics);

    await waitFor(() => {
      expect(screen.getByText("Sincronizado con Jira")).toBeInTheDocument();
    });
  });
});
