export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content?: string;
  audio?: {
    mimeType: string; // e.g., "audio/mp3"
    base64: string;   // base64-encoded audio data
  };
}

export interface AIProvider {
  chat(messages: ChatMessage[]): Promise<string>;
}
