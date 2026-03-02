import { UnauthorizedError } from "@/utils/errors/domain-errors";

export const parseBearerToken = (authorizationHeader: string | null): string => {
  if (!authorizationHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new UnauthorizedError("Invalid Authorization header format");
  }

  return token;
};
