"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { SessionSidebar } from "./SessionSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatLayout({ children, className }: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background",
        className
      )}
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-y-0 left-0 z-50 md:hidden w-64 border-r border-r-muted/30 bg-zinc-900"
          >
            <SessionSidebar
              isCollapsed={false}
              onToggle={handleToggleSidebar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
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
      <main className="flex flex-1 flex-col overflow-hidden min-h-0">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-between p-2">
          <Button variant="ghost" size="icon" onClick={handleToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat content */}
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}
