import { useEffect, useRef, useState } from "react";
import { X, Plus, Minus, Home, Check } from "lucide-react";
import { EastBankMap } from "@/components/scenes/EastBankMap";
import { PlaceSheet } from "@/components/PlaceSheet";
import { calmTone } from "@/components/SensoryMeter";
import { NODES, findNode } from "@/data/sensory";
import { zoomAt, type View } from "@/lib/logic";
import { useStore } from "@/lib/store";

const ctrl = "retro grid size-11 place-items-center rounded-xl bg-card text-primary";
/** Near-full-screen schematic map with pan/pinch/zoom. Illustrative drawing, not live geography; pass backgroundSrc later for Earth Studio art. */
export function MapExplorer({ path, onRoute, onClose }: { path: string[]; onRoute: (id: string) => void; onClose: () => void }) {
  const st = useStore(); const box = useRef<HTMLDivElement>(null);
  const [v, setV] = useState<View>({ z: st.mapView.z, x: st.mapView.x, y: st.mapView.y }); const [pin, setPin] = useState<string | null>(st.mapView.pin);
  const vr = useRef(v); vr.current = v;
  const clamp = (n: View): View => { const r = box.current?.getBoundingClientRect(); if (!r) return n; return { z: n.z, x: Math.min(0, Math.max(r.width - r.width * n.z, n.x)), y: Math.min(0, Math.max(r.height - r.height * n.z, n.y)) }; };
  const apply = (n: View) => setV(clamp(n));
  useEffect(() => { st.set({ mapView: { ...v, pin } }); }, [v, pin]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = box.current; if (!el) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" && !pin) onClose(); };
    const w = (e: WheelEvent) => { e.preventDefault(); const r = el.getBoundingClientRect(); const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1); apply(zoomAt(vr.current, vr.current.z * Math.exp(-dy * 0.002), e.clientX - r.left, e.clientY - r.top)); };
    el.addEventListener("wheel", w, { passive: false }); window.addEventListener("keydown", k);
    return () => { el.removeEventListener("wheel", w); window.removeEventListener("keydown", k); };
  }); // re-bind each render so handlers see latest pin/onClose
  const pts = useRef(new Map<number, { x: number; y: number }>()); const pinch = useRef<number | null>(null);
  const down = (e: React.PointerEvent) => { pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); pinch.current = null; };
  const move = (e: React.PointerEvent) => {
    const p = pts.current.get(e.pointerId); if (!p) return; const r = box.current!.getBoundingClientRect();
    if (pts.current.size === 1) { apply({ ...vr.current, x: vr.current.x + e.clientX - p.x, y: vr.current.y + e.clientY - p.y }); }
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()] as [{ x: number; y: number }, { x: number; y: number }]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current) apply(zoomAt(vr.current, vr.current.z * (d / pinch.current), (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top));
      pinch.current = d;
    }
  };
  const up = (e: React.PointerEvent) => { pts.current.delete(e.pointerId); pinch.current = null; };
  const btnZoom = (f: number) => { const r = box.current!.getBoundingClientRect(); apply(zoomAt(v, v.z * f, r.width / 2, r.height / 2)); };
  const node = pin ? findNode(pin) : null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Explore map" className="map-open fixed inset-0 z-40 mx-auto flex max-w-[430px] flex-col bg-background">
      <header className="flex h-14 items-center justify-between px-5"><h2 className="font-display text-2xl font-bold text-primary">Explore map</h2>
        <button aria-label="Close map" onClick={onClose} className="grid size-11 place-items-center rounded-full hover:bg-accent"><X className="size-6" /></button></header>
      <div ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} className="relative mx-3 mb-3 flex-1 touch-none select-none overflow-hidden rounded-2xl">
        <EastBankMap line={path.map((id) => findNode(id)!.xy)} className="absolute inset-0 size-full" inner={{ transform: `translate(${v.x}px, ${v.y}px) scale(${v.z})` }}>
          {NODES.map((n) => { const on = pin === n.id; const inPath = path.includes(n.id); return (
            <button key={n.id} aria-label={n.name} aria-pressed={on} onPointerDown={(e) => e.stopPropagation()} onClick={() => setPin(n.id)}
              style={{ left: `${n.xy[0]}%`, top: `${n.xy[1]}%`, transform: `translate(-50%, -50%) scale(${1 / v.z})` }} className="absolute z-10 grid size-11 place-items-center">
              <span className={`grid place-items-center rounded-full border-2 border-primary transition-all duration-[var(--dur-select)] ${calmTone(st.sensory(n.id))} ${on ? "size-9 ring-4 ring-brand" : inPath ? "size-7" : "size-5"}`}>{on && <Check className="size-4 text-primary" />}</span>
              {(on || v.z >= 2) && <span className="absolute top-full whitespace-nowrap rounded bg-background/90 px-1 text-[11px] font-bold text-primary">{n.name}</span>}
            </button>); })}
        </EastBankMap>
        <div className="absolute bottom-8 right-3 z-20 flex flex-col gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button aria-label="Zoom in" className={ctrl} onClick={() => btnZoom(1.5)}><Plus className="size-5" /></button>
          <button aria-label="Zoom out" className={ctrl} onClick={() => btnZoom(1 / 1.5)}><Minus className="size-5" /></button>
          <button aria-label="Reset view" className={ctrl} onClick={() => setV({ z: 1, x: 0, y: 0 })}><Home className="size-5" /></button>
        </div>
      </div>
      {node && <PlaceSheet node={node} onRoute={() => { onRoute(node.id); setPin(null); onClose(); }} onClose={() => setPin(null)} />}
    </div>
  );
}
