export function newMessageId(): string {
  return crypto.randomUUID();
}

export function formatStreamStatus(tools?: string[]): string {
  if (!tools?.length) return "Thinking…";
  if (tools.includes("get_recommendations")) return "Finding recommendations…";
  return `Using: ${tools.join(", ")}`;
}
