import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Shell, Heading, primaryBtn } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { SEED_QUESTION, SEED_TIP } from "@/data/demo";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/community/")({
  validateSearch: (s: Record<string, unknown>) => ({ thread: typeof s['thread'] === "string" ? s['thread'] : undefined }),
  head: head("Community · UCL East", "Demo questions and tips linked to campus routes."), component: Community });
function Community() {
  const s = useStore(); const { thread } = Route.useSearch();
  if (thread === "seed-1") return (
    <Shell back="/route/preview" backLabel="Route preview" tabs>
      <p className="text-sm font-bold text-muted-foreground">Demo discussion · Stratford Station → Marshgate</p>
      <Heading>{SEED_QUESTION.text}</Heading>
      <div className="rounded-lg bg-accent p-3"><p className="text-sm text-muted-foreground">Demo reply</p><p>{SEED_QUESTION.reply}</p></div>
      <Link to="/community/new" className={primaryBtn}>Write a question <ArrowRight className="size-4" /></Link>
    </Shell>
  );
  return (
    <Shell tabs title="Community">
      <Heading>Community</Heading>
      <section className="space-y-3 rounded-xl border border-border p-3">
        <div className="flex items-center gap-3"><Scene kind="route" className="w-20" /><div><p className="font-bold text-primary">Stratford Station → Marshgate</p><p className="text-sm text-muted-foreground">Demo discussion</p></div></div>
        <Link to="/community" search={{ thread: "seed-1" }} className="flex min-h-11 items-center gap-2 font-bold text-primary underline-offset-4 hover:underline"><MessageCircle className="size-4" />{SEED_QUESTION.text}</Link>
        <p className="text-muted-foreground">{SEED_TIP}</p>
        {s.questions.map((q) => <p key={q.id} className="rounded-lg bg-accent p-3"><span className="block text-sm text-muted-foreground">Your demo question · this prototype only</span>{q.text}</p>)}
      </section>
      <Link to="/community/new" className={primaryBtn}>Write a question <ArrowRight className="size-4" /></Link>
    </Shell>
  );
}
