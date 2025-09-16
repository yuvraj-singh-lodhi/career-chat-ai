"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Rocket } from "lucide-react";
import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gradient-to-b from-background via-muted/40 to-background text-center">
      <motion.div
        className="flex flex-col items-center max-w-3xl w-full space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge with icon */}
        <Badge
          variant="outline"
          className="px-4 py-2 text-sm font-medium flex items-center space-x-2"
        >
          <Rocket className="w-4 h-4 text-blue-500" />
          <span>AI Career Assistant</span>
        </Badge>

        {/* Icon animation */}
        <Sparkles className="w-14 h-14 text-blue-500 animate-pulse drop-shadow-lg" />

        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Your Career&#39;s AI Co-pilot
        </h1>

        {/* Subtext */}
        <p className="text-lg text-muted-foreground max-w-xl md:text-xl">
          Get personalized advice, practice for interviews, and explore new
          opportunities with a friendly AI career counselor.
        </p>

        {/* Action Button inside a Card */}
        <Card className="w-full max-w-lg shadow-lg border border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Ready to take off?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {status === "authenticated" ? (
              <Link href="/chat">
                <Button
                  size="lg"
                  className="h-12 text-md font-semibold px-8 shadow-lg transition-transform hover:scale-105"
                >
                  Continue to Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth?callbackUrl=/chat">
                <Button
                  size="lg"
                  className="h-12 text-md font-semibold px-8 shadow-lg transition-transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
