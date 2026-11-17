import type { Cat, XY } from "@/data/demo";
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

export type ResultItem = { kind: "place" | "route"; id: string; name: string; sub: string; cat: Cat; xy: XY };
export function filterResults(items: ResultItem[], q: string, cat: Cat | "all") {
  const t = q.trim().toLowerCase();
  return items.filter((i) => (cat === "all" || i.cat === cat) && (!t || `${i.name} ${i.sub}`.toLowerCase().includes(t)));
}
export type BrowseView = "list" | "map";
export const switchView = <S extends { view: BrowseView }>(s: S, view: BrowseView): S => ({ ...s, view });

export type SavedRef = { kind: "place" | "route" | "post"; id: string };
export const isSaved = (list: SavedRef[], r: SavedRef) => list.some((x) => x.kind === r.kind && x.id === r.id);
export const toggleSaved = (list: SavedRef[], r: SavedRef) => (isSaved(list, r) ? list.filter((x) => !(x.kind === r.kind && x.id === r.id)) : [...list, r]);

export type PracticeFrom = "home" | "route";
export const practiceExit = (from: PracticeFrom, routeId: string) => (from === "route" ? { kind: "route" as const, id: routeId } : { kind: "home" as const });

export type ThreadFrom = "feed" | "route" | "place";
export function threadBack(from: ThreadFrom, ref?: string) {
  if (from === "route" && ref) return { kind: "route" as const, id: ref };
  if (from === "place" && ref) return { kind: "place" as const, id: ref };
  return { kind: "feed" as const };
}

export const setStep = (m: Record<string, number>, id: string, n: number) => ({ ...m, [id]: n });
export const clearStep = (m: Record<string, number>, id: string) => { const c = { ...m }; delete c[id]; return c; };

export type Prefs = { sound: boolean; reduceMotion: boolean; detail: "short" | "full"; routePref: "none" | "fewer-crowds" | "step-free" };
export const DEFAULT_PREFS: Prefs = { sound: false, reduceMotion: false, detail: "full", routePref: "none" };
export const visibleNotes = (notes: string[], detail: Prefs["detail"]) => (detail === "short" ? notes.slice(0, 1) : notes);
export type KeptDraft = { text: string; routeId: string } | null;
export const keepDraft = (text: string, routeId: string): KeptDraft => (canPublish(text) ? { text, routeId } : null);
export const toggleReport = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);
export const availableOffline = (saved: SavedRef[], r: SavedRef) => isSaved(saved, r);
