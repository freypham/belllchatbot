import { useCallback, useEffect, useState } from "react";
import { streamChatMessage } from "../../api/chatClient";
import { useChatTheme } from "../../hooks/useChatTheme";
import {
  loadMessagesFromStorage,
  saveMessagesToStorage,
} from "../../lib/chatPersistence";
import {
  formatStreamStatus,
  newMessageId,
} from "../../lib/chatStreamHelpers";
import type { ChatMessage, PropertyListing } from "../../types/chat";
import { CHAT_EMPTY_HINT } from "./chatConstants";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatLayout } from "./ChatLayout";
import { ListingDetailModal } from "./ListingDetailModal";
import { MessageList } from "./MessageList";

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadMessagesFromStorage(),
  );
  const [draft, setDraft] = useState("");
  const [modalListing, setModalListing] = useState<PropertyListing | null>(
    null,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const { theme, toggleTheme } = useChatTheme();

  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: ChatMessage = {
        id: newMessageId(),
        role: "user",
        content: text,
      };
      const assistantId = newMessageId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
        streamStatus: "Thinking…",
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsStreaming(true);

      try {
        await streamChatMessage(text, {
          onStatus: (payload) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      streamStatus: formatStreamStatus(payload.tools),
                    }
                  : m,
              ),
            );
          },
          onText: (chunk) => {
            if (!chunk) return;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: m.content + chunk,
                      streamStatus: undefined,
                    }
                  : m,
              ),
            );
          },
          onListings: (listings) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, listings } : m)),
            );
          },
          onDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      isStreaming: false,
                      streamStatus: undefined,
                    }
                  : m,
              ),
            );
          },
        });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Something went wrong. Try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: m.content || msg,
                  isStreaming: false,
                  streamStatus: undefined,
                }
              : m,
          ),
        );
      } finally {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && m.isStreaming
              ? { ...m, isStreaming: false, streamStatus: undefined }
              : m,
          ),
        );
        setIsStreaming(false);
      }
    },
    [isStreaming],
  );

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text || isStreaming) return;
    setDraft("");
    void sendMessage(text);
  }, [draft, isStreaming, sendMessage]);

  return (
    <ChatLayout>
      <ChatHeader theme={theme} onThemeToggle={toggleTheme} />

      <MessageList
        messages={messages}
        isTyping={false}
        onSelectListing={setModalListing}
        emptyHint={CHAT_EMPTY_HINT}
      />

      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={isStreaming}
      />

      <ListingDetailModal
        listing={modalListing}
        onClose={() => setModalListing(null)}
      />
    </ChatLayout>
  );
}
