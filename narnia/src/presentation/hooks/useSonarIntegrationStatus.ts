"use client";

import { useEffect, useState } from "react";
import { container, USECASE_TYPES } from "@/infrastructure/ioc";
import { GetSonarIntegrationStatusUseCase } from "@/domain/usecases/sonar/GetSonarIntegrationStatusUseCase";
import type { SonarIntegrationStatus } from "@/domain/models/SonarIntegrationStatus";

interface UseSonarIntegrationStatusResult {
  data: SonarIntegrationStatus | null;
  isLoading: boolean;
  error: string | null;
}

export function useSonarIntegrationStatus(): UseSonarIntegrationStatusResult {
  const [data, setData] = useState<SonarIntegrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useCase = container.get<GetSonarIntegrationStatusUseCase>(
      USECASE_TYPES.GetSonarIntegrationStatusUseCase
    );

    useCase
      .execute()
      .then(setData)
      .catch((err) => {
        setError(err?.message ?? "No se pudo cargar el estado de SonarQube");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
