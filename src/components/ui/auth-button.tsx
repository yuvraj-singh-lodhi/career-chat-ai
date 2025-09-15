// components/auth-button.tsx

"use client";
import { useSession } from "next-auth/react";
import { Button } from "./button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export function AuthButton() {
  const { status } = useSession();
  if (status === "loading") {
    return null;
  }
  if (status === "unauthenticated") {
    return (
      <Link href="/auth">
        <Button variant="outline" size="lg" className="h-12 text-md font-semibold px-8">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    );
  }
  return null;
}