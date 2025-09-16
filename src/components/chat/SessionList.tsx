"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

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
  } = trpc.session.listByUser.useQuery(
    { userId },
    { enabled: !!userId }
  );

  const deleteSessionMutation = trpc.session.delete.useMutation();

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync({ id });
      refetch();
      router.push("/chat");
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return (
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 mt-2 flex flex-col min-h-0"
        >
          <div className="px-4 py-2 text-sm font-semibold text-zinc-400">
            Chats
          </div>
          <ScrollArea className="flex-1">
            {isLoading && (
              <div className="px-4 py-2 text-sm text-zinc-500">Loading...</div>
            )}
            {error && (
              <div className="px-4 py-2 text-sm text-red-500">
                Failed to load sessions
              </div>
            )}
            <ul className="space-y-1 px-4">
              {sessions?.map((session) => {
                const isActive = pathname === `/chat/${session.id}`;
                return (
                  <li key={session.id}>
                    <div
                      className={cn(
                        "flex items-center rounded-md px-2 py-1 group transition-colors",
                        isActive
                          ? "bg-zinc-800 text-white font-medium"
                          : "hover:bg-zinc-800 text-zinc-300"
                      )}
                    >
                      <Link
                        href={`/chat/${session.id}`}
                        className="flex-1 block truncate text-sm"
                        title={session.title}
                      >
                        {session.title}
                      </Link>
                      {!isActive && (
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-5 h-5 p-0 hover:bg-zinc-700 rounded"
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
  );
}
