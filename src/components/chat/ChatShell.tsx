"use client"

import * as React from "react"
import { SessionSidebar } from "./SessionSidebar"
import { cn } from "@/lib/utils"

interface ChatShellProps {
  children: React.ReactNode
  className?: string
}

export function ChatShell({ children, className }: ChatShellProps) {
  return (
    <div className={cn("flex h-screen w-full overflow-hidden bg-background", className)}>
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-muted/30 md:flex">
        <SessionSidebar />
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
