import type { ChatMessage } from "../types/chat";

const STORAGE_KEY = "bella-chat-messages";

export function loadMessagesFromStorage(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        "id" in m &&
        "role" in m &&
        "content" in m,
    );
  } catch {
    return [];
  }
}

export function saveMessagesToStorage(messages: ChatMessage[]): void {
  try {
    const sanitized = messages.map(
      ({ isStreaming: _s, streamStatus: _st, ...rest }) => rest,
    );
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    /* quota or private mode */
  }
}
