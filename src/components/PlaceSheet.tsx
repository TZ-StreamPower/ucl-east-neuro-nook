import { Link } from "@tanstack/react-router";
import { ArrowRight, Route as RouteIcon } from "lucide-react";
import { Sheet, primaryBtn, secondaryBtn } from "@/components/Shell";
import { SensoryCard } from "@/components/SensoryMeter";
import { FEEDBACK, type NavNode } from "@/data/sensory";
import { useStore } from "@/lib/store";
export function PlaceSheet({ node, onRoute, onClose }: { node: NavNode; onRoute: () => void; onClose: () => void }) {
  const st = useStore(); const mine = st.walkFb.filter((f) => f.id === node.id).slice(-3).reverse();
  return (
    <Sheet title={node.name} onClose={onClose}>
      <p className="text-sm">{node.cue}</p>
      <SensoryCard s={st.sensory(node.id)} mine={!!st.ratings[node.id]} />
      {mine.length > 0 && <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-primary">You said:{mine.map((f, i) => { const d = FEEDBACK.find((x) => x.k === f.k)!; return <span key={i} className="sticker inline-flex items-center gap-1 bg-card px-2 py-0.5"><img src={d.src} alt="" className="size-5" />{d.label}</span>; })}</div>}
      <button className={primaryBtn} onClick={onRoute}>Route here <RouteIcon className="size-4" /></button>
      {node.placeId && <Link to="/place/$id" params={{ id: node.placeId }} className={secondaryBtn}>View details <ArrowRight className="size-4" /></Link>}
    </Sheet>
  );
}
