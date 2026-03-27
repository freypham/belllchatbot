const SESSION_COOKIE = "session_id";
const MAX_AGE_SEC = 60 * 60 * 24 * 400; // ~400 days

function parseCookies(): Record<string, string> {
  if (typeof document === "undefined") return {};
  return Object.fromEntries(
    document.cookie.split("; ").map((part) => {
      const i = part.indexOf("=");
      if (i === -1) return [part, ""];
      return [part.slice(0, i), decodeURIComponent(part.slice(i + 1))];
    }),
  );
}

export function getSessionIdFromCookie(): string | null {
  const v = parseCookies()[SESSION_COOKIE];
  return v && v.length > 0 ? v : null;
}

/** Persists session_id in a first-party cookie; value is also sent via `X-Session-Id` on API calls (Cookie header cannot be set from browser fetch to third-party origins). */
export function setSessionIdCookie(sessionId: string): void {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax`;
}
