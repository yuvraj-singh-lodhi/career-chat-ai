"use client";
import * as React from "react";
import Link from "next/link";
import { Plus, Search, LogOut, LogIn, Menu, PanelLeft, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/app/providers";

interface SessionSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SessionSidebar({ isCollapsed, onToggle }: SessionSidebarProps) {
  const { userId, user, logout } = useAuth();
  const { data: sessions, isLoading, error } = trpc.session.list.useQuery();
  
  const sidebarItems = [
    { icon: Plus, label: "New Chat", href: "/" },
    { icon: Search, label: "Search Chats", href: "/chat/search" },
  ];
  
  if (!userId) sidebarItems.push({ icon: LogIn, label: "Login / Signup", href: "/auth" });

  // ---------------- Generate initials ----------------
  const getInitials = (name: string = "") => {
    if (!name || name.trim().length === 0) return "?";
    const names = name.trim().split(/\s+/); // Use regex to handle multiple spaces
    
    if (names.length === 1) {
      return names[0].slice(0, 2).toUpperCase(); // Take first 2 chars if single name
    }
    
    // Take first char of first name and first char of last name
    const firstInitial = names[0][0] || "";
    const lastInitial = names[names.length - 1][0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Debug logging - remove in production
  React.useEffect(() => {
    console.log("Auth state:", { userId, user, userName: user?.name });
  }, [userId, user]);

  return (
    <div className="flex h-full w-full flex-col bg-muted/30 border-r">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              className="text-sm font-semibold flex items-center gap-2 min-w-0"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              Career AI
            </motion.h2>
          )}
        </AnimatePresence>
        
        {/* Toggle Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggle}
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {isCollapsed ? <Menu className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "bottom"}>
              {isCollapsed ? "Open Sidebar" : "Close Sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Collapsed Avatar Display */}
      {isCollapsed && userId && user && (
        <div className="flex justify-center py-3 border-b border-gray-200 dark:border-gray-700">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm cursor-pointer">
                  {user.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                {user.name || user.email || "User"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Sidebar buttons */}
      <div className="flex flex-col gap-1 py-2">
        {/* User Avatar Button (when logged in) */}
        {userId && user && (
          isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mx-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm cursor-pointer hover:scale-105 transition-transform">
                      {user.name ? getInitials(user.name) : <User className="h-3 w-3" />}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {user.name || user.email || "User"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm flex-shrink-0">
                {user.name ? getInitials(user.name) : <User className="h-3 w-3" />}
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="truncate text-gray-800 dark:text-white"
                  >
                    {user.name || user.email || "User"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )
        )}

        {/* Regular sidebar items */}
        {sidebarItems.map((item, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mx-2"
                    >
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        )}

        {/* Logout Button */}
        {userId &&
          (!isCollapsed ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 font-semibold"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="mx-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={logout}
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}

        {/* Theme Toggle */}
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <ThemeToggle className="h-4 w-4 flex-shrink-0" />
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              Theme
            </motion.span>
          </div>
        ) : (
          <div className="mx-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                    <ThemeToggle className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Session List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 mt-2"
          >
            <ScrollArea className="h-full">
              <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Chats</div>
              {isLoading && <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>}
              {error && <div className="px-4 py-2 text-sm text-red-500">Failed to load sessions</div>}
              <ul className="space-y-1 px-2">
                {sessions?.map((session) => (
                  <li key={session.id}>
                    <Link
                      href={`/chat/${session.id}`}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                    >
                      <span className="truncate">{session.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}