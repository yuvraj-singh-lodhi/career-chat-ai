import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getAIResponse } from "@/server/ai/providers";

export const messageRouter = router({
  create: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Always prepend system instruction for career counseling
      const systemInstruction = {
        role: "system" as const,
        content: `You are an AI career counselor. 
- Provide meaningful, supportive, and actionable career guidance. 
- Maintain a natural conversation flow, remembering past context. 
- Be empathetic, clear, and practical in your advice. 
- Ask clarifying questions if needed before giving guidance.`,
      };

      // Merge instruction with conversation history
      const finalMessages = [systemInstruction, ...input.messages];

      const aiResponse = await getAIResponse(finalMessages);
      return { message: aiResponse };
    }),
});
