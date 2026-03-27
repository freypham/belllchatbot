import type { ChatApiResponse } from "../types/chat";
import {
  getSessionIdFromCookie,
  setSessionIdCookie,
} from "../lib/sessionCookie";

const DEFAULT_URL = import.meta.env.DEV
  ? "/api/chatbot"
  : "https://bella.staginggo.media/chatbot";

export async function postChatMessage(
  message: string,
): Promise<ChatApiResponse> {
  const url = import.meta.env.VITE_CHAT_API_URL ?? DEFAULT_URL;
  const apiKey = "Ebros15JE5rC9ZmdTeqOTlPlgwqX52vD3BeteqGp7eQ";
  if (!apiKey) {
    throw new Error("Missing VITE_API_KEY. Set it in .env.local");
  }

  const sessionFromCookie = getSessionIdFromCookie();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };
  if (sessionFromCookie) {
    headers["X-Session-Id"] = sessionFromCookie;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ message }),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON from chat API");
  }

  if (!res.ok) {
    const err =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : res.statusText;
    throw new Error(err || `Request failed (${res.status})`);
  }

  const body = data as ChatApiResponse;
  if (body.session_id) {
    setSessionIdCookie(body.session_id);
  }
  return body;
}
