import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addQuestion, parseJSON, DEFAULT_PREFS, type Question, type SavedRef, type Prefs, type KeptDraft, type MyRating, type FeedbackKind, type Sensory, combineRating } from "./logic";
import type { ChoiceId } from "@/data/demo";
import { SEED, DEFAULT_SENSORY } from "@/data/sensory";
export type WalkFb = { id: string; k: FeedbackKind };

type S = { saved: SavedRef[]; questions: Question[]; replies: Record<string, string[]>; steps: Record<string, number>; draft: string; choice: ChoiceId | null; stage: 1 | 2 | 3; prefs: Prefs; kept: KeptDraft; reports: string[]; offline: boolean; ratings: Record<string, MyRating>; walkFb: WalkFb[] };
const init: S = { saved: [], questions: [], replies: {}, steps: {}, draft: "", choice: null, stage: 1, prefs: DEFAULT_PREFS, kept: null, reports: [], offline: false, ratings: {}, walkFb: [] };
type Ctx = S & { set: (p: Partial<S>) => void; publish: (t: string, routeId: string) => string; reply: (postId: string, t: string) => void; sensory: (id: string) => Sensory };
const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<S>(init);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const local = parseJSON<Partial<S>>(localStorage.getItem("ucl-local-v2"), {});
    const sess = parseJSON<Partial<S>>(sessionStorage.getItem("ucl-session-v2"), {});
    setS((p) => ({ ...p, ...sess, ...local, saved: Array.isArray(local.saved) ? local.saved : [], prefs: { ...DEFAULT_PREFS, ...(local.prefs ?? {}) }, reports: Array.isArray(local.reports) ? local.reports : [], ratings: local.ratings && typeof local.ratings === "object" ? local.ratings : {}, walkFb: Array.isArray(local.walkFb) ? local.walkFb : [] }));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const { saved, questions, replies, steps, draft, choice, stage, prefs, kept, reports, offline, ratings, walkFb } = s;
    localStorage.setItem("ucl-local-v2", JSON.stringify({ saved, questions, replies, prefs, kept, reports, ratings, walkFb }));
    sessionStorage.setItem("ucl-session-v2", JSON.stringify({ steps, draft, choice, stage, offline }));
    document.documentElement.classList.toggle("reduce-motion", prefs.reduceMotion);
  }, [s, ready]);
  const set = (p: Partial<S>) => setS((x) => ({ ...x, ...p }));
  const publish = (t: string, routeId: string) => {
    const id = `q-${Date.now()}`;
    setS((x) => ({ ...x, draft: "", questions: addQuestion(x.questions, t, routeId, id) }));
    return id;
  };
  const reply = (postId: string, t: string) => { if (!t.trim()) return; setS((x) => ({ ...x, replies: { ...x.replies, [postId]: [...(x.replies[postId] ?? []), t.trim()] } })); };
  return <C.Provider value={{ ...s, set, publish, reply, sensory: (id: string) => combineRating(SEED[id] ?? DEFAULT_SENSORY, s.ratings[id]) }}>{children}</C.Provider>;
}
export function useStore() {
  const c = useContext(C);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
