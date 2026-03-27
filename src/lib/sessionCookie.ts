const SESSION_STORAGE_KEY = "session_id";

export function getSessionIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return value && value.length > 0 ? value : null;
}

export function setSessionIdStorage(sessionId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
}

