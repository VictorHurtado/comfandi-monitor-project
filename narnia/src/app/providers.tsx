"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@/presentation/auth/AuthGuard";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
