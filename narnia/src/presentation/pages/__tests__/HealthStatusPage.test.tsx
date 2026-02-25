import { render, screen } from "@testing-library/react";
import { HealthStatusPage } from "@/presentation/pages/HealthStatusPage";

const executeMock = jest.fn();

jest.mock("@/infrastructure/ioc", () => ({
  USECASE_TYPES: {
    GetPlatformHealthStatusUseCase: Symbol.for("GetPlatformHealthStatusUseCase")
  },
  container: {
    get: () => ({
      execute: executeMock
    })
  }
}));

describe("HealthStatusPage", () => {
  it("renders card when data is available", async () => {
    executeMock.mockResolvedValue({
      status: "ok",
      checkedAt: "2026-01-01T00:00:00.000Z",
      integrations: [
        {
          provider: "sonar",
          status: "ok",
          message: "healthy",
          checkedAt: "2026-01-01T00:00:00.000Z"
        }
      ]
    });

    const ui = await HealthStatusPage();
    render(ui);

    expect(screen.getByText("Narnia technical status")).toBeInTheDocument();
    expect(screen.getByText("healthy")).toBeInTheDocument();
  });

  it("renders error fallback when use case fails", async () => {
    executeMock.mockRejectedValue(new Error("boom"));

    const ui = await HealthStatusPage();
    render(ui);

    expect(screen.getByText("Unexpected error loading project status")).toBeInTheDocument();
  });
});
