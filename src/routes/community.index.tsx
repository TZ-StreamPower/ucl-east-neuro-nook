import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, pill } from "@/components/Shell";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";
import { allPosts, toCard } from "@/lib/posts";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/community/")({ head: pageHead("Community · UCL East", "Questions and tips linked to campus places and routes."), component: Community });
function Community() {
  const s = useStore(); const [kind, setKind] = useState<"all" | "Question" | "Tip">("all");
  const posts = allPosts(s.questions).reverse().filter((p) => kind === "all" || p.kind === kind);
  return (
    <Shell tabs title="Community">
      <Heading>Community</Heading>
      <p className="-mt-2 text-sm text-muted-foreground">Demo discussion · student notes, not official guidance</p>
      <div role="group" aria-label="Filter posts" className="flex gap-2">
        {([["all", "All"], ["Question", "Questions"], ["Tip", "Tips"]] as const).map(([k, l]) => <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={pill}>{l}</button>)}
      </div>
      {s.kept && <div className="retro space-y-1 rounded-2xl bg-accent p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Kept draft · not published</p><p className="font-bold text-primary">{s.kept.text}</p>
        <Link to="/community/new" search={{ from: "feed", route: s.kept.routeId }} onClick={() => s.set({ draft: s.kept!.text })} className="font-bold text-brand underline">Continue editing</Link></div>}
      <ul className="space-y-3">{posts.map((p) => <li key={p.id}><PostCard p={toCard(p, s.replies, p.id.startsWith("q-"))} from="feed" /></li>)}</ul>
      <Link to="/community/new" search={{ from: "feed" }} className={primaryBtn}>Write a question <ArrowRight className="size-4" /></Link>
    </Shell>
  );
}
