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

// ---- Sensory ratings & calm navigation ----
export type Light = "dark" | "ok" | "bright";
export type Busy = "free" | "busy" | "full";
/** noise 1 = quiet … 5 = very loud; calm 1 = overwhelming … 5 = calm; n = number of ratings */
export type Sensory = { noise: number; light: Light; calm: number; busy: Busy; n: number };
export type MyRating = { noise?: number; light?: Light; calm?: number; busy?: Busy };
const r1 = (x: number) => Math.round(x * 10) / 10;
export function combineRating(seed: Sensory, mine?: MyRating | undefined): Sensory {
  if (!mine || !Object.keys(mine).length) return seed;
  return { noise: mine.noise ? r1((seed.noise * seed.n + mine.noise) / (seed.n + 1)) : seed.noise, calm: mine.calm ? r1((seed.calm * seed.n + mine.calm) / (seed.n + 1)) : seed.calm,
    light: mine.light ?? seed.light, busy: mine.busy ?? seed.busy, n: seed.n + 1 };
}
export type FeedbackKind = "quiet" | "loud" | "dark" | "bright" | "crowded" | "overwhelming" | "calm";
const FB: Record<FeedbackKind, MyRating> = { quiet: { noise: 1 }, loud: { noise: 5 }, dark: { light: "dark" }, bright: { light: "bright" }, crowded: { busy: "full" }, overwhelming: { calm: 1 }, calm: { calm: 5 } };
export const applyFeedback = (mine: MyRating | undefined, k: FeedbackKind): MyRating => ({ ...(mine ?? {}), ...FB[k] });
export type Feel = "quiet" | "soft-light" | "not-busy";
export function matchesFeel(s: Sensory, feel: Feel[]) {
  return feel.every((f) => (f === "quiet" ? s.noise <= 2.5 : f === "soft-light" ? s.light !== "bright" : s.busy === "free"));
}
export const isCalm = (s: Sensory) => s.calm >= 4 && s.noise <= 2.5;
export type Graph = { a: string; b: string; min: number }[];
const nbrs = (g: Graph, id: string) => g.flatMap((e) => (e.a === id ? [[e.b, e.min] as const] : e.b === id ? [[e.a, e.min] as const] : []));
/** Penalty multiplier for entering a node when walking the calmest way. */
export const stressCost = (s: Sensory) => 1 + (5 - s.calm) * 0.5 + (s.noise >= 4 ? 1 : 0) + (s.busy === "full" ? 0.5 : 0);
function dijkstra(g: Graph, from: string, w: (to: string, min: number) => number) {
  const dist: Record<string, number> = { [from]: 0 }; const prev: Record<string, string> = {}; const done = new Set<string>();
  for (;;) {
    let u: string | null = null;
    for (const k in dist) if (!done.has(k) && (u === null || dist[k]! < dist[u]!)) u = k;
    if (u === null) break; done.add(u);
    for (const [v, m] of nbrs(g, u)) { const d = dist[u]! + w(v, m); if (dist[v] === undefined || d < dist[v]!) { dist[v] = d; prev[v] = u; } }
  }
  return { dist, prev };
}
export function planRoute(g: Graph, from: string, to: string, mode: "quick" | "calm", get: (id: string) => Sensory) {
  if (from === to) return { path: [from], minutes: 0 };
  const { dist, prev } = dijkstra(g, from, (v, m) => (mode === "calm" ? m * stressCost(get(v)) : m));
  if (dist[to] === undefined) return null;
  const path = [to]; while (path[0] !== from) path.unshift(prev[path[0]!]!);
  let minutes = 0; for (let i = 1; i < path.length; i++) minutes += g.find((e) => (e.a === path[i - 1] && e.b === path[i]) || (e.b === path[i - 1] && e.a === path[i]))!.min;
  return { path, minutes };
}
export function nearestCalm(g: Graph, from: string, get: (id: string) => Sensory) {
  const { dist } = dijkstra(g, from, (_, m) => m);
  return Object.keys(dist).filter((k) => k !== from && isCalm(get(k))).sort((a, b) => dist[a]! - dist[b]!)[0] ?? null;
}

export type View = { z: number; x: number; y: number };
export const ZMIN = 1, ZMAX = 4;
/** Zoom to `next` keeping screen point (px,py) fixed; transform is translate(x,y) scale(z). */
export function zoomAt(v: View, next: number, px: number, py: number): View {
  const z = Math.min(ZMAX, Math.max(ZMIN, next)); const k = z / v.z;
  return { z, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
}
