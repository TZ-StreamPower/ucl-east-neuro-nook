import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Clock, Users } from "lucide-react";

const A = "/game/assets";
/** L1 hero: featured entry to the bundled game; opens the overlay on Campus via ?game=1. */
export function GameShowcase() {
  return (
    <section aria-labelledby="game-h" className="retro overflow-hidden rounded-2xl bg-card">
      <div className="relative aspect-[16/10] border-b-2 border-primary bg-map">
        <img src={`${A}/scenes/atrium.png`} alt="" className="size-full object-cover" loading="lazy" />
        <span className="sticker absolute left-3 top-3 inline-flex items-center gap-1 bg-accent-yellow px-2.5 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" aria-hidden="true" />Interactive story</span>
        <div className="absolute bottom-1 right-3 flex items-end gap-1" aria-hidden="true">
          {["mei", "sam", "leila"].map((c) => <img key={c} src={`${A}/sprites/${c}.png`} alt="" className="h-16 w-auto object-contain drop-shadow" loading="lazy" />)}
        </div>
      </div>
      <div className="space-y-3 bg-accent-lavender p-4">
        <div>
          <h2 id="game-h" className="font-display text-2xl font-bold leading-tight text-primary">Same Day, Three Paths</h2>
          <p className="text-muted-foreground">One campus. Different experiences.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Users className="size-3.5" aria-hidden="true" />3 paths</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />10 min</span>
        </div>
        <Link to="/" search={(p) => ({ ...p, game: 1 })} resetScroll={false} aria-label="Play Same Day, Three Paths"
          className="retro inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand">
          Play <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
