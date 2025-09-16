"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  // Detect if user scrolled away from bottom
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setShowScrollButton(!isNearBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="relative flex-1 w-full px-4">
      <ScrollArea
        className="h-full w-full pr-4"
        type="scroll"
        viewportRef={viewportRef} // ensure ScrollArea supports this
      >
        <div className="mx-auto w-full max-w-[600px] space-y-3 pt-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Floating scroll-to-bottom button */}
      {showScrollButton && (
        <Button
          size="icon"
          variant="secondary"
          onClick={scrollToBottom}
          className={cn(
            "absolute right-6 bottom-20 rounded-full shadow-lg"
          )}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
