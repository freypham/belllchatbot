export function TypingIndicator() {
  return (
    <div className="message-enter flex w-full max-w-[min(100%,92%)] items-end gap-2.5">
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--social-bg)] text-xs font-semibold text-[var(--text-h)]"
        aria-hidden
      >
        B
      </div>
      <div className="flex flex-col items-start">
        <span className="mb-1 px-1 text-xs font-medium text-[var(--text)]/80">
          Bella
        </span>
        <div
          className="flex items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--social-bg)] px-4 py-3 text-sm text-[var(--text)]"
          aria-live="polite"
          aria-label="Assistant is typing"
        >
          <span className="typing-dot h-2 w-2 animate-bounce rounded-full bg-[var(--text)]/50 [animation-delay:0ms]" />
          <span className="typing-dot h-2 w-2 animate-bounce rounded-full bg-[var(--text)]/50 [animation-delay:150ms]" />
          <span className="typing-dot h-2 w-2 animate-bounce rounded-full bg-[var(--text)]/50 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
