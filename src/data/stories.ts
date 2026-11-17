import type { Cat } from "@/data/demo";
const A = "/game/assets";
/** Category-specific framing for the one bundled game. The game has no chapter deep-link, so every card opens it from the start. */
export type Story = { title: string; desc: string; cover: string; sticker: string; sprites?: string[] };
export const STORIES: Record<Cat | "all", Story> = {
  all: { title: "Same Day, Three Paths", desc: "One campus. Different experiences.", cover: `${A}/scenes/atrium.png`, sticker: "Interactive story", sprites: ["mei", "sam", "leila"].map((c) => `${A}/sprites/${c}.png`) },
  buildings: { title: "Finding your way", desc: "Explore entrances and campus routes.", cover: `${A}/scenes/route.png`, sticker: "Buildings" },
  food: { title: "Ordering food", desc: "Navigate queues, menus and conversations.", cover: `${A}/scenes/lunch.png`, sticker: "Food" },
  study: { title: "Learning together", desc: "Explore lectures and group work.", cover: `${A}/scenes/classroom.png`, sticker: "Study" },
  support: { title: "Finding support", desc: "Ask for help when things change.", cover: `${A}/scenes/home_evening.png`, sticker: "Support" },
};
