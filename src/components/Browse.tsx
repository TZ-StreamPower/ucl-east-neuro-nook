import type { ReactNode } from "react";
import { Building2, Coffee, BookOpen, LifeBuoy, Route as RouteIcon, LayoutGrid } from "lucide-react";
import type { Cat, XY } from "@/data/demo";

export const CAT_STYLE: Record<Cat | "all", { I: typeof Building2; tile: string }> = {
  all: { I: LayoutGrid, tile: "bg-primary/10 text-primary" },
  buildings: { I: Building2, tile: "bg-cat-buildings text-primary" },
  food: { I: Coffee, tile: "bg-cat-food text-primary" },
  study: { I: BookOpen, tile: "bg-cat-study text-primary" },
  support: { I: LifeBuoy, tile: "bg-cat-support text-primary" },
};

/** Placeholder thumbnail: category-tinted tile with its icon. */
export function Thumb({ cat, route, className = "size-16" }: { cat: Cat; route?: boolean; className?: string }) {
  const { I, tile } = CAT_STYLE[cat]; const Icon = route ? RouteIcon : I;
  return <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-xl border-2 border-primary ${tile} ${className}`}><Icon className="size-6" /></span>;
}

/** Schematic campus map placeholder. Children are absolutely positioned pins (0–100 coords). */
export function MapCanvas({ line, children, className = "aspect-[4/3]" }: { line?: XY[]; children?: ReactNode; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-border bg-map ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <path d="M0 58 C 25 50, 40 70, 60 60 S 90 45, 100 52 L100 60 C 90 54, 70 70, 60 68 S 25 58, 0 66 Z" className="fill-map-water" />
        <rect x="44" y="8" width="40" height="24" rx="3" className="fill-map-green" />
        <rect x="4" y="76" width="30" height="18" rx="3" className="fill-map-green" />
        <path d="M0 90 L100 20 M10 0 L35 100 M0 40 L100 40" className="stroke-background" strokeWidth="2.5" fill="none" />
        {[[58, 34, 12, 8], [24, 60, 10, 10], [70, 24, 10, 8], [36, 70, 10, 8], [8, 22, 10, 10]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" className="fill-map-block" />)}
        {line && <polyline points={line.map((p) => p.join(",")).join(" ")} fill="none" className="stroke-brand" strokeWidth="1.6" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 4 }} />}
      </svg>
      {children}
      <span className="absolute bottom-1.5 right-2 rounded bg-background/80 px-1.5 text-[10px] font-bold text-muted-foreground">Schematic map · illustrative</span>
    </div>
  );
}

export function MapPin({ xy, label, active, onClick, children }: { xy: XY; label: string; active?: boolean; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; children: ReactNode }) {
  return (
    <button aria-label={label} aria-pressed={!!active} onClick={onClick} style={{ left: `${xy[0]}%`, top: `${xy[1]}%` }}
      className={`absolute z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background text-xs font-bold shadow-md ${active ? "scale-110 bg-brand text-primary-foreground ring-4 ring-brand/30" : "bg-primary text-primary-foreground"}`}>
      {children}
    </button>
  );
}
