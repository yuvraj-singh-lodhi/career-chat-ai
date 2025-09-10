"use client"

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"
import { httpBatchLink } from "@trpc/client"
import { loggerLink } from "@trpc/client/links/loggerLink"

let queryClient: QueryClient | null = null

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  }
  return queryClient
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  const trpcClient = trpc.createClient({
    links: [
      loggerLink(),
      httpBatchLink({ url: "/api/trpc" }),
    ],
  })

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  )
}
