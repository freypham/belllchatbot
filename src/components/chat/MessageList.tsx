import { useEffect, useRef } from "react";
import type { ChatMessage, PropertyListing } from "../../types/chat";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

type MessageListProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  onSelectListing: (listing: PropertyListing) => void;
  emptyHint: string;
};

export function MessageList({
  messages,
  isTyping,
  onSelectListing,
  emptyHint,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const showEmpty = messages.length === 0 && !isTyping;

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 sm:px-4"
    >
      <div className="mx-auto flex max-w-[768px] flex-col gap-6">
        {showEmpty && (
          <div className="message-enter rounded-2xl border border-dashed border-[var(--border)] bg-[var(--social-bg)]/60 px-6 py-12 text-center">
            <p className="text-lg font-medium text-[var(--text-h)]">
              Bella · Property assistant
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text)]">
              {emptyHint}
            </p>
          </div>
        )}
        {messages.map((m) => (
          <MessageItem
            key={m.id}
            message={m}
            onSelectListing={onSelectListing}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
      </div>
    </div>
  );
}
