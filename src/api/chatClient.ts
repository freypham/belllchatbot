import axios from "axios";
import type { ChatApiResponse, PropertyListing } from "../types/chat";
import {
  getSessionIdFromStorage,
  setSessionIdStorage,
} from "../lib/sessionCookie";

const DEFAULT_URL = "https://bella.staginggo.media/chatbot";
const DEFAULT_STREAM_URL = "https://bella.staginggo.media/chatbot/stream";

type StreamEventBase = { message_id?: string };

type StreamEvent =
  | (StreamEventBase & { type: "message_start" })
  | (StreamEventBase & { type: "status"; tools?: string[] })
  /** Legacy stream chunks */
  | (StreamEventBase & { type: "text"; text?: string })
  /** Current API: incremental text */
  | (StreamEventBase & { type: "text_delta"; delta?: string })
  | (StreamEventBase & { type: "listings"; listings?: unknown[] })
  | (StreamEventBase & {
      type: "done";
      session_id?: string;
      full_text?: string;
    });

export type StreamHandlers = {
  onMessageStart?: (
    payload: Extract<StreamEvent, { type: "message_start" }>,
  ) => void;
  onStatus?: (payload: Extract<StreamEvent, { type: "status" }>) => void;
  /** Called for both `text` and `text_delta` chunks. */
  onText?: (text: string, messageId?: string) => void;
  onListings?: (listings: PropertyListing[], messageId?: string) => void;
  onDone?: (payload: Extract<StreamEvent, { type: "done" }>) => void;
};

function normalizeStreamListing(raw: unknown): PropertyListing | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title : "";
  if (!title) return null;
  const priceValue =
    typeof o.price_value === "number"
      ? o.price_value
      : typeof o.price === "number"
        ? o.price
        : 0;
  return {
    ...o,
    title,
    price: priceValue,
    price_value:
      typeof o.price_value === "number" ? o.price_value : undefined,
  } as PropertyListing;
}

export async function postChatMessage(
  message: string,
): Promise<ChatApiResponse> {
  const url = import.meta.env.VITE_CHAT_API_URL ?? DEFAULT_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
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

export async function streamChatMessage(
  message: string,
  handlers: StreamHandlers,
): Promise<void> {
  const url = import.meta.env.VITE_CHAT_STREAM_API_URL ?? DEFAULT_STREAM_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  const sessionId = getSessionIdFromStorage();
  const body: Record<string, unknown> = { message };
  if (sessionId) body.session_id = sessionId;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
  if (sessionId) {
    headers["X-Session-Id"] = sessionId;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }

  if (!response.body) {
    throw new Error("Stream is not available in this browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventBlock of events) {
      const dataLines = eventBlock
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());
      if (dataLines.length === 0) continue;
      const raw = dataLines.join("\n");
      if (!raw) continue;

      let payload: StreamEvent;
      try {
        payload = JSON.parse(raw) as StreamEvent;
      } catch {
        continue;
      }

      switch (payload.type) {
        case "message_start":
          handlers.onMessageStart?.(payload);
          break;
        case "status":
          handlers.onStatus?.(payload);
          break;
        case "text_delta":
          handlers.onText?.(payload.delta ?? "", payload.message_id);
          break;
        case "text":
          handlers.onText?.(payload.text ?? "", payload.message_id);
          break;
        case "listings": {
          const rawList = Array.isArray(payload.listings)
            ? payload.listings
            : [];
          const listings = rawList
            .map(normalizeStreamListing)
            .filter((x): x is PropertyListing => x !== null);
          handlers.onListings?.(listings, payload.message_id);
          break;
        }
        case "done":
          if (payload.session_id) {
            setSessionIdStorage(payload.session_id);
          }
          handlers.onDone?.(payload);
          break;
        default:
          break;
      }
    }
  }
}
