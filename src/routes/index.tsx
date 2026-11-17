import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Search, List, Map as MapIcon, X, ArrowRight, Footprints } from "lucide-react";
import { Shell, textLink } from "@/components/Shell";
import { CAT_STYLE, MapCanvas, MapPin, Thumb } from "@/components/Browse";
import { CATS, PLACES, ROUTES, DEFAULT_ROUTE, type Cat } from "@/data/demo";
import { MiniMeter } from "@/components/SensoryMeter";
import { matchesFeel, type Feel } from "@/lib/logic";
import { filterResults, switchView, type ResultItem, type BrowseView } from "@/lib/logic";
import { GamePractice } from "@/components/GamePractice";
import { GameShowcase } from "@/components/GameShowcase";
import { pageHead } from "@/lib/head";
import { useStore } from "@/lib/store";

const ALL: ResultItem[] = [
  ...PLACES.map((p) => ({ kind: "place" as const, id: p.id, name: p.name, sub: p.sub, cat: p.cat, xy: p.xy })),
  ...ROUTES.map((r) => ({ kind: "route" as const, id: r.id, name: r.name, sub: `Route · ${r.minutes} min walk`, cat: r.cat, xy: r.steps[1]!.landmark.xy })),
];
const catIds = ["all", ...CATS.map((c) => c.id)];
export const Route = createFileRoute("/")({
  validateSearch: zodValidator(z.object({ q: fallback(z.string(), "").default(""), cat: fallback(z.string(), "all").default("all"), view: fallback(z.string(), "list").default("list"), sel: fallback(z.string().optional(), undefined), game: fallback(z.number(), 0).default(0), feel: fallback(z.string(), "").default("") })),
  head: pageHead("Campus · UCL East Community", "Search places and routes around UCL East."), component: Browse });

function ItemLink({ i, className, children }: { i: ResultItem; className: string; children: React.ReactNode }) {
  return i.kind === "place"
    ? <Link to="/place/$id" params={{ id: i.id }} className={className}>{children}</Link>
    : <Link to="/route/$id" params={{ id: i.id }} className={className}>{children}</Link>;
}

