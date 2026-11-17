import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Footprints, Leaf, Zap, Coffee, MessageSquareHeart, Flag, MapPin as PinIcon } from "lucide-react";
import { Shell, Sheet, primaryBtn, secondaryBtn } from "@/components/Shell";
import { EastBankMap } from "@/components/scenes/EastBankMap";
import { MiniMeter, calmTone } from "@/components/SensoryMeter";
import { FeedbackTray } from "@/components/FeedbackTray";
import { NODES, GRAPH, FEEDBACK, findNode } from "@/data/sensory";
import { planRoute, nearestCalm, applyFeedback, type FeedbackKind } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/navigate")({
  validateSearch: zodValidator(z.object({ from: fallback(z.string(), "stratford").default("stratford"), to: fallback(z.string(), "marshgate").default("marshgate"), mode: fallback(z.string(), "calm").default("calm"), walk: fallback(z.number(), 0).default(0), step: fallback(z.number(), 0).default(0) })),
  head: pageHead("Navigate · UCL East Community", "Find the calmest way between Stratford, UCL East, Here East, V&A East and the DLR."), component: Navigate });

const sel = "min-h-12 w-full retro rounded-xl bg-card px-3 font-bold text-primary";
function Navigate() {
  const raw = Route.useSearch(); const nav = useNavigate({ from: "/navigate" }); const st = useStore();
  const from = findNode(raw.from)?.id ?? "stratford"; const to = findNode(raw.to)?.id ?? "marshgate"; const mode = raw.mode === "quick" ? "quick" : "calm";
  const upd = (p: Partial<typeof raw>) => nav({ search: (x) => ({ ...x, ...p }), replace: true, resetScroll: false });
  const plan = planRoute(GRAPH, from, to, mode, st.sensory);
  const path = plan?.path ?? [from]; const walking = raw.walk === 1; const step = Math.min(Math.max(raw.step, 0), path.length - 1);
  const here = findNode(path[step]!)!; const arrived = walking && step === path.length - 1;
  const [tray, setTray] = useState(false); const [brk, setBrk] = useState(false); const [saved, setSaved] = useState<string | null>(null);
  const give = (k: FeedbackKind) => { st.set({ ratings: { ...st.ratings, [here.id]: applyFeedback(st.ratings[here.id], k) }, walkFb: [...st.walkFb, { id: here.id, k }] }); setSaved(FEEDBACK.find((f) => f.k === k)!.label); };
  const breakId = nearestCalm(GRAPH, here.id, st.sensory); const breakNode = breakId ? findNode(breakId) : null;
  const line = path.map((id) => findNode(id)!.xy);

  return (
    <Shell tabs>
      {!walking && <div><h1 className="font-display text-3xl font-bold text-primary">Navigate</h1><p className="text-muted-foreground">Find the calm way across East Bank.</p></div>}
      {!walking && (
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs font-bold text-muted-foreground">From<select aria-label="From" className={sel} value={from} onChange={(e) => upd({ from: e.target.value, step: 0 })}>{NODES.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}</select></label>
          <label className="space-y-1 text-xs font-bold text-muted-foreground">To<select aria-label="To" className={sel} value={to} onChange={(e) => upd({ to: e.target.value, step: 0 })}>{NODES.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}</select></label>
          <div role="group" aria-label="Route type" className="col-span-2 grid grid-cols-2 gap-2">
            {([["calm", "Calmest", Leaf], ["quick", "Quickest", Zap]] as const).map(([m, l, I]) => (
              <button key={m} aria-pressed={mode === m} onClick={() => upd({ mode: m })} className={`retro inline-flex min-h-12 items-center justify-center gap-2 rounded-xl font-bold ${mode === m ? "bg-primary text-primary-foreground" : "bg-card text-primary"}`}><I className="size-5" />{l}</button>))}
          </div>
        </div>
      )}
      <EastBankMap line={line} className={walking ? "aspect-square" : "aspect-[4/5]"}>
        {NODES.map((n) => { const on = path.includes(n.id); const cur = walking && n.id === here.id; return (
          <button key={n.id} aria-label={n.name} disabled={walking} onClick={() => upd({ to: n.id, step: 0 })} style={{ left: `${n.xy[0]}%`, top: `${n.xy[1]}%` }}
            className={`absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center`}>
            <span className={`grid place-items-center rounded-full border-2 border-primary ${calmTone(st.sensory(n.id))} ${cur ? "size-9 ring-4 ring-brand" : on ? "size-6" : "size-4 opacity-80"}`}>{cur && <Footprints className="size-4 text-primary" />}</span>
          </button>); })}
      </EastBankMap>
      {!walking && <p className="flex flex-wrap gap-2 text-xs font-bold text-primary"><Key cls="bg-accent-lime" l="Calm" /><Key cls="bg-accent-yellow" l="Mixed" /><Key cls="bg-terracotta/40" l="Overwhelming" /></p>}

      {!plan ? <p className="rounded-xl bg-accent p-4 font-bold text-primary">No path between these places.</p> : !walking ? (
        <>
          <p className="font-display text-xl font-bold text-primary">{plan.minutes} min · {path.length - 1} {path.length === 2 ? "stage" : "stages"}</p>
          <ol className="space-y-2">{path.map((id, i) => { const n = findNode(id)!; return (
            <li key={id} className="flex items-start gap-3 retro rounded-xl bg-card p-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full border-2 border-primary text-sm font-bold text-primary ${calmTone(st.sensory(id))}`}>{i + 1}</span>
              <span className="min-w-0"><span className="block font-bold text-primary">{n.name}</span><MiniMeter s={st.sensory(id)} /></span></li>); })}</ol>
          <button className={primaryBtn} disabled={path.length < 2} onClick={() => upd({ walk: 1, step: 0 })}>Start walk <Footprints className="size-5" /></button>
        </>
      ) : (
        <>
          <section aria-live="polite" className={`retro space-y-2 rounded-2xl p-4 ${arrived ? "bg-accent-lime" : "bg-card"}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{arrived ? "You have arrived" : `Stage ${step + 1} of ${path.length}`}</p>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-primary">{arrived ? <Flag className="size-6" /> : <PinIcon className="size-6" />}{here.name}</h2>
            <p>{here.cue}</p><MiniMeter s={st.sensory(here.id)} />
            {saved && <p role="status" className="text-sm font-bold text-brand">Saved: {saved}</p>}
          </section>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setTray(true)} className="retro flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl bg-accent-lavender font-bold text-primary"><MessageSquareHeart className="size-6" />How is it here?</button>
            <button onClick={() => setBrk(true)} className="retro flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl bg-accent-blue font-bold text-primary"><Coffee className="size-6" />I need a break</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className={secondaryBtn} onClick={() => (step === 0 ? upd({ walk: 0 }) : upd({ step: step - 1 }))}><ArrowLeft className="size-4" />{step === 0 ? "Exit" : "Back"}</button>
            {arrived ? <button className={primaryBtn} onClick={() => upd({ walk: 0, step: 0 })}>Finish <Flag className="size-4" /></button>
              : <button className={primaryBtn} onClick={() => { setSaved(null); upd({ step: step + 1 }); }}>Next <ArrowRight className="size-4" /></button>}
          </div>
        </>
      )}
      {tray && <FeedbackTray place={here.name} onPick={give} onClose={() => setTray(false)} />}
      {brk && (
        <Sheet title="Take a break" onClose={() => setBrk(false)}>
          {breakNode ? (<>
            <div className="retro rounded-xl bg-accent-lime p-3"><p className="font-bold text-primary">{breakNode.name}</p><p className="text-sm">{breakNode.cue}</p><MiniMeter s={st.sensory(breakNode.id)} /></div>
            <button className={primaryBtn} onClick={() => { setBrk(false); upd({ from: here.id, to: breakNode.id, mode: "calm", step: 0, walk: 1 }); }}>Go there <ArrowRight className="size-4" /></button>
          </>) : <p>No calmer spot nearby. Pause here as long as you need.</p>}
          <button className={secondaryBtn} onClick={() => setBrk(false)}>Stay here</button>
        </Sheet>
      )}
    </Shell>
  );
}
function Key({ cls, l }: { cls: string; l: string }) { return <span className="inline-flex items-center gap-1"><span className={`size-3 rounded-full border-2 border-primary ${cls}`} />{l}</span>; }
