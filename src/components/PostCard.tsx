import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle } from "lucide-react";
import type { ThreadFrom } from "@/lib/logic";

export type CardPost = { id: string; kind: "Question" | "Tip"; title: string; context: string; replies: number; mine?: boolean };
export function PostCard({ p, from, ref }: { p: CardPost; from: ThreadFrom; ref?: string }) {
  return (
    <Link to="/community/$id" params={{ id: p.id }} search={{ from, ref }} className="block space-y-1.5 rounded-2xl border border-border p-3 hover:border-brand">
      <span className="flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className={`rounded-full px-2 py-0.5 ${p.kind === "Tip" ? "bg-cat-study/15 text-cat-study" : "bg-cat-buildings/15 text-cat-buildings"}`}>{p.kind}</span>
        <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-3" />{p.context}</span>
        {p.mine && <span className="text-muted-foreground">· Yours</span>}
      </span>
      <span className="block font-bold text-primary">{p.title}</span>
      <span className="flex items-center gap-1 text-sm text-muted-foreground"><MessageCircle className="size-4" />{p.replies} {p.replies === 1 ? "reply" : "replies"}</span>
    </Link>
  );
}
