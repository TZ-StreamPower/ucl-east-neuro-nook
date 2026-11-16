import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addQuestion, parseJSON, type Origin, type Question } from "./logic";
import type { ChoiceId } from "@/data/demo";

type S = { saved: boolean; questions: Question[]; step: number | null; draft: string; choice: ChoiceId | null; origin: Origin; stage: 1 | 2 | 3 };
const init: S = { saved: false, questions: [], step: null, draft: "", choice: null, origin: "home", stage: 1 };
type Ctx = S & { set: (p: Partial<S>) => void; publish: (t: string) => void };
const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<S>(init);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const local = parseJSON(localStorage.getItem("ucl-local"), { saved: false, questions: [] as Question[] });
    const sess = parseJSON(sessionStorage.getItem("ucl-session"), {});
    setS((p) => ({ ...p, ...sess, ...local }));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("ucl-local", JSON.stringify({ saved: s.saved, questions: s.questions }));
    const { step, draft, choice, origin, stage } = s;
    sessionStorage.setItem("ucl-session", JSON.stringify({ step, draft, choice, origin, stage }));
  }, [s, ready]);
  const set = (p: Partial<S>) => setS((x) => ({ ...x, ...p }));
  const publish = (t: string) => setS((x) => ({ ...x, draft: "", questions: addQuestion(x.questions, t, "stratford-marshgate", `q-${Date.now()}`) }));
  return <C.Provider value={{ ...s, set, publish }}>{children}</C.Provider>;
}
export function useStore() {
  const c = useContext(C);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
