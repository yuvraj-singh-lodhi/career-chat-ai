"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, LogOut, Menu, PanelLeft, User } from "lucide-react";
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
import { SessionList } from "./SessionList";
import { SearchDialog } from "./SearchDialog";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

interface SessionSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

type SidebarItem = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  href?: string;
  onClick: () => void;
};

export function SessionSidebar({ isCollapsed, onToggle }: SessionSidebarProps) {
  const { userId, user, logout } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const createSessionMutation = trpc.session.create.useMutation();

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
      router.push(`/chat/${newSession.id}`);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const sidebarItems: SidebarItem[] = [
    { icon: Plus, label: "New Chat", onClick: handleNewChat },
    {
      icon: Search,
      label: "Search Chats",
      onClick: () => setIsSearchOpen(true),
    },
  ];

  if (!userId) return null;

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              className="text-sm font-semibold flex items-center gap-2 min-w-0 text-foreground"
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
                className="w-8 h-8 rounded-md hover:bg-muted transition-colors flex-shrink-0"
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

      {/* User + Actions */}
      <div className="flex flex-col gap-1 py-2">
        {/* User */}
        {user &&
          (isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mx-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-xs shadow-sm cursor-pointer hover:scale-105 transition-transform">
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-xs shadow-sm flex-shrink-0">
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
                  className="truncate text-foreground"
                >
                  {user.name || user.email || "User"}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}

        {/* Sidebar Items */}
        {sidebarItems.map((item, index) =>
          item.href ? (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ) : (
            <div
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-muted-foreground"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          )
        )}

        {/* Logout */}
        {!isCollapsed ? (
          <div
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-destructive font-semibold cursor-pointer"
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
                    className="w-8 h-8 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Theme Toggle */}
        {!isCollapsed ? (
          <div
            onClick={() =>
              document
                .querySelector<HTMLButtonElement>("#theme-toggle-button")
                ?.click()
            }
            className="flex w-full items-center gap-2 px-4 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors text-muted-foreground"
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
                  <ThemeToggle className="w-8 h-8 rounded-md hover:bg-muted transition-colors flex items-center justify-center" />
                </TooltipTrigger>
                <TooltipContent side="right">Theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Sessions List */}
      <SessionList isCollapsed={isCollapsed} userId={userId} />

      {/* Search Popup */}
      {userId && (
        <SearchDialog
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
}
