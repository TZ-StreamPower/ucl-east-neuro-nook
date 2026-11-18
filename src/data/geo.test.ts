import { describe, expect, it } from "vitest";
import { GEO, PLACE_HOST, ROUTE_NODES, placeLL } from "./geo";
import { NODES, GRAPH, SEED } from "./sensory";
import { PLACES, ROUTES, POSTS } from "./demo";

const inEastBank = ([lng, lat]: [number, number]) =>
  lng > -0.03 && lng < 0.0 && lat > 51.53 && lat < 51.555;

describe("geo data and shared identifiers", () => {
  it("every navigation node has a position inside the East Bank area", () => {
    for (const n of NODES) {
      expect(GEO[n.id], n.id).toBeDefined();
      expect(inEastBank(GEO[n.id]!.ll), n.id).toBe(true);
    }
  });
  it("every position is either traceable to OSM or flagged approximate", () => {
    for (const [id, g] of Object.entries(GEO)) expect(g.osm || g.approx, id).toBeTruthy();
  });
  it("graph edges only join known nodes", () => {
    const ids = new Set(NODES.map((n) => n.id));
    for (const e of GRAPH) expect(ids.has(e.a) && ids.has(e.b), `${e.a}-${e.b}`).toBe(true);
  });
  it("places map to a host node and have sensory seeds", () => {
    for (const p of PLACES) {
      expect(PLACE_HOST[p.id], p.id).toBeDefined();
      expect(NODES.some((n) => n.id === PLACE_HOST[p.id])).toBe(true);
      expect(placeLL(p.id)).not.toBeNull();
      expect(SEED[p.id], p.id).toBeDefined();
    }
  });
  it("routes map to nodes; posts reference real places and routes", () => {
    for (const r of ROUTES) {
      const rn = ROUTE_NODES[r.id];
      expect(rn, r.id).toBeDefined();
      expect(GEO[rn!.from] && GEO[rn!.to]).toBeTruthy();
    }
    for (const p of POSTS) {
      if (p.placeId)
        expect(
          PLACES.some((x) => x.id === p.placeId),
          p.id,
        ).toBe(true);
      if (p.routeId)
        expect(
          ROUTES.some((x) => x.id === p.routeId),
          p.id,
        ).toBe(true);
      if (p.kind === "Experience" || p.kind === "Review") expect(p.demo, p.id).toBe(true);
    }
  });
});
