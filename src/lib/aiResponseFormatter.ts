// src/lib/aiResponseFormatter.ts
export class AIResponseFormatter {
  static format(raw: string): (string | { type: "list"; items: string[] })[] {
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

    const result: (string | { type: "list"; items: string[] })[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length) {
        result.push({ type: "list", items: currentList });
        currentList = [];
      }
    };

    for (const line of lines) {
      // Detect bullet lines like "* text" or "- text"
      if (/^[-*]/.test(line)) {
        const cleaned = line.replace(/^[-*]\s*/, "").replace(/\*\*/g, "").trim();
        currentList.push(cleaned);
      } else {
        flushList();
        // remove bold markers **text**
        const cleaned = line.replace(/\*\*/g, "").trim();
        result.push(cleaned);
      }
    }

    flushList();
    return result;
  }
}
