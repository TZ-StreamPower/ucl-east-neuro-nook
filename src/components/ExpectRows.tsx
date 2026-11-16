import { useState } from "react";
import { Volume2, Users, DoorOpen, Armchair, ChevronDown } from "lucide-react";
import { EXPECT_LABEL, type ExpectRow } from "@/data/demo";
const ICON = { sound: Volume2, crowds: Users, entrances: DoorOpen, pause: Armchair };
export function ExpectRows({ rows }: { rows: ExpectRow[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <ul className="divide-y divide-border rounded-2xl border border-border">
        {rows.map((r) => { const I = ICON[r.key]; const on = open === r.key; return (
          <li key={r.key}>
            <button aria-expanded={on} onClick={() => setOpen(on ? null : r.key)} className="flex min-h-14 w-full items-center gap-3 px-3 text-left">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><I className="size-5" /></span>
              <span className="flex-1"><span className="block font-bold text-primary">{EXPECT_LABEL[r.key]}</span><span className="block text-sm text-muted-foreground">{r.detail ? "Details available" : "Not yet recorded"}</span></span>
              <ChevronDown className={`size-4 transition-transform motion-reduce:transition-none ${on ? "rotate-180" : ""}`} />
            </button>
            {on && <div className="space-y-1 px-3 pb-3 pl-16 text-sm">
              {r.detail ? <><p>{r.detail}</p><p className="text-muted-foreground">Observed: {r.observed}</p><p className="text-muted-foreground">Source: {r.source}</p></>
                : <p>No information recorded for this route yet. Observation time and source: not available.</p>}
            </div>}
          </li>); })}
      </ul>
      <p className="text-sm text-muted-foreground">These are notes, not settings. You decide what matters to you and what to do with it.</p>
    </div>
  );
}
