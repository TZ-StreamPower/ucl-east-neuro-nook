import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GamePractice } from "./GamePractice";

const GOOD = '<section id="welcomeScreen"></section><button id="finishButton">Finish</button>';

/** jsdom does not load iframe src, so inject a document and fire `load` like a browser would. */
function loadFrame(html: string) {
  const f = document.querySelector("iframe") as HTMLIFrameElement;
  const doc = new DOMParser().parseFromString(html, "text/html");
  Object.defineProperty(doc, "URL", { value: "http://localhost/game/index.html" });
  Object.defineProperty(f, "contentDocument", { configurable: true, get: () => doc });
  fireEvent.load(f);
  return doc;
}

const setup = () => {
  const onBack = vi.fn();
  render(<GamePractice onBack={onBack} onAsk={() => {}} backLabel="Campus" />);
  return onBack;
};

afterEach(() => vi.useRealTimers());

describe("GamePractice", () => {
  it("shows Retry when the frame loads a page that is not the game (404 / blank)", () => {
    setup();
    loadFrame("<h1>404</h1>");
    expect(screen.getByText("Couldn't load the game")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("Retry reloads the frame with a cache-busting URL and returns to loading", () => {
    setup();
    loadFrame("<h1>404</h1>");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.getByText("Loading practice…")).toBeInTheDocument();
    expect(document.querySelector("iframe")?.getAttribute("src")).toContain("retry=1");
  });

  it("falls back to Retry if no usable game appears before the timeout", () => {
    vi.useFakeTimers();
    setup();
    act(() => {
      vi.advanceTimersByTime(12001);
    });
    expect(screen.getByText("Couldn't load the game")).toBeInTheDocument();
  });

  it("hides the overlay once the real game document is present", () => {
    setup();
    loadFrame(GOOD);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("Finish inside the game and Escape (parent or inside the frame) all go back", () => {
    const onBack = setup();
    const doc = loadFrame(GOOD);
    doc.getElementById("finishButton")!.click();
    expect(onBack).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onBack).toHaveBeenCalledTimes(2);
    doc.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onBack).toHaveBeenCalledTimes(3);
  });

  it("hooks the frame once even if load fires twice", () => {
    const onBack = setup();
    const doc = loadFrame(GOOD);
    fireEvent.load(document.querySelector("iframe")!);
    doc.getElementById("finishButton")!.click();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("restores page scrolling on unmount", () => {
    const { unmount } = render(<GamePractice onBack={() => {}} onAsk={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
