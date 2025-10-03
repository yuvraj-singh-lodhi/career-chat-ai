"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatLayout({ children, className }: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-screen w-full bg-background",
        "items-center justify-center", 
        className
      )}
    >
      <main className="flex h-screen flex-col items-center justify-center w-full max-w-3xl p-4">
        {children}
      </main>
    </div>
  );
}
