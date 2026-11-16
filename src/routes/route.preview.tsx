import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bookmark, MessageCircle, Plus, Minus, X, Footprints } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene, MAP_PINS } from "@/components/scenes/Scene";
import { ROUTE, EXPECT, VISIT_US, LANDMARKS, ILLUSTRATIVE, type LandmarkId } from "@/data/demo";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/route/preview")({ head: head("To Marshgate · Route preview", "Example route from Stratford Station to Marshgate."), component: Preview });
const pill = "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-bold text-primary hover:bg-accent";
function Preview() {
  const s = useStore(); const nav = useNavigate();
  const [open, setOpen] = useState(false); const [list, setList] = useState(false);
  const [pin, setPin] = useState<LandmarkId | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null); const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (pin) closeRef.current?.focus(); }, [pin]);
  const close = () => { setPin(null); trigger.current?.focus(); };
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && pin && close(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); });
  const ids = Object.keys(LANDMARKS) as LandmarkId[];
  return (
    <Shell back="/" backLabel="Campus">
      <Heading>To Marshgate</Heading>
      <p className="text-muted-foreground">From {ROUTE.from} · <span className="font-bold">Example route</span></p>
      <div className="relative">
        <Scene kind="route" />
        {ids.map((id, i) => { const [x, y] = MAP_PINS[id]; return (
          <button key={id} aria-label={`Stop ${i + 1}: ${LANDMARKS[id].name}`} aria-pressed={pin === id}
            onClick={(e) => { trigger.current = e.currentTarget; setPin(id); }}
            className={`absolute flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground ${pin === id ? "ring-[3px] ring-brand" : ""}`}
            style={{ left: `${x / 3}%`, top: `${y / 2}%` }}>{i + 1} <span className="max-[359px]:sr-only">{LANDMARKS[id].name}</span></button>); })}
      </div>
      <p className="text-sm text-muted-foreground">Tap a stop for its landmark. {ILLUSTRATIVE}.</p>
      <Link to="/route/steps" className={primaryBtn}>{s.step !== null ? "Resume steps" : "View steps"} <ArrowRight className="size-4" /></Link>
      <div>
        <button aria-expanded={list} onClick={() => setList(!list)} className={textLink}>See all steps {list ? <Minus className="size-4" /> : <Plus className="size-4" />}</button>
        {list && <ol className="list-decimal space-y-1 pl-5">{ROUTE.steps.map((x) => <li key={x.title}><b>{x.title}.</b> {x.text}</li>)}</ol>}
      </div>
      <div>
        <button aria-expanded={open} onClick={() => setOpen(!open)} className={textLink}>What to expect {open ? <Minus className="size-4" /> : <Plus className="size-4" />}</button>
        {open && <div className="space-y-2 rounded-lg bg-accent p-3"><p><b>Sound and crowds.</b> {EXPECT}</p><p><b>Surfaces.</b> Example route uses paved, step-free paths.</p><a href={VISIT_US} target="_blank" rel="noreferrer" className="font-bold text-primary underline">Official UCL East Visit Us page</a></div>}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Link to="/practice" search={{ from: "preview" }} onClick={() => s.set({ stage: 1, choice: null })} className={pill}><Footprints className="size-4" /> Practise this arrival</Link>
        <button className={pill} onClick={() => nav({ to: "/community/$id", params: { id: "station-exit" }, search: { from: "preview" } })}><MessageCircle className="size-4" /> Ask about this route</button>
        <button aria-pressed={s.saved} onClick={() => s.set({ saved: !s.saved })} className={pill}><Bookmark className={`size-4 ${s.saved ? "fill-primary" : ""}`} /> {s.saved ? "Saved" : "Save route"}</button>
      </div>
      <p role="status" className="sr-only">{s.saved ? "Route saved" : ""}</p>
      {pin && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-foreground/30" onClick={close}>
          <div role="dialog" aria-modal="true" aria-labelledby="sheet-t" onClick={(e) => e.stopPropagation()} className="w-full max-w-[430px] space-y-3 rounded-t-2xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h2 id="sheet-t" className="text-lg font-bold text-primary">Stop {LANDMARKS[pin].step + 1} · {LANDMARKS[pin].name}</h2>
              <button ref={closeRef} aria-label="Close" onClick={close} className="grid size-11 place-items-center rounded-full hover:bg-accent"><X className="size-5" /></button>
            </div>
            <Scene kind={ROUTE.steps[LANDMARKS[pin].step]!.scene === "segment" ? "bridge" : ROUTE.steps[LANDMARKS[pin].step]!.scene} className="h-36" />
            <p>{LANDMARKS[pin].cue}</p>
            <button className={primaryBtn} onClick={() => { s.set({ step: LANDMARKS[pin].step }); nav({ to: "/route/steps" }); }}>View this step <ArrowRight className="size-4" /></button>
          </div>
        </div>
      )}
    </Shell>
  );
}
