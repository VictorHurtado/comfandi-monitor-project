import { render, screen } from "@testing-library/react";
import {
  SonarIntegrationCard,
  SonarIntegrationCardLoading
} from "@/presentation/components/organisms/SonarIntegrationCard";

describe("SonarIntegrationCard", () => {
  it("renders project data and passed quality gate", () => {
    render(
      <SonarIntegrationCard
        projectName="Proyecto Afiliaciones"
        sonarStatus={{
          qualityGate: "passed",
          projectKey: "monitor_afiliaciones",
          projectSlug: "afiliaciones",
          coverage: 82.5,
          bugs: 3,
          vulnerabilities: 1,
          message: "Quality Gate passed",
          checkedAt: "2026-01-01T00:00:00.000Z"
        }}
      />
    );

    expect(screen.getByText("SonarQube - Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("Quality Gate passed")).toBeInTheDocument();
    expect(screen.getByText("monitor_afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("82.5 %")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("passed")).toHaveLength(2);
  });

  it("renders unknown state with fallback project key label", () => {
    render(
      <SonarIntegrationCard
        projectName="Proyecto Afiliaciones"
        sonarStatus={{
          qualityGate: "unknown",
          projectKey: "",
          projectSlug: "afiliaciones",
          coverage: undefined,
          bugs: undefined,
          vulnerabilities: undefined,
          message: "Sonar no disponible para este proyecto",
          checkedAt: "2026-01-01T00:00:00.000Z"
        }}
      />
    );

    expect(screen.getAllByText("unknown")).toHaveLength(2);
    expect(screen.getAllByText("sin dato")).toHaveLength(3);
    expect(screen.getByText("sin configurar")).toBeInTheDocument();
  });

  it("renders loading card content", () => {
    render(<SonarIntegrationCardLoading projectName="Proyecto Afiliaciones" />);

    expect(screen.getByText("Cargando datos de Sonar...")).toBeInTheDocument();
    expect(screen.getByText("SonarQube - Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("cargando")).toBeInTheDocument();
  });
});
