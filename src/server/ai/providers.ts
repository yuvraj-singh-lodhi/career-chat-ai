import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ChatMessage, AIProvider } from "./types";
import { getSystemInstruction } from "./utils";

export class GeminiProvider implements AIProvider {
  private model: GenerativeModel;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is not set. Please add it to your .env.local file.");
      throw new Error("Missing GEMINI_API_KEY");
    } else {
      console.log("✅ GEMINI_API_KEY successfully loaded.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    // Always prepend system instruction
    const finalMessages = [getSystemInstruction(), ...messages];

    const contents = finalMessages.map((m) => {
      // 🔥 Map roles to Gemini-compatible ones
      let role: "user" | "model" = "user";
      if (m.role === "assistant") {
        role = "model";
      } else if (m.role === "user" || m.role === "system") {
        role = "user";
      }

      const parts: any[] = [];

      if (m.content) {
        parts.push({ text: m.content });
      }

      if (m.audio) {
        parts.push({
          inlineData: {
            mimeType: m.audio.mimeType,
            data: m.audio.base64,
          },
        });
      }

      return { role, parts };
    });

    const result = await this.model.generateContent({ contents });
    return result.response.text() ?? "";
  }
}
