import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, secondaryBtn } from "@/components/Shell";
import { ROUTE, VISIT_US } from "@/data/demo";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/route/help")({ head: head("Get help · UCL East Community", "Support options while following your route."), component: Help });
function Help() {
  const s = useStore(); const i = s.step ?? 0;
  return (
    <Shell back="/route/steps" backLabel="Current step">
      <Heading>Get help</Heading>
      <p>You are on step {i + 1}: {ROUTE.steps[i].title}.</p>
      <h2 className="font-bold text-primary">All steps</h2>
      <ol className="list-decimal space-y-1 pl-5">{ROUTE.steps.map((x) => <li key={x.title}>{x.title}</li>)}</ol>
      <a href={VISIT_US} target="_blank" rel="noreferrer" className={secondaryBtn}>Campus support information <ArrowRight className="size-4" /></a>
      <Link to="/route/steps" className={primaryBtn}>Return to current step <ArrowRight className="size-4" /></Link>
    </Shell>
  );
}
