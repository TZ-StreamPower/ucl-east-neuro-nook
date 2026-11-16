// Schematic isometric scenes. Decorative; text equivalents live outside.
import type { ChoiceId, LandmarkId } from "@/data/demo";
type Kind = "home" | "station" | "segment" | "entrance" | "route" | "bridge";
const INK = "#361A54", HI = "#9A3BFF";
function Building({ x, y, tone }: { x: number; y: number; tone: "lilac" | "terra" }) {
  const side = tone === "lilac" ? "#a48aa6" : "#c07a66";
  const shade = tone === "lilac" ? "#8a6f7f" : "#946a64";
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points="0,20 40,0 80,20 40,40" fill="#f1e6cf" />
      <polygon points="0,20 40,40 40,80 0,60" fill={side} />
      <polygon points="40,40 80,20 80,60 40,80" fill={shade} />
      <polygon points="14,46 26,52 26,70 14,64" fill="#3d2b4a" />
    </g>
  );
}
function Bridge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points="0,20 60,-10 70,-5 10,25" fill="#d9c7a6" />
      <polygon points="10,25 70,-5 70,3 10,33" fill="#a99273" />
    </g>
  );
}
function Tree({ x, y }: { x: number; y: number }) {
  return <polygon points={`${x},${y} ${x + 8},${y + 24} ${x - 8},${y + 24}`} fill="#5f7a63" />;
}
function Ground() {
  return (<>
    <polygon points="0,130 180,40 300,100 300,200 0,200" fill="#b9c6a2" />
    <polygon points="0,170 200,70 260,100 60,200 0,200" fill="#f4e7cb" />
  </>);
}
const Pin = ({ cx, cy, hi }: { cx: number; cy: number; hi?: boolean }) => <circle cx={cx} cy={cy} r={hi ? 10 : 7} fill={hi ? HI : INK} stroke="#fff" strokeWidth="2" />;

export const MAP_PINS: Record<LandmarkId, [number, number]> = { station: [70, 140], bridge: [140, 95], entrance: [215, 135] };

export function Scene({ kind, className = "" }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={`w-full rounded-xl bg-sand ${className}`} aria-hidden="true">
      <Ground />
      <Tree x={40} y={110} /><Tree x={240} y={120} /><Tree x={210} y={140} />
      {kind === "route" ? (
        <>
          <Building x={30} y={60} tone="lilac" />
          <Bridge x={110} y={95} />
          <Building x={190} y={70} tone="terra" />
          <polyline points="70,140 140,95 215,135" fill="none" stroke={INK} strokeWidth="4" />
        </>
      ) : kind === "bridge" ? (
        <><Bridge x={95} y={110} /><Tree x={90} y={95} /><Tree x={180} y={80} /><Pin cx={135} cy={118} /></>
      ) : (
        <>
          <Building x={110} y={50} tone={kind === "entrance" || kind === "home" ? "terra" : "lilac"} />
          {kind !== "home" && <Pin cx={150} cy={150} />}
          {kind === "segment" && <path d="M150 150 L205 122" stroke={INK} strokeWidth="4" strokeDasharray="6 6" />}
          {kind === "entrance" && <rect x="120" y="92" width="16" height="26" fill="none" stroke={HI} strokeWidth="3" />}
        </>
      )}
    </svg>
  );
}

// Same station scene throughout Practice; the consequence changes one element.
export function PracticeScene({ choice, className = "" }: { choice: ChoiceId | null; className?: string }) {
  const [cx, cy] = choice === "continue" ? [150, 112] : [85, 150];
  return (
    <svg viewBox="0 0 300 200" className={`w-full rounded-xl bg-sand ${className}`} aria-hidden="true">
      <Ground />
      <Building x={20} y={60} tone="lilac" />
      <Bridge x={150} y={90} />
      <Tree x={250} y={150} /><Tree x={270} y={140} />
      <rect x="236" y="168" width="30" height="6" rx="2" fill="#946a64" />
      {choice === "calm" && <ellipse cx="252" cy="165" rx="34" ry="20" fill="none" stroke={HI} strokeWidth="3" strokeDasharray="5 4" />}
      {choice === "map" && <circle cx="185" cy="100" r="18" fill="none" stroke={HI} strokeWidth="3" />}
      <Pin cx={185} cy={100} hi={choice === "map"} />
      {choice === "continue" && <path d="M85 150 L145 115" stroke={INK} strokeWidth="3" strokeDasharray="4 5" />}
      <g transform={`translate(${cx} ${cy})`}>
        <circle cx="0" cy="-18" r="6" fill={INK} />
        <rect x="-5" y="-12" width="10" height="14" rx="4" fill={INK} />
      </g>
    </svg>
  );
}
