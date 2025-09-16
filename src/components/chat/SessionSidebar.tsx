"use client";
import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LogOut,
  Menu,
  PanelLeft,
  User,
  Trash2,
} from "lucide-react";
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
import { useRouter } from "next/navigation";

interface SessionSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SessionSidebar({ isCollapsed, onToggle }: SessionSidebarProps) {
  const { userId, user, logout } = useAuth();
  const router = useRouter();

  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = trpc.session.listByUser.useQuery(
    { userId: userId || "" },
    { enabled: !!userId }
  );

  const createSessionMutation = trpc.session.create.useMutation();
  const deleteSessionMutation = trpc.session.delete.useMutation();

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "?";
    const names = name.trim().split(/\s+/);
    if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createSessionMutation.mutateAsync({
        title: "New Chat",
        userId: userId || "",
      });
      refetch();
      router.push(`/chat/${newSession.id}`);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync({ id });
      refetch();
      router.push("/chat");
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const sidebarItems = [
    { icon: Plus, label: "New Chat", onClick: handleNewChat },
    { icon: Search, label: "Search Chats", href: "/chat/search" },
  ];

  if (!userId) return null;

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

      <div className="flex flex-col gap-1 py-2">
        {/* User Avatar & Name */}
        {user &&
          (isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mx-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm cursor-pointer hover:scale-105 transition-transform">
                      {user.name ? (
                        getInitials(user.name)
                      ) : (
                        <User className="h-3 w-3" />
                      )}
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
                {user.name ? (
                  getInitials(user.name)
                ) : (
                  <User className="h-3 w-3" />
                )}
              </div>
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  className="truncate text-gray-800 dark:text-white"
                >
                  {user.name || user.email || "User"}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}

        {/* Sidebar Items */}
        {sidebarItems.map((item, index) =>
          item.href ? (
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
                <span>{item.label}</span>
              </Link>
            )
          ) : isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 mx-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    onClick={item.onClick}
                  >
                    <item.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </div>
          )
        )}

        {/* Logout */}
        {userId &&
          (!isCollapsed ? (
            <div
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 font-semibold cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
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
          <div
            onClick={() =>
              document
                .querySelector<HTMLButtonElement>("#theme-toggle-button")
                ?.click()
            }
            className="flex w-full items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <ThemeToggle
              className="h-4 w-4 flex-shrink-0"
              id="theme-toggle-button"
              style={{ pointerEvents: "none" }}
            />
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
                  <ThemeToggle className="w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center" />
                </TooltipTrigger>
                <TooltipContent side="right">Theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Sessions List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 mt-2 flex flex-col min-h-0"
          >
            <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Chats
            </div>
            <ScrollArea className="flex-1">
              {isLoading && (
                <div className="px-4 py-2 text-sm text-gray-400">
                  Loading...
                </div>
              )}
              {error && (
                <div className="px-4 py-2 text-sm text-red-500">
                  Failed to load sessions
                </div>
              )}
              <ul className="space-y-1 px-4">
                {sessions?.map((session) => (
                  <li key={session.id}>
                    <div className="flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors px-2 py-1 group">
                      <div className="flex-1 min-w-0 pr-2">
                        <Link
                          href={`/chat/${session.id}`}
                          className="block"
                          title={session.title}
                        >
                          <span className="block truncate text-sm text-gray-800 dark:text-gray-200">
                            {session.title}
                          </span>
                        </Link>
                      </div>
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-5 h-5 p-0 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteSession(session.id);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                Delete Chat
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
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
