import { useState } from "react";
import { Star, Volume2, Check } from "lucide-react";
import { Sheet, primaryBtn, secondaryBtn } from "@/components/Shell";
import { LIGHT, BUSY, SensoryCard } from "@/components/SensoryMeter";
import { combineRating, type MyRating, type Light, type Busy, type Sensory } from "@/lib/logic";

const opt = "grid min-h-11 min-w-11 place-items-center rounded-xl border-2 border-primary px-2 text-sm font-bold text-primary aria-pressed:bg-accent-lavender aria-pressed:ring-[3px] aria-pressed:ring-brand";
export function RateSheet({ name, seed, initial, onSave, onClose }: { name: string; seed: Sensory; initial?: MyRating | undefined; onSave: (r: MyRating) => void; onClose: () => void }) {
  const [r, setR] = useState<MyRating>(initial ?? {}); const [preview, setPreview] = useState(false);
  const u = (p: MyRating) => setR((x) => ({ ...x, ...p }));
  if (preview) return (
    <Sheet title="Check your rating" onClose={onClose}>
      <SensoryCard s={combineRating(seed, r)} mine />
      <button className={primaryBtn} onClick={() => { onSave(r); onClose(); }}>Confirm <Check className="size-4" /></button>
      <button className={secondaryBtn} onClick={() => setPreview(false)}>Edit</button>
    </Sheet>
  );
  return (
    <Sheet title={`Rate ${name}`} onClose={onClose}>
      <Row label="Noise" icon={<Volume2 className="size-4" />} hint="1 quiet · 5 very loud">
        {[1, 2, 3, 4, 5].map((n) => <button key={n} aria-pressed={r.noise === n} aria-label={`Noise ${n}`} onClick={() => u({ noise: n })} className={opt}>{n}</button>)}
      </Row>
      <Row label="Lighting">
        {(Object.keys(LIGHT) as Light[]).map((k) => { const L = LIGHT[k]; return <button key={k} aria-pressed={r.light === k} onClick={() => u({ light: k })} className={`${opt} flex-1 gap-0.5`}><L.I className="size-5" aria-hidden="true" />{L.l}</button>; })}
      </Row>
      <Row label="How calm did it feel?" icon={<Star className="size-4" />}>
        {[1, 2, 3, 4, 5].map((n) => <button key={n} aria-label={`Calm ${n} of 5`} aria-pressed={r.calm === n} onClick={() => u({ calm: n })} className="grid size-11 place-items-center rounded-full"><Star className={`size-8 ${r.calm && n <= r.calm ? "fill-accent-yellow text-primary" : "text-border"}`} aria-hidden="true" /></button>)}
      </Row>
      <Row label="Space right now">
        {(Object.keys(BUSY) as Busy[]).map((k) => <button key={k} aria-pressed={r.busy === k} onClick={() => u({ busy: k })} className={`${opt} flex-1 ${BUSY[k].cls}`}>{BUSY[k].l}</button>)}
      </Row>
      <button className={primaryBtn} disabled={!Object.keys(r).length} onClick={() => setPreview(true)}>Preview <Check className="size-4" /></button>
    </Sheet>
  );
}
function Row({ label, icon, hint, children }: { label: string; icon?: React.ReactNode; hint?: string; children: React.ReactNode }) {
  return <fieldset className="space-y-1.5"><legend className="flex items-center gap-1.5 font-bold text-primary">{icon}{label}{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</legend><div className="flex gap-2">{children}</div></fieldset>;
}
