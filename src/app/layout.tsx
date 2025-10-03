"use client"; // this is a client-only layout

import * as React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/chat/AppSidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <SidebarProvider>
              <div className="flex h-screen w-screen">
                <AppSidebar /> {/* your sidebar */}
                <main className="flex-1 flex flex-col overflow-hidden">
                  <SidebarTrigger /> {/* optional trigger */}
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
