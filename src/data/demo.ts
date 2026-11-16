export type Cat = "buildings" | "food" | "study" | "support";
export const CATS: { id: Cat; label: string }[] = [
  { id: "buildings", label: "Buildings" }, { id: "food", label: "Food" }, { id: "study", label: "Study" }, { id: "support", label: "Support" },
];
export type XY = [number, number];
export type Place = { id: string; name: string; cat: Cat; sub: string; notes: string[]; xy: XY };
export const PLACES: Place[] = [
  { id: "marshgate", name: "Marshgate", cat: "buildings", sub: "Teaching and research building", notes: ["Main entrance faces the path from the footbridge.", "Step-free entrance with automatic doors."], xy: [64, 38] },
  { id: "one-pool-street", name: "One Pool Street", cat: "buildings", sub: "Teaching, study and student housing", notes: ["Entrance on Pool Street, opposite the waterway path."], xy: [28, 64] },
  { id: "marshgate-cafe", name: "Marshgate café", cat: "food", sub: "Ground floor, Marshgate", notes: ["Seating by the windows.", "Busier around midday."], xy: [74, 48] },
  { id: "pool-street-kitchen", name: "Pool Street kitchen", cat: "food", sub: "Shared kitchen, One Pool Street", notes: ["Microwaves and hot water available."], xy: [18, 74] },
  { id: "marshgate-study", name: "Marshgate study space", cat: "study", sub: "Open study area, level 2", notes: ["Mix of desks and soft seating."], xy: [54, 26] },
  { id: "quiet-room", name: "Quiet study room", cat: "study", sub: "One Pool Street, level 1", notes: ["Silent study. No calls."], xy: [38, 56] },
  { id: "student-support", name: "Student Support desk", cat: "support", sub: "Marshgate reception", notes: ["Ask about access, wellbeing and wayfinding."], xy: [76, 28] },
  { id: "reflection-room", name: "Reflection room", cat: "support", sub: "Quiet room, One Pool Street", notes: ["Low light and soft seating. Open to everyone."], xy: [42, 74] },
];
export type Landmark = { name: string; cue: string; xy: XY };
export type ExpectKey = "sound" | "crowds" | "entrances" | "pause";
export type ExpectRow = { key: ExpectKey; detail: string | null; observed: string | null; source: string | null };
export type RouteT = { id: string; name: string; from: string; to: string; toPlace: string; cat: Cat; minutes: number; summary: string;
  steps: { title: string; text: string; landmark: Landmark }[]; expect: ExpectRow[] };
const demoSrc = "Team 6 walk-through (demo)";
export const ROUTES: RouteT[] = [
  { id: "stratford-marshgate", name: "Stratford Station → Marshgate", from: "Stratford Station", to: "Marshgate", toPlace: "marshgate", cat: "buildings", minutes: 12,
    summary: "Paved, step-free route through the Park via the footbridge.",
    steps: [
      { title: "Find the station exit signs", text: "Follow the exit signs towards the Park.", landmark: { name: "Station exit", cue: "A lilac building with a dark doorway marks the exit.", xy: [14, 82] } },
      { title: "Follow your route towards campus", text: "Walk towards the footbridge and keep it ahead of you.", landmark: { name: "Footbridge", cue: "A raised path crosses ahead, with trees on either side.", xy: [40, 52] } },
      { title: "Look for the Marshgate entrance", text: "Go to the marked entrance facing the path.", landmark: { name: "Marshgate entrance", cue: "A terracotta building with one marked door.", xy: [64, 38] } },
    ],
    expect: [
      { key: "sound", detail: "Louder near the station and roads; quieter on the footbridge.", observed: "Weekday, 08:40", source: demoSrc },
      { key: "crowds", detail: "Busy at the station exit at peak times.", observed: "Weekday, 08:40", source: demoSrc },
      { key: "entrances", detail: "One main entrance with automatic doors, facing the path.", observed: "Weekday, 09:00", source: demoSrc },
      { key: "pause", detail: null, observed: null, source: null },
    ] },
  { id: "intl-poolstreet", name: "Stratford International → One Pool Street", from: "Stratford International", to: "One Pool Street", toPlace: "one-pool-street", cat: "buildings", minutes: 10,
    summary: "Short route along the waterway path.",
    steps: [
      { title: "Leave by the main exit", text: "Follow signs for the Park.", landmark: { name: "International exit", cue: "Glass canopy over a wide doorway.", xy: [10, 28] } },
      { title: "Walk along the waterway", text: "Keep the water on your left.", landmark: { name: "Waterway path", cue: "A wide path with railings by the water.", xy: [20, 48] } },
      { title: "Arrive at One Pool Street", text: "The entrance faces the path.", landmark: { name: "Pool Street entrance", cue: "A tall building with a wide entrance canopy.", xy: [28, 64] } },
    ],
    expect: [
      { key: "sound", detail: "Mostly quiet; some trains overhead.", observed: "Weekday, 12:15", source: demoSrc },
      { key: "crowds", detail: null, observed: null, source: null },
      { key: "entrances", detail: "Main door is step-free.", observed: "Weekday, 12:20", source: demoSrc },
      { key: "pause", detail: "Benches along the waterway path.", observed: "Weekday, 12:15", source: demoSrc },
    ] },
  { id: "marshgate-poolstreet", name: "Marshgate → One Pool Street", from: "Marshgate", to: "One Pool Street", toPlace: "one-pool-street", cat: "buildings", minutes: 6,
    summary: "Short walk between the two campus buildings.",
    steps: [
      { title: "Leave Marshgate by the main entrance", text: "Turn towards the waterway.", landmark: { name: "Marshgate door", cue: "The marked door facing the path.", xy: [64, 38] } },
      { title: "Cross the small bridge", text: "Keep the water below you.", landmark: { name: "Small bridge", cue: "A low bridge with wooden rails.", xy: [46, 52] } },
      { title: "Arrive at One Pool Street", text: "Entrance faces the path.", landmark: { name: "Pool Street entrance", cue: "A tall building with a wide entrance canopy.", xy: [28, 64] } },
    ],
    expect: [
      { key: "sound", detail: null, observed: null, source: null },
      { key: "crowds", detail: "Busier between lectures, on the hour.", observed: "Weekday, 11:00", source: demoSrc },
      { key: "entrances", detail: "Both entrances are step-free.", observed: "Weekday, 11:05", source: demoSrc },
      { key: "pause", detail: "Seats by the small bridge.", observed: "Weekday, 11:05", source: demoSrc },
    ] },
];
export const EXPECT_LABEL: Record<ExpectKey, string> = { sound: "Sound", crowds: "Crowds", entrances: "Entrances", pause: "Places to pause" };
export const DEFAULT_ROUTE = "stratford-marshgate";
export const findPlace = (id: string) => PLACES.find((p) => p.id === id);
export const findRoute = (id: string) => ROUTES.find((r) => r.id === id);

