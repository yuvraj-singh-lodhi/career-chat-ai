"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useSession } from "next-auth/react";
import { ChatSession } from "@/components/chat/ChatSession";

export default function ChatLandingPage() {
  const router = useRouter();
  const { data: authSession, status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
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

  // 🚀 Do not create session here
  return <ChatSession sessionId={null} />;
}
