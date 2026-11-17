import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MessageCircle, ExternalLink, RotateCw } from "lucide-react";
import { GAME_URL, DEFAULT_ROUTE, STARTER_DRAFT, findRoute } from "@/data/demo";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/practice_/game")({
  validateSearch: zodValidator(z.object({ route: fallback(z.string(), DEFAULT_ROUTE).default(DEFAULT_ROUTE) })),
  head: pageHead("Campus Practice game · UCL East", "The full Same Day, Three Paths practice game."), component: Game });
const bar = "inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold";
function Game() {
  const q = Route.useSearch(); const route = findRoute(q.route) ? q.route : DEFAULT_ROUTE; const s = useStore(); const nav = useNavigate();
  return (
    <div className="fixed inset-0 flex flex-col bg-primary">
      <div className="flex items-center gap-2 px-2 py-1 text-primary-foreground" style={{ paddingTop: "max(env(safe-area-inset-top), 4px)" }}>
        <Link to="/route/$id" params={{ id: route }} className={`${bar} bg-background text-primary`}><ChevronLeft className="size-4" />Back to route</Link>
        <button className={`${bar} border-2 border-primary-foreground`} onClick={() => { s.set({ draft: s.draft || STARTER_DRAFT }); nav({ to: "/community/new", search: { from: "practice", route } }); }}><MessageCircle className="size-4" />Ask the community</button>
        <a href={GAME_URL} target="_blank" rel="noreferrer" className={`${bar} ml-auto`} aria-label="Open game in a new tab"><ExternalLink className="size-4" /></a>
      </div>
      <div className="relative flex-1">
        <iframe title="Same Day, Three Paths game" src={GAME_URL} className="absolute inset-0 size-full border-0 bg-background" allow="autoplay; fullscreen" />
        <p className="pointer-events-none absolute bottom-2 left-2 right-2 hidden rounded-lg bg-background p-2 text-center text-sm font-bold text-primary portrait:block portrait:max-md:block">
          <RotateCw className="mr-1 inline size-4" />Turn your phone sideways for the game. Your choices stay private.</p>
      </div>
    </div>
  );
}
