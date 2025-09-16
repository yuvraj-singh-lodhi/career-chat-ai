"use client";

import * as React from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useSession } from "next-auth/react";
import { ChatSession } from "@/components/chat/ChatSession";

export default function ChatLandingPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <ChatLayout>
        <div className="flex flex-1 items-center justify-center">
          <p>Checking authentication...</p>
        </div>
      </ChatLayout>
    );
  }

  return <ChatSession sessionId={null} />;
}
