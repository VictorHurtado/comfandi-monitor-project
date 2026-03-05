import { ValidationError } from "@/utils/errors/domain-errors";
import { GetSonarQualityGateUseCase } from "../GetSonarQualityGateUseCase";

describe("GetSonarQualityGateUseCase", () => {
  const mockRepo = {
    getQualityGate: jest.fn()
  };
  const mockResolver = {
    getSonarProjectKey: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws ValidationError when projectId is empty", async () => {
    const useCase = new GetSonarQualityGateUseCase(
      mockRepo as never,
      mockResolver as never
    );

    await expect(
      useCase.execute({ projectId: "", projectName: "Test" })
    ).rejects.toThrow(ValidationError);

    expect(mockResolver.getSonarProjectKey).not.toHaveBeenCalled();
    expect(mockRepo.getQualityGate).not.toHaveBeenCalled();
  });

  it("throws ValidationError when projectId is only whitespace", async () => {
    const useCase = new GetSonarQualityGateUseCase(
      mockRepo as never,
      mockResolver as never
    );

    await expect(
      useCase.execute({ projectId: "   ", projectName: "Test" })
    ).rejects.toThrow(ValidationError);

    expect(mockResolver.getSonarProjectKey).not.toHaveBeenCalled();
  });

  it("returns unknown when project has no Sonar mapping", async () => {
    mockResolver.getSonarProjectKey.mockReturnValue(null);

    const useCase = new GetSonarQualityGateUseCase(
      mockRepo as never,
      mockResolver as never
    );

    const result = await useCase.execute({
      projectId: "unknown-project",
      projectName: "Unknown"
    });

    expect(result).toEqual({
      status: "unknown",
      sonarProjectKey: "",
      projectName: "Unknown",
      message: "Proyecto sin mapeo en Sonar"
    });
    expect(mockRepo.getQualityGate).not.toHaveBeenCalled();
  });

  it("calls repository and enriches result with projectName", async () => {
    mockResolver.getSonarProjectKey.mockReturnValue("ComfandiTD_my-project");
    mockRepo.getQualityGate.mockResolvedValue({
      status: "passed",
      sonarProjectKey: "ComfandiTD_my-project",
      projectName: ""
    });

    const useCase = new GetSonarQualityGateUseCase(
      mockRepo as never,
      mockResolver as never
    );

    const result = await useCase.execute({
      projectId: "afiliaciones",
      projectName: "Afiliaciones"
    });

    expect(mockRepo.getQualityGate).toHaveBeenCalledWith("ComfandiTD_my-project");
    expect(result).toEqual({
      status: "passed",
      sonarProjectKey: "ComfandiTD_my-project",
      projectName: "Afiliaciones"
    });
  });
});
