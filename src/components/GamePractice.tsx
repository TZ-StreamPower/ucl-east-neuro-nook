import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { GAME_URL } from "@/data/demo";
import { GAME_FINISH_ID, gameSrc, inspectGameFrame, readFrameDocument } from "@/lib/gameFrame";

const bar = "retro inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold";
/** No usable game document within this time → show Retry. */
const LOAD_TIMEOUT_MS = 12000;

/** Full-screen local game over the route page; parent stays mounted so scroll/tab survive. */
export function GamePractice({
  onBack,
  onAsk,
  backLabel = "Route",
}: {
  onBack: () => void;
  onAsk: () => void;
  backLabel?: string;
}) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);
  const back = useRef(onBack);
  back.current = onBack;
  const frame = useRef<HTMLIFrameElement>(null);
  const hooked = useRef<Document | null>(null);

  // Verify the frame holds the real game, then hook Finish and Escape inside it.
  const verify = useCallback(() => {
    const f = frame.current;
    const doc = readFrameDocument(f);
    // Unreadable (cross-origin) cannot be verified; the top bar still returns.
    const check = doc === undefined ? "ready" : inspectGameFrame(doc);
    if (check === "pending") return;
    if (check === "invalid") {
      setState("failed");
      return;
    }
    setState("ready");
    if (!doc || hooked.current === doc) return;
    hooked.current = doc;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back.current();
    };
    doc.addEventListener("keydown", onKey);
    doc.getElementById(GAME_FINISH_ID)?.addEventListener("click", () => back.current());
  }, []);

  // SSR/direct load: the iframe may finish before hydration, so onLoad never fires.
  useEffect(() => {
    verify();
  }, [attempt, verify]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") back.current();
    };
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", k);
    };
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    const t = setTimeout(() => {
      verify();
      setState((s) => (s === "loading" ? "failed" : s));
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [state, attempt, verify]);

  const retry = () => {
    hooked.current = null;
    setState("loading");
    setAttempt((k) => k + 1);
  };

  return (
    <section
      aria-label="Campus Practice game"
      className="fade-in fixed inset-0 z-40 flex flex-col bg-background"
      style={{ height: "100dvh", overscrollBehavior: "none", touchAction: "manipulation" }}
    >
      <div
        className="flex shrink-0 items-center gap-2 border-b-2 border-primary bg-accent-lavender px-3 pb-1.5"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 6px)",
          paddingLeft: "max(env(safe-area-inset-left), 12px)",
          paddingRight: "max(env(safe-area-inset-right), 12px)",
        }}
      >
        <button
          onClick={onBack}
          aria-label={`Back to ${backLabel}`}
          className={`${bar} bg-primary text-primary-foreground`}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </button>
        <button
          onClick={onAsk}
          aria-label="Ask the community"
          className={`${bar} ml-auto bg-background text-primary`}
        >
          <MessageCircle className="size-4" />
          Ask
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        {state !== "ready" && (
          <div
            role="status"
            className="absolute inset-0 z-10 grid place-items-center bg-background p-6 text-center"
          >
            {state === "loading" ? (
              <p className="font-bold text-primary">Loading practice…</p>
            ) : (
              <div className="space-y-3">
                <p className="font-bold text-primary">Couldn't load the game</p>
                <button className={`${bar} bg-primary text-primary-foreground`} onClick={retry}>
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
        <iframe
          key={attempt}
          title="Same Day, Three Paths — optional practice"
          src={gameSrc(GAME_URL, attempt)}
          ref={frame}
          onLoad={verify}
          className="absolute inset-0 size-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </section>
  );
}
