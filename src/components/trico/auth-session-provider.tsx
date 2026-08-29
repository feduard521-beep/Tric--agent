"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/** Provider de sessão Auth.js para componentes cliente. */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
