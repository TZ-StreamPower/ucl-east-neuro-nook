import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Shell, Heading, backCls, pill } from "@/components/Shell";
import { useStore } from "@/lib/store";
import type { Prefs } from "@/lib/logic";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/settings")({ head: pageHead("Preferences · UCL East Community", "Choose sound, motion, detail and route preferences."), component: Settings });
function Toggle({ label, hint, on, set }: { label: string; hint: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="retro flex min-h-14 items-center gap-3 rounded-xl p-3">
      <span className="flex-1"><span className="block font-bold text-primary">{label}</span><span className="text-sm text-muted-foreground">{hint}</span></span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => set(e.target.checked)} className="size-6 accent-[var(--brand)]" />
    </label>
  );
}
function Settings() {
  const s = useStore(); const p = s.prefs; const up = (x: Partial<Prefs>) => s.set({ prefs: { ...p, ...x } });
  return (
    <Shell back={<Link to="/" className={backCls}><ChevronLeft className="size-4" />Campus</Link>}>
      <Heading>Preferences</Heading>
      <p className="-mt-2 text-sm text-muted-foreground">You choose these. Nothing is set for you, and they stay on this device.</p>
      <Toggle label="Sound" hint="Play sounds in Practice and the game" on={p.sound} set={(v) => up({ sound: v })} />
      <Toggle label="Reduce motion" hint="Turn off animations" on={p.reduceMotion} set={(v) => up({ reduceMotion: v })} />
      <fieldset className="space-y-2"><legend className="font-bold text-primary">Information detail</legend>
        <div className="flex gap-2">{(["short", "full"] as const).map((d) => <button key={d} aria-pressed={p.detail === d} onClick={() => up({ detail: d })} className={pill}>{d === "short" ? "Short" : "Full"}</button>)}</div></fieldset>
      <fieldset className="space-y-2"><legend className="font-bold text-primary">Route preference</legend>
        <div className="flex flex-wrap gap-2">{([["none", "No preference"], ["fewer-crowds", "Fewer crowds"], ["step-free", "Step-free"]] as const).map(([k, l]) => <button key={k} aria-pressed={p.routePref === k} onClick={() => up({ routePref: k })} className={pill}>{l}</button>)}</div>
        <p className="text-xs text-muted-foreground">Shown as a reminder on routes. Quietness, crowds and access are not guaranteed.</p></fieldset>
      <Toggle label="Simulate offline (demo)" hint="Test what works without a connection" on={s.offline} set={(v) => s.set({ offline: v })} />
    </Shell>
  );
}
