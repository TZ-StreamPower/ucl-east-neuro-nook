import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { THREADS, LANDMARKS } from "@/data/demo";
import { threadBack, type ThreadFrom } from "@/lib/logic";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/community/$id")({
  validateSearch: (q: Record<string, unknown>) => ({ from: (["preview", "place"].includes(q["from"] as string) ? q["from"] : "feed") as ThreadFrom }),
  loader: ({ params }) => { const t = THREADS.find((x) => x.id === params.id); if (!t) throw notFound(); return t; },
  head: head("Discussion · UCL East Community", "A demo route-linked discussion."), component: ThreadPage });
function ThreadPage() {
  const t = Route.useLoaderData(); const { from } = Route.useSearch(); const b = threadBack(from);
  const sceneKind = t.landmark === "bridge" ? "bridge" : t.landmark === "entrance" ? "entrance" : t.landmark === "station" ? "station" : "route";
  return (
    <Shell back={b.to} backLabel={b.label}>
      <p className="text-sm font-bold text-muted-foreground">Demo {t.kind.toLowerCase()} · {t.label}</p>
      <Heading>{t.text}</Heading>
      <div className="rounded-lg bg-accent p-3"><p className="text-sm text-muted-foreground">Demo reply</p><p>{t.reply}</p></div>
      <section className="flex items-center gap-3 rounded-xl border border-border p-2">
        <Scene kind={sceneKind} className="w-24 shrink-0" />
        <div><p className="flex items-center gap-1 text-sm font-bold text-primary"><MapPin className="size-3" />{t.landmark === "route" ? "Example route" : LANDMARKS[t.landmark].name}</p>
          <Link to="/route/preview" className={textLink}>Open route preview</Link></div>
      </section>
      <Link to="/community/new" search={{ from: "feed" }} className={primaryBtn}>Write a question <ArrowRight className="size-4" /></Link>
    </Shell>
  );
}
