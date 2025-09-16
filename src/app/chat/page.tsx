"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useSession } from "next-auth/react";
import { ChatSession } from "@/components/chat/ChatSession";

export default function ChatLandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth"); 
    }
  }, [status, router]);

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

  return <ChatSession sessionId={null} />;
}
