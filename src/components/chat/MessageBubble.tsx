"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

function TypingBubble() {
  return (
    <div className="flex space-x-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-colors border-0",
          isUser
            ? "bg-zinc-800/70 text-zinc-100" // softer dark gray
            : "bg-zinc-700/60 text-zinc-100" // slightly lighter gray
        )}
      >
        {content === "•••" ? (
          <TypingBubble />
        ) : (
          <ReactMarkdown
            components={{
              p: (props) => (
                <p
                  {...props}
                  className="mb-2 last:mb-0 leading-relaxed text-sm"
                />
              ),
              ul: (props) => (
                <ul {...props} className="list-disc pl-5 space-y-1" />
              ),
              li: (props) => <li {...props} />,
              code: (props) => (
                <code
                  {...props}
                  className="rounded bg-zinc-900/70 px-1 py-0.5 text-xs font-mono text-zinc-200"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </Card>
    </div>
  );
}
