import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Shell, Heading, Sheet, backCls, primaryBtn, textLink } from "@/components/Shell";
import { ROUTES, DEFAULT_ROUTE, findRoute } from "@/data/demo";
import { useStore } from "@/lib/store";
import { canPublish, keepDraft } from "@/lib/logic";
import { pageHead } from "@/lib/head";
type From = "feed" | "practice" | "route";
export const Route = createFileRoute("/community/new")({
  validateSearch: zodValidator(z.object({ from: fallback(z.string(), "feed").default("feed"), route: fallback(z.string(), DEFAULT_ROUTE).default(DEFAULT_ROUTE) })),
  head: pageHead("Write a question · UCL East Community", "Ask a route-linked question in this demo."), component: Composer });
function Composer() {
  const s = useStore(); const nav = useNavigate(); const q = Route.useSearch(); const from: From = q.from === "practice" || q.from === "route" ? q.from : "feed"; const initial = findRoute(q.route) ? q.route : DEFAULT_ROUTE;
  const [route, setRoute] = useState(initial); const r = findRoute(route)!;
  const [preview, setPreview] = useState(false); const [err, setErr] = useState(false); const [confirm, setConfirm] = useState(false); const [discard, setDiscard] = useState(false);
  const leave = () => from === "feed" ? nav({ to: "/community" }) : nav({ to: "/route/$id", params: { id: initial }, search: { tab: from === "route" ? "community" : "overview" } });
  const back = from === "feed" ? <Link to="/community" className={backCls}><ChevronLeft className="size-4" />Community</Link>
    : <Link to="/route/$id" params={{ id: initial }} search={{ tab: from === "route" ? "community" : "overview" }} className={backCls}><ChevronLeft className="size-4" />Route preview</Link>;
  const publish = () => { s.set({ kept: null }); const id = s.publish(s.draft, route); nav({ to: "/community/$id", params: { id }, search: from === "feed" ? { from: "feed" } : { from: "route", ref: route } }); };
  return (
    <Shell back={back}>
      <Heading key={preview ? "p" : "e"}>{preview ? "Preview question" : "Write a question"}</Heading>
      {preview ? (<>
        <p className="text-sm text-muted-foreground">Route · {r.name}</p>
        <p className="rounded-lg border-2 border-dashed border-brand p-3">{s.draft}</p>
        <p className="rounded-lg bg-accent p-2 text-sm font-bold">Local demo only · not visible to other students</p>
        <button className={primaryBtn} onClick={() => setConfirm(true)}>Publish demo question <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => setPreview(false)}>Edit question</button>
      </>) : (<>
        <label className="font-bold text-primary" htmlFor="rt">Linked route</label>
        <select id="rt" value={route} onChange={(e) => setRoute(e.target.value)} className="min-h-12 rounded-lg border border-input bg-background px-3">{ROUTES.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <label className="font-bold text-primary" htmlFor="q">Your question</label>
        <textarea id="q" rows={4} value={s.draft} onChange={(e) => { s.set({ draft: e.target.value }); setErr(false); }} aria-invalid={err} aria-describedby={err ? "qerr" : undefined} className="rounded-lg border border-input p-3" />
        {err && <p id="qerr" className="text-destructive">Write a question before previewing.</p>}
        <p className="text-sm text-muted-foreground">Audience · This prototype only</p>
        <button className={primaryBtn} onClick={() => canPublish(s.draft) ? setPreview(true) : setErr(true)}>Preview question <ArrowRight className="size-4" /></button>
        <div className="flex flex-wrap gap-x-4">
          <button className={textLink} disabled={!canPublish(s.draft)} onClick={() => { s.set({ kept: keepDraft(s.draft, route), draft: "" }); leave(); }}>Keep draft for later</button>
          <button className={textLink} onClick={() => setDiscard(true)}>Discard draft</button>
        </div>
      </>)}
      {discard && <Sheet title="Discard this draft?" onClose={() => setDiscard(false)}>
        <p>Your question text will be removed from this device.</p>
        <button className={primaryBtn} onClick={() => { s.set({ draft: "", kept: null }); leave(); }}>Discard <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => setDiscard(false)}>Keep editing</button>
      </Sheet>}
      {confirm && <Sheet title="Publish this question?" onClose={() => setConfirm(false)}>
        <p>It will be added to the {r.name} discussion in this prototype only.</p>
        <button className={primaryBtn} onClick={publish}>Confirm and publish <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => setConfirm(false)}>Not yet</button>
      </Sheet>}
    </Shell>
  );
}
