import { describe, it, expect } from "vitest";
import { canPublish, nextStep, prevStep, addQuestion, filterResults, switchView, toggleSaved, isSaved, practiceExit, threadBack, setStep, clearStep, type ResultItem } from "./logic";
const items: ResultItem[] = [
  { kind: "place", id: "a", name: "Marshgate café", sub: "Ground floor", cat: "food", xy: [0, 0] },
  { kind: "place", id: "b", name: "Quiet study room", sub: "One Pool Street", cat: "study", xy: [0, 0] },
];
describe("browse", () => {
  it("category filters results", () => expect(filterResults(items, "", "food").map((i) => i.id)).toEqual(["a"]));
  it("search matches name or subtitle", () => expect(filterResults(items, "pool", "all").map((i) => i.id)).toEqual(["b"]));
  it("search and category combine to empty", () => expect(filterResults(items, "café", "study")).toHaveLength(0));
  it("switching view keeps selection", () => expect(switchView({ view: "list" as const, sel: "a" }, "map")).toEqual({ view: "map", sel: "a" }));
});
describe("saved", () => {
  it("toggle adds then removes", () => { const l = toggleSaved([], { kind: "route", id: "r" }); expect(isSaved(l, { kind: "route", id: "r" })).toBe(true); expect(toggleSaved(l, { kind: "route", id: "r" })).toHaveLength(0); });
  it("place and route with same id are separate", () => expect(isSaved([{ kind: "place", id: "x" }], { kind: "route", id: "x" })).toBe(false));
});
describe("practice and threads", () => {
  it("practice from route returns to that route", () => expect(practiceExit("route", "intl-poolstreet")).toEqual({ kind: "route", id: "intl-poolstreet" }));
  it("practice from home returns home", () => expect(practiceExit("home", "x")).toEqual({ kind: "home" }));
  it("thread from route returns to that route", () => expect(threadBack("route", "r1")).toEqual({ kind: "route", id: "r1" }));
  it("thread from place returns to that place", () => expect(threadBack("place", "p1")).toEqual({ kind: "place", id: "p1" }));
  it("thread from feed returns to feed", () => expect(threadBack("feed")).toEqual({ kind: "feed" }));
});
describe("steps and publish", () => {
  it("step progress is kept per route and cleared on finish", () => { const m = setStep({}, "r", 2); expect(m.r).toBe(2); expect(clearStep(m, "r").r).toBeUndefined(); });
  it("steps clamp within 3", () => { expect(nextStep(2, 3)).toBe(2); expect(prevStep(0)).toBe(0); });
  it("blank question cannot publish", () => { expect(canPublish("   ")).toBe(false); expect(addQuestion([], " ", "r", "1")).toHaveLength(0); });
  it("publishing adds one question", () => expect(addQuestion([], "Hi?", "r", "1")).toHaveLength(1));
});
