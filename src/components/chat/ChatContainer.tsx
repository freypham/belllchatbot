import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { postChatMessage } from "../../api/chatClient";
import { loadMessagesFromStorage, saveMessagesToStorage } from "../../lib/chatPersistence";
import type { ChatMessage, PropertyListing } from "../../types/chat";
import { ChatInput } from "./ChatInput";
import { ListingDetailModal } from "./ListingDetailModal";
import { MessageList } from "./MessageList";

const EMPTY_HINT =
  "Ask me to find properties based on your budget, location, or preferences";

function newId(): string {
  return crypto.randomUUID();
}

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadMessagesFromStorage(),
  );
  const [draft, setDraft] = useState("");
  const [modalListing, setModalListing] = useState<PropertyListing | null>(
    null,
  );

  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  const mutation = useMutation({
    mutationFn: (text: string) => postChatMessage(text),
  });

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text || mutation.isPending) return;

    const userMessage: ChatMessage = {
      id: newId(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");

    mutation.mutate(text, {
      onSuccess: (data) => {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content: data.message,
            listings: data.listings,
          },
        ]);
      },
      onError: (err) => {
        const msg =
          err instanceof Error ? err.message : "Something went wrong. Try again.";
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: msg },
        ]);
      },
    });
  }, [draft, mutation]);

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col bg-[var(--bg)]">
      <header className="shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[768px] items-center justify-between gap-3">
          <div className="text-left">
            <h1 className="text-base font-semibold text-[var(--text-h)]">
              Bella
            </h1>
            <p className="text-xs text-[var(--text)]">Real estate assistant</p>
          </div>
        </div>
      </header>

      <MessageList
        messages={messages}
        isTyping={mutation.isPending}
        onSelectListing={setModalListing}
        emptyHint={EMPTY_HINT}
      />

      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={mutation.isPending}
      />

      <ListingDetailModal
        listing={modalListing}
        onClose={() => setModalListing(null)}
      />
    </div>
  );
}
