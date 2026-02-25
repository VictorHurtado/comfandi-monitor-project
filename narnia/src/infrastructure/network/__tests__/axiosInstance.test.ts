import { axiosInstance } from "@/infrastructure/network/axiosInstance";

describe("axiosInstance", () => {
  it("defines default timeout and content type", () => {
    expect(axiosInstance.defaults.timeout).toBe(10000);
    expect(axiosInstance.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
