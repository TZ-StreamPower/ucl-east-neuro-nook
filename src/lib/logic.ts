export type Origin = "home" | "preview";
export const practiceExitTarget = (o: Origin) => (o === "preview" ? "/route/preview" : "/");
export const canPublish = (t: string) => t.trim().length > 0;
export const nextStep = (s: number, total: number) => Math.min(s + 1, total - 1);
export const prevStep = (s: number) => Math.max(s - 1, 0);
export type Question = { id: string; text: string; routeId: string };
export function addQuestion(list: Question[], text: string, routeId: string, id: string): Question[] {
  if (!canPublish(text)) return list;
  return [...list, { id, text: text.trim(), routeId }];
}
export function parseJSON<T>(raw: string | null, fallback: T): T {
  try { return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}
export type ThreadFrom = "feed" | "preview" | "place";
export function threadBack(f: ThreadFrom) {
  return f === "preview" ? { to: "/route/preview", label: "Route preview" } as const
    : f === "place" ? { to: "/place/marshgate", label: "Marshgate" } as const
    : { to: "/community", label: "Community" } as const;
}
