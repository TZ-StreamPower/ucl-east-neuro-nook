import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { DEFAULT_ROUTE, findRoute } from "@/data/demo";
import { pageHead } from "@/lib/head";
export const Route = createFileRoute("/practice_/game")({
  validateSearch: zodValidator(z.object({ route: fallback(z.string(), DEFAULT_ROUTE).default(DEFAULT_ROUTE) })),
  head: pageHead("Campus Practice game · UCL East", "The Same Day, Three Paths practice game."), component: Game });
function Game() {
  const q = Route.useSearch(); const id = findRoute(q.route) ? q.route : DEFAULT_ROUTE;
  return <Navigate to="/route/$id" params={{ id }} search={{ tab: "overview", game: 1 }} replace />;
}
