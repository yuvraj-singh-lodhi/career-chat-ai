"use client";
import * as React from "react";
import Link from "next/link";
import { Plus, Search, LogOut, LogIn, Menu, PanelLeft } from "lucide-react";
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

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
}

interface SessionSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SessionSidebar({ isCollapsed, onToggle }: SessionSidebarProps) {
  const sessions: ChatSession[] = [
    { id: "1", title: "AI Basics", createdAt: new Date() },
    { id: "2", title: "Next.js Project", createdAt: new Date() },
    { id: "3", title: "Sports Betting App", createdAt: new Date() },
  ];

  const sidebarItems = [
    { icon: Plus, label: "New Chat", href: "/chat/new" },
    { icon: Search, label: "Search Chats", href: "/chat/search" },
    { icon: LogIn, label: "Login / Signup", href: "/auth" },
    { icon: LogOut, label: "Logout", href: "/logout" },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-muted/30 border-r">
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2 
              className="text-sm font-semibold"
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
                className="w-8 h-8 rounded-md hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {isCollapsed ? (
                    <Menu className="h-4 w-4" />
                  ) : (
                    <PanelLeft className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "bottom"}>
              {isCollapsed ? "Open Sidebar" : "Close Sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Sidebar buttons */}
      <div className="flex flex-col gap-1 py-2">
        {sidebarItems.map((item, index) => {
          return isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-md hover:bg-gray-700 transition-colors mx-2"
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
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
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
          );
        })}

        {/* Theme Toggle */}
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
            <ThemeToggle className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mx-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center">
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
              <div className="px-4 py-2 text-sm font-semibold text-gray-500">
                Chats
              </div>
              <ul className="space-y-1">
                {sessions.map((session: ChatSession) => (
                  <li key={session.id}>
                    <Link
                      href={`/chat/${session.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <span>{session.title}</span>
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
