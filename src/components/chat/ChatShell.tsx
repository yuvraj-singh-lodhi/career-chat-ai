"use client"
import * as React from "react"
import { SessionSidebar } from "./SessionSidebar"
import { cn } from "@/lib/utils"

interface ChatShellProps {
  children: React.ReactNode
  className?: string
}

export function ChatShell({ children, className }: ChatShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={cn("flex h-screen w-full overflow-hidden bg-background", className)}>
      {/* Sidebar */}
      <aside 
        className={cn(
          "border-r bg-muted/30 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-16",
          "hidden md:flex"
        )}
      >
        <SessionSidebar 
          isCollapsed={!isSidebarOpen} 
          onToggle={handleToggleSidebar}
        />
      </aside>
      
      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
