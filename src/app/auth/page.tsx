"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

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

  // ✅ Redirect if user is already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/chat");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isSignUp) {
        await signupMutation.mutateAsync({ name, email, password });
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result?.ok) throw new Error(result?.error || "Invalid email or password");

      router.replace("/chat");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If already authenticated, do not show login form
  if (status === "authenticated") return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? "Sign up to get started" : "Sign in to continue"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
