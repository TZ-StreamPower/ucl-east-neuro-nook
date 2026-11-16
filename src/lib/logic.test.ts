import { describe, it, expect } from "vitest";
import { practiceExitTarget, canPublish, nextStep, prevStep, addQuestion } from "./logic";
describe("rules", () => {
  it("practice from preview exits to preview", () => expect(practiceExitTarget("preview")).toBe("/route/preview"));
  it("practice from home exits to home", () => expect(practiceExitTarget("home")).toBe("/"));
  it("blank question cannot publish", () => { expect(canPublish("   ")).toBe(false); expect(addQuestion([], " ", "r", "1")).toHaveLength(0); });
  it("publishing adds one question", () => expect(addQuestion([], "Hi?", "r", "1")).toHaveLength(1));
  it("steps clamp within 3", () => { expect(nextStep(2, 3)).toBe(2); expect(prevStep(0)).toBe(0); expect(nextStep(1, 3)).toBe(2); });
});
