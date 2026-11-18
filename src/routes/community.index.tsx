import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, secondaryBtn, pill } from "@/components/Shell";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";
import { allPosts, toCard, isMine } from "@/lib/posts";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/community/")({ head: pageHead("Community · UCL East", "Questions and tips linked to campus places and routes."), component: Community });
function Community() {
  const s = useStore(); const [kind, setKind] = useState<"all" | "Experience" | "Question" | "Review">("all");
  const posts = allPosts(s.questions, s.experiences).reverse().filter((p) => kind === "all" || p.kind === kind || (kind === "Question" && p.kind === "Tip"));
  const expIdx = new Map(posts.filter((p) => p.kind === "Experience").map((p, n) => [p.id, n] as const));
  return (
    <Shell tabs title="Community">
      <Heading>Community</Heading>
      <p className="-mt-2 text-sm text-muted-foreground">Demonstration posts written by the team · not student testimonials or official guidance</p>
      <div role="group" aria-label="Filter posts" className="-mx-5 flex gap-2 overflow-x-auto px-5">
        {([["all", "All"], ["Experience", "Experiences"], ["Question", "Questions"], ["Review", "Route reviews"]] as const).map(([k, l]) => <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={pill}>{l}</button>)}
      </div>
      {s.kept && <div className="retro space-y-1 rounded-2xl bg-accent p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Kept draft · not published</p><p className="font-bold text-primary">{s.kept.text}</p>
        <Link to="/community/new" search={{ from: "feed", route: s.kept.routeId }} onClick={() => s.set({ draft: s.kept!.text })} className="font-bold text-brand underline">Continue editing</Link></div>}
      <ul className="space-y-4">{posts.map((p) => <li key={p.id}><PostCard p={toCard(p, s.replies, isMine(p.id))} from="feed" tall={p.kind === "Experience" && expIdx.get(p.id)! % 2 === 1} /></li>)}</ul>
      <Link to="/reflect" search={{ from: "stratford", to: "marshgate", mode: "calm" }} className={secondaryBtn}>Share an experience <ArrowRight className="size-4" /></Link>
      <Link to="/community/new" search={{ from: "feed" }} className={primaryBtn}>Write a question <ArrowRight className="size-4" /></Link>
    </Shell>
  );
}
