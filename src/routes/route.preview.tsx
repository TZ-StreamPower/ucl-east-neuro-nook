import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Bookmark, MessageCircle, Plus, Minus } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink, secondaryBtn } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { ROUTE, EXPECT, VISIT_US } from "@/data/demo";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/route/preview")({ head: head("To Marshgate · Route preview", "Example route from Stratford Station to Marshgate."), component: Preview });
function Preview() {
  const s = useStore(); const nav = useNavigate();
  const [open, setOpen] = useState(false); const [map, setMap] = useState(false); const [pin, setPin] = useState<number | null>(null);
  return (
    <Shell back="/" backLabel="Campus">
      <Heading>To Marshgate</Heading>
      <p className="text-muted-foreground">From {ROUTE.from} · <span className="font-bold">Example route</span></p>
      <div className="relative">
        <Scene kind="route" />
        {ROUTE.steps.map((st, i) => (
          <button key={i} aria-label={`Landmark ${i + 1}: ${st.title}`} aria-pressed={pin === i} onClick={() => setPin(i)}
            className={`absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full ${pin === i ? "ring-[3px] ring-brand" : ""}`}
            style={{ left: `${[70,140,215][i]! / 3}%`, top: `${[140,95,135][i]! / 2}%` }} />
        ))}
      </div>
      {pin !== null && <p className="rounded-lg bg-accent p-3"><b>{pin + 1}.</b> {ROUTE.steps[pin]!.title}</p>}
      <Link to="/route/steps" className={primaryBtn}>{s.step !== null ? "Resume steps" : "View steps"} <ArrowRight className="size-4" /></Link>
      <Link to="/practice" search={{ from: "preview" }} onClick={() => s.set({ stage: 1 })} className={secondaryBtn}>Practise this arrival · optional <ArrowRight className="size-4" /></Link>
      <div>
        <button aria-expanded={open} onClick={() => setOpen(!open)} className={textLink}>What to expect {open ? <Minus className="size-4" /> : <Plus className="size-4" />}</button>
        {open && <div className="space-y-2 pb-2"><p>{EXPECT}</p><a href={VISIT_US} target="_blank" rel="noreferrer" className="font-bold text-primary underline">Official UCL East Visit Us page</a></div>}
      </div>
      <div>
        <button aria-expanded={map} onClick={() => setMap(!map)} className={textLink}>{map ? "Hide map" : "View map"}</button>
        {map && <div className="space-y-2"><Scene kind="route" /><ol className="list-decimal pl-5">{ROUTE.steps.map((x) => <li key={x.title}>{x.title}</li>)}</ol><p className="text-sm text-muted-foreground">Schematic only. No live position.</p></div>}
      </div>
      <button className={textLink} onClick={() => nav({ to: "/community", search: { thread: "seed-1" } })}><MessageCircle className="size-4" /> Ask about this route</button>
      <button aria-pressed={s.saved} onClick={() => s.set({ saved: !s.saved })} className={textLink}><Bookmark className={`size-4 ${s.saved ? "fill-primary" : ""}`} /> {s.saved ? "Saved · tap to remove" : "Save route"}</button>
      <p role="status" className="sr-only">{s.saved ? "Route saved" : ""}</p>
    </Shell>
  );
}
