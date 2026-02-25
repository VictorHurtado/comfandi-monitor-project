import { ExternalApiService } from "@/infrastructure/services/ExternalApiService";
import { InternalServerError } from "@/utils/errors/domain-errors";

describe("ExternalApiService", () => {
  it("returns integration health from http client", async () => {
    const http = {
      get: jest.fn().mockResolvedValue({
        data: {
          provider: "sonar",
          status: "ok",
          message: "healthy",
          checkedAt: "2026-01-01T00:00:00.000Z"
        }
      })
    };

    const service = new ExternalApiService(http as never);
    const result = await service.getIntegrationHealth("sonar");

    expect(http.get).toHaveBeenCalledWith("/integrations/sonar");
    expect(result.status).toBe("ok");
  });

  it("maps technical errors to InternalServerError", async () => {
    const http = {
      get: jest.fn().mockRejectedValue(new Error("timeout"))
    };

    const service = new ExternalApiService(http as never);

    await expect(service.getIntegrationHealth("github")).rejects.toBeInstanceOf(
      InternalServerError
    );
  });
});
