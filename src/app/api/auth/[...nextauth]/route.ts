// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db"; // Prisma client
import { verifyPassword } from "@/server/lib/auth";

// LOG the secret to ensure it’s loaded correctly
console.log("NEXTAUTH_SECRET from .env:", process.env.NEXTAUTH_SECRET ? "✅ Loaded" : "❌ Missing");

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // 🔑 required in production
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.users.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) return null;

        console.log("User authorized:", user.email); // log authorized user
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth", // login page
    error: "/auth", // error page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        };
      }
      console.log("Session callback session:", session); // log session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
