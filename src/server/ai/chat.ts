import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export interface AIProvider {
  chat(messages: { role: "system" | "user" | "assistant"; content: string }[]): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  private model: GenerativeModel;

  constructor(apiKey: string) {
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is not set. Please add it to your .env.local file.");
      throw new Error("Missing GEMINI_API_KEY");
    } else {
      console.log("✅ GEMINI_API_KEY successfully loaded.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  async chat(messages: { role: "system" | "user" | "assistant"; content: string }[]): Promise<string> {
    const prompt = messages
      .map((m) => `${m.role === "user" ? "User" : m.role === "assistant" ? "Assistant" : "System"}: ${m.content}`)
      .join("\n");
    const result = await this.model.generateContent(prompt);
    return result.response.text() ?? "";
  }
}
const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);

export async function getAIResponse(messages: { role: "system" | "user" | "assistant"; content: string }[]) {
  return provider.chat(messages);
}