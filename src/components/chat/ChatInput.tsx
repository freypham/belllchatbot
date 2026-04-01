import { useEffect, useRef, type KeyboardEvent } from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Message Bella…",
}: ChatInputProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!disabled) taRef.current?.focus();
  }, [disabled]);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  }

  return (
    <div
      className="border-t border-[var(--border)] bg-[var(--bg)] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-3"
    >
      <div className="mx-auto flex max-w-[768px] items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--social-bg)] p-2 shadow-[var(--shadow)] sm:p-2.5">
        <textarea
          ref={taRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          enterKeyHint="send"
          inputMode="text"
          autoComplete="off"
          autoCorrect="on"
          className="max-h-[200px] min-h-[44px] min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-base leading-relaxed text-[var(--text-h)] outline-none placeholder:text-[var(--text)]/70 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]"
          aria-label="Chat message"
        />
        <button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={() => {
            if (!disabled && value.trim()) onSend();
          }}
          className="touch-manip mb-0.5 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] px-4 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:mb-1 sm:min-w-0 sm:py-2"
        >
          Send
        </button>
      </div>
      <p className="mx-auto mt-2 hidden max-w-[768px] text-center text-[11px] text-[var(--text)]/80 sm:block">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
