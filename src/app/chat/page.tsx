"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { ChatSession } from "@/components/chat/ChatSession";
import { Button } from "@/components/ui/button";

export default function ChatLandingPage() {
  const router = useRouter();
  const { data: authSession, status } = useSession();

  const createSessionMutation = trpc.session.create.useMutation();
  const { data: existingSessions, isLoading: sessionsLoading, refetch } =
    trpc.session.listByUser.useQuery(
      { userId: authSession?.user?.id || "" },
      { enabled: !!authSession?.user?.id }
    );

  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [sessionInitialized, setSessionInitialized] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  React.useEffect(() => {
    const initSession = async () => {
      if (!authSession?.user?.id || sessionInitialized || sessionsLoading) {
        return;
      }

      setSessionInitialized(true);

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      if (existingSessions && existingSessions.length > 0) {
        const mostRecentSession = existingSessions[0];
        const lastActivity = mostRecentSession.updated_at
          ? new Date(mostRecentSession.updated_at)
          : new Date(0);
          
        if (lastActivity < tenMinutesAgo) {
          // If the most recent session is older than 10 minutes, create a new one.
          try {
            const newSession = await createSessionMutation.mutateAsync({
              title: "New Chat",
              userId: authSession.user.id,
            });
            setSessionId(newSession.id);
            refetch();
          } catch (err) {
            console.error("Failed to create new session:", err);
          }
        } else {
          // Otherwise, reuse the most recent session.
          setSessionId(mostRecentSession.id);
        }
      } else {
        // If no sessions exist, create the first one.
        try {
          const newSession = await createSessionMutation.mutateAsync({
            title: "New Chat",
            userId: authSession.user.id,
          });
          setSessionId(newSession.id);
          refetch();
        } catch (err) {
          console.error("Failed to create initial session:", err);
        }
      }
    };

    initSession();
  }, [
    authSession?.user?.id,
    existingSessions,
    sessionsLoading,
    createSessionMutation,
    refetch,
    sessionInitialized,
  ]);

  if (status === "loading" || sessionsLoading) {
    return (
      <ChatLayout>
        <div className="flex flex-1 items-center justify-center">
          <p>Checking authentication...</p>
        </div>
      </ChatLayout>
    );
  }

  if (status === "unauthenticated") return null;

  if (!sessionId) {
    return (
      <ChatLayout>
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <p>No active sessions found.</p>
          <Button
            onClick={async () => {
              if (!authSession?.user?.id) return;
              const newSession = await createSessionMutation.mutateAsync({
                title: "New Chat",
                userId: authSession.user.id,
              });
              setSessionId(newSession.id);
              refetch();
            }}
          >
            Start a New Session
          </Button>
        </div>
      </ChatLayout>
    );
  }

  return <ChatSession sessionId={sessionId} />;
}