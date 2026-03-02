import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import { AppError, InternalServerError, ValidationError } from "@/utils/errors/domain-errors";

const createRepositoryMock = (): jest.Mocked<IStatusRepository> => ({
  getPlatformHealthStatus: jest.fn(),
  getIntegrationStatus: jest.fn()
});

const healthOk = {
  status: "ok" as const,
  checkedAt: "2026-01-01T00:00:00.000Z",
  integrations: []
};

describe("GetPlatformHealthStatusUseCase", () => {
  it("returns global status when provider is not defined", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    repositoryMock.getPlatformHealthStatus.mockResolvedValue(healthOk);

    const result = await useCase.execute();

    expect(result.status).toBe("ok");
    expect(repositoryMock.getPlatformHealthStatus).toHaveBeenCalledTimes(1);
  });

  it("returns integration status when provider is defined", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    repositoryMock.getIntegrationStatus.mockResolvedValue(healthOk);

    const result = await useCase.execute("sonar");

    expect(result.status).toBe("ok");
    expect(repositoryMock.getIntegrationStatus).toHaveBeenCalledWith("sonar");
    expect(repositoryMock.getPlatformHealthStatus).not.toHaveBeenCalled();
  });

  it("re-throws AppError instances without wrapping", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);
    const original = new AppError("service down", 503);

    repositoryMock.getPlatformHealthStatus.mockRejectedValue(original);

    await expect(useCase.execute()).rejects.toThrow(original);
  });

  it("wraps non-AppError in InternalServerError", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    repositoryMock.getPlatformHealthStatus.mockRejectedValue(new Error("network failure"));

    await expect(useCase.execute()).rejects.toBeInstanceOf(InternalServerError);
  });

  it("validates unsupported provider", () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    expect(() => useCase.validateProvider("jira")).toThrow(ValidationError);
  });

  it("validates and returns valid provider", () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    expect(useCase.validateProvider("sonar")).toBe("sonar");
    expect(useCase.validateProvider("github")).toBe("github");
    expect(useCase.validateProvider("sentry")).toBe("sentry");
    expect(useCase.validateProvider("proteo")).toBe("proteo");
  });
});
