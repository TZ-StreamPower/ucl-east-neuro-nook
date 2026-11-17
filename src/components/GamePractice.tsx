import { useEffect, useRef, useState } from "react";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { GAME_URL } from "@/data/demo";

const bar = "retro inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold";

/** Full-screen local game over the route page; parent stays mounted so scroll/tab survive. */
export function GamePractice({ onBack, onAsk, backLabel = "Route" }: { onBack: () => void; onAsk: () => void; backLabel?: string }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [key, setKey] = useState(0);
  const cb = useRef(onBack); cb.current = onBack;
  const frame = useRef<HTMLIFrameElement>(null);
  const attach = (f: HTMLIFrameElement | null) => { if (!f) return; setState("ready"); try { const b = f.contentDocument?.getElementById("finishButton"); if (b && !b.dataset.hooked) { b.dataset.hooked = "1"; b.addEventListener("click", () => cb.current()); } } catch { /* cross-origin: top bar still returns */ } };
  // SSR/direct load: iframe may finish before hydration, so onLoad never fires.
  useEffect(() => { const f = frame.current; try { const d = f?.contentDocument; if (d && d.readyState === "complete" && d.URL !== "about:blank") attach(f); } catch { /* ignore */ } }, [key]);
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
    <section aria-label="Campus Practice game" className="fade-in fixed inset-0 z-40 flex flex-col bg-background" style={{ height: "100dvh", overscrollBehavior: "none", touchAction: "manipulation" }}>
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-primary bg-accent-lavender px-3 pb-1.5" style={{ paddingTop: "max(env(safe-area-inset-top), 6px)", paddingLeft: "max(env(safe-area-inset-left), 12px)", paddingRight: "max(env(safe-area-inset-right), 12px)" }}>
        <button onClick={onBack} aria-label={`Back to ${backLabel}`} className={`${bar} bg-primary text-primary-foreground`}><ChevronLeft className="size-4" aria-hidden="true" />{backLabel}</button>
        <button onClick={onAsk} aria-label="Ask the community" className={`${bar} ml-auto bg-background text-primary`}><MessageCircle className="size-4" />Ask</button>
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
        <iframe key={key} title="Same Day, Three Paths — optional practice" src={GAME_URL} ref={frame} onLoad={(e) => attach(e.currentTarget)} className="absolute inset-0 size-full border-0" allow="autoplay; fullscreen" />
      </div>
    </section>
  );
}
