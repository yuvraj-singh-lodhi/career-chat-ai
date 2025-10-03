"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { LucideProps, Plus, Search, User, LogOut, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/app/providers";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SidebarItem {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  onClick: () => void;
}

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId, user, logout } = useAuth();
  const createSessionMutation = trpc.session.create.useMutation();
  const { data: sessions, isLoading, error, refetch } = trpc.session.listByUser.useQuery(
    { userId: userId || "" },
    { enabled: !!userId }
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const deleteSessionMutation = trpc.session.delete.useMutation();

  if (!userId) return null;

  const getInitials = (name: string = "") => {
    if (!name.trim()) return "?";
    const names = name.trim().split(/\s+/);
    if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createSessionMutation.mutateAsync({ title: "New Chat", userId });
      router.push(`/chat/${newSession.id}`);
      refetch();
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleSessionClick = (id: string) => {
    setLoadingSessionId(id);
    router.push(`/chat/${id}`);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      setDeletingSessionId(id);
      await deleteSessionMutation.mutateAsync({ id });
      refetch();
      router.push("/chat");
    } catch (err) {
      console.error("Failed to delete session:", err);
    } finally {
      setDeletingSessionId(null);
      setConfirmOpen(false);
    }
  };

  const sidebarItems: SidebarItem[] = [
    { icon: Plus, label: "New Chat", onClick: handleNewChat },
    { icon: Search, label: "Search Chats", onClick: () => setIsSearchOpen(true) },
  ];

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Career AI</SidebarGroupLabel>
            <SidebarGroupContent>
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs shadow-sm flex-shrink-0">
                    {user.name ? getInitials(user.name) : <User className="h-3 w-3" />}
                  </div>
                  {!isCollapsed && (
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
                  )}
                </div>
              )}

              {/* Other Sidebar Items */}
              <SidebarMenu>
                {sidebarItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={item.onClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-muted-foreground"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              {/* Logout */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-destructive font-semibold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      {!isCollapsed && <span>Logout</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              {/* Theme Toggle */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() =>
                        document.querySelector<HTMLButtonElement>("#theme-toggle-button")?.click()
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors text-muted-foreground"
                    >
                      <ThemeToggle className="h-4 w-4 flex-shrink-0" id="theme-toggle-button" style={{ pointerEvents: "none" }} />
                      {!isCollapsed && <span>Theme</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>

            {/* Session List */}
            <SidebarGroupContent>
              <SidebarMenu>
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                  Chats
                </div>
                <AnimatePresence>
                  {isLoading && <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>}
                  {error && <div className="px-4 py-2 text-sm text-destructive">Failed to load sessions</div>}
                  {sessions?.map((session) => {
                    const isActive = pathname === `/chat/${session.id}`;
                    const isLoadingSession = loadingSessionId === session.id;
                    const isDeleting = deletingSessionId === session.id;
                    return (
                      <SidebarMenuItem key={session.id}>
                        <SidebarMenuButton asChild>
                          <div
                            className={cn(
                              "flex items-center justify-between w-full px-3 py-2 rounded-2xl cursor-pointer transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground font-medium shadow-md"
                                : "bg-muted/50 text-foreground hover:bg-muted hover:text-foreground"
                            )}
                            onClick={() => handleSessionClick(session.id)}
                          >
                            <span className={cn("flex-1 truncate text-sm", isActive && "font-semibold")}>
                              {isLoadingSession ? "Loading..." : session.title}
                            </span>
                            {!isActive && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSessionId(session.id);
                                  setConfirmOpen(true);
                                }}
                                className="flex items-center"
                              >
                                {isDeleting ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                                )}
                              </div>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </AnimatePresence>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Confirm Dialog for Deletion */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => selectedSessionId ? handleDeleteSession(selectedSessionId) : Promise.resolve()}
        title="Delete this chat?"
        description="This will permanently delete the chat and all its messages. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}