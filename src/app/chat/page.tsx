"use client";

import * as React from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatSession } from "@/components/chat/ChatSession";

export default function ChatLandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth"); // redirect to login if not logged in
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

  if (status === "unauthenticated") return null; // already redirecting

  // ✅ User is authenticated, render chat session
  return <ChatSession sessionId={null} />;
}
