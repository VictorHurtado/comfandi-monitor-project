import type { IntegrationProvider } from "@/domain/models/PlatformHealthStatus";
import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";
import type { ITechnicalIntegrationRepository } from "@/domain/repositories/ITechnicalIntegrationRepository";

const PROJECT_NAME = "Proyecto Alfa";

const DEFAULT_MOCK_CARDS: readonly TechnicalIntegrationCard[] = [
  {
    provider: "sonar",
    providerLabel: "SonarQube",
    projectName: PROJECT_NAME,
    status: "healthy",
    summary: "Análisis mock disponible para revisión rápida.",
    sonarMetrics: {
      qualityGateStatus: "PASSED",
      coverage: 82.4,
      bugs: 12,
      vulnerabilities: 0
    }
  },
  {
    provider: "github",
    providerLabel: "GitHub",
    projectName: PROJECT_NAME,
    status: "warning",
    summary: "PRs pendientes de revisión en el último ciclo."
  },
  {
    provider: "sentry",
    providerLabel: "Sentry",
    projectName: PROJECT_NAME,
    status: "critical",
    summary: "Incidencias críticas activas en monitoreo."
  },
  {
    provider: "proteo",
    providerLabel: "Proteo",
    projectName: PROJECT_NAME,
    status: "unknown",
    summary: "Integración aún sin datos reales conectados."
  }
];

export class TechnicalIntegrationRepository
  implements ITechnicalIntegrationRepository
{
  constructor(
    private readonly mockCards: readonly TechnicalIntegrationCard[] = DEFAULT_MOCK_CARDS
  ) {}

  async getTechnicalIntegrationCards(): Promise<TechnicalIntegrationCard[]> {
    const cardsByProvider = new Map<IntegrationProvider, TechnicalIntegrationCard>(
      this.mockCards.map((card) => [card.provider, card] as const)
    );

    return [
      this.resolveSonarCard(cardsByProvider.get("sonar")),
      this.resolveCard("github", "GitHub", cardsByProvider.get("github")),
      this.resolveCard("sentry", "Sentry", cardsByProvider.get("sentry")),
      this.resolveCard("proteo", "Proteo", cardsByProvider.get("proteo"))
    ];
  }

  private resolveSonarCard(
    sonarCard: TechnicalIntegrationCard | undefined
  ): TechnicalIntegrationCard {
    if (!sonarCard?.sonarMetrics) {
      return this.buildUnknownCard(
        "sonar",
        "SonarQube",
        "Sin métricas mock disponibles por ahora."
      );
    }

    return sonarCard;
  }

  private resolveCard(
    provider: IntegrationProvider,
    providerLabel: string,
    card: TechnicalIntegrationCard | undefined
  ): TechnicalIntegrationCard {
    if (card) {
      return card;
    }

    return this.buildUnknownCard(
      provider,
      providerLabel,
      `Sin datos mock de ${providerLabel} por ahora.`
    );
  }

  private buildUnknownCard(
    provider: IntegrationProvider,
    providerLabel: string,
    summary: string
  ): TechnicalIntegrationCard {
    return {
      provider,
      providerLabel,
      projectName: PROJECT_NAME,
      status: "unknown",
      summary
    };
  }
}
