import { GetPlatformHealthStatusUseCase } from "@/domain/usecases/GetPlatformHealthStatusUseCase";
import type { IStatusRepository } from "@/domain/repositories/IStatusRepository";
import { ValidationError } from "@/utils/errors/domain-errors";

const createRepositoryMock = (): jest.Mocked<IStatusRepository> => ({
  getPlatformHealthStatus: jest.fn(),
  getIntegrationStatus: jest.fn()
});

describe("GetPlatformHealthStatusUseCase", () => {
  it("returns global status when provider is not defined", async () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    repositoryMock.getPlatformHealthStatus.mockResolvedValue({
      status: "ok",
      checkedAt: "2026-01-01T00:00:00.000Z",
      integrations: []
    });

    const result = await useCase.execute();

    expect(result.status).toBe("ok");
    expect(repositoryMock.getPlatformHealthStatus).toHaveBeenCalledTimes(1);
  });

  it("validates unsupported provider", () => {
    const repositoryMock = createRepositoryMock();
    const useCase = new GetPlatformHealthStatusUseCase(repositoryMock);

    expect(() => useCase.validateProvider("jira")).toThrow(ValidationError);
  });
});
