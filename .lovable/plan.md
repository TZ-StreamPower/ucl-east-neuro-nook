# Integrate portrait game + Figma flow gaps (keep current look)

Current visuals stay as they are: white background, purple buttons, coloured category icons, dark outlines with small hard shadows. Campus / Community / Saved tabs stay. Nothing is rebuilt from scratch; nothing is published.

## 1. Portrait game inside "Practise this arrival"
- Copy the game package's `public/game/` (index.html, portrait.css, game.js, artwork) into the project unchanged, so it is served at `/game/index.html`.
- Replace the current blank hosted-game frame with this local game, shown full-screen over the route page (adapted from the supplied CampusPractice adapter, restyled with current buttons).
- Top bar: "Back to route" (always visible) and "Ask the community" (opens an editable draft, never auto-posts). Loading state with a "Return to route" fallback; "Couldn't load" with Retry.
- The game opens on top of the route page instead of navigating away, so returning restores the same route, tab and scroll position. Browser back / Escape also closes it. Back links from the Practice intro page also return to the saved scroll spot.
- No forced landscape: remove the "turn your phone sideways" hint.

## 2. Flow and state gaps from the Figma source (33 screens)
Compare each Figma screen to the app and add only what is missing, reusing existing icons, scene art and cards:
- "You have arrived" end of directions (ask / save / see Marshgate).
- "Choose a practice" hub: Leaving the station (existing), plus Ordering food, Leaving a lecture, Group discussion, App not working — each a short choice -> supportive feedback -> "Your next step" (back to route / ask community). Fills the 4 "to develop" scenarios.
- "A change nearby" and "Connection lost" linked to Find support, where not already covered.
- Report a concern, Route preferences / filters from search, Your preferences — verify existing versions match the Figma flow and add missing links only.
- Cut repeated sentences (privacy and "illustrative" notes shown once per screen, as small badges).

## 3. Test the portrait game for real and fix issues
Playwright at 375x812, 393x852, 430x932 portrait (plus one landscape): game loads, wake-up, direction buttons move the player, Full map / Follow me, Explore moment, choices, feedback, pause, chapter progression, then Back to route restores route and scroll. Screenshots reviewed; layout or input failures fixed (in the game's portrait.css/adapter only, not the story). Results recorded in the verification log, with anything untested named.

## Technical details
- Game assets (~49 MB) live in `public/game/` because the game loads them by relative path inside its iframe; supplied docs/storyboards/test files not needed at runtime are left out.
- New `src/components/GamePractice.tsx` overlay mounted by `route.$id.tsx` and the Practice page; `route.$id` search gains optional `game` flag (zodValidator + fallback) so back button closes the overlay; scroll saved in sessionStorage per route.
- `/practice/game` keeps working, now pointing at the local game, and returns to the route. `GAME_URL` becomes the local path.
- New practice scenarios added as data in `src/data/demo.ts`; pure rule for scenario next-step in `logic.ts` with tests.
- AGENTS.md rule updated: game is now bundled locally in `public/game/` (replaces the hosted-iframe rule).
