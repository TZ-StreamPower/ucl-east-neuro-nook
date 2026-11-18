/**
 * Real-world positions for the East Bank navigation nodes, as [lng, lat].
 * Source: OpenStreetMap (Nominatim / Overpass, retrieved 2026-11-18, © OpenStreetMap contributors, ODbL).
 * `osm` is the OSM object the position was taken from. `approx: true` means no named OSM object
 * exists for the spot, so the point is a nearby named feature and should be field-checked.
 * Walking times in GRAPH and all sensory ratings remain illustrative.
 */
export type Geo = { ll: [number, number]; osm?: string; approx?: boolean };
export const GEO: Record<string, Geo> = {
  stratford: { ll: [-0.00355, 51.54129], osm: "node/5257403774" },
  "stratford-dlr": { ll: [-0.00361, 51.54147], osm: "node/12854833" },
  "stratford-intl": { ll: [-0.00936, 51.54571], osm: "node/5483374935" },
  "westfield-bridge": { ll: [-0.00642, 51.54306], approx: true }, // Westfield Stratford City centroid
  "orbit-plaza": { ll: [-0.01301, 51.53829], osm: "way/149637725" },
  "river-path": { ll: [-0.01071, 51.53828], approx: true }, // Waterworks River
  marshgate: { ll: [-0.00928, 51.53767], approx: true }, // Sidings Street (way/22617066); building not named in OSM
  "one-pool-street": { ll: [-0.00987, 51.5383], osm: "Nominatim: One Pool Street" },
  "va-east": { ll: [-0.01253, 51.54189], osm: "East Bank", approx: true }, // East Bank site, V&A East building not separately named
  "ual-lcf": { ll: [-0.01291, 51.54159], osm: "Nominatim: London College of Fashion" },
  "pudding-mill": { ll: [-0.01354, 51.53383], osm: "node/6912844957" },
  "north-park": { ll: [-0.0185, 51.5475], approx: true },
  "here-east": { ll: [-0.02302, 51.54902], osm: "node/4879639154" },
  "va-storehouse": { ll: [-0.02118, 51.54644], osm: "node/12278757767" },
};
/** Campus places that sit inside a node's building; markers are offset slightly so they do not stack. */
export const PLACE_HOST: Record<string, string> = {
  marshgate: "marshgate",
  "marshgate-cafe": "marshgate",
  "marshgate-study": "marshgate",
  "student-support": "marshgate",
  "one-pool-street": "one-pool-street",
  "pool-street-kitchen": "one-pool-street",
  "quiet-room": "one-pool-street",
  "reflection-room": "one-pool-street",
};
export const MAP_CENTER: [number, number] = [-0.0115, 51.5425];
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
export const MAP_ATTRIBUTION = "Map © OpenStreetMap contributors · OpenFreeMap";
export const ILLUSTRATIVE_ROUTE =
  "Illustrative route line and walking times · ratings are demo data";

/** Small deterministic offset (≈15–25 m) so places inside one building don't overlap. */
export function placeLL(placeId: string): [number, number] | null {
  const host = PLACE_HOST[placeId];
  const g = host ? GEO[host] : undefined;
  if (!g) return null;
  if (placeId === host) return g.ll;
  let h = 0;
  for (const c of placeId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return [g.ll[0] + ((h % 7) - 3) * 0.00005, g.ll[1] + (((h >> 3) % 7) - 3) * 0.00004];
}

/** Shared identifiers: guide routes (demo.ts) → navigation nodes (sensory.ts). */
export const ROUTE_NODES: Record<string, { from: string; to: string }> = {
  "stratford-marshgate": { from: "stratford", to: "marshgate" },
  "intl-poolstreet": { from: "stratford-intl", to: "one-pool-street" },
  "marshgate-poolstreet": { from: "marshgate", to: "one-pool-street" },
};
export const llOf = (nodeId: string): [number, number] | null => GEO[nodeId]?.ll ?? null;
export const llPath = (path: string[]) => path.flatMap((id) => (GEO[id] ? [GEO[id]!.ll] : []));

/** Icon family for a navigation node marker. */
export const kindOf = (id: string): "station" | "building" | "green" | "water" =>
  ["stratford", "stratford-dlr", "stratford-intl", "pudding-mill"].includes(id)
    ? "station"
    : id === "river-path"
      ? "water"
      : id === "north-park"
        ? "green"
        : "building";
