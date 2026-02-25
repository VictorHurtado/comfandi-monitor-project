import NextAuth, { type NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";

const keycloakService = new KeycloakService();

const providers = keycloakService.isConfigured()
  ? [
      KeycloakProvider({
        issuer: keycloakService.getIssuer(),
        clientId: keycloakService.getClientId(),
        clientSecret: keycloakService.getClientSecret()
      })
    ]
  : [];

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
