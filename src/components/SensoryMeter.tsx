import { Star, Volume2, Sun, Moon, SunDim, Users } from "lucide-react";
import type { Sensory, Light, Busy } from "@/lib/logic";

export const LIGHT: Record<Light, { l: string; I: typeof Sun }> = { dark: { l: "Dim", I: Moon }, ok: { l: "Soft", I: SunDim }, bright: { l: "Bright", I: Sun } };
export const BUSY: Record<Busy, { l: string; cls: string }> = { free: { l: "Free", cls: "bg-accent-lime" }, busy: { l: "Busy", cls: "bg-accent-yellow" }, full: { l: "Full", cls: "bg-terracotta/30" } };
export const calmTone = (s: Sensory) => (s.calm >= 4 ? "bg-accent-lime" : s.calm >= 3 ? "bg-accent-yellow" : "bg-terracotta/40");

export function Stars({ value, label }: { value: number; label: string }) {
  return <span role="img" aria-label={`${label} ${value} of 5`} className="inline-flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} aria-hidden="true" className={`size-4 ${i <= Math.round(value) ? "fill-accent-yellow text-primary" : "text-border"}`} />)}</span>;
}

/** Compact icon row for list cards. */
export function MiniMeter({ s }: { s: Sensory }) {
  const L = LIGHT[s.light];
  return (
    <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-bold text-primary">
      <span className="inline-flex items-center gap-0.5 rounded-full border border-primary px-1.5"><Volume2 className="size-3" aria-hidden="true" />{s.noise <= 2.5 ? "Quiet" : s.noise >= 4 ? "Loud" : "Some noise"}</span>
      <span className="inline-flex items-center gap-0.5 rounded-full border border-primary px-1.5"><L.I className="size-3" aria-hidden="true" />{L.l}</span>
      <span className={`rounded-full border border-primary px-1.5 ${BUSY[s.busy].cls}`}>{BUSY[s.busy].l}</span>
    </span>
  );
}

/** Full "How it feels" block. */
export function SensoryCard({ s, mine }: { s: Sensory; mine?: boolean }) {
  const L = LIGHT[s.light];
  return (
    <div className="grid grid-cols-2 gap-2">
      <Tile icon={<Volume2 className="size-5" />} label="Quietness"><Stars value={6 - s.noise} label="Quietness" /></Tile>
      <Tile icon={<Star className="size-5" />} label="Calm"><Stars value={s.calm} label="Calm" /></Tile>
      <Tile icon={<L.I className="size-5" />} label="Lighting"><span className="font-bold">{L.l}</span></Tile>
      <Tile icon={<Users className="size-5" />} label="Usually" cls={BUSY[s.busy].cls}><span className="font-bold">{BUSY[s.busy].l}</span></Tile>
      <p className="col-span-2 text-xs text-muted-foreground">{s.n} ratings{mine ? " · includes yours" : " · illustrative"}</p>
    </div>
  );
}
function Tile({ icon, label, children, cls = "bg-card" }: { icon: React.ReactNode; label: string; children: React.ReactNode; cls?: string }) {
  return <div className={`retro flex flex-col gap-1 rounded-xl p-3 text-primary ${cls}`}><span className="flex items-center gap-1.5 text-xs font-bold" aria-hidden="true">{icon}{label}</span>{children}</div>;
}
