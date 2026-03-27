import axios from "axios";
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
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_API_KEY. Set it in .env.local");
  }

  const sessionFromCookie = getSessionIdFromCookie();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "x-api-key": apiKey,
  };
  if (sessionFromCookie) {
    headers["X-Session-Id"] = sessionFromCookie;
  }

  try {
    const { data } = await axios.post<ChatApiResponse>(
      url,
      { message },
      {
        headers,
      },
    );

    if (data.session_id) {
      setSessionIdCookie(data.session_id);
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
