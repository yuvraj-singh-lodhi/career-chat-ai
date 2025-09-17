import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const sessionRouter = router({
  // Create a new session
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, userId } = input;

      const newSession = await ctx.db.sessions.create({
        data: {
          title,
          user_id: userId,
        },
      });

      return newSession;
    }),

  // List all sessions
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.sessions.findMany({
      orderBy: { created_at: "desc" },
      include: {
        _count: { select: { messages: true } },
      },
    });
  }),

  // List sessions by a specific user
  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.sessions.findMany({
        where: { user_id: input.userId },
        orderBy: { created_at: "desc" },
        include: {
          _count: { select: { messages: true } },
        },
      });
    }),

  // Get a specific session with messages
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.sessions.findUnique({
        where: { id: input.id },
        include: {
          messages: {
            orderBy: { created_at: "asc" },
          },
        },
      });
    }),

  // Update session title
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title } = input;

      if (!title) throw new Error("Title is required to update session");

      return ctx.db.sessions.update({
        where: { id },
        data: { title },
      });
    }),

  // Delete a session and its messages
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete messages first
      await ctx.db.messages.deleteMany({
        where: { session_id: input.id },
      });

      // Delete the session
      return ctx.db.sessions.delete({
        where: { id: input.id },
      });
    }),

  // Get recent sessions with last message preview
  getRecent: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const sessions = await ctx.db.sessions.findMany({
        where: { user_id: input.userId },
        orderBy: { updated_at: "desc" },
        take: input.limit,
        include: {
          messages: {
            orderBy: { created_at: "desc" },
            take: 1,
            select: { content: true, role: true, created_at: true },
          },
          _count: { select: { messages: true } },
        },
      });

      return sessions.map((session) => ({
        ...session,
        lastMessage: session.messages[0] || null,
        messages: undefined,
      }));
    }),

  // Search sessions and messages for a given query
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, userId } = input;
      if (!query.trim()) {
        return [];
      }

      const searchResults = await ctx.db.sessions.findMany({
        where: {
          user_id: userId,
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive", 
              },
            },
            {
              messages: {
                some: {
                  content: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          messages: {
            where: {
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
            select: {
              content: true,
              created_at: true,
            },
            orderBy: {
              created_at: "desc",
            },
            take: 1, 
          },
        },
        orderBy: {
          updated_at: "desc",
        },
      });

      return searchResults.map((session) => {
        const matchingMessage = session.messages[0];
        const snippet = matchingMessage?.content.substring(0, 100) + "...";
        return {
          id: session.id,
          title: session.title,
          updated_at: session.updated_at,
          snippet: matchingMessage ? snippet : null,
        };
      });
    }),
});
