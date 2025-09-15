"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// ---------------- Query Client ----------------
let queryClient: QueryClient | null = null;
function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
    });
  }
  return queryClient;
}

// ---------------- Auth Context ----------------
export type User = { id: string; name: string; email: string };

type AuthContextType = {
  userId: string | null;
  user: User | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside Providers");
  return ctx;
};

// ---------------- AuthProvider Inner ----------------
function AuthProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Sync NextAuth session with context
  useEffect(() => {
    if (session?.user) {
      setUserId(session.user.id as string);
      setUser({
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
      });
    } else {
      setUserId(null);
      setUser(null);
    }
  }, [session]);

  const logout = async () => {
    await signOut({ redirect: false });
    setUserId(null);
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ userId, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- Main Providers ----------------
import type { Session } from "next-auth";

export function Providers({ children, session }: { children: ReactNode; session?: Session | null | undefined }) {
  const queryClient = getQueryClient();

  const trpcClient = trpc.createClient({
    links: [loggerLink(), httpBatchLink({ url: "/api/trpc" })],
  });

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <AuthProviderInner>{children}</AuthProviderInner>
        </trpc.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
