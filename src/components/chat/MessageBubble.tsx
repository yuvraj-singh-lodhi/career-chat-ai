// components/chat/MessageBubble.tsx
"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

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
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
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

  const bubbleStyle: React.CSSProperties = isUser
    ? {
        backgroundColor: "#FFDAB9", // soft peach for user
        color: "#1F1F1F", // dark text
      }
    : {
        backgroundColor: "#E8E8E8", // soft neutral for assistant
        color: "#1F1F1F",
      };

  return (
    <div
      className={cn("flex w-full mb-2", isUser ? "justify-end" : "justify-start")}
    >
      <div
        style={bubbleStyle}
        className="max-w-[75%] rounded-xl px-4 py-2 text-sm shadow-sm"
      >
        {content === "•••" ? (
          <TypingBubble />
        ) : (
          <ReactMarkdown
            components={{
              p: (props) => (
                <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
              ),
              ul: (props) => (
                <ul {...props} className="list-disc pl-5 space-y-1" />
              ),
              li: (props) => <li {...props} />,
              code: (props) => (
                <code
                  {...props}
                  className="bg-gray-200 dark:bg-gray-700 rounded p-1 text-xs"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
