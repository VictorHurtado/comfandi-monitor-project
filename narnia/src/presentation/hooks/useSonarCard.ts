"use client";

import { useState, useEffect } from "react";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";
import type { GetSonarIntegrationUseCase } from "@/domain/usecases/GetSonarIntegrationUseCase";
import { container } from "@/infrastructure/ioc/container";
import { USECASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

export interface UseSonarCardResult {
  sonarData: IntegrationHealth | null;
  isLoading: boolean;
  error: string | null;
}

export function useSonarCard(): UseSonarCardResult {
  const [sonarData, setSonarData] = useState<IntegrationHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useCase = container.get<GetSonarIntegrationUseCase>(
      USECASE_TYPES.GetSonarIntegrationUseCase
    );

    useCase
      .execute()
      .then(setSonarData)
      .catch(() => setError("No se pudo cargar los datos de SonarQube"))
      .finally(() => setIsLoading(false));
  }, []);

  return { sonarData, isLoading, error };
}
