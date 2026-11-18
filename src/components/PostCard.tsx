import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { isSaved, toggleSaved, type ThreadFrom, type FeedbackKind } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { Art, Avatar, artForCat, type ArtKey } from "@/components/Art";
import { RouteMini } from "@/components/RouteMini";
import { Stars } from "@/components/SensoryMeter";
import { FEEDBACK } from "@/data/sensory";
import { findPlace } from "@/data/demo";

export type CardPost = {
  id: string;
  kind: "Question" | "Tip" | "Experience" | "Review";
  title: string;
  context: string;
  replies: number;
  mine?: boolean;
  placeId?: string;
  routeId?: string;
  art?: string;
  tags?: FeedbackKind[];
  ratings?: { noise: number; calm: number };
  author?: string;
  demo?: boolean;
};

const act =
  "inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-bold text-primary hover:bg-accent";

const TAG_LABEL: Partial<Record<FeedbackKind, string>> = {
  dark: "Dim light",
  bright: "Bright light",
};
function Tag({ k }: { k: FeedbackKind }) {
  const f = FEEDBACK.find((x) => x.k === k)!;
  return (
    <span className="sticker inline-flex items-center gap-1 bg-card px-2 py-0.5 text-xs font-bold text-primary">
      <img src={f.src} alt="" className="size-4" />
      {TAG_LABEL[k] ?? f.label}
    </span>
  );
}

function Meta({ p }: { p: CardPost }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-muted-foreground">
      {p.author && <Avatar name={p.author} className="size-6" />}
      {p.author && <span className="text-primary">{p.mine ? "You" : p.author}</span>}
      {p.demo && <span className="rounded-full bg-accent px-2 py-0.5 text-primary">Demo post</span>}
      <span className="inline-flex items-center gap-1">
        <MapPin className="size-3" aria-hidden="true" />
        {p.context}
      </span>
    </span>
  );
}

function Actions({ p, from, ctx }: { p: CardPost; from: ThreadFrom; ctx: string | undefined }) {
  const s = useStore();
  const ref = { kind: "post" as const, id: p.id };
  const on = isSaved(s.saved, ref);
  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-border px-2 py-1">
      <button
        aria-pressed={on}
        aria-label={on ? "Remove from Saved" : "Save post"}
        onClick={() => s.set({ saved: toggleSaved(s.saved, ref) })}
        className={`${act} press ${on ? "bg-accent-lavender" : ""}`}
      >
        <Bookmark className={`size-4 ${on ? "fill-current" : ""}`} />
        {on ? "Saved" : "Save"}
      </button>
      <Link to="/community/$id" params={{ id: p.id }} search={{ from, ref: ctx }} className={act}>
        <MessageCircle className="size-4" />
        Reply{p.replies ? ` · ${p.replies}` : ""}
      </Link>
      {p.placeId && findPlace(p.placeId) && (
        <Link to="/place/$id" params={{ id: p.placeId }} className={`${act} ml-auto`}>
          View place <ArrowRight className="size-4" />
        </Link>
      )}
      {!(p.placeId && findPlace(p.placeId)) && p.routeId && (
        <Link
          to="/route/$id"
          params={{ id: p.routeId }}
          search={{ tab: "overview" }}
          className={`${act} ml-auto`}
        >
          View route <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

/** Three layouts: Experience (large photo), Question (compact), Review (route map preview + ratings). */
export function PostCard({
  p,
  from,
  ctx,
  tall,
}: {
  p: CardPost;
  from: ThreadFrom;
  ctx?: string;
  tall?: boolean;
}) {
  const link = { to: "/community/$id" as const, params: { id: p.id }, search: { from, ref: ctx } };
  const place = p.placeId ? findPlace(p.placeId) : undefined;
  if (p.kind === "Experience") {
    const art = (p.art as ArtKey | undefined) ?? (place ? artForCat(place.cat) : "park");
    return (
      <article className="retro overflow-hidden rounded-2xl bg-card">
        <Link
          {...link}
          aria-label={`Experience: ${p.title}`}
          className={`relative block ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}
        >
          <Art kind={art} photoKey={p.placeId ?? art} />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-primary/75 to-transparent"
          />
          <span className="sticker absolute left-2 top-2 bg-accent-yellow px-2 text-xs font-bold text-primary">
            Experience
          </span>
          <span className="absolute inset-x-2 bottom-2 flex flex-wrap items-end justify-between gap-1.5">
            <span className="flex flex-wrap gap-1">
              {p.tags?.map((k) => (
                <Tag key={k} k={k} />
              ))}
            </span>
            <span className="sticker inline-flex max-w-full items-center gap-1 bg-card px-2 py-0.5 text-xs font-bold text-primary">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{place?.name ?? p.context}</span>
            </span>
          </span>
        </Link>
        <div className="space-y-1.5 p-3">
          <Link
            {...link}
            className="line-clamp-2 block font-display text-lg font-bold leading-snug text-primary"
          >
            {p.title}
          </Link>
          <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            {p.author && <Avatar name={p.author} className="size-6" />}
            {p.author && <span className="text-primary">{p.mine ? "You" : p.author}</span>}
            {p.demo && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-primary">Demo post</span>
            )}
          </span>
        </div>
        <Actions p={p} from={from} ctx={ctx} />
      </article>
    );
  }
  if (p.kind === "Review") {
    return (
      <article className="retro overflow-hidden rounded-2xl bg-card">
        <Link {...link} aria-label={`Route review: ${p.title}`} className="relative block">
          {p.routeId && <RouteMini routeId={p.routeId} />}
          <span className="sticker absolute left-2 top-2 bg-accent-blue px-2 text-xs font-bold text-primary">
            Route review
          </span>
        </Link>
        <div className="space-y-1.5 p-3">
          {p.ratings && (
            <span className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-primary">
              <span className="inline-flex items-center gap-1">
                Quiet <Stars value={6 - p.ratings.noise} label="Quietness" />
              </span>
              <span className="inline-flex items-center gap-1">
                Calm <Stars value={p.ratings.calm} label="Calm" />
              </span>
            </span>
          )}
          <Link {...link} className="block font-bold text-primary">
            {p.title}
          </Link>
          <Meta p={p} />
        </div>
        <Actions p={p} from={from} ctx={ctx} />
      </article>
    );
  }
  return (
    <article className="retro rounded-2xl bg-card">
      <Link {...link} className="flex items-start gap-3 p-3 hover:bg-accent/40">
        <span className="min-w-0 flex-1 space-y-1">
          <span className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span
              className={`sticker rounded-full px-2 py-0.5 text-primary ${p.kind === "Tip" ? "bg-accent-blue" : "bg-accent-yellow"}`}
            >
              {p.kind}
            </span>
            {p.mine && <span className="text-muted-foreground">Yours</span>}
          </span>
          <span className="block font-bold text-primary">{p.title}</span>
          <Meta p={p} />
        </span>
        {place && (
          <span className="size-14 shrink-0 overflow-hidden rounded-xl border-2 border-primary">
            <Art kind={artForCat(place.cat)} photoKey={place.id} />
          </span>
        )}
      </Link>
      <Actions p={p} from={from} ctx={ctx} />
    </article>
  );
}
