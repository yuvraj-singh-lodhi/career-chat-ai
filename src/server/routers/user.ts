import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../lib/auth";

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.users.findUnique({
        where: { email: input.email },
      });
      if (existing) throw new Error("User already exists");

      const hashed = await hashPassword(input.password);

      // 1️⃣ Create user
      const user = await ctx.db.users.create({
        data: {
          name: input.name || null,
          email: input.email,
          password: hashed,
        },
      });

      // 2️⃣ Create default session for user (ONLY on signup)
      await ctx.db.sessions.create({
        data: {
          title: "New Chat",
          user_id: user.id,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.users.findUnique({
        where: { email: input.email },
      });
      if (!user || !user.password) throw new Error("Invalid credentials");

      const valid = await verifyPassword(input.password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      // ✅ Do NOT create new sessions here, only return user
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }),

  me: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.users.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
        },
      });
      if (!user) throw new Error("User not found");
      return user;
    }),
});
