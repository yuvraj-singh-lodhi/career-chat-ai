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
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async chat(messages: { role: "system" | "user" | "assistant"; content: string }[]): Promise<string> {
    // Always prepend a system instruction
    const systemInstruction = {
      role: "system" as const,
      content: `You are an AI career counselor. 
- Provide meaningful, supportive, and actionable career guidance. 
- Maintain a natural conversation flow, remembering past context. 
- Be empathetic, clear, and practical in your advice. 
- Ask clarifying questions if needed before giving guidance.`,
    };

    // Combine the system instruction with the conversation history
    const finalMessages = [systemInstruction, ...messages];

    // Convert to plain text for Gemini
    const prompt = finalMessages
      .map((m) => `${m.role === "user" ? "User" : m.role === "assistant" ? "Assistant" : "System"}: ${m.content}`)
      .join("\n");

    const result = await this.model.generateContent(prompt);

    return result.response.text() ?? "";
  }
}

// Singleton instance
const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);

export async function getAIResponse(messages: { role: "system" | "user" | "assistant"; content: string }[]) {
  return provider.chat(messages);
}
