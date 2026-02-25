import { render, screen } from "@testing-library/react";
import { HealthStatusCard } from "@/presentation/components/organisms/HealthStatusCard";

describe("HealthStatusCard", () => {
  it("renders global status and integration details", () => {
    render(
      <HealthStatusCard
        healthStatus={{
          status: "ok",
          checkedAt: "2026-01-01T00:00:00.000Z",
          integrations: [
            {
              provider: "sonar",
              status: "ok",
              message: "all good",
              checkedAt: "2026-01-01T00:00:00.000Z"
            }
          ]
        }}
      />
    );

    expect(screen.getByText("Narnia technical status")).toBeInTheDocument();
    expect(screen.getByText("sonar")).toBeInTheDocument();
    expect(screen.getByText("all good")).toBeInTheDocument();
  });
});
