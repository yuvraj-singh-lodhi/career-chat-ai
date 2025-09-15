"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { SessionSidebar } from "./SessionSidebar";

interface ChatLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatLayout({ children, className }: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden bg-background flex-1",
        className
      )}
    >
      {/* Sidebar */}
      <aside
        className={cn(
          "relative flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64 border-r border-r-muted/30" : "w-16",
          "hidden md:flex"
        )}
      >
        <SessionSidebar
          isCollapsed={!isSidebarOpen}
          onToggle={handleToggleSidebar}
        />
      </aside>
      
      {/* Main Chat Area */}
      <main className="flex flex-1 justify-center overflow-hidden">
        <div className="flex flex-1 max-w-full flex-col bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
