"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b bg-background px-4",
        className
      )}
    >
      {/* Brand */}
      <Link href="/" className="text-lg font-semibold">
        AI career counselor
      </Link>

      {/* Right side */}
      <nav className="flex items-center gap-4">
        <Link href="/chat/new" className="text-sm hover:underline">
          New Chat
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  )
}