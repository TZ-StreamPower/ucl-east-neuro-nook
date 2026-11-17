import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Shell, Heading, backCls, primaryBtn } from "@/components/Shell";
import { MapCanvas, MapPin, Thumb, CAT_STYLE } from "@/components/Browse";
import { SaveShare } from "@/components/SaveShare";
import { PostCard } from "@/components/PostCard";
import { CATS, ROUTES, findPlace, ILLUSTRATIVE } from "@/data/demo";
import { useStore } from "@/lib/store";
import { visibleNotes } from "@/lib/logic";
import { allPosts, toCard } from "@/lib/posts";
import { pageHead } from "@/lib/head";
import { useState } from "react";
import { Star } from "lucide-react";
import { SensoryCard } from "@/components/SensoryMeter";
import { RateSheet } from "@/components/RateSheet";
import { SEED, DEFAULT_SENSORY } from "@/data/sensory";
export const Route = createFileRoute("/place/$id")({
  loader: ({ params }) => { const p = findPlace(params.id); if (!p) throw notFound(); return p; },
  head: pageHead("Place · UCL East Community", "Arrival information and routes for a UCL East place."), component: PlacePage });
function PlacePage() {
  const p = Route.useLoaderData(); const s = useStore(); const { I } = CAT_STYLE[p.cat];
  const routes = ROUTES.filter((r) => r.toPlace === p.id || r.from === p.name);
  const [rate, setRate] = useState(false);
  const posts = allPosts(s.questions).filter((x) => x.placeId === p.id);
  return (
    <Shell back={<Link to="/" className={backCls}><ChevronLeft className="size-4" />Campus</Link>}>
      <MapCanvas className="aspect-[16/9]"><MapPin xy={p.xy} label={p.name} active onClick={() => {}}><I className="size-4" /></MapPin></MapCanvas>
      <div className="flex items-start gap-3"><Thumb cat={p.cat} className="size-12" />
        <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{CATS.find((c) => c.id === p.cat)!.label}</p><Heading>{p.name}</Heading><p className="text-muted-foreground">{p.sub}</p></div></div>
      <SaveShare item={{ kind: "place", id: p.id }} />
      <section className="space-y-2"><h2 className="font-bold text-primary">How it feels</h2>
        <SensoryCard s={s.sensory(p.id)} mine={!!s.ratings[p.id]} />
        <button className={primaryBtn} onClick={() => setRate(true)}>{s.ratings[p.id] ? "Update your rating" : "Rate this space"} <Star className="size-4" /></button></section>
      {rate && <RateSheet name={p.name} seed={SEED[p.id] ?? DEFAULT_SENSORY} initial={s.ratings[p.id]} onSave={(r) => s.set({ ratings: { ...s.ratings, [p.id]: r } })} onClose={() => setRate(false)} />}
      <section className="space-y-2"><h2 className="flex items-center gap-2 font-bold text-primary">Arrival information <span className="rounded-full bg-accent px-2 text-xs">Illustrative</span></h2>
        <ul className="list-disc space-y-1 pl-5">{visibleNotes(p.notes, s.prefs.detail).map((n) => <li key={n}>{n}</li>)}</ul></section>
      <section className="space-y-2"><h2 className="font-bold text-primary">Plan a route</h2>
        {routes.length ? routes.map((r) => (
          <Link key={r.id} to="/route/$id" params={{ id: r.id }} className="flex items-center gap-3 rounded-2xl border border-border p-3 hover:border-brand">
            <Thumb cat={r.cat} route className="size-12" /><span className="flex-1"><span className="block font-bold text-primary">{r.name}</span><span className="text-sm text-muted-foreground">{r.minutes} min walk</span></span><ArrowRight className="size-4" /></Link>
        )) : <p className="text-sm text-muted-foreground">No example routes to this place yet.</p>}
      </section>
      <section className="space-y-2"><h2 className="font-bold text-primary">Community</h2>
        {posts.length ? posts.map((x) => <PostCard key={x.id} p={toCard(x, s.replies, x.id.startsWith("q-"))} from="place" ctx={p.id} />) : <p className="text-sm text-muted-foreground">No posts about this place yet.</p>}
        <Link to="/community/new" search={{ from: "feed" }} className={primaryBtn}>Ask a question <ArrowRight className="size-4" /></Link>
      </section>
      <p className="text-xs text-muted-foreground">{ILLUSTRATIVE}</p>
    </Shell>
  );
}
