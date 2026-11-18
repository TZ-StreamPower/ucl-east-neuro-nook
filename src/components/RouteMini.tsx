import { GEO, ROUTE_NODES } from "@/data/geo";
import { GRAPH } from "@/data/sensory";
import { planRoute } from "@/lib/logic";
import { toneOf } from "@/components/GeoMap";
import { useStore } from "@/lib/store";
import { routeMapFor } from "@/data/images";

const COS = Math.cos((51.54 * Math.PI) / 180);
const FILL = {
  calm: "fill-accent-lime",
  mixed: "fill-accent-yellow",
  over: "fill-terracotta/60",
} as const;

/** Lightweight static route preview for cards (no WebGL). Illustrative line between verified node positions. */
export function RouteMini({
  routeId,
  className = "aspect-[16/9]",
  compact = false,
}: {
  routeId: string;
  className?: string;
  compact?: boolean;
}) {
  const st = useStore();
  const img = routeMapFor(routeId);
  if (img) {
    return (
      <span className={`relative block w-full overflow-hidden bg-map ${className}`}>
        <img
          src={img}
          alt="Route preview on an OpenStreetMap basemap (illustrative route)"
          loading="lazy"
          className="size-full object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-background/80 px-1 text-[9px] text-muted-foreground">
          {compact ? "© OSM" : "© OpenStreetMap contributors · illustrative"}
        </span>
      </span>
    );
  }
  const rn = ROUTE_NODES[routeId];
  const path = rn ? planRoute(GRAPH, rn.from, rn.to, "calm", st.sensory)?.path : undefined;
  if (!path || path.length < 2) return <div className={`bg-map ${className}`} />;
  const pts = path.map((id) => GEO[id]!.ll);
  const lngs = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const [x0, x1] = [Math.min(...lngs), Math.max(...lngs)];
  const [y0, y1] = [Math.min(...lats), Math.max(...lats)];
  const w = Math.max((x1 - x0) * COS, 1e-4);
  const h = Math.max(y1 - y0, 1e-4);
  const k = Math.min(160 / w, 80 / h);
  const X = (lng: number) => 100 + (lng - (x0 + x1) / 2) * COS * k;
  const Y = (lat: number) => 50 - (lat - (y0 + y1) / 2) * k;
  const edges = GRAPH.filter((e) => GEO[e.a] && GEO[e.b]);
  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Route preview (illustrative)"
      className={`w-full bg-map ${className}`}
    >
      {edges.map((e) => (
        <line
          key={e.a + e.b}
          x1={X(GEO[e.a]!.ll[0])}
          y1={Y(GEO[e.a]!.ll[1])}
          x2={X(GEO[e.b]!.ll[0])}
          y2={Y(GEO[e.b]!.ll[1])}
          className="stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <polyline
        points={pts.map((p) => `${X(p[0])},${Y(p[1])}`).join(" ")}
        fill="none"
        className="stroke-brand"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {path.map((id, i) => (
        <circle
          key={id}
          cx={X(GEO[id]!.ll[0])}
          cy={Y(GEO[id]!.ll[1])}
          r={i === 0 || i === path.length - 1 ? 5 : 3.5}
          className={`stroke-primary ${FILL[toneOf(st.sensory(id).calm)]}`}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
