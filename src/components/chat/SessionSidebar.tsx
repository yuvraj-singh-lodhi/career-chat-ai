"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc"

// Chat session type
interface ChatSession {
  id: string
  title: string
  createdAt: Date
}

export function SessionSidebar() {
  // Fetch sessions from backend
  // const { data: sessions } = trpc.session.list.useQuery()

  // ✅ Test/mock data
  const sessions: ChatSession[] = [
    { id: "1", title: "AI Basics", createdAt: new Date() },
    { id: "2", title: "Next.js Project", createdAt: new Date() },
    { id: "3", title: "Sports Betting App", createdAt: new Date() },
  ]

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">My Sessions</h2>
        <Button size="icon" variant="ghost" asChild>
          <Link href="/chat/new">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Session List */}
      <ScrollArea className="flex-1">
        <ul className="space-y-1 p-2">
          {(sessions ?? []).map((session: ChatSession) => (
            <li key={session.id}>
              <Link
                href={`/chat/${session.id}`}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {session.title}
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
