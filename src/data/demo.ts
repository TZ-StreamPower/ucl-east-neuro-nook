export const ROUTE = {
  id: "stratford-marshgate",
  from: "Stratford Station",
  to: "Marshgate",
  steps: [
    { title: "Find the station exit signs", text: "Follow the exit signs towards the Park.", scene: "station" as const, landmark: "station" as const },
    { title: "Follow your route towards campus", text: "Walk towards the footbridge and keep it ahead of you.", scene: "segment" as const, landmark: "bridge" as const },
    { title: "Look for the Marshgate entrance", text: "Go to the marked entrance facing the path.", scene: "entrance" as const, landmark: "entrance" as const },
  ],
};
export const PLACES = ["Stratford Station", "Marshgate", "One Pool Street"];
export const EXPECT = "Crowding and sound can vary. This prototype has no current conditions.";
export const VISIT_US = "https://www.ucl.ac.uk/engage/ucl-east/about-ucl-east/visit-us";
export const GAME_URL = "https://same-day-three-paths-team6.pages.dev";
export const PRACTICE_SITUATION = "You leave the station and the area around the exit feels busy. What would you like to do?";
export type ChoiceId = "continue" | "map" | "calm";
export const CHOICES: { id: ChoiceId; label: string; full: string; feedback: string }[] = [
  { id: "continue", label: "Continue", full: "Continue on my route", feedback: "Keep the next landmark in view. You can pause and check it at any point." },
  { id: "map", label: "Check map", full: "Pause and check the map", feedback: "You can review the next landmark before deciding when to continue." },
  { id: "calm", label: "Find a calmer spot", full: "Look for a calmer place to stop", feedback: "You can take a moment to get your bearings and check the overview when you are ready." },
];
export const SEED_QUESTION = {
  id: "seed-1",
  text: "Which station exit should I look for?",
  reply: "Check the exit name and the next landmark in your route preview before leaving the station.",
};
export const SEED_TIP = "Tip: the overview list helps if you prefer reading every step before you leave.";
export const STARTER_DRAFT = "What helps you find your bearings outside Stratford Station?";

export type LandmarkId = "station" | "bridge" | "entrance";
export const LANDMARKS: Record<LandmarkId, { name: string; cue: string; step: number }> = {
  station: { name: "Station exit", cue: "A lilac building with a dark doorway marks the exit.", step: 0 },
  bridge: { name: "Footbridge", cue: "A raised path crosses ahead, with trees on either side.", step: 1 },
  entrance: { name: "Marshgate entrance", cue: "A terracotta building with one marked door.", step: 2 },
};
export const ILLUSTRATIVE = "Illustrative · not yet field-checked";
export type Thread = { id: string; kind: "Question" | "Tip"; label: string; landmark: LandmarkId | "route"; text: string; reply: string };
export const THREADS: Thread[] = [
  { id: "station-exit", kind: "Question", label: "Stratford Station → Marshgate", landmark: "station", text: "Which station exit should I look for?", reply: "Check the exit name and the next landmark in your route preview before leaving the station." },
  { id: "bridge-tip", kind: "Tip", label: "Footbridge", landmark: "bridge", text: "The footbridge is a good place to check you are on track.", reply: "Agreed, I pause at the start of it and look for Marshgate ahead." },
  { id: "marshgate-entrance", kind: "Question", label: "Marshgate", landmark: "entrance", text: "Which Marshgate door is the main entrance?", reply: "Look for the marked door facing the path. The place page shows it." },
];