export const VISIT_US = "https://www.ucl.ac.uk/engage/ucl-east/about-ucl-east/visit-us";
export const GAME_URL = "https://same-day-three-paths-team6.pages.dev";
export const PRACTICE_SITUATION = "You leave the station and the area around the exit feels busy. What would you like to do?";
export type ChoiceId = "continue" | "map" | "calm";
export const CHOICES: { id: ChoiceId; label: string; full: string; feedback: string }[] = [
  { id: "continue", label: "Continue", full: "Continue on my route", feedback: "Keep the next landmark in view. You can pause and check it at any point." },
  { id: "map", label: "Check map", full: "Pause and check the map", feedback: "You can review the next landmark before deciding when to continue." },
  { id: "calm", label: "Pause", full: "Look for a calmer place to stop", feedback: "You can take a moment to get your bearings and check the overview when you are ready." },
];
export const STARTER_DRAFT = "What helps you find your bearings on this route?";
export const ILLUSTRATIVE = "Illustrative · not yet field-checked";

export type Post = { id: string; kind: "Question" | "Tip"; title: string; routeId?: string; placeId?: string; replies: string[] };
export const POSTS: Post[] = [
  { id: "station-exit", kind: "Question", title: "Which station exit should I look for?", routeId: "stratford-marshgate", replies: ["Check the exit name and the next landmark in your route preview before leaving the station."] },
  { id: "bridge-tip", kind: "Tip", title: "The footbridge is a good place to check you are on track", routeId: "stratford-marshgate", replies: ["Agreed, I pause at the start of it and look for Marshgate ahead.", "There are fewer people there in the morning too."] },
  { id: "marshgate-entrance", kind: "Question", title: "Which Marshgate door is the main entrance?", placeId: "marshgate", routeId: "stratford-marshgate", replies: ["Look for the marked door facing the path. The place page shows it."] },
  { id: "cafe-quiet", kind: "Tip", title: "The café is calmer after 2pm", placeId: "marshgate-cafe", replies: [] },
  { id: "poolstreet-door", kind: "Question", title: "Is the One Pool Street door step-free?", routeId: "intl-poolstreet", placeId: "one-pool-street", replies: ["Yes, the main door is step-free with a wide canopy."] },
  { id: "quiet-room", kind: "Question", title: "Do I need to book the quiet study room?", placeId: "quiet-room", replies: ["Not in this demo. Check signs on the door."] },
];
export const postContext = (p: { routeId?: string; placeId?: string }) =>
  (p.routeId && findRoute(p.routeId)?.name) || (p.placeId && findPlace(p.placeId)?.name) || "UCL East";
