import { describe, it, expect } from "vitest";
import { combineRating, applyFeedback, matchesFeel, planRoute, nearestCalm, zoomAt, type Sensory, type Graph } from "./logic";
const S = (noise: number, calm: number, extra: Partial<Sensory> = {}): Sensory => ({ noise, calm, light: "ok", busy: "free", n: 4, ...extra });
const g: Graph = [{ a: "stn", b: "bridge", min: 4 }, { a: "bridge", b: "plaza", min: 5 }, { a: "plaza", b: "mg", min: 3 }, { a: "bridge", b: "river", min: 7 }, { a: "river", b: "mg", min: 4 }];
const seeds: Record<string, Sensory> = { stn: S(4, 2), bridge: S(3, 3), plaza: S(5, 1), river: S(1, 5), mg: S(2, 4) };
const get = (id: string) => seeds[id]!;
describe("sensory ratings", () => {
  it("my noise rating averages with the 4 seeded ratings", () => expect(combineRating(S(2, 3), { noise: 5 }).noise).toBe(2.6));
  it("my rating adds one to the count", () => expect(combineRating(S(2, 3), { calm: 5 }).n).toBe(5));
  it("feedback 'too bright' sets lighting to bright", () => expect(applyFeedback({ noise: 2 }, "bright")).toEqual({ noise: 2, light: "bright" }));
  it("Quiet filter hides a place with noise 4", () => expect(matchesFeel(S(4, 3), ["quiet"])).toBe(false));
  it("Not busy filter hides a full place", () => expect(matchesFeel(S(1, 5, { busy: "full" }), ["not-busy"])).toBe(false));
});
describe("calm navigation", () => {
  it("quickest goes through the loud plaza (12 min)", () => expect(planRoute(g, "stn", "mg", "quick", get)).toEqual({ path: ["stn", "bridge", "plaza", "mg"], minutes: 12 }));
  it("calmest skips the noise-5 plaza (15 min)", () => expect(planRoute(g, "stn", "mg", "calm", get)).toEqual({ path: ["stn", "bridge", "river", "mg"], minutes: 15 }));
  it("need a break finds the nearest calm space", () => expect(nearestCalm(g, "plaza", get)).toBe("mg"));
});
describe("map zoom", () => {
  it("zooming keeps the anchor point fixed", () => { const v = zoomAt({ z: 1, x: 0, y: 0 }, 2, 100, 50); expect((100 - v.x) / v.z).toBe(100); expect((50 - v.y) / v.z).toBe(50); });
  it("zoom is clamped to 1–4", () => { expect(zoomAt({ z: 3, x: 0, y: 0 }, 9, 0, 0).z).toBe(4); expect(zoomAt({ z: 1, x: 0, y: 0 }, 0.2, 0, 0).z).toBe(1); });
});
