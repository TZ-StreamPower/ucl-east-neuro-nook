import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronLeft, Star, Check, Navigation } from "lucide-react";
import { Shell, Heading, backCls, primaryBtn, secondaryBtn } from "@/components/Shell";
import { Art, artForCat } from "@/components/Art";
import { GeoMap, toneOf } from "@/components/GeoMap";
import { RouteMini } from "@/components/RouteMini";
import { SaveShare } from "@/components/SaveShare";
import { PostCard } from "@/components/PostCard";
import { SensoryCard } from "@/components/SensoryMeter";
import { RateSheet } from "@/components/RateSheet";
import { CATS, ROUTES, findPlace, ILLUSTRATIVE } from "@/data/demo";
import { SEED, DEFAULT_SENSORY, findNode } from "@/data/sensory";
import { PLACE_HOST, GEO, placeLL, kindOf, ILLUSTRATIVE_ROUTE } from "@/data/geo";
import { useStore } from "@/lib/store";
import { visibleNotes } from "@/lib/logic";
import { allPosts, toCard, isMine } from "@/lib/posts";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/place/$id")({
  loader: ({ params }) => {
    const p = findPlace(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: pageHead(
    "Place · UCL East Community",
    "Arrival information and routes for a UCL East place.",
  ),
  component: PlacePage,
});

/** Hero image → sensory ratings → essential info → map preview → community → primary action. */
function PlacePage() {
  const p = Route.useLoaderData();
  const s = useStore();
  const routes = ROUTES.filter((r) => r.toPlace === p.id || r.from === p.name);
  const [rate, setRate] = useState(false);
  const [done, setDone] = useState(false);
  const posts = allPosts(s.questions, s.experiences).filter((x) => x.placeId === p.id);
  const host = PLACE_HOST[p.id];
  const hostNode = host ? findNode(host) : undefined;
  const ll = placeLL(p.id);
  const sensory = s.sensory(p.id);
  return (
    <Shell
      back={
        <Link to="/" className={backCls}>
          <ChevronLeft className="size-4" />
          Explore
        </Link>
      }
      footer={
        hostNode ? (
          <Link
            to="/navigate"
            search={{ from: "stratford", to: hostNode.id, mode: "calm" }}
            className={primaryBtn}
          >
            Route here <Navigation className="size-4" />
          </Link>
        ) : undefined
      }
    >
      <div className="retro relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Art kind={artForCat(p.cat)} photoKey={p.id} />
        <span className="sticker absolute left-2 top-2 bg-accent-yellow px-2 text-xs font-bold text-primary">
          {CATS.find((c) => c.id === p.cat)!.label}
        </span>
      </div>
      <div>
        <Heading>{p.name}</Heading>
        <p className="text-muted-foreground">{p.sub}</p>
      </div>
      <SaveShare item={{ kind: "place", id: p.id }} />

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 font-bold text-primary">
          How it feels
          {done && (
            <span
              role="status"
              className="pop sticker inline-flex items-center gap-1 bg-accent-lime px-2 text-xs"
            >
              <Check className="size-3.5" aria-hidden="true" />
              Saved
            </span>
          )}
        </h2>
        <SensoryCard s={sensory} mine={!!s.ratings[p.id]} />
        <button className={secondaryBtn} onClick={() => setRate(true)}>
          {s.ratings[p.id] ? "Update your rating" : "Rate this space"} <Star className="size-4" />
        </button>
      </section>
      {rate && (
        <RateSheet
          name={p.name}
          seed={SEED[p.id] ?? DEFAULT_SENSORY}
          initial={s.ratings[p.id]}
          onSave={(r) => {
            s.set({ ratings: { ...s.ratings, [p.id]: r } });
            setDone(true);
          }}
          onClose={() => setRate(false)}
        />
      )}

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 font-bold text-primary">
          Essential information{" "}
          <span className="rounded-full bg-accent px-2 text-xs">Illustrative</span>
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          {visibleNotes(p.notes, s.prefs.detail).map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        {routes.map((r) => (
          <Link
            key={r.id}
            to="/route/$id"
            params={{ id: r.id }}
            search={{ tab: "overview" }}
            className="retro press flex items-center gap-3 overflow-hidden rounded-2xl bg-card pr-3"
          >
            <span className="block w-24 shrink-0 self-stretch">
              <RouteMini routeId={r.id} className="size-full" compact />
            </span>
            <span className="flex-1 py-2">
              <span className="block font-bold text-primary">{r.name}</span>
              <span className="text-sm text-muted-foreground">{r.minutes} min walk</span>
            </span>
            <ArrowRight className="size-4 text-primary" aria-hidden="true" />
          </Link>
        ))}
      </section>

      {ll && (
        <section className="space-y-2">
          <h2 className="font-bold text-primary">Map preview</h2>
          <GeoMap
            className="aspect-[16/9]"
            controls={false}
            markers={[
              {
                id: p.id,
                name: p.name,
                ll,
                tone: toneOf(sensory.calm),
                calm: sensory.calm,
                state: "selected",
                kind: host ? kindOf(host) : "building",
                approx: host ? !!GEO[host]?.approx : true,
                ...(hostNode ? { xy: hostNode.xy } : {}),
              },
            ]}
            lines={[]}
            fit={[ll]}
            fitKey={p.id}
            onSelect={() => {}}
          />
          <p className="text-xs text-muted-foreground">
            Pin sits on the host building. {ILLUSTRATIVE_ROUTE}.
          </p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="font-bold text-primary">Community</h2>
        {posts.length ? (
          <ul className="space-y-3">
            {posts.map((x) => (
              <li key={x.id}>
                <PostCard p={toCard(x, s.replies, isMine(x.id))} from="place" ctx={p.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No posts about this place yet.</p>
        )}
        <Link to="/community/new" search={{ from: "feed" }} className={secondaryBtn}>
          Ask a question <ArrowRight className="size-4" />
        </Link>
      </section>
      <p className="text-xs text-muted-foreground">{ILLUSTRATIVE}</p>
    </Shell>
  );
}
