"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SessionSidebar } from "./SessionSidebar"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface ChatLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ChatLayout({ children, className }: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  return (
    <div className={cn("flex h-screen w-full overflow-hidden bg-background", className)}>
      {/* Collapsible Sidebar */}
      <aside
        className={cn(
          "relative h-full border-r bg-muted/30 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-16",
          "hidden md:flex"
        )}
      >
        <div className={cn("flex w-full flex-col", !isSidebarOpen && "hidden")}>
          <SessionSidebar />
        </div>
        
        {/* Toggle Button */}
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2",
            isSidebarOpen ? "" : "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </aside>

      {/* Main Chat Area */}
      <main className="relative flex flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}