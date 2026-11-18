/**
 * Pure checks for the bundled portrait game iframe (public/game/index.html).
 * An iframe fires `load` even for a 404/SPA fallback page or a blank document, so
 * "loaded" is not "usable": we require the game's own landmarks to exist.
 */
export type FrameCheck = "pending" | "ready" | "invalid";

export const GAME_ROOT_ID = "welcomeScreen";
export const GAME_FINISH_ID = "finishButton";

export function inspectGameFrame(doc: Document | null | undefined): FrameCheck {
  if (!doc || doc.URL === "about:blank" || doc.readyState !== "complete") return "pending";
  return doc.getElementById(GAME_ROOT_ID) && doc.getElementById(GAME_FINISH_ID)
    ? "ready"
    : "invalid";
}

/** Read the frame document; `undefined` when it cannot be read (e.g. cross-origin). */
export function readFrameDocument(frame: HTMLIFrameElement | null): Document | null | undefined {
  try {
    return frame?.contentDocument;
  } catch {
    return undefined;
  }
}

/** Cache-busting URL so Retry refetches instead of reusing a failed response. */
export const gameSrc = (base: string, attempt: number) =>
  attempt === 0 ? base : `${base}${base.includes("?") ? "&" : "?"}retry=${attempt}`;
