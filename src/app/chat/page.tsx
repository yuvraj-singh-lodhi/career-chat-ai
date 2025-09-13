"use client"

import * as React from "react"
import { trpc } from "@/lib/trpc"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { MessageList } from "@/components/chat/MessageList"
import { ChatComposer } from "@/components/chat/ChatComposer"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const messageIdRef = React.useRef(1)
  const sendMessageMutation = trpc.message.create.useMutation()

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: messageIdRef.current.toString(),
      role: "user",
      content,
      createdAt: new Date(),
    }
    messageIdRef.current += 1
    setMessages((prev) => [...prev, userMessage])

    const formattedMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const response = await sendMessageMutation.mutateAsync({
        messages: formattedMessages,
      })

      const aiMessage: ChatMessage = {
        id: messageIdRef.current.toString(),
        role: "assistant",
        content: response.message,
        createdAt: new Date(),
      }
      messageIdRef.current += 1
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Oops! Something went wrong. Please try again.",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const hasConversationStarted = messages.length > 0

  return (
    <ChatLayout>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {!hasConversationStarted ? (
            // INITIAL CENTERED VIEW
            <motion.div
              key="centered"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col items-center justify-center space-y-6 px-4"
            >
              {/* Centered title */}
              <h1 className="text-xl font-semibold text-center">
                Hello! I&apos;m your AI career counselor. How can I help today?
              </h1>

              {/* Centered input */}
              <ChatComposer
                onSend={handleSend}
                disabled={sendMessageMutation.isPending}
              />
            </motion.div>
          ) : (
            // NORMAL CHAT LAYOUT
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-auto">
                <MessageList messages={messages} />
              </div>
              <div>
                <ChatComposer
                  onSend={handleSend}
                  disabled={sendMessageMutation.isPending}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChatLayout>
  )
}
