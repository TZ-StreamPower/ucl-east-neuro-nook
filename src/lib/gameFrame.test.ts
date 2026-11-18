import { describe, expect, it } from "vitest";
import { gameSrc, inspectGameFrame } from "./gameFrame";

// jsdom parses to an about:blank document; give it a real URL like a loaded frame.
const parse = (html: string) => {
  const d = new DOMParser().parseFromString(html, "text/html");
  Object.defineProperty(d, "URL", { value: "http://localhost/game/index.html" });
  return d;
};

describe("inspectGameFrame", () => {
  it("is pending with no document or about:blank", () => {
    expect(inspectGameFrame(null)).toBe("pending");
    expect(inspectGameFrame(undefined)).toBe("pending");
    const blank = { URL: "about:blank", readyState: "complete" } as Document;
    expect(inspectGameFrame(blank)).toBe("pending");
  });
  it("is invalid for a 404/SPA fallback page without the game landmarks", () => {
    expect(inspectGameFrame(parse("<h1>404 Not Found</h1>"))).toBe("invalid");
    expect(inspectGameFrame(parse('<section id="welcomeScreen"></section>'))).toBe("invalid");
  });
  it("is ready when the game landmarks exist", () => {
    const doc = parse('<section id="welcomeScreen"></section><button id="finishButton"></button>');
    expect(inspectGameFrame(doc)).toBe("ready");
  });
});

describe("gameSrc", () => {
  it("only adds a cache-buster after the first attempt", () => {
    expect(gameSrc("/game/index.html", 0)).toBe("/game/index.html");
    expect(gameSrc("/game/index.html", 2)).toBe("/game/index.html?retry=2");
    expect(gameSrc("/g?x=1", 1)).toBe("/g?x=1&retry=1");
  });
});
