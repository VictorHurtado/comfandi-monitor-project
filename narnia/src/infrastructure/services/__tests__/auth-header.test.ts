import { parseBearerToken } from "@/infrastructure/services/auth-header";
import { UnauthorizedError } from "@/utils/errors/domain-errors";

describe("parseBearerToken", () => {
  it("returns token when authorization header has Bearer format", () => {
    const token = parseBearerToken("Bearer abc.def.ghi");

    expect(token).toBe("abc.def.ghi");
  });

  it("throws UnauthorizedError when header is missing", () => {
    expect(() => parseBearerToken(null)).toThrow(UnauthorizedError);
  });

  it("throws UnauthorizedError when format is invalid", () => {
    expect(() => parseBearerToken("Basic 123")).toThrow(UnauthorizedError);
    expect(() => parseBearerToken("Bearer")).toThrow(UnauthorizedError);
  });
});
