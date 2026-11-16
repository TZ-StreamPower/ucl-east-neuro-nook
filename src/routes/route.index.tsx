import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { PLACES } from "@/data/demo";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/route/")({
  validateSearch: (q: Record<string, unknown>) => ({ to: typeof q["to"] === "string" ? q["to"] : undefined }), head: head("Choose your route · UCL East Community", "Pick where you start and where you are going."), component: Picker });
function Field({ label, value, onChange, kind }: { label: string; value: string; onChange: (v: string) => void; kind: "station" | "entrance" }) {
  const [q, setQ] = useState("");
  const opts = PLACES.filter((p) => p.toLowerCase().includes(q.toLowerCase()));
  return (
    <fieldset className="space-y-2">
      <legend className="font-bold text-primary">{label}</legend>
      <Scene kind={kind} className="h-24 object-cover" />
      <input aria-label={`Search ${label}`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places" className="min-h-11 w-full rounded-lg border border-input px-3" />
      {opts.length === 0 && <p className="text-muted-foreground">No places match that search.</p>}
      <div className="flex flex-wrap gap-2">
        {opts.map((p) => (
          <button key={p} aria-pressed={value === p} onClick={() => onChange(p)} className={`min-h-11 rounded-lg border px-3 font-bold text-primary ${value === p ? "border-brand ring-2 ring-brand" : "border-border"}`}>{p}</button>
        ))}
      </div>
    </fieldset>
  );
}
function Picker() {
  const pre = Route.useSearch().to;
  const [from, setFrom] = useState(""); const [to, setTo] = useState(pre ?? "");
  const ok = from === "Stratford Station" && to === "Marshgate";
  return (
    <Shell back={pre ? "/place/marshgate" : "/"} backLabel="Find my way">
      <Heading>Choose your route</Heading>
      <Field label="From" value={from} onChange={setFrom} kind="station" />
      <Field label="To" value={to} onChange={setTo} kind="entrance" />
      {!ok && from && to && <p className="text-muted-foreground">This prototype supports Stratford Station to Marshgate only.</p>}
      {ok ? <Link to="/route/preview" className={primaryBtn}>Preview route <ArrowRight className="size-4" /></Link>
        : <button disabled className={primaryBtn}>Preview route <ArrowRight className="size-4" /></button>}
    </Shell>
  );
}
