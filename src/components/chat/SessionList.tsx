"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SessionListProps {
  isCollapsed: boolean;
  userId: string;
}

export function SessionList({ isCollapsed, userId }: SessionListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = trpc.session.listByUser.useQuery({ userId }, { enabled: !!userId });
  const deleteSessionMutation = trpc.session.delete.useMutation();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedSessionId, setSelectedSessionId] = React.useState<
    string | null
  >(null);
  const [loadingSessionId, setLoadingSessionId] = React.useState<string | null>(
    null
  );
  const [deletingSessionId, setDeletingSessionId] = React.useState<
    string | null
  >(null);

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

  const handleSessionClick = (id: string) => {
    setLoadingSessionId(id);
    router.push(`/chat/${id}`);
  };

  return (
    <>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 mt-2 flex flex-col min-h-0"
          >
            <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
              Chats
            </div>
            <ScrollArea className="flex-1 rounded-md bg-background">
              {isLoading && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}
              {error && (
                <div className="px-4 py-2 text-sm text-destructive">
                  Failed to load sessions
                </div>
              )}
              <ul className="space-y-1 px-4 py-2">
                {sessions?.map((session) => {
                  const isActive = pathname === `/chat/${session.id}`;
                  const isLoadingSession = loadingSessionId === session.id;
                  const isDeleting = deletingSessionId === session.id;
                  return (
                    <li key={session.id}>
                      <div
                        className={cn(
                          "flex items-center rounded-2xl px-3 py-2 group transition-colors cursor-pointer",
                          isActive
                            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium shadow-md hover:bg-blue-700" // Fixed: specific blue color for active state with darker hover
                            : "bg-background text-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                        onClick={() => handleSessionClick(session.id)}
                      >
                        <span
                          className={cn(
                            "flex-1 truncate text-sm",
                            isActive && "font-semibold text-white" // Ensure white text for active state
                          )}
                          title={session.title}
                        >
                          {isLoadingSession ? "Loading..." : session.title}
                        </span>
                        {!isActive && (
                          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-5 h-5 p-0 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20" // Fixed: better contrast for delete button
                                      onClick={(e) => {
                                        e.stopPropagation(); // prevent opening chat
                                        setSelectedSessionId(session.id);
                                        setConfirmOpen(true);
                                      }}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? (
                                        <span className="text-xs">...</span>
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5 text-red-500 hover:text-red-600" /> // Fixed: consistent red color
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    Delete Chat
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          selectedSessionId
            ? handleDeleteSession(selectedSessionId)
            : Promise.resolve()
        }
        title="Delete this chat?"
        description="This will permanently delete the chat and all its messages. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
