"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AIResponseFormatter } from "@/lib/aiResponseFormatter"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user"
  const parts = role === "assistant" ? AIResponseFormatter.format(content) : [content]

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-2 text-sm shadow-sm whitespace-pre-line",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {parts.map((part, idx) =>
          typeof part === "string" ? (
            <p key={idx} className="mb-2 last:mb-0 leading-relaxed">
              {part}
            </p>
          ) : (
            <ul key={idx} className="list-disc pl-5 space-y-1">
              {part.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  )
}
