import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Shell, Heading, primaryBtn } from "@/components/Shell";
import { THREADS } from "@/data/demo";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/community/")({ head: head("Community · UCL East", "Demo questions and tips linked to campus places and routes."), component: Community });
function Community() {
  const s = useStore();
  return (
    <Shell tabs title="Community">
      <Heading>Community</Heading>
      <p className="text-sm text-muted-foreground">Demo discussion · student notes, not official guidance</p>
      <ul className="space-y-3">
        {THREADS.map((t) => (
          <li key={t.id}>
            <Link to="/community/$id" params={{ id: t.id }} search={{ from: "feed" }} className="block space-y-1 rounded-xl border border-border p-3 hover:border-brand">
              <span className="flex items-center gap-2 text-xs font-bold"><span className={`rounded-full px-2 py-0.5 ${t.kind === "Tip" ? "bg-sage/40" : "bg-accent"} text-primary`}>{t.kind}</span><span className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-3" />{t.label}</span></span>
              <span className="block font-bold text-primary">{t.text}</span>
            </Link>
          </li>
        ))}
        {s.questions.map((q) => <li key={q.id} className="rounded-xl bg-accent p-3"><span className="block text-xs font-bold text-muted-foreground">Your demo question · Stratford Station → Marshgate · this prototype only</span>{q.text}</li>)}
      </ul>
      <Link to="/community/new" search={{ from: "feed" }} className={primaryBtn}>Write a question <ArrowRight className="size-4" /></Link>
    </Shell>
  );
}
