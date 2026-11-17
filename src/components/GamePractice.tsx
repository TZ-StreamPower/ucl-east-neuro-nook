import { useEffect, useRef, useState } from "react";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { GAME_URL } from "@/data/demo";

const bar = "retro inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold";

/** Full-screen local game over the route page; parent stays mounted so scroll/tab survive. */
export function GamePractice({ onBack, onAsk }: { onBack: () => void; onAsk: () => void }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [key, setKey] = useState(0);
  const cb = useRef(onBack); cb.current = onBack;
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") cb.current(); };
    window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", k); };
  }, []);
  useEffect(() => {
    if (state !== "loading") return;
    const t = setTimeout(() => setState((s) => (s === "loading" ? "failed" : s)), 20000);
    return () => clearTimeout(t);
  }, [state, key]);
  return (
    <section aria-label="Campus Practice game" className="fixed inset-0 z-40 flex flex-col bg-background" style={{ height: "100dvh" }}>
      <div className="flex items-center gap-2 border-b-2 border-primary px-2 py-1" style={{ paddingTop: "max(env(safe-area-inset-top), 4px)" }}>
        <button onClick={onBack} className={`${bar} bg-primary text-primary-foreground`}><ChevronLeft className="size-4" />Back to route</button>
        <button onClick={onAsk} className={`${bar} ml-auto bg-background text-primary`}><MessageCircle className="size-4" />Ask</button>
      </div>
      <div className="relative min-h-0 flex-1">
        {state !== "ready" && (
          <div role="status" className="absolute inset-0 z-10 grid place-items-center bg-background p-6 text-center">
            {state === "loading"
              ? <p className="font-bold text-primary">Loading practice…</p>
              : <div className="space-y-3"><p className="font-bold text-primary">Couldn't load the game</p>
                  <button className={`${bar} bg-primary text-primary-foreground`} onClick={() => { setState("loading"); setKey((k) => k + 1); }}>Retry</button></div>}
          </div>
        )}
        <iframe key={key} title="Same Day, Three Paths — optional practice" src={GAME_URL} onLoad={(e) => { setState("ready"); try { e.currentTarget.contentDocument?.getElementById("finishButton")?.addEventListener("click", () => cb.current()); } catch { /* cross-origin: top bar still returns */ } }} className="absolute inset-0 size-full border-0" allow="autoplay; fullscreen" />
      </div>
    </section>
  );
}
