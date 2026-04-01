import type { ThemeMode } from "../../hooks/useChatTheme";

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--social-bg)] px-3 py-2 text-xs font-medium text-[var(--text-h)] transition hover:opacity-90"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`${theme === "dark" ? "Light" : "Dark"} mode`}
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

function IconSun() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3c.5 0 .73.61.38.97A7 7 0 0 0 20.03 12.4c.36-.36.97-.12.97.39z" />
    </svg>
  );
}
