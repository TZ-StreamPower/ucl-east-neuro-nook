import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell, Heading, primaryBtn, textLink } from "@/components/Shell";
import { Scene } from "@/components/scenes/Scene";
import { useStore } from "@/lib/store";
const head = (t: string, d: string) => () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] });
export const Route = createFileRoute("/")({ head: head("Campus · UCL East Community", "Find your way to Marshgate and practise your first arrival."), component: Home });
function Home() {
  const s = useStore(); const nav = useNavigate();
  return (
    <Shell tabs>
      <Link to="/route" aria-label="Marshgate, selected destination" className="block rounded-xl ring-2 ring-brand"><Scene kind="home" /></Link>
      <Heading>Where are you going?</Heading>
      <Link to="/route" className={primaryBtn}>Find my way <ArrowRight className="size-4" /></Link>
      <button className={textLink} onClick={() => { s.set({ origin: "home", stage: 1 }); nav({ to: "/practice" }); }}>Campus Practice <ArrowRight className="size-4" /></button>
    </Shell>
  );
}
