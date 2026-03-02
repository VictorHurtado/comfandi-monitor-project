"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useState } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const interactiveAttempted = useRef(false);
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [keycloakAvailable, setKeycloakAvailable] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      setKeycloakAvailable(Boolean(providers?.keycloak));
      setProvidersLoaded(true);
    };

    void loadProviders();
  }, []);

  useEffect(() => {
    const authenticate = async () => {
      if (!providersLoaded || !keycloakAvailable || status === "loading") {
        return;
      }

      const sessionWithTokens = session as
        | (typeof session & { error?: string })
        | null;

      if (sessionWithTokens?.error === "RefreshAccessTokenError") {
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL ?? "/" });
        return;
      }

      if (status === "unauthenticated" && !interactiveAttempted.current) {
        interactiveAttempted.current = true;
        await signIn("keycloak", {
          callbackUrl: process.env.NEXT_PUBLIC_APP_URL ?? "/"
        });
      }
    };

    void authenticate();
  }, [session, status, providersLoaded, keycloakAvailable]);

  if (keycloakAvailable && (status === "loading" || status === "unauthenticated")) {
    return (
      <div className="flex min-h-screen items-center justify-center text-brand-800">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
