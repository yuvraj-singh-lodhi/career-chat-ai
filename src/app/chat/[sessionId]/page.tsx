// app/chat/[sessionId]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ChatSession } from "@/components/chat/ChatSession";

export default function ChatSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  if (!sessionId) return <div>Invalid session</div>;

  return <ChatSession sessionId={sessionId} />;
}
