import { chatWithAI } from "./chat";
import { ChatMessage } from "./types";

/**
 * Generate a short session title (max 5 words)
 */
export async function generateAITitle(messages: ChatMessage[]): Promise<string> {
  if (messages.length === 0) return "New Chat";

  // Prompt AI for a very short title
  const promptMessage: ChatMessage = {
    role: "user",
    content:
      "Summarize this conversation in a short title, maximum 3 words. No punctuation, just plain words.",
  };

  const aiResponse = await chatWithAI([...messages, promptMessage]);
  let title = aiResponse.message.trim();

  // Fallback if AI response is empty
  if (!title) {
    title = messages[0]?.content
      ? messages[0].content.split(" ").slice(0, 5).join(" ")
      : "New Chat";
  }

  // Ensure title is short
  return title.length > 30 ? title.substring(0, 30) : title;
}
