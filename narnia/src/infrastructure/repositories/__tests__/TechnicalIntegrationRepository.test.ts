import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";
import { TechnicalIntegrationRepository } from "@/infrastructure/repositories/TechnicalIntegrationRepository";

describe("TechnicalIntegrationRepository", () => {
  it("returns sonar mock metrics in dashboard card format", async () => {
    const repository = new TechnicalIntegrationRepository();

    const result = await repository.getTechnicalIntegrationCards();
    const sonarCard = result.find((card) => card.provider === "sonar");

    expect(result).toHaveLength(4);
    expect(sonarCard).toBeDefined();
    expect(sonarCard?.projectName).toBe("Proyecto Alfa");
    expect(sonarCard?.status).toBe("healthy");
    expect(sonarCard?.sonarMetrics).toMatchObject({
      qualityGateStatus: "PASSED",
      coverage: 82.4,
      bugs: 12,
      vulnerabilities: 0
    });
  });

  it("returns unknown sonar card when sonar metrics are unavailable", async () => {
    const incompleteCards: TechnicalIntegrationCard[] = [
      {
        provider: "sonar",
        providerLabel: "SonarQube",
        projectName: "Proyecto Alfa",
        status: "healthy",
        summary: "Sin métricas en payload"
      }
    ];

    const repository = new TechnicalIntegrationRepository(incompleteCards);
    const result = await repository.getTechnicalIntegrationCards();
    const sonarCard = result.find((card) => card.provider === "sonar");

    expect(sonarCard?.status).toBe("unknown");
    expect(sonarCard?.summary).toContain("Sin métricas");
    expect(sonarCard?.sonarMetrics).toBeUndefined();
  });

  it("creates fallback cards for providers without mock data", async () => {
    const onlySonar: TechnicalIntegrationCard[] = [
      {
        provider: "sonar",
        providerLabel: "SonarQube",
        projectName: "Proyecto Alfa",
        status: "healthy",
        summary: "Mock Sonar",
        sonarMetrics: {
          qualityGateStatus: "PASSED",
          coverage: 80,
          bugs: 1,
          vulnerabilities: 0
        }
      }
    ];

    const repository = new TechnicalIntegrationRepository(onlySonar);
    const result = await repository.getTechnicalIntegrationCards();

    expect(result.find((card) => card.provider === "github")?.status).toBe("unknown");
    expect(result.find((card) => card.provider === "sentry")?.status).toBe("unknown");
    expect(result.find((card) => card.provider === "proteo")?.status).toBe("unknown");
  });
});
