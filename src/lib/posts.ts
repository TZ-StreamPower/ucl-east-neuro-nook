import { POSTS, postContext, findRoute, type Post } from "@/data/demo";
import type { Question } from "./logic";
import type { CardPost } from "@/components/PostCard";
export const fromQuestion = (q: Question): Post => ({ id: q.id, kind: "Question", title: q.text, routeId: q.routeId, replies: [] });
export function allPosts(questions: Question[]) { return [...POSTS, ...questions.map(fromQuestion)]; }
export function toCard(p: Post, extra: Record<string, string[]>, mine: boolean): CardPost {
  return { id: p.id, kind: p.kind, title: p.title, context: postContext(p), replies: p.replies.length + (extra[p.id]?.length ?? 0), mine };
}
export const routeName = (id: string) => findRoute(id)?.name ?? "this route";
