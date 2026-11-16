import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { LANDMARKS, ILLUSTRATIVE, EXPECT } from "@/data/demo";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/place/marshgate")({ head: head("Marshgate · UCL East Community", "Arrival details for the Marshgate building."), component: Place });
function Place() {
  return (
    <Shell back="/" backLabel="Campus">
      <Scene kind="entrance" />
      <Heading>Marshgate</Heading>
      <p className="text-sm text-muted-foreground">{ILLUSTRATIVE}</p>
      <section className="space-y-2 rounded-xl bg-accent p-3">
        <h2 className="font-bold text-primary">Arriving</h2>
        <p>{LANDMARKS.entrance.cue}</p>
        <p className="text-muted-foreground">{EXPECT}</p>
      </section>
      <Link to="/route" search={{ to: "Marshgate" }} className={primaryBtn}>Plan a route <ArrowRight className="size-4" /></Link>
      <Link to="/community/$id" params={{ id: "marshgate-entrance" }} search={{ from: "place" }} className={textLink}><MessageCircle className="size-4" /> Which door is the main entrance?</Link>
    </Shell>
  );
}
