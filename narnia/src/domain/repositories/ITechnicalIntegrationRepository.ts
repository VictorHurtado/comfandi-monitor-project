import type { TechnicalIntegrationCard } from "@/domain/models/TechnicalIntegrationCard";

export interface ITechnicalIntegrationRepository {
  getTechnicalIntegrationCards(): Promise<TechnicalIntegrationCard[]>;
}
