import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, ExternalLink } from "lucide-react";
import { Shell, Heading, primaryBtn, secondaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { CHOICES, PRACTICE_SITUATION, STARTER_DRAFT, GAME_URL } from "@/data/demo";
import { useStore } from "@/lib/store";
import { practiceExitTarget } from "@/lib/logic";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/practice")({ head: head("Campus Practice · Leaving the station", "An optional, text-first practice of your first arrival."), component: Practice });
const sceneFor = { continue: "segment", map: "route", calm: "home" } as const;
function Practice() {
  const s = useStore(); const nav = useNavigate();
  const exit = <Link to={practiceExitTarget(s.origin)} className={textLink}>Exit practice</Link>;
  const back = { back: practiceExitTarget(s.origin), backLabel: "Campus Practice", practice: true, footer: exit };
  if (s.stage === 1) return (
    <Shell {...back}>
      <Heading display>Leaving the station</Heading>
      <div className="relative"><Scene kind="station" />
        <button aria-label="Station exit: see what is happening" onClick={() => s.set({ stage: 2 })} className="absolute left-1/2 top-3/4 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-brand" /></div>
      <p className="text-lg">The exit feels busy.</p>
      <button className={primaryBtn} onClick={() => s.set({ stage: 2 })}>Continue to choices <ArrowRight className="size-4" /></button>
      <a href={GAME_URL} target="_blank" rel="noreferrer" className={textLink}>Open full game <ExternalLink className="size-4" /></a>
    </Shell>
  );
  if (s.stage === 2) return (
    <Shell {...back}>
      <Heading display>What would you do?</Heading>
      <p>{PRACTICE_SITUATION}</p>
      <div className="space-y-3">
        {CHOICES.map((c) => (
          <button key={c.id} aria-label={c.full} aria-pressed={s.choice === c.id} onClick={() => s.set({ choice: c.id, stage: 3 })}
            className={`flex min-h-20 w-full items-center gap-3 rounded-xl border bg-background p-2 text-left font-bold text-primary ${s.choice === c.id ? "border-brand ring-2 ring-brand" : "border-border"}`}>
            <Scene kind={sceneFor[c.id]} className="w-24 shrink-0" />{c.label}
          </button>
        ))}
      </div>
    </Shell>
  );
  const c = CHOICES.find((x) => x.id === s.choice) ?? CHOICES[0]!;
  return (
    <Shell {...back}>
      <Heading display>Take a moment</Heading>
      <Scene kind={sceneFor[c.id]} />
      <p className="text-lg">{c.feedback}</p>
      <Link to="/route/preview" className={primaryBtn}>Back to route <ArrowUp className="size-4" /></Link>
      <button className={secondaryBtn} onClick={() => { s.set({ draft: s.draft || STARTER_DRAFT }); nav({ to: "/community/new" }); }}>Ask the community <ArrowRight className="size-4" /></button>
      <button className={textLink} onClick={() => s.set({ stage: 2 })}>Back to choices</button>
    </Shell>
  );
}
