import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

type AuthToken = JWT & {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_at?: number;
  error?: string;
};

const getKeycloakConfig = () => ({
  issuer: process.env.KEYCLOAK_ISSUER ?? "",
  clientId: process.env.KEYCLOAK_CLIENT_ID ?? "",
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? ""
});

export const isKeycloakConfigured = (): boolean => {
  const { issuer, clientId, clientSecret } = getKeycloakConfig();
  return Boolean(issuer && clientId && clientSecret);
};

export async function refreshAccessToken(token: AuthToken): Promise<AuthToken> {
  const { issuer, clientId, clientSecret } = getKeycloakConfig();

  if (!token.refresh_token || !issuer || !clientId || !clientSecret) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  const tokenEndpoint = `${issuer}/protocol/openid-connect/token`;

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token
      })
    });

    const refreshedToken = await response.json();

    if (!response.ok) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    return {
      ...token,
      access_token: refreshedToken.access_token,
      id_token: refreshedToken.id_token ?? token.id_token,
      refresh_token: refreshedToken.refresh_token ?? token.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (refreshedToken.expires_in ?? 0),
      error: undefined
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const keycloakProvider = (() => {
  if (!isKeycloakConfigured()) {
    return null;
  }

  const { issuer, clientId, clientSecret } = getKeycloakConfig();
  return KeycloakProvider({ issuer, clientId, clientSecret });
})();

export const authOptions: NextAuthOptions = {
  providers: keycloakProvider ? [keycloakProvider] : [],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/api/auth/signin/keycloak"
  },
  callbacks: {
    async jwt({ token, account }) {
      const currentToken = token as AuthToken;

      if (account) {
        return {
          ...currentToken,
          access_token: account.access_token,
          id_token: account.id_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          error: undefined
        };
      }

      if (currentToken.expires_at && Date.now() / 1000 < currentToken.expires_at) {
        return currentToken;
      }

      return refreshAccessToken(currentToken);
    },
    async session({ session, token }) {
      const currentToken = token as AuthToken;
      return {
        ...session,
        access_token: currentToken.access_token,
        id_token: currentToken.id_token,
        refresh_token: currentToken.refresh_token,
        error: currentToken.error
      };
    }
  }
};
