import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { chatWithAI } from "@/server/ai/chat";
import { generateAITitle } from "@/server/ai/sessionTitle";

export const messageRouter = router({
  create: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userId: z.string(),
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sessionId, userId, role, content } = input;

      try {
        // 1️⃣ Validate existing session
        const existingSession = await ctx.db.sessions.findUnique({
          where: { id: sessionId },
        });
        if (!existingSession) throw new Error("Session not found");

        // 2️⃣ Save user/assistant message
        const newMessage = await ctx.db.messages.create({
          data: {
            session_id: sessionId,
            user_id: userId,
            role,
            content,
          },
        });

        // 3️⃣ Update session title if first user message using AI
        if (role === "user" && (!existingSession.title || existingSession.title === "New Chat")) {
          try {
            const previousMessages = await ctx.db.messages.findMany({
              where: { session_id: sessionId },
              orderBy: { created_at: "asc" },
            });

            const conversationHistory = previousMessages.map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            }));

            // Generate AI title
            const aiTitle = await generateAITitle(conversationHistory);

            await ctx.db.sessions.update({
              where: { id: sessionId },
              data: { title: aiTitle },
            });
          } catch (err) {
            console.error("AI title generation failed, using fallback:", err);
            // Fallback: first 50 chars of user message
            await ctx.db.sessions.update({
              where: { id: sessionId },
              data: { title: content.substring(0, 50) + "..." },
            });
          }
        }

        // 4️⃣ If user message → call AI and save assistant reply
        let aiMessage = null;
        if (role === "user") {
          try {
            const previousMessages = await ctx.db.messages.findMany({
              where: { session_id: sessionId },
              orderBy: { created_at: "asc" },
              take: 10,
            });

            const conversationHistory = previousMessages
              .filter((msg) => msg.role !== "system")
              .map((msg) => ({ role: msg.role as "user" | "assistant", content: msg.content }));

            const aiReply = await chatWithAI(conversationHistory);

            aiMessage = await ctx.db.messages.create({
              data: {
                session_id: sessionId,
                user_id: userId,
                role: "assistant",
                content: aiReply.message,
              },
            });
          } catch (err) {
            console.error("AI reply error:", err);
          }
        }

        return { sessionId, userMessage: newMessage, aiMessage };
      } catch (err) {
        console.error("message.create error:", err);
        throw new Error("Failed to create message");
      }
    }),

  list: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.messages.findMany({
        where: { session_id: input.sessionId },
        orderBy: { created_at: "asc" },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.messages.delete({ where: { id: input.id } });
    }),

  deleteBySession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.messages.deleteMany({
        where: { session_id: input.sessionId },
      });
    }),
});
