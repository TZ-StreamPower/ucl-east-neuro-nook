import type { ReactNode } from "react";
/** Schematic East Bank map (0–100 coords). Children are absolutely positioned pins. */
export function EastBankMap({ line, children, className = "aspect-[4/5]" }: { line?: [number, number][]; children?: ReactNode; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden retro rounded-2xl bg-map ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <rect x="38" y="20" width="26" height="22" rx="4" className="fill-map-green" />
        <rect x="18" y="8" width="20" height="12" rx="3" className="fill-map-green" />
        <path d="M30 0 C 34 25, 52 40, 50 60 S 44 85, 52 100 L58 100 C 50 85, 56 70, 56 58 S 40 25, 36 0 Z" className="fill-map-water" />
        <path d="M88 0 L 80 100" className="stroke-map-block" strokeWidth="3" fill="none" strokeDasharray="2 1.5" />
        <path d="M0 95 L 100 70" className="stroke-background" strokeWidth="2.5" fill="none" />
        {[[44, 62, 9, 7], [36, 69, 8, 6], [55, 71, 7, 5], [61, 79, 7, 5], [22, 18, 9, 7], [76, 50, 10, 8]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" className="fill-map-block" />)}
        {line && <polyline points={line.map((p) => p.join(",")).join(" ")} fill="none" className="stroke-brand" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 5 }} strokeLinecap="round" />}
      </svg>
      {children}
      <span className="absolute bottom-1.5 right-2 rounded bg-background/90 px-1.5 text-[10px] font-bold text-muted-foreground">Schematic · not to scale</span>
    </div>
  );
}
