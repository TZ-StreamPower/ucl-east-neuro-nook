import { Sheet } from "@/components/Shell";
import { FEEDBACK } from "@/data/sensory";
import type { FeedbackKind } from "@/lib/logic";
export function FeedbackTray({ place, onPick, onClose }: { place: string; onPick: (k: FeedbackKind) => void; onClose: () => void }) {
  return (
    <Sheet title={`How is it at ${place}?`} onClose={onClose}>
      <div className="grid grid-cols-4 gap-2">
        {FEEDBACK.map((f) => (
          <button key={f.k} onClick={() => { onPick(f.k); onClose(); }} className="flex min-h-11 flex-col items-center gap-1 rounded-xl p-1 text-xs font-bold text-primary press hover:bg-accent">
            <img src={f.src} alt="" className="size-14" />{f.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">One tap saves it to this spot's ratings on your phone.</p>
    </Sheet>
  );
}
