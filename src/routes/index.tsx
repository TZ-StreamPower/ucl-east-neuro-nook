import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { useStore } from "@/lib/store";
import { ILLUSTRATIVE } from "@/data/demo";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/")({ head: head("Campus · UCL East Community", "Find your way to Marshgate and practise your first arrival."), component: Home });
function Home() {
  const s = useStore();
  return (
    <Shell tabs>
      <Heading>Where are you going?</Heading>
      <Link to="/place/marshgate" className="block overflow-hidden rounded-xl border border-border hover:border-brand">
        <Scene kind="home" className="rounded-none" />
        <span className="flex min-h-12 items-center justify-between px-3 font-bold text-primary">Marshgate <span className="text-sm font-normal text-muted-foreground">Place details</span></span>
      </Link>
      <Link to="/route" search={{ to: undefined }} className={primaryBtn}>Find my way <ArrowRight className="size-4" /></Link>
      <Link to="/practice" search={{ from: "home" }} onClick={() => s.set({ stage: 1, choice: null })} className={textLink}>Campus Practice <ArrowRight className="size-4" /></Link>
      <p className="mt-auto text-sm text-muted-foreground">{ILLUSTRATIVE}</p>
    </Shell>
  );
}
