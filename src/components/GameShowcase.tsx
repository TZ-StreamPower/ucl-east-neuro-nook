import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Users } from "lucide-react";
import { CAT_STYLE } from "@/components/Browse";
import { STORIES } from "@/data/stories";
import type { Cat } from "@/data/demo";

const ORDER = ["all", "buildings", "food", "study", "support"] as const;
/** L1 hero: one shared story card; content follows the selected category. Opens the game overlay via ?game=1. */
export function GameShowcase({ cat = "all" }: { cat?: Cat | "all" }) {
  const st = STORIES[cat]; const { I, tile } = CAT_STYLE[cat];
  return (
    <section aria-labelledby="game-h" className="retro overflow-hidden rounded-2xl bg-card">
      <div className="relative aspect-[16/10] border-b-2 border-primary bg-map">
        {ORDER.map((c) => <img key={c} src={STORIES[c].cover} alt="" loading={c === cat ? "eager" : "lazy"} aria-hidden={c !== cat}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[var(--dur-fade)] ${c === cat ? "opacity-100" : "opacity-0"}`} />)}
        <span className={`sticker absolute left-3 top-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-primary ${cat === "all" ? "bg-accent-yellow" : tile}`}><I className="size-3.5" aria-hidden="true" />{st.sticker}</span>
        {st.sprites && <div className="absolute bottom-1 right-3 flex items-end gap-1" aria-hidden="true">
          {st.sprites.map((s) => <img key={s} src={s} alt="" className="h-16 w-auto object-contain drop-shadow" loading="lazy" />)}</div>}
      </div>
      <div className="space-y-3 bg-accent-lavender p-4">
        <div key={cat} className="fade-in min-h-[4.5rem]">
          <h2 id="game-h" className="font-display text-2xl font-bold leading-tight text-primary">{st.title}</h2>
          <p className="text-muted-foreground">{st.desc}</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Users className="size-3.5" aria-hidden="true" />3 paths</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />10 min</span>
        </div>
        <Link to="/" search={(p) => ({ ...p, game: 1 })} resetScroll={false} aria-label={`Play ${st.title}`}
          className="retro inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand">
          Play <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
