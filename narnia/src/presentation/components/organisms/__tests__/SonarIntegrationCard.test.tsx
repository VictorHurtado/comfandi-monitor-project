import { render, screen } from "@testing-library/react";
import { SonarIntegrationCard } from "@/presentation/components/organisms/SonarIntegrationCard";

describe("SonarIntegrationCard", () => {
  it("renders project data and passed quality gate", () => {
    render(
      <SonarIntegrationCard
        projectName="Proyecto Afiliaciones"
        sonarStatus={{
          qualityGate: "passed",
          projectKey: "monitor_afiliaciones",
          projectSlug: "afiliaciones",
          message: "Quality Gate passed",
          checkedAt: "2026-01-01T00:00:00.000Z"
        }}
      />
    );

    expect(screen.getByText("SonarQube - Proyecto Afiliaciones")).toBeInTheDocument();
    expect(screen.getByText("Quality Gate passed")).toBeInTheDocument();
    expect(screen.getByText("monitor_afiliaciones")).toBeInTheDocument();
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
          message: "Sonar no disponible para este proyecto",
          checkedAt: "2026-01-01T00:00:00.000Z"
        }}
      />
    );

    expect(screen.getAllByText("unknown")).toHaveLength(2);
    expect(screen.getByText("sin configurar")).toBeInTheDocument();
  });
});
