import { getEnvironment } from "@/infrastructure/config/environment";
import {
  AppError,
  InternalServerError,
  UnauthorizedError
} from "@/utils/errors/domain-errors";

export class KeycloakService {
  private readonly environment = getEnvironment();

  isAuthDisabled(): boolean {
    return this.environment.authDisabled;
  }

  isConfigured(): boolean {
    return Boolean(
      this.environment.keycloakIssuer &&
        this.environment.keycloakClientId &&
        this.environment.keycloakClientSecret
    );
  }

  getIssuer(): string {
    return this.environment.keycloakIssuer;
  }

  getClientId(): string {
    return this.environment.keycloakClientId;
  }

  getClientSecret(): string {
    return this.environment.keycloakClientSecret;
  }

  async validateAccessToken(accessToken: string): Promise<void> {
    if (this.isAuthDisabled()) {
      return;
    }

    if (!this.isConfigured()) {
      throw new InternalServerError("Keycloak authentication is not configured");
    }

    const userInfoEndpoint = `${this.getIssuer()}/protocol/openid-connect/userinfo`;

    try {
      const response = await fetch(userInfoEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new UnauthorizedError("Invalid or expired Keycloak token");
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError("Unable to validate Keycloak token", error);
    }
  }
}
