/** Optional drop-in photos: src/assets/photos/<key>.(jpg|png|webp|svg). Falls back to illustrations. */
const files = import.meta.glob("/src/assets/photos/*.{jpg,jpeg,png,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
export const photoFor = (key: string): string | undefined =>
  Object.entries(files).find(
    ([p]) =>
      p
        .split("/")
        .pop()!
        .replace(/\.[^.]+$/, "") === key,
  )?.[1];

const scenes = import.meta.glob("/src/assets/scenes/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const maps = import.meta.glob("/src/assets/maps/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const byName = (files: Record<string, string>, key: string) =>
  Object.entries(files).find(
    ([p]) =>
      p
        .split("/")
        .pop()!
        .replace(/\.[^.]+$/, "") === key,
  )?.[1];
/** Small copies of the game scene art (scripts/gen-images.mjs); originals stay in public/game. */
export const sceneFor = (name: string) => byName(scenes, name);
/** OpenStreetMap-based route preview image, if generated. */
export const routeMapFor = (routeId: string) => byName(maps, routeId);
