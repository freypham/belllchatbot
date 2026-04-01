import type { ReactNode } from "react";

type ChatLayoutProps = {
  children: ReactNode;
};

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-dvh min-h-0 max-h-dvh flex-col overflow-hidden bg-[var(--bg)]">
      {children}
    </div>
  );
}
