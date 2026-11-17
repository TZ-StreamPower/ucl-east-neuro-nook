import type { Sensory, Graph, FeedbackKind } from "@/lib/logic";
import quiet from "@/assets/feedback/quiet.svg"; import loud from "@/assets/feedback/loud.svg"; import dark from "@/assets/feedback/dark.svg";
import bright from "@/assets/feedback/bright.svg"; import crowded from "@/assets/feedback/crowded.svg"; import overwhelming from "@/assets/feedback/overwhelming.svg"; import calm from "@/assets/feedback/calm.svg";

/** Replace the SVGs in src/assets/feedback/ with the team's graphic assets (same file names). */
export const FEEDBACK: { k: FeedbackKind; label: string; src: string }[] = [
  { k: "quiet", label: "Quiet", src: quiet }, { k: "loud", label: "Too loud", src: loud }, { k: "dark", label: "Too dark", src: dark },
  { k: "bright", label: "Too bright", src: bright }, { k: "crowded", label: "Crowded", src: crowded }, { k: "overwhelming", label: "Overwhelming", src: overwhelming }, { k: "calm", label: "Feels calm", src: calm },
];

export type Area = "Stratford" | "UCL East" | "Here East" | "Waterfront" | "DLR" | "Park";
export type NavNode = { id: string; name: string; area: Area; xy: [number, number]; placeId?: string; cue: string };
/** Illustrative East Bank network. Positions are schematic, not to scale. */
export const NODES: NavNode[] = [
  { id: "stratford", name: "Stratford station", area: "Stratford", xy: [82, 54], cue: "Main concourse. Take the Westfield / Park exit." },
  { id: "stratford-dlr", name: "Stratford DLR", area: "DLR", xy: [86, 64], cue: "DLR platforms at the south end of the station." },
  { id: "stratford-intl", name: "Stratford International DLR", area: "DLR", xy: [70, 28], cue: "Quieter station, north of Westfield." },
  { id: "westfield-bridge", name: "Westfield bridge", area: "Stratford", xy: [70, 46], cue: "Busy shopping bridge into the park." },
  { id: "orbit-plaza", name: "Orbit plaza", area: "Park", xy: [55, 56], cue: "Open plaza by the stadium. Loud on event days." },
  { id: "river-path", name: "Waterworks river path", area: "Park", xy: [60, 38], cue: "Tree-lined path along the water." },
  { id: "marshgate", name: "Marshgate (UCL East)", area: "UCL East", xy: [48, 66], placeId: "marshgate", cue: "Main entrance faces the footbridge." },
  { id: "one-pool-street", name: "One Pool Street (UCL East)", area: "UCL East", xy: [40, 72], placeId: "one-pool-street", cue: "Entrance on Pool Street." },
  { id: "va-east", name: "V&A East", area: "Waterfront", xy: [58, 74], cue: "Museum by the waterfront." },
  { id: "ual-lcf", name: "UAL London College of Fashion", area: "Waterfront", xy: [64, 82], cue: "Next to V&A East on the waterfront." },
  { id: "pudding-mill", name: "Pudding Mill Lane DLR", area: "DLR", xy: [36, 88], cue: "Small DLR stop south of UCL East." },
  { id: "north-park", name: "North Park lawns", area: "Park", xy: [44, 30], cue: "Open green space, usually calm." },
  { id: "here-east", name: "Here East (UCL & Loughborough London)", area: "Here East", xy: [26, 22], cue: "UCL at Here East and Loughborough University London share the yard." },
  { id: "va-storehouse", name: "V&A East Storehouse", area: "Here East", xy: [34, 14], cue: "Storehouse on the canal side of Here East." },
];
export const GRAPH: Graph = [
  { a: "stratford", b: "stratford-dlr", min: 2 }, { a: "stratford", b: "westfield-bridge", min: 4 }, { a: "westfield-bridge", b: "stratford-intl", min: 4 },
  { a: "westfield-bridge", b: "orbit-plaza", min: 5 }, { a: "westfield-bridge", b: "river-path", min: 5 }, { a: "orbit-plaza", b: "marshgate", min: 3 },
  { a: "river-path", b: "marshgate", min: 7 }, { a: "marshgate", b: "one-pool-street", min: 2 }, { a: "marshgate", b: "va-east", min: 3 },
  { a: "va-east", b: "ual-lcf", min: 2 }, { a: "orbit-plaza", b: "va-east", min: 3 }, { a: "one-pool-street", b: "pudding-mill", min: 5 },
  { a: "ual-lcf", b: "pudding-mill", min: 7 }, { a: "river-path", b: "north-park", min: 5 }, { a: "stratford-intl", b: "north-park", min: 8 },
  { a: "north-park", b: "here-east", min: 6 }, { a: "here-east", b: "va-storehouse", min: 3 }, { a: "orbit-plaza", b: "north-park", min: 9 },
];
const s = (noise: number, light: Sensory["light"], calm: number, busy: Sensory["busy"], n: number): Sensory => ({ noise, light, calm, busy, n });
/** Illustrative seed ratings for navigation nodes and Campus places. */
export const SEED: Record<string, Sensory> = {
  stratford: s(5, "bright", 1, "full", 42), "stratford-dlr": s(4, "bright", 2, "busy", 18), "stratford-intl": s(2, "ok", 4, "free", 9),
  "westfield-bridge": s(4, "bright", 2, "full", 25), "orbit-plaza": s(4, "bright", 2, "busy", 14), "river-path": s(1, "ok", 5, "free", 11),
  marshgate: s(3, "ok", 3, "busy", 20), "one-pool-street": s(2, "ok", 4, "free", 12), "va-east": s(3, "ok", 3, "busy", 8),
  "ual-lcf": s(3, "bright", 3, "busy", 7), "pudding-mill": s(1, "dark", 4, "free", 5), "north-park": s(1, "ok", 5, "free", 10),
  "here-east": s(2, "ok", 4, "free", 9), "va-storehouse": s(2, "dark", 4, "free", 6),
  "marshgate-cafe": s(4, "bright", 2, "full", 15), "pool-street-kitchen": s(3, "ok", 3, "busy", 6), "marshgate-study": s(2, "ok", 4, "busy", 13),
  "quiet-room": s(1, "ok", 5, "free", 9), "student-support": s(2, "ok", 4, "free", 7), "reflection-room": s(1, "dark", 5, "free", 8),
};
export const DEFAULT_SENSORY: Sensory = s(3, "ok", 3, "busy", 0);
export const findNode = (id: string) => NODES.find((n) => n.id === id);
