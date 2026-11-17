import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Shell, Heading, backCls, primaryBtn, secondaryBtn, textLink } from "@/components/Shell";
import { findScenario, DEFAULT_ROUTE } from "@/data/demo";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/practice_/scenario/$id")({
  loader: ({ params }) => { const s = findScenario(params.id); if (!s) throw notFound(); return s; },
  head: pageHead("Campus Practice scenario · UCL East", "A short, private practice of an everyday campus moment."), component: Scenario });
function Scenario() {
  const sc = Route.useLoaderData(); const [pick, setPick] = useState<number | null>(null); const o = pick === null ? null : sc.options[pick]!;
  return (
    <Shell practice back={<Link to="/practice" search={{ from: "home", route: DEFAULT_ROUTE }} className={backCls}><ChevronLeft className="size-4" />Choose a practice</Link>}>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Campus Practice · private</p>
      <Heading display key={o ? "f" : "q"}>{o ? "Your next step" : sc.title}</Heading>
      {o ? (<>
        <p className="text-lg" role="status">{o.feedback}</p>
        <p className="retro rounded-xl bg-background p-3">{sc.nextStep}</p>
        <Link to="/route/$id" params={{ id: DEFAULT_ROUTE }} className={primaryBtn}>Back to route <ArrowRight className="size-4" /></Link>
        <Link to="/community/new" search={{ from: "feed" }} className={secondaryBtn}>Ask the community <ArrowRight className="size-4" /></Link>
        <button className={textLink} onClick={() => setPick(null)}>Try another choice</button>
      </>) : (<>
        <p className="text-lg">{sc.situation}</p>
        <div className="grid gap-2">{sc.options.map((x, i) => <button key={x.label} onClick={() => setPick(i)} className={secondaryBtn}>{x.label}<ArrowRight className="size-4" /></button>)}</div>
      </>)}
    </Shell>
  );
}
