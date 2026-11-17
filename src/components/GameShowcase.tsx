import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const A = "/game/assets";
/** Featured entry to the bundled game; opens the overlay on Campus via ?game=1. */
export function GameShowcase() {
  return (
    <section aria-labelledby="game-h" className="space-y-2">
      <h2 className="text-lg font-bold text-primary">Interactive experience</h2>
      <div className="retro overflow-hidden rounded-2xl bg-background">
        <div className="relative aspect-[16/10] bg-map">
          <img src={`${A}/scenes/atrium.png`} alt="" className="size-full object-cover" loading="lazy" />
          <div className="absolute bottom-1 right-3 flex items-end gap-1" aria-hidden="true">
            {["mei", "sam", "leila"].map((c) => <img key={c} src={`${A}/sprites/${c}.png`} alt="" className="h-16 w-auto object-contain drop-shadow" loading="lazy" />)}
          </div>
        </div>
        <div className="space-y-2 bg-practice p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Interactive story · Campus life</p>
          <h3 id="game-h" className="font-display text-xl font-bold text-primary">Same Day, Three Paths</h3>
          <p className="text-sm text-muted-foreground">One campus. Different experiences.</p>
          <Link to="/" search={(p) => ({ ...p, game: 1 })} resetScroll={false}
            className="retro inline-flex min-h-12 w-full items-center justify-between rounded-lg bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand">
            Start experience <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
