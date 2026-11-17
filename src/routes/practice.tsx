import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, ExternalLink, ChevronLeft } from "lucide-react";
import { Shell, Heading, backCls, primaryBtn, secondaryBtn, textLink } from "@/components/Shell";
import { PracticeScene } from "@/components/scenes/Scene";
import { SCENARIOS, CHOICES, PRACTICE_SITUATION, STARTER_DRAFT, ILLUSTRATIVE, DEFAULT_ROUTE, findRoute } from "@/data/demo";
import { useStore } from "@/lib/store";
import { practiceExit, type PracticeFrom } from "@/lib/logic";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/practice")({
  validateSearch: zodValidator(z.object({ from: fallback(z.string(), "home").default("home"), route: fallback(z.string(), DEFAULT_ROUTE).default(DEFAULT_ROUTE) })),
  head: pageHead("Campus Practice · Leaving the station", "An optional practice of your first arrival."), component: Practice });
const STAGES = ["Exploration", "Decision-making", "Support and feedback"];
function Practice() {
  const s = useStore(); const nav = useNavigate(); const q = Route.useSearch(); const from: PracticeFrom = q.from === "route" ? "route" : "home"; const route = findRoute(q.route) ? q.route : DEFAULT_ROUTE; const r = findRoute(route)!;
  const ex = practiceExit(from, route);
  const exitLink = (cls: string, label: string, icon?: boolean) => ex.kind === "route"
    ? <Link to="/route/$id" params={{ id: ex.id }} className={cls}>{icon && <ChevronLeft className="size-4" />}{label}</Link>
    : <Link to="/" className={cls}>{icon && <ChevronLeft className="size-4" />}{label}</Link>;
  const shell = { back: exitLink(backCls, "Exit practice", true), practice: true, footer: <div className="bg-practice">{exitLink(textLink, "Exit practice")}</div> };
  const stageBar = <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Campus Practice · {r.to} · {s.stage} of 3 · {STAGES[s.stage - 1]}</p>;
  if (s.stage === 1) return (
    <Shell {...shell}>
      {stageBar}
      <Heading display>Leaving the station</Heading>
      <p className="rounded-lg bg-background p-3 text-sm">Optional practice. Your choices stay private and are never posted. You can exit at any time.</p>
      <PracticeScene choice={null} />
      <p className="text-lg">The exit feels busy. Your next landmark is {r.steps[1]!.landmark.name.toLowerCase()}.</p>
      <button className={primaryBtn} onClick={() => s.set({ stage: 2 })}>Explore choices <ArrowRight className="size-4" /></button>
      <Link to="/practice/game" search={{ route }} className={textLink}>Open the game <ExternalLink className="size-4" /></Link>
      <section className="space-y-2"><h2 className="font-bold text-primary">Choose another practice</h2>
        {SCENARIOS.map((x) => <Link key={x.id} to="/practice/scenario/$id" params={{ id: x.id }} className={secondaryBtn}>{x.title}<ArrowRight className="size-4" /></Link>)}</section>
      <p className="text-sm text-muted-foreground">{ILLUSTRATIVE}</p>
    </Shell>
  );
  const c = s.stage === 3 ? CHOICES.find((x) => x.id === s.choice) : undefined;
  return (
    <Shell {...shell}>
      {stageBar}
      <Heading display key={c ? "fb" : "q"}>{c ? "Take a moment" : "What would you do?"}</Heading>
      <PracticeScene choice={c ? c.id : null} />
      {c ? (<>
        <p className="text-lg" role="status">{c.feedback}</p>
        <Link to="/route/$id" params={{ id: route }} className={primaryBtn}>Back to route <ArrowUp className="size-4" /></Link>
        <button className={secondaryBtn} onClick={() => { s.set({ draft: s.draft || STARTER_DRAFT }); nav({ to: "/community/new", search: { from: "practice", route } }); }}>Ask the community <ArrowRight className="size-4" /></button>
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
        <Link to="/practice/game" search={{ route }} className={textLink}>Open the game <ExternalLink className="size-4" /></Link>
      </>)}
    </Shell>
  );
}
