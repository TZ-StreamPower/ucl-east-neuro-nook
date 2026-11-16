import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_ROUTE } from "@/data/demo";
export const Route = createFileRoute("/route/preview")({ beforeLoad: () => { throw redirect({ to: "/route/$id", params: { id: DEFAULT_ROUTE }, statusCode: 301 }); } });
