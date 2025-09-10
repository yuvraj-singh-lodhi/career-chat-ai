"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatComposerProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onSend(value.trim())
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t bg-background px-3 py-2"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={disabled || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