function Browse() {
  const raw = Route.useSearch(); const s = { ...raw, cat: (catIds.includes(raw.cat) ? raw.cat : "all") as Cat | "all", view: (raw.view === "map" ? "map" : "list") as BrowseView }; const nav = useNavigate({ from: "/" }); const store = useStore();
  const upd = (p: Partial<typeof raw>) => nav({ search: (prev) => ({ ...prev, ...p }), replace: true });
  const feel = raw.feel.split(",").filter((f): f is Feel => ["quiet", "soft-light", "not-busy"].includes(f));
  const results = filterResults(ALL, s.q, s.cat).filter((r) => !feel.length || (r.kind === "place" && matchesFeel(store.sensory(r.id), feel)));
  const toggleFeel = (f: Feel) => upd({ feel: (feel.includes(f) ? feel.filter((x) => x !== f) : [...feel, f]).join(",") });
  const sel = results.find((r) => `${r.kind}:${r.id}` === s.sel);
  return (
    <Shell tabs>
      {s.game === 1 && <GamePractice backLabel="Campus" onBack={() => nav({ search: (p) => ({ ...p, game: 0 }), replace: true, resetScroll: false })} onAsk={() => nav({ to: "/community/new", search: { from: "feed", route: DEFAULT_ROUTE } })} />}
      <div><h1 className="font-display text-3xl font-bold text-primary">Campus</h1><p className="text-muted-foreground">Your campus, your pace.</p></div>
      <label className="flex min-h-12 items-center gap-2 retro rounded-xl bg-card px-4 focus-within:ring-4 focus-within:ring-brand/40">
        <Search className="size-5 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Search places and routes</span>
        <input value={s.q} onChange={(e) => upd({ q: e.target.value })} placeholder="Search places and routes" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
        {s.q && <button aria-label="Clear search" onClick={() => upd({ q: "" })} className="grid size-9 place-items-center rounded-full hover:bg-accent"><X className="size-4" /></button>}
      </label>
      <div role="group" aria-label="Categories" className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {([{ id: "all", label: "All" }, ...CATS] as const).map((c) => { const { I, tile } = CAT_STYLE[c.id]; const on = s.cat === c.id; return (
          <button key={c.id} aria-pressed={on} onClick={() => upd({ cat: c.id })} className="press flex w-16 shrink-0 flex-col items-center gap-1 rounded-xl py-1 text-xs font-bold text-primary">
            <span className={`relative grid size-12 place-items-center rounded-2xl border-2 border-primary transition-shadow duration-[var(--dur-select)] ${tile} ${on ? "ring-[3px] ring-brand" : ""}`}><I className="size-5" />{on && <span className="pop sticker absolute -right-1.5 -top-1.5 grid size-5 place-items-center bg-card"><Check className="size-3" aria-hidden="true" /></span>}</span>
            <span className={on ? "text-brand" : ""}>{c.label}</span>
          </button>); })}
      </div>
      <div role="group" aria-label="How it feels" className="-mx-5 flex gap-2 overflow-x-auto px-5">
        {([["quiet", "Quiet"], ["soft-light", "Soft light"], ["not-busy", "Not busy"]] as const).map(([f, l]) => (
          <button key={f} aria-pressed={feel.includes(f)} onClick={() => toggleFeel(f)} className="retro inline-flex min-h-11 shrink-0 items-center rounded-full bg-card px-4 text-sm font-bold text-primary aria-pressed:bg-accent-lime">{l}</button>))}
      </div>
      <GameShowcase cat={s.cat} />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" role="status">{results.length} {results.length === 1 ? "result" : "results"}</p>
        <div role="group" aria-label="View" className="flex rounded-full border border-border p-0.5">
          {(["list", "map"] as const).map((v) => { const I = v === "list" ? List : MapIcon; return (
            <button key={v} aria-pressed={s.view === v} onClick={() => nav({ search: (p) => switchView({ ...p, view: p.view as BrowseView }, v), replace: true })}
              className={`inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm font-bold ${s.view === v ? "bg-primary text-primary-foreground" : "text-primary"}`}><I className="size-4" />{v === "list" ? "List" : "Map"}</button>); })}
        </div>
      </div>
      {results.length === 0 ? (
        <div className="space-y-2 rounded-xl bg-accent p-4"><p className="font-bold text-primary">No matches</p><p className="text-sm">Try another word or category.</p>
          <button className={textLink} onClick={() => upd({ q: "", cat: "all", feel: "" })}>Reset search</button></div>
      ) : s.view === "map" ? (
        <div className="space-y-3">
          <MapCanvas className="aspect-[4/5]">
            {results.map((r) => { const { I } = CAT_STYLE[r.cat]; const key = `${r.kind}:${r.id}`; return (
              <MapPin key={key} xy={r.xy} label={r.name} active={s.sel === key} onClick={() => upd({ sel: key })}><I className="size-4" /></MapPin>); })}
          </MapCanvas>
          {sel ? (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-brand p-3 shadow-md" aria-live="polite">
              <Thumb cat={sel.cat} route={sel.kind === "route"} className="size-14" />
              <div className="min-w-0 flex-1"><p className="font-bold text-primary">{sel.name}</p><p className="text-sm text-muted-foreground">{sel.sub}</p>
                <ItemLink i={sel} className={textLink}>Open details <ArrowRight className="size-4" /></ItemLink></div>
              <button aria-label="Close" onClick={() => upd({ sel: undefined })} className="grid size-11 place-items-center self-start rounded-full hover:bg-accent"><X className="size-4" /></button>
            </div>
          ) : <p className="text-sm text-muted-foreground">Tap a pin to see the place or route.</p>}
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((r) => { const key = `${r.kind}:${r.id}`; return (
            <li key={key}><ItemLink i={r} className={`flex items-center gap-3 retro rounded-2xl bg-card p-3 ${s.sel === key ? "ring-2 ring-brand" : ""}`}>
              <Thumb cat={r.cat} route={r.kind === "route"} className="size-12" />
              <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">{r.kind === "route" ? "Route" : CATS.find((c) => c.id === r.cat)!.label}</span>
                <span className="block font-bold text-primary">{r.name}</span><span className="block truncate text-sm text-muted-foreground">{r.sub}</span>{r.kind === "place" && <MiniMeter s={store.sensory(r.id)} />}</span>
              <ArrowRight className="size-4 text-primary" aria-hidden="true" />
            </ItemLink></li>); })}
        </ul>
      )}
      <Link to="/practice" search={{ from: "home", route: DEFAULT_ROUTE }} onClick={() => store.set({ stage: 1, choice: null })} className="retro flex items-center gap-3 rounded-2xl bg-accent-lime p-3">
        <span className="sticker grid size-12 shrink-0 place-items-center bg-card text-primary"><Footprints className="size-5" /></span>
        <span className="flex-1"><span className="block font-display font-bold text-primary">Campus Practice</span><span className="block text-sm text-muted-foreground">Optional · 2 min</span></span>
        <ArrowRight className="size-4 text-primary" />
      </Link>
      <p className="self-start rounded-full border border-border px-2 text-xs text-muted-foreground">Illustrative</p>
    </Shell>
  );
}
