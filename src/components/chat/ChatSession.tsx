"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { MessageList } from "@/components/chat/MessageList";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export function ChatSession({ sessionId }: { sessionId: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessageContent = searchParams.get("initialMessage");

  const { data: authSession, status } = useSession();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const messageIdRef = React.useRef(1);

  const sendMessageMutation = trpc.message.create.useMutation();
  const createSessionMutation = trpc.session.create.useMutation();

  const { data: existingMessages } = trpc.message.list.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(
    sessionId
  );

  React.useEffect(() => {
    if (existingMessages) {
      setMessages(
        existingMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          createdAt: new Date(msg.created_at ?? Date.now()),
        }))
      );
    }
  }, [status, existingMessages]);

  React.useEffect(() => {
    if (initialMessageContent && messages.length === 0) {
      handleSend({ content: initialMessageContent });
    }
  }, [initialMessageContent, messages.length]);

  const handleSend = async (message: { content?: string }) => {
    if (!authSession?.user?.id) return;

    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      try {
        const newSession = await createSessionMutation.mutateAsync({
          title: "New Chat",
          userId: authSession.user.id,
        });
        setActiveSessionId(newSession.id);
        currentSessionId = newSession.id;
      } catch (err) {
        console.error("Failed to create session:", err);
        return;
      }
    }

    const userMessageId = (messageIdRef.current++).toString();
    const typingId = (messageIdRef.current++).toString();

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: message.content ?? "[Audio message]",
      createdAt: new Date(),
    };

    const typingMessage: ChatMessage = {
      id: typingId,
      role: "assistant",
      content: "•••",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, typingMessage]);

    try {
      const response = await sendMessageMutation.mutateAsync({
        content: message.content ?? "[Audio message]",
        role: "user",
        sessionId: currentSessionId,
        userId: authSession.user.id,
      });

      setMessages((curr) =>
        curr.map((m) =>
          m.id === typingId
            ? {
                ...m,
                content:
                  "aiMessage" in response && response.aiMessage
                    ? response.aiMessage.content
                    : "I'm sorry, I couldn't process your message.",
              }
            : m
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((curr) =>
        curr.map((m) =>
          m.id === typingId
            ? { ...m, content: "Oops! Something went wrong." }
            : m
        )
      );
    }
  };

  if (status === "loading") {
    return (
      <ChatLayout>
        <div className="flex flex-1 items-center justify-center">
          <p>Checking authentication...</p>
        </div>
      </ChatLayout>
    );
  }

  if (status === "unauthenticated") return null;

  const hasConversationStarted = messages.length > 0;
  const headingText = `Hello ${authSession?.user?.name?.split(" ")[0] || "there"}! I'm your AI career counselor.`;

  return (
    <ChatLayout>
      <div className="flex flex-1 flex-col min-h-0 w-full max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {!hasConversationStarted ? (
            <motion.div
              key="centered"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col items-center justify-center space-y-6 text-center min-h-[60vh]"
            >
              {/* Animated Heading */}
              <motion.h1
                key={headingText} // replay animation when text changes
                className="text-5xl sm:text-6xl md:text-5xl font-bold tracking-tighter mb-4 max-w-4xl mx-auto leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {headingText.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block mr-2 last:mr-0">
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={`${wordIndex}-${letterIndex}`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: wordIndex * 0.1 + letterIndex * 0.02,
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                        className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h1>

              <ChatComposer
                onSend={handleSend}
                disabled={sendMessageMutation.isPending}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col min-h-0"
            >
              <div className="flex-1 w-full overflow-y-auto">
                <MessageList messages={messages} />
              </div>

              <div className="mt-2 shrink-0">
                <ChatComposer
                  onSend={handleSend}
                  disabled={sendMessageMutation.isPending}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChatLayout>
  );
}
