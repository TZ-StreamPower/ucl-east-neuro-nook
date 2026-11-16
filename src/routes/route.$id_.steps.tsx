import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, List, LifeBuoy } from "lucide-react";
import { Shell, Heading, Sheet, backCls, primaryBtn, pill } from "@/components/Shell";
import { MapCanvas, MapPin } from "@/components/Browse";
import { findRoute, VISIT_US } from "@/data/demo";
import { useStore } from "@/lib/store";
import { nextStep, prevStep, setStep, clearStep } from "@/lib/logic";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/route/$id_/steps")({
  loader: ({ params }) => { const r = findRoute(params.id); if (!r) throw notFound(); return r; },
  head: pageHead("Directions · UCL East Community", "Step-by-step directions with landmarks."), component: Steps });
function Steps() {
  const r = Route.useLoaderData(); const s = useStore();
  const [sheet, setSheet] = useState<"overview" | "help" | null>(null); const [done, setDone] = useState(false);
  const n = r.steps.length; const i = Math.min(s.steps[r.id] ?? 0, n - 1); const st = r.steps[i]!; const last = i === n - 1;
  const go = (k: number) => s.set({ steps: setStep(s.steps, r.id, k) });
  const back = <Link to="/route/$id" params={{ id: r.id }} className={backCls}><ChevronLeft className="size-4" />Route preview</Link>;
  if (done) return (
    <Shell back={back}>
      <Heading>You have arrived at {r.to}</Heading>
      <p>Take your time. This was an example route.</p>
      <Link to="/route/$id" params={{ id: r.id }} className={primaryBtn}>Back to route preview <ArrowRight className="size-4" /></Link>
    </Shell>
  );
  return (
    <Shell back={back}>
      <MapCanvas line={r.steps.map((x) => x.landmark.xy)}>
        {r.steps.map((x, k) => <MapPin key={k} xy={x.landmark.xy} label={`Step ${k + 1}: ${x.landmark.name}`} active={k === i} onClick={() => go(k)}>{k + 1}</MapPin>)}
      </MapCanvas>
      <section aria-label="Current step" className="space-y-3 rounded-t-2xl border border-border p-4 shadow-md">
        <div className="flex items-center gap-3"><p className="text-sm text-muted-foreground">Step {i + 1} of {n}</p>
          <div className="flex flex-1 gap-1" aria-hidden="true">{r.steps.map((_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= i ? "bg-brand" : "bg-border"}`} />)}</div></div>
        <Heading key={i}>{st.title}</Heading>
        <p>{st.text}</p>
        <p className="rounded-lg bg-accent p-2 text-sm"><b>Landmark · {st.landmark.name}.</b> {st.landmark.cue}</p>
        <div className="grid grid-cols-2 gap-2">
          <button disabled={i === 0} onClick={() => go(prevStep(i))} className="inline-flex min-h-12 items-center justify-center gap-1 rounded-lg border border-border font-bold text-primary disabled:opacity-40"><ArrowLeft className="size-4" />Previous</button>
          {last ? <button className="inline-flex min-h-12 items-center justify-center gap-1 rounded-lg bg-primary font-bold text-primary-foreground" onClick={() => { s.set({ steps: clearStep(s.steps, r.id) }); setDone(true); }}>Finish route</button>
            : <button className="inline-flex min-h-12 items-center justify-center gap-1 rounded-lg bg-primary font-bold text-primary-foreground" onClick={() => go(nextStep(i, n))}>Next<ArrowRight className="size-4" /></button>}
        </div>
        <div className="flex gap-2"><button className={pill} onClick={() => setSheet("overview")}><List className="size-4" />Route overview</button><button className={pill} onClick={() => setSheet("help")}><LifeBuoy className="size-4" />Help</button></div>
      </section>
      {sheet === "overview" && <Sheet title="Route overview" onClose={() => setSheet(null)}>
        <ol className="space-y-2">{r.steps.map((x, k) => <li key={k} className={`rounded-lg border p-3 ${k === i ? "border-2 border-brand" : "border-border"}`}><b>{k + 1}. {x.title}</b>{k === i && <span className="ml-1 text-sm text-brand">· current</span>}<p className="text-sm">{x.text}</p></li>)}</ol>
        <button className={primaryBtn} onClick={() => setSheet(null)}>Return to step {i + 1} <ArrowRight className="size-4" /></button>
      </Sheet>}
      {sheet === "help" && <Sheet title="Get help" onClose={() => setSheet(null)}>
        <ul className="list-disc space-y-1 pl-5"><li>You can stop at any time. Your step is kept.</li><li>Ask staff at the Student Support desk in Marshgate reception.</li></ul>
        <a href={VISIT_US} target="_blank" rel="noreferrer" className="font-bold text-primary underline">Official UCL East Visit Us page</a>
        <button className={primaryBtn} onClick={() => setSheet(null)}>Return to step {i + 1} <ArrowRight className="size-4" /></button>
      </Sheet>}
    </Shell>
  );
}
