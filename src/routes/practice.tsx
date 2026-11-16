import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, ExternalLink } from "lucide-react";
import { Shell, Heading, primaryBtn, secondaryBtn, textLink } from "@/components/Shell";
import { PracticeScene } from "@/components/scenes/Scene";
import { CHOICES, PRACTICE_SITUATION, STARTER_DRAFT, GAME_URL, ILLUSTRATIVE } from "@/data/demo";
import { useStore } from "@/lib/store";
import { practiceExitTarget } from "@/lib/logic";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/practice")({
  validateSearch: (q: Record<string, unknown>) => ({ from: q['from'] === "preview" ? ("preview" as const) : ("home" as const) }),
  head: head("Campus Practice · Leaving the station", "An optional practice of your first arrival."), component: Practice });
function Practice() {
  const s = useStore(); const nav = useNavigate(); const { from } = Route.useSearch();
  const exit = <Link to={practiceExitTarget(from)} className={textLink}>Exit practice</Link>;
  const shell = { back: practiceExitTarget(from), backLabel: "Campus Practice", practice: true, footer: exit };
  if (s.stage === 1) return (
    <Shell {...shell}>
      <Heading display>Leaving the station</Heading>
      <PracticeScene choice={null} />
      <p className="text-lg">The exit feels busy. The footbridge is your next landmark.</p>
      <button className={primaryBtn} onClick={() => s.set({ stage: 2 })}>Explore choices <ArrowRight className="size-4" /></button>
      <a href={GAME_URL} target="_blank" rel="noreferrer" className={textLink}>Open full game <ExternalLink className="size-4" /></a>
      <p className="text-sm text-muted-foreground">{ILLUSTRATIVE}</p>
    </Shell>
  );
  const c = s.stage === 3 ? CHOICES.find((x) => x.id === s.choice) : undefined;
  return (
    <Shell {...shell}>
      <Heading display key={c ? "fb" : "q"}>{c ? "Take a moment" : "What would you do?"}</Heading>
      <PracticeScene choice={c ? c.id : null} />
      {c ? (<>
        <p className="text-lg" role="status">{c.feedback}</p>
        <Link to="/route/preview" className={primaryBtn}>Back to route <ArrowUp className="size-4" /></Link>
        <button className={secondaryBtn} onClick={() => { s.set({ draft: s.draft || STARTER_DRAFT }); nav({ to: "/community/new", search: { from: "practice" } }); }}>Ask the community <ArrowRight className="size-4" /></button>
        <button className={textLink} onClick={() => s.set({ stage: 2 })}>Back to choices</button>
      </>) : (<>
        <p>{PRACTICE_SITUATION}</p>
        <div className="grid grid-cols-3 gap-2">
          {CHOICES.map((x) => (
            <button key={x.id} aria-label={x.full} aria-pressed={s.choice === x.id} onClick={() => s.set({ choice: x.id, stage: 3 })}
              className={`flex min-h-24 flex-col items-center gap-1 rounded-xl border bg-background p-1.5 text-center text-sm font-bold text-primary ${s.choice === x.id ? "border-brand ring-2 ring-brand" : "border-border"}`}>
              <PracticeScene choice={x.id} className="rounded-lg" />{x.label}
            </button>
          ))}
        </div>
      </>)}
    </Shell>
  );
}
