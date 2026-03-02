import { renderHook, waitFor } from "@testing-library/react";
import type { IntegrationHealth } from "@/domain/models/PlatformHealthStatus";

jest.mock("@/infrastructure/ioc/container", () => ({
  container: {
    get: jest.fn()
  }
}));

jest.mock("@/infrastructure/ioc/usecases/usecases.types", () => ({
  USECASE_TYPES: {
    GetSonarIntegrationUseCase: Symbol.for("GetSonarIntegrationUseCase")
  }
}));

const { container } = jest.requireMock("@/infrastructure/ioc/container") as {
  container: { get: jest.MockedFunction<(token: symbol) => unknown> };
};

const mockHealth: IntegrationHealth = {
  provider: "sonar",
  status: "warning",
  message: "WARN",
  checkedAt: "2026-01-01T00:00:00.000Z",
  sonarMetrics: {
    qualityGateStatus: "WARN",
    coverage: 72.5,
    bugs: 3,
    vulnerabilities: 1
  }
};

describe("useSonarCard", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("initialises with isLoading=true and sonarData=null", () => {
    container.get.mockReturnValue({ execute: jest.fn().mockReturnValue(new Promise(() => {})) });

    const { useSonarCard } = require("@/presentation/hooks/useSonarCard");
    const { result } = renderHook(() => useSonarCard());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.sonarData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets sonarData and stops loading on success", async () => {
    container.get.mockReturnValue({ execute: jest.fn().mockResolvedValue(mockHealth) });

    const { useSonarCard } = require("@/presentation/hooks/useSonarCard");
    const { result } = renderHook(() => useSonarCard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.sonarData).toEqual(mockHealth);
    expect(result.current.error).toBeNull();
  });

  it("sets error message and stops loading on failure", async () => {
    container.get.mockReturnValue({ execute: jest.fn().mockRejectedValue(new Error("api error")) });

    const { useSonarCard } = require("@/presentation/hooks/useSonarCard");
    const { result } = renderHook(() => useSonarCard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.sonarData).toBeNull();
    expect(result.current.error).toBe("No se pudo cargar los datos de SonarQube");
  });
});
