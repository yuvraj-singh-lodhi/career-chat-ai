import * as React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/Navbar"
import { Providers } from "./providers" // ✅ import our Providers
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Oration AI Career Chat",
  description: "AI-powered career counseling chat built with Next.js + tRPC",
}

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
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
