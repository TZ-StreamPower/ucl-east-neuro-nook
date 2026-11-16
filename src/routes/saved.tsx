import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { Shell, Heading, primaryBtn } from "@/components/Shell";
import { Thumb } from "@/components/Browse";
import { findPlace, findRoute } from "@/data/demo";
import { useStore } from "@/lib/store";
import { allPosts } from "@/lib/posts";
import { toggleSaved } from "@/lib/logic";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/saved")({ head: pageHead("Saved · UCL East Community", "Your saved places, routes and posts."), component: Saved });
const card = "flex flex-1 items-center gap-3 p-3";
function Saved() {
  const s = useStore(); const posts = allPosts(s.questions);
  return (
    <Shell tabs title="Saved">
      <Heading>Saved</Heading>
      {s.saved.length === 0 ? (<><p>Nothing saved yet. Save places, routes or posts to find them here.</p><Link to="/" className={primaryBtn}>Browse campus <ArrowRight className="size-4" /></Link></>) : (
        <ul className="space-y-3">{s.saved.map((it) => {
          const p = it.kind === "place" ? findPlace(it.id) : undefined; const r = it.kind === "route" ? findRoute(it.id) : undefined; const post = it.kind === "post" ? posts.find((x) => x.id === it.id) : undefined;
          if (!p && !r && !post) return null;
          const name = p?.name ?? r?.name ?? post!.title; const label = p ? "Place" : r ? "Route" : "Post";
          const body = <><Thumb cat={p?.cat ?? r?.cat ?? "support"} route={!!r} className="size-12" /><span className="flex-1"><span className="block text-xs font-bold uppercase text-muted-foreground">{label}</span><span className="font-bold text-primary">{name}</span></span></>;
          return (
            <li key={`${it.kind}:${it.id}`} className="flex items-center rounded-2xl border border-border hover:border-brand">
              {p ? <Link to="/place/$id" params={{ id: it.id }} className={card}>{body}</Link> : r ? <Link to="/route/$id" params={{ id: it.id }} className={card}>{body}</Link> : <Link to="/community/$id" params={{ id: it.id }} className={card}>{body}</Link>}
              <button aria-label={`Remove ${name}`} onClick={() => s.set({ saved: toggleSaved(s.saved, it) })} className="mr-2 grid size-11 place-items-center rounded-full hover:bg-accent"><X className="size-4" /></button>
            </li>); })}</ul>
      )}
    </Shell>
  );
}
