import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage, PropertyListing } from "../../types/chat";
import { ListingCarousel } from "./ListingCarousel";

/** Emphasize common real-estate keywords outside existing `**markdown**` spans. */
function enhanceMarkdownForHighlights(content: string): string {
  const keywords =
    /\b(budget|location|preferences|Condo|HDB|MRT|district|sqft|bedroom|bathroom)\b/gi;
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) return part;
      return part.replace(keywords, (match) => `**${match}**`);
    })
    .join("");
}

const markdownComponents = {
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-[var(--text-h)]">{children}</strong>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-3 list-disc pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-3 list-decimal pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  code: ({
    inline,
    children,
  }: {
    inline?: boolean;
    children?: ReactNode;
    className?: string;
  }) => {
    const isBlock = !inline;
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-lg bg-[var(--code-bg)] p-3 text-[13px] font-mono text-[var(--text-h)]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[var(--code-bg)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--text-h)]">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="mb-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 last:mb-0">
      {children}
    </pre>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      className="font-medium text-[var(--accent)] underline underline-offset-2 hover:opacity-90"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

type MessageItemProps = {
  message: ChatMessage;
  onSelectListing: (listing: PropertyListing) => void;
};

export function MessageItem({ message, onSelectListing }: MessageItemProps) {
  const isUser = message.role === "user";
  const senderName = isUser ? "You" : "Bella";
  const avatarLabel = isUser ? "Y" : "B";
  const displayContent = isUser
    ? message.content
    : enhanceMarkdownForHighlights(message.content);

  return (
    <div
      className={`message-enter flex w-full flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex w-full max-w-[min(100%,92%)] items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
            isUser
              ? "bg-[var(--accent)]/15 text-[var(--accent)]"
              : "border border-[var(--border)] bg-[var(--social-bg)] text-[var(--text-h)]"
          }`}
          aria-hidden
        >
          {avatarLabel}
        </div>
        <div
          className={`flex min-w-0 flex-col ${isUser ? "items-end" : "items-start"}`}
        >
          <span className="mb-1 px-1 text-xs font-medium text-[var(--text)]/80">
            {senderName}
          </span>
          <div
            className={`max-w-[min(100%,85vw)] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
              isUser
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] bg-[var(--social-bg)] text-[var(--text)]"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap text-left">{message.content}</p>
            ) : (
              <div className="prose-chat text-left">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
      {!isUser && message.listings && message.listings.length > 0 && (
        <div className="w-full max-w-full pl-10">
          <ListingCarousel
            listings={message.listings}
            onSelectListing={onSelectListing}
          />
        </div>
      )}
    </div>
  );
}
