import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronLeft, Footprints, MessageCircle } from "lucide-react";
import { Shell, Heading, Sheet, backCls, primaryBtn, secondaryBtn } from "@/components/Shell";
import { MapCanvas, MapPin } from "@/components/Browse";
import { SaveShare } from "@/components/SaveShare";
import { ExpectRows } from "@/components/ExpectRows";
import { PostCard } from "@/components/PostCard";
import { findRoute, ILLUSTRATIVE, VISIT_US } from "@/data/demo";
import { useStore } from "@/lib/store";
import { allPosts, toCard } from "@/lib/posts";
import { setStep } from "@/lib/logic";
import { pageHead } from "@/lib/head";
type Tab = "overview" | "expect" | "community";
const TABS: { id: Tab; l: string }[] = [{ id: "overview", l: "Overview" }, { id: "expect", l: "What to expect" }, { id: "community", l: "Community" }];
export const Route = createFileRoute("/route/$id")({
  validateSearch: zodValidator(z.object({ tab: fallback(z.string(), "overview").default("overview") })),
  loader: ({ params }) => { const r = findRoute(params.id); if (!r) throw notFound(); return r; },
  head: pageHead("Route preview · UCL East Community", "Example campus route with landmarks, what to expect and discussion."), component: Preview });
function Preview() {
  const r = Route.useLoaderData(); const raw = Route.useSearch().tab; const tab: Tab = raw === "expect" || raw === "community" ? raw : "overview"; const s = useStore(); const nav = useNavigate();
  const [pin, setPin] = useState<number | null>(null);
  const resume = s.steps[r.id] !== undefined;
  const posts = allPosts(s.questions).filter((p) => p.routeId === r.id);
  return (
    <Shell back={<Link to="/" className={backCls}><ChevronLeft className="size-4" />Campus</Link>}
      footer={<Link to="/route/$id/steps" params={{ id: r.id }} className={primaryBtn}>{resume ? `Resume directions · step ${s.steps[r.id]! + 1}` : "Start directions"} <ArrowRight className="size-4" /></Link>}>
      <MapCanvas line={r.steps.map((x) => x.landmark.xy)}>
        {r.steps.map((x, i) => <MapPin key={i} xy={x.landmark.xy} label={`Stop ${i + 1}: ${x.landmark.name}`} active={pin === i} onClick={() => setPin(i)}>{i + 1}</MapPin>)}
      </MapCanvas>
      <p className="-mt-2 text-xs text-muted-foreground">Tap a numbered stop for its landmark.</p>
      <div><Heading>{r.to}</Heading><p className="text-muted-foreground">From {r.from} · {r.minutes} min walk · <b>Example route</b></p></div>
      <SaveShare item={{ kind: "route", id: r.id }} />
      <div role="tablist" aria-label="Route details" className="grid grid-cols-3 border-b border-border">
        {TABS.map((t) => (
          <Link key={t.id} role="tab" aria-selected={tab === t.id} to="/route/$id" params={{ id: r.id }} search={{ tab: t.id }} replace
            className={`flex min-h-12 items-center justify-center border-b-[3px] px-1 text-center text-sm font-bold ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted-foreground"}`}>{t.l}</Link>
        ))}
      </div>
      <div role="tabpanel" className="space-y-4">
        {tab === "overview" && <>
          <p>{r.summary}</p>
          <ol className="space-y-2">{r.steps.map((x, i) => <li key={i} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span><span><b className="text-primary">{x.title}.</b> {x.text}</span></li>)}</ol>
          <Link to="/practice" search={{ from: "route", route: r.id }} onClick={() => s.set({ stage: 1, choice: null })} className="flex items-center gap-3 rounded-2xl bg-practice p-3">
            <span className="grid size-12 place-items-center rounded-xl bg-background text-primary"><Footprints className="size-5" /></span>
            <span className="flex-1"><span className="block font-display font-bold text-primary">Practise this arrival</span><span className="block text-sm text-muted-foreground">Optional · try the first moments before you go</span></span><ArrowRight className="size-4 text-primary" /></Link>
          <a href={VISIT_US} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary underline">Official UCL East Visit Us page</a>
        </>}
        {tab === "expect" && <ExpectRows rows={r.expect} />}
        {tab === "community" && <>
          {posts.length ? <ul className="space-y-3">{posts.map((p) => <li key={p.id}><PostCard p={toCard(p, s.replies, p.id.startsWith("q-"))} from="route" ctx={r.id} /></li>)}</ul> : <p className="text-muted-foreground">No posts about this route yet.</p>}
          <Link to="/community/new" search={{ from: "route", route: r.id }} className={secondaryBtn}><span className="flex items-center gap-2"><MessageCircle className="size-4" />Ask about this route</span><ArrowRight className="size-4" /></Link>
        </>}
      </div>
      <p className="text-xs text-muted-foreground">{ILLUSTRATIVE}</p>
      {pin !== null && (
        <Sheet title={`Stop ${pin + 1} · ${r.steps[pin]!.landmark.name}`} onClose={() => setPin(null)}>
          <p>{r.steps[pin]!.landmark.cue}</p>
          <button className={primaryBtn} onClick={() => { s.set({ steps: setStep(s.steps, r.id, pin) }); nav({ to: "/route/$id/steps", params: { id: r.id } }); }}>View this step <ArrowRight className="size-4" /></button>
        </Sheet>
      )}
    </Shell>
  );
}
