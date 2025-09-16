"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import React, { Suspense } from "react";
import { AuthButton } from "@/components/ui/auth-button";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background text-foreground text-center">
      <div className="flex flex-col items-center max-w-2xl px-4 py-8 space-y-6">
        <Sparkles className="w-16 h-16 text-blue-500 animate-pulse" />
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Your Career&#39;s AI Co-pilot
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl md:text-xl">
          Get personalized advice, practice for interviews, and explore new
          opportunities with a friendly AI career counselor.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href={session ? "/chat" : "/auth?callbackUrl=/chat"}>
            {" "}
            <Button
              size="lg"
              className="h-12 text-md font-semibold px-8 shadow-lg transition-transform transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Suspense fallback={<p>Loading...</p>}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
