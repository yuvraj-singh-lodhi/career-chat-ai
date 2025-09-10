"use client"

import * as React from "react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { MessageList } from "@/components/chat/MessageList"
import { ChatComposer } from "@/components/chat/ChatComposer"
import { trpc } from "@/lib/trpc"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI career counselor. How can I help today?",
      createdAt: new Date(),
    },
  ]);
  const messageIdRef = React.useRef(2);

  // Correctly access the mutation status from the useMutation hook
  const sendMessageMutation = trpc.message.create.useMutation();

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: messageIdRef.current.toString(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    messageIdRef.current += 1;

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const formattedMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await sendMessageMutation.mutateAsync({
        messages: formattedMessages,
      });

      const aiMessage: ChatMessage = {
        id: messageIdRef.current.toString(),
        role: "assistant",
        content: response.message,
        createdAt: new Date(),
      };
      messageIdRef.current += 1;
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Oops! Something went wrong. Please try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <ChatLayout>
      <MessageList messages={messages} />
      <ChatComposer onSend={handleSend} disabled={sendMessageMutation.isPending} />
    </ChatLayout>
  );
}