import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { useStore } from "@/lib/store";
import { canPublish } from "@/lib/logic";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/community/new")({ head: head("Write a question · UCL East Community", "Ask a route-linked question in this demo."), component: Composer });
function Composer() {
  const s = useStore(); const nav = useNavigate(); const [preview, setPreview] = useState(false); const [err, setErr] = useState(false);
  if (preview) return (
    <Shell back="/community" backLabel="Community">
      <Heading>Preview question</Heading>
      <p className="text-sm text-muted-foreground">Stratford Station → Marshgate</p>
      <p className="rounded-lg bg-accent p-3">{s.draft}</p>
      <p>Audience · This prototype only</p>
      <button className={primaryBtn} onClick={() => { s.publish(s.draft); nav({ to: "/community", search: { thread: undefined } }); }}>Publish demo question <ArrowRight className="size-4" /></button>
      <button className={textLink} onClick={() => setPreview(false)}>Edit question</button>
    </Shell>
  );
  return (
    <Shell back="/community" backLabel="Community">
      <Heading>Write a question</Heading>
      <p className="text-muted-foreground">Route · Stratford Station → Marshgate</p>
      <label className="font-bold text-primary" htmlFor="q">Your question</label>
      <textarea id="q" rows={4} value={s.draft} onChange={(e) => { s.set({ draft: e.target.value }); setErr(false); }} aria-invalid={err} aria-describedby={err ? "qerr" : undefined} className="rounded-lg border border-input p-3" />
      {err && <p id="qerr" className="text-destructive">Write a question before previewing.</p>}
      <p className="text-muted-foreground">Audience · This prototype only</p>
      <button className={primaryBtn} onClick={() => canPublish(s.draft) ? setPreview(true) : setErr(true)}>Preview question <ArrowRight className="size-4" /></button>
    </Shell>
  );
}
