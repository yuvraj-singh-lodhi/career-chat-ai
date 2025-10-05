"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, ArrowRight } from "lucide-react";
import React from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";

const AnimatedRocket = motion(Rocket);

export default function HomePage() {
  const { status } = useSession();
  const title = "AI Career Assistant";

  return (
    <BackgroundPaths>
      {/* Make this div full screen and flex center */}
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8 px-4 md:px-6 text-center">
        {/* Badge with Rocket */}
        <Badge
          variant="outline"
          className="px-4 py-2 text-sm font-medium flex items-center space-x-2 backdrop-blur-md border-white/20 bg-white/10"
        >
          <AnimatedRocket
            className="w-4 h-4 text-blue-500"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              scale: 1.3,
              rotate: 15,
              y: -4,
              filter: "drop-shadow(0 0 6px rgb(59 130 246))",
            }}
          />
          <span>{title}</span>
        </Badge>

        {/* Animated Heading */}
        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-4 max-w-5xl mx-auto leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {"Your AI Career Co-pilot".split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-4 last:mr-0">
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={`${wordIndex}-${letterIndex}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: wordIndex * 0.15 + letterIndex * 0.03,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  className="inline-block text-transparent bg-clip-text 
                      bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                      dark:from-white dark:to-white/80"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Subtext */}
        <p className="text-lg text-muted-foreground max-w-xl md:text-xl mx-auto">
          Get personalized advice, practice for interviews, and explore new
          opportunities with your friendly AI career counselor.
        </p>

        {/* Glass Card with Button */}
        <Card glass className="w-full max-w-lg shadow-lg border border-white/20 bg-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Ready to take off?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {status === "authenticated" ? (
              <Link href="/chat">
                <Button
                  size="lg"
                  className="h-12 text-md font-semibold px-8 shadow-lg transition-transform hover:scale-105 bg-white/90 hover:bg-white text-black"
                >
                  Continue to Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth?callbackUrl=/chat">
                <motion.div
                  whileHover="hover"
                  className="group relative h-12 text-md font-semibold px-8 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-md transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Get Started</span>
                  <motion.div
                    variants={{
                      hover: {
                        x: [0, 6, 0],
                        transition: { duration: 0.5, ease: "easeInOut" },
                      },
                    }}
                    className="ml-2 flex items-center"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </Link>
            )}
          </CardContent>
        </Card>
        
      </div>
    </BackgroundPaths>
  );
}
