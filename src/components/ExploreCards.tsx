import { Link } from "@tanstack/react-router";
import { Footprints } from "lucide-react";
import { Art, artForCat } from "@/components/Art";
import { RouteMini } from "@/components/RouteMini";
import { MiniMeter } from "@/components/SensoryMeter";
import { GeoMap, toneOf, type GeoMarker } from "@/components/GeoMap";
import { CATS, findPlace, findRoute } from "@/data/demo";
import { ROUTE_NODES, GEO, placeLL, llOf } from "@/data/geo";
import { findNode } from "@/data/sensory";
import { useStore } from "@/lib/store";
import type { ResultItem } from "@/lib/logic";

function ItemLink({
  i,
  className,
  children,
}: {
  i: ResultItem;
  className: string;
  children: React.ReactNode;
}) {
  return i.kind === "place" ? (
    <Link to="/place/$id" params={{ id: i.id }} className={className}>
      {children}
    </Link>
  ) : (
    <Link to="/route/$id" params={{ id: i.id }} search={{ tab: "overview" }} className={className}>
      {children}
    </Link>
  );
}

/** Image-led card. `wide` cards use a 16:9 image, others a taller 4:5 image, for visual rhythm. */
export function ExploreCard({
  i,
  wide,
  active,
}: {
  i: ResultItem;
  wide: boolean;
  active?: boolean;
}) {
  const st = useStore();
  const label = i.kind === "route" ? "Route" : CATS.find((c) => c.id === i.cat)!.label;
  return (
    <ItemLink
      i={i}
      className={`retro press block overflow-hidden rounded-2xl bg-card ${wide ? "col-span-2" : ""} ${active ? "ring-2 ring-brand" : ""}`}
    >
      <span className={`relative block ${wide ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
        {i.kind === "route" ? (
          <RouteMini routeId={i.id} className="size-full" compact={!wide} />
        ) : (
          <Art kind={artForCat(i.cat)} photoKey={i.id} />
        )}
        <span className="sticker absolute left-2 top-2 bg-accent-yellow px-2 text-xs font-bold text-primary">
          {label}
        </span>
      </span>
      <span className="block space-y-0.5 p-3">
        <span className="block font-bold leading-tight text-primary">{i.name}</span>
        <span className="block text-sm text-muted-foreground">{i.sub}</span>
        {i.kind === "place" && <MiniMeter s={st.sensory(i.id)} />}
      </span>
    </ItemLink>
  );
}

export function ExploreGrid({
  items,
  selKey,
}: {
  items: ResultItem[];
  selKey?: string | undefined;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {items.map((r, n) => {
        const wide = n % 3 === 0;
        return (
          <li key={`${r.kind}:${r.id}`} className={wide ? "col-span-2" : ""}>
            <ExploreCard i={r} wide={wide} active={selKey === `${r.kind}:${r.id}`} />
          </li>
        );
      })}
    </ul>
  );
}

const FEATURED = [
  { kind: "place" as const, id: "marshgate" },
  { kind: "route" as const, id: "stratford-marshgate" },
  { kind: "place" as const, id: "quiet-room" },
  { kind: "place" as const, id: "marshgate-cafe" },
];
/** Horizontal rail with one wide hero card followed by tall cards. */
export function FeaturedRail() {
  const st = useStore();
  return (
    <section aria-labelledby="feat-h" className="space-y-2">
      <h2 id="feat-h" className="font-display text-xl font-bold text-primary">
        Featured
      </h2>
      <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
        {FEATURED.map((f, n) => {
          const p = f.kind === "place" ? findPlace(f.id) : undefined;
          const r = f.kind === "route" ? findRoute(f.id) : undefined;
          const name = p?.name ?? r?.name;
          if (!name) return null;
          const inner = (
            <>
              <span
                className={`relative block ${n === 0 ? "aspect-[4/3] w-64" : "aspect-[3/4] w-40"}`}
              >
                {r ? (
                  <RouteMini routeId={r.id} className="size-full" compact />
                ) : (
                  <Art kind={artForCat(p!.cat)} photoKey={p!.id} />
                )}
              </span>
              <span className="block space-y-0.5 p-2.5">
                <span className="block text-sm font-bold leading-tight text-primary">{name}</span>
                {p && <MiniMeter s={st.sensory(p.id)} />}
                {r && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    <Footprints className="size-3" /> {r.minutes} min
                  </span>
                )}
              </span>
            </>
          );
          return (
            <li key={f.id} className="shrink-0">
              {r ? (
                <Link
                  to="/route/$id"
                  params={{ id: r.id }}
                  search={{ tab: "overview" }}
                  className="retro press block overflow-hidden rounded-2xl bg-card"
                >
                  {inner}
                </Link>
              ) : (
                <Link
                  to="/place/$id"
                  params={{ id: f.id }}
                  className="retro press block overflow-hidden rounded-2xl bg-card"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Real map of the current results; place pins sit on their host building (verified OSM positions). */
export function ExploreMap({
  items,
  sel,
  onSel,
}: {
  items: ResultItem[];
  sel?: string | undefined;
  onSel: (key: string) => void;
}) {
  const st = useStore();
  const markers: GeoMarker[] = items.flatMap((i) => {
    const key = `${i.kind}:${i.id}`;
    const nodeId = i.kind === "route" ? ROUTE_NODES[i.id]?.to : undefined;
    const ll = i.kind === "place" ? placeLL(i.id) : nodeId ? llOf(nodeId) : null;
    if (!ll) return [];
    const calm = i.kind === "place" ? st.sensory(i.id).calm : st.sensory(nodeId!).calm;
    const node = nodeId ? findNode(nodeId) : undefined;
    return [
      {
        id: key,
        name: i.name,
        ll,
        tone: toneOf(calm),
        calm,
        state: key === sel ? ("selected" as const) : ("normal" as const),
        approx:
          i.kind === "place"
            ? GEO[i.id]
              ? !!GEO[i.id]!.approx
              : true
            : !!(nodeId && GEO[nodeId]?.approx),
        ...(node ? { xy: node.xy } : { xy: i.xy }),
      },
    ];
  });
  return (
    <GeoMap
      markers={markers}
      lines={[]}
      fit={markers.map((m) => m.ll)}
      fitKey={markers.map((m) => m.id).join("|")}
      onSelect={onSel}
      className="aspect-[4/5]"
    />
  );
}
