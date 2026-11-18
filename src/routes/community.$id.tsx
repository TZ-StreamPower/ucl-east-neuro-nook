import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronLeft, MapPin, Flag } from "lucide-react";
import { Shell, Heading, Sheet, backCls, primaryBtn, textLink } from "@/components/Shell";
import { postContext, findRoute, findPlace } from "@/data/demo";
import { threadBack, canPublish, toggleReport, type ThreadFrom } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { allPosts } from "@/lib/posts";
import { pageHead } from "@/lib/head";
import { SaveShare } from "@/components/SaveShare";
export const Route = createFileRoute("/community/$id")({
  validateSearch: zodValidator(z.object({ from: fallback(z.string(), "feed").default("feed"), ref: fallback(z.string().optional(), undefined) })),
  head: pageHead("Discussion · UCL East Community", "A demo place- or route-linked discussion."), component: ThreadPage });
function ThreadPage() {
  const { id } = Route.useParams(); const { from: f, ref } = Route.useSearch(); const from: ThreadFrom = f === "route" || f === "place" ? f : "feed"; const s = useStore();
  const [mode, setMode] = useState<"idle" | "edit" | "preview">("idle"); const [text, setText] = useState(""); const [confirm, setConfirm] = useState(false); const [err, setErr] = useState(false); const [report, setReport] = useState(false);
  const t = allPosts(s.questions, s.experiences).find((p) => p.id === id);
  const b = threadBack(from, ref);
  const back = b.kind === "route" ? <Link to="/route/$id" params={{ id: b.id }} search={{ tab: "community" }} className={backCls}><ChevronLeft className="size-4" />{findRoute(b.id)?.to ?? "Route"}</Link>
    : b.kind === "place" ? <Link to="/place/$id" params={{ id: b.id }} className={backCls}><ChevronLeft className="size-4" />{findPlace(b.id)?.name ?? "Place"}</Link>
    : <Link to="/community" className={backCls}><ChevronLeft className="size-4" />Community</Link>;
  if (!t) return <Shell back={back}><Heading>Post not found</Heading><p>This demo post isn't available in this browser.</p></Shell>;
  const replies = [...t.replies, ...(s.replies[t.id] ?? [])];
  return (
    <Shell back={back}>
      <p className="text-sm font-bold text-muted-foreground">Demo {t.kind.toLowerCase()}</p>
      <Heading>{t.title}</Heading>
      <p className="flex items-center gap-1 text-sm font-bold text-primary"><MapPin className="size-4" />{postContext(t)}</p>
      <div className="flex flex-wrap gap-2">
        {t.routeId && <Link to="/route/$id" params={{ id: t.routeId }} className={textLink}>Open route</Link>}
        {t.placeId && <Link to="/place/$id" params={{ id: t.placeId }} className={textLink}>Open place</Link>}
      </div>
      <SaveShare item={{ kind: "post", id: t.id }} />
      {s.reports.includes(t.id) ? <p role="status" className="text-sm font-bold text-muted-foreground">Reported, thanks. A moderator would review this (demo).</p>
        : <button className={textLink} onClick={() => setReport(true)}><Flag className="size-4" />Report post</button>}
      <section className="space-y-2"><h2 className="font-bold text-primary">{replies.length} {replies.length === 1 ? "reply" : "replies"}</h2>
        {replies.length ? replies.map((x, i) => <p key={i} className="rounded-lg bg-accent p-3">{x}</p>) : <p className="rounded-lg bg-accent p-3 text-muted-foreground">No replies yet. Replies can take time; you can save this post and check back.</p>}
      </section>
      {mode === "idle" && <button className={primaryBtn} onClick={() => setMode("edit")}>Reply <ArrowRight className="size-4" /></button>}
      {mode === "edit" && <div className="space-y-2">
        <label htmlFor="reply" className="font-bold text-primary">Your reply</label>
        <textarea id="reply" rows={3} value={text} onChange={(e) => { setText(e.target.value); setErr(false); }} aria-invalid={err} aria-describedby={err ? "rerr" : undefined} className="w-full rounded-lg border border-input p-3" />
        {err && <p id="rerr" className="text-destructive">Write a reply before previewing.</p>}
        <button className={primaryBtn} onClick={() => canPublish(text) ? setMode("preview") : setErr(true)}>Preview reply <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => setMode("idle")}>Cancel</button>
      </div>}
      {mode === "preview" && <div className="space-y-2"><h2 className="font-bold text-primary">Preview reply</h2><p className="rounded-lg border-2 border-dashed border-brand p-3">{text}</p>
        <button className={primaryBtn} onClick={() => setConfirm(true)}>Publish reply <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => setMode("edit")}>Edit reply</button></div>}
      {report && <Sheet title="Report this post" onClose={() => setReport(false)}>
        <p>Why are you reporting it?</p>
        {["Unkind or unsafe", "Wrong or misleading", "Personal information", "Something else"].map((r) => <button key={r} className={primaryBtn} onClick={() => { s.set({ reports: toggleReport(s.reports, t.id) }); setReport(false); }}>{r} <ArrowRight className="size-4" /></button>)}
      </Sheet>}
      {confirm && <Sheet title="Publish this reply?" onClose={() => setConfirm(false)}>
        <p>It will appear in this discussion on this device only (local demo, not visible to other students).</p>
        <button className={primaryBtn} onClick={() => { s.reply(t.id, text); setText(""); setConfirm(false); setMode("idle"); }}>Confirm and publish <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => setConfirm(false)}>Not yet</button>
      </Sheet>}
    </Shell>
  );
}
