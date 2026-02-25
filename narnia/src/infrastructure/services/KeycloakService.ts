import { getEnvironment } from "@/infrastructure/config/environment";

export class KeycloakService {
  private readonly environment = getEnvironment();

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
}
