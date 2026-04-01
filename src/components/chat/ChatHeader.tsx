import { ThemeToggle } from "./ThemeToggle";
import type { ThemeMode } from "../../hooks/useChatTheme";
import { Avatar } from "./Avatar";

type ChatHeaderProps = {
  theme: ThemeMode;
  onThemeToggle: () => void;
  title?: string;
  subtitle?: string;
  avatarSrc?: string;
  avatarAlt?: string;
};

export function ChatHeader({
  theme,
  onThemeToggle,
  title = "Bella",
  subtitle = "Real estate assistant",
}: ChatHeaderProps) {
  return (
    <header className="shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[768px] items-center justify-between gap-3">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Avatar />
            <h1 className="text-base font-semibold text-[var(--text-h)]">
              {title}
            </h1>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-0.5 text-xs text-(--text)">{subtitle}</p>
        </div>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
