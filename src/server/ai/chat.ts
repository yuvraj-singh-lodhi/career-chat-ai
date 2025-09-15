import { ChatMessage } from "./types";
import { getAIResponse } from "./index";
import { getSystemInstruction } from "./utils";

// This is now a thin wrapper for AI response only
export async function chatWithAI(messages: ChatMessage[]) {
  const finalMessages = [getSystemInstruction(), ...messages];
  const aiResponse = await getAIResponse(finalMessages);
  return { message: aiResponse };
}
