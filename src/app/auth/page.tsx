"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, ArrowLeft, Sparkles, User, Mail, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BackgroundPaths } from "@/components/ui/background-paths";

const AnimatedRocket = motion(Rocket);

export default function AuthPage() {
  const router = useRouter();
  const { status } = useSession();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signupMutation = trpc.user.signup.useMutation();

  useEffect(() => {
    if (status === "authenticated") router.replace("/chat");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isSignUp) await signupMutation.mutateAsync({ name, email, password });

      const result = await signIn("credentials", { redirect: false, email, password });
      if (!result?.ok) throw new Error(result?.error || "Invalid email or password");

      router.replace("/chat");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-gray-400">
        <p className="animate-pulse">Checking auth...</p>
      </div>
    );
  }

  if (status === "authenticated") return null;

  const headingText = isSignUp ? "Join AI Journey" : "Welcome Back";

  return (
    <BackgroundPaths>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8 px-4 md:px-6 text-center">

        {/* Animated Heading */}
        <motion.h1
          key={headingText} // force re-mount to replay animation
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-4 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {headingText.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-2 last:mr-0">
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={`${wordIndex}-${letterIndex}`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: wordIndex * 0.1 + letterIndex * 0.02,
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Glass Card Form */}
        <Card glass className="w-full max-w-2xl shadow-lg border border-white/20 bg-transparent backdrop-blur-sm relative">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute top-4 left-4 flex items-center space-x-1 text-purple-400 hover:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-semibold text-white">
              {isSignUp ? "Sign Up" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isSignUp ? "Create your account" : "Enter your credentials"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-9 bg-white/10 border-none text-white placeholder-gray-400"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 bg-white/10 border-none text-white placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 bg-white/10 border-none text-white placeholder-gray-400"
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm text-center font-medium">{errorMessage}</p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-transform"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>

              <p className="text-sm text-center text-gray-300">
                {isSignUp ? "Have an account?" : "No account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium text-purple-400 hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </BackgroundPaths>
  );
}
