import { GeminiProvider } from "./providers";
import { ChatMessage } from "./types";

const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);

export async function getAIResponse(messages: ChatMessage[]) {
  return provider.chat(messages);
}
