import { chatWithAI } from "./chat";
import { ChatMessage } from "./types";

/**
 * Generate a descriptive session title from AI based on conversation messages
 */
export async function generateAITitle(messages: ChatMessage[]): Promise<string> {
  if (messages.length === 0) return "New Chat";

  // Use AI to summarize the conversation in 5-7 words
  const promptMessage: ChatMessage = {
    role: "user",
    content: "Please provide a concise 5-7 word title summarizing the conversation for this chat.",
  };

  const aiResponse = await chatWithAI([...messages, promptMessage]);
  let title = aiResponse.message.trim();

  // Fallback if AI gives empty response
  if (!title) {
    title = messages[0]?.content ? messages[0].content.substring(0, 50) + "..." : "New Chat";
  }

  return title.length > 50 ? title.substring(0, 50) + "..." : title;
}
