"use client"; // make sure client-only logic is separated

import * as React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { cn } from "@/lib/utils"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* ✅ Wrap the app in Providers so tRPC & React Query work */}
          <Providers>
            <div className="flex flex-col h-screen">
              <main className="flex-1 flex overflow-hidden">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
