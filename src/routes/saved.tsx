import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/saved")({ head: head("Saved routes · UCL East Community", "Your saved campus routes."), component: Saved });
function Saved() {
  const s = useStore();
  return (
    <Shell tabs title="Saved">
      <Heading>Saved</Heading>
      {s.saved ? (
        <div className="space-y-3 rounded-xl border border-border p-3">
          <Scene kind="route" />
          <p className="font-bold text-primary">Stratford Station → Marshgate</p>
          <Link to="/route/preview" className={primaryBtn}>Open route <ArrowRight className="size-4" /></Link>
          <button className={textLink} onClick={() => s.set({ saved: false })}>Remove</button>
        </div>
      ) : (<><p>No saved routes yet</p><Link to="/route" search={{ to: undefined }} className={primaryBtn}>Find a route <ArrowRight className="size-4" /></Link></>)}
    </Shell>
  );
}
