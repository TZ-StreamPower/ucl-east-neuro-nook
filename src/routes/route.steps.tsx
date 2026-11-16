import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { ROUTE } from "@/data/demo";
import { useStore } from "@/lib/store";
import { nextStep, prevStep } from "@/lib/logic";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/route/steps")({ head: head("Route steps · To Marshgate", "One step at a time from Stratford Station to Marshgate."), component: Steps });
function Steps() {
  const s = useStore(); const [all, setAll] = useState(false); const [done, setDone] = useState(false);
  const i = s.step ?? 0; const st = ROUTE.steps[i]!; const last = i === ROUTE.steps.length - 1;
  if (done) return (
    <Shell back="/route/preview" backLabel="To Marshgate">
      <Scene kind="entrance" />
      <Heading>You have arrived at Marshgate</Heading>
      <p>Take your time. This was an example route.</p>
      <Link to="/route/preview" className={primaryBtn}>Back to route preview <ArrowRight className="size-4" /></Link>
    </Shell>
  );
  if (all) return (
    <Shell back="/route/preview" backLabel="To Marshgate">
      <Heading>All steps</Heading>
      <ol className="space-y-3">{ROUTE.steps.map((x, n) => <li key={n} className={`rounded-lg border p-3 ${n === i ? "border-brand" : "border-border"}`}><b>{n + 1}. {x.title}</b><p>{x.text}</p></li>)}</ol>
      <button className={primaryBtn} onClick={() => setAll(false)}>Return to step {i + 1} <ArrowRight className="size-4" /></button>
    </Shell>
  );
  return (
    <Shell back="/route/preview" backLabel="To Marshgate">
      <Scene kind={st.scene} />
      <p className="text-muted-foreground">Step {i + 1} of {ROUTE.steps.length}</p>
      <Heading key={i}>{st.title}</Heading>
      <p>{st.text}</p>
      {last ? <button className={primaryBtn} onClick={() => { s.set({ step: null }); setDone(true); }}>Finish route <ArrowRight className="size-4" /></button>
        : <button className={primaryBtn} onClick={() => s.set({ step: nextStep(i, ROUTE.steps.length) })}>Next step <ArrowRight className="size-4" /></button>}
      {i > 0 && <button className={textLink} onClick={() => s.set({ step: prevStep(i) })}><ArrowLeft className="size-4" /> Previous step</button>}
      <div className="mt-auto flex justify-between">
        <button className={textLink} onClick={() => { s.set({ step: i }); setAll(true); }}>See all steps</button>
        <Link to="/route/help" onClick={() => s.set({ step: i })} className={textLink}>Get help</Link>
      </div>
    </Shell>
  );
}
