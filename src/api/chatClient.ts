import axios from "axios";
import type { ChatApiResponse } from "../types/chat";
import {
  getSessionIdFromStorage,
  setSessionIdStorage,
} from "../lib/sessionCookie";

const DEFAULT_URL = "https://bella.staginggo.media/chatbot";

export async function postChatMessage(
  message: string,
): Promise<ChatApiResponse> {
  const url = import.meta.env.VITE_CHAT_API_URL ?? DEFAULT_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_API_KEY. Set it in .env.local");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };
  const sessionId = getSessionIdFromStorage();
  if (sessionId) {
    headers["session_id"] = sessionId;
  }

  try {
    const { data } = await axios.post<ChatApiResponse>(
      url,
      { message, session_id: sessionId },
      {
        headers,
      },
    );

    if (data.session_id) {
      setSessionIdStorage(data.session_id);
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data === "object" &&
        error.response?.data &&
        "message" in error.response.data
          ? String((error.response.data as { message: unknown }).message)
          : undefined;
      throw new Error(
        apiMessage ??
          error.message ??
          `Request failed (${error.response?.status ?? "unknown"})`,
      );
    }
    throw error;
  }
}
