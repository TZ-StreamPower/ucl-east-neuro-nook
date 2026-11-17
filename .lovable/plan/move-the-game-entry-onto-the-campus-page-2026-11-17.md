# Move the game entry onto the Campus page

## What changes for the student
- **Campus page** now reads in this order: search and categories, then the map/list, then an **Interactive experience** card, then the Campus Practice shortcut and the usual notes.
- The card spans the full width and stands about 340-380 px tall at iPhone width. Its top 60% shows a real picture from the game (`scenes/atrium.png`, with the three character sprites Mei, Sam and Leila along the bottom edge). Below that it shows:
  - INTERACTIVE STORY · CAMPUS LIFE
  - **Same Day, Three Paths**
  - One campus. Different experiences.
  - **Start experience →**, a purple button in the current style
- **Start experience** opens the existing game full-screen on top of Campus. It is the same overlay already used on route pages. "Back to Campus", the game's "Finish here", Escape and the browser back button all return to Campus at the same scroll spot. The "Ask" button opens a new community draft that isn't tied to any route.
- **Campus Practice is simpler.** I remove the "Open the game" link and its "opens elsewhere" arrow from the Practice page. The short Explore choices flow, the 4 extra scenarios (Ordering food and the rest) and Exit practice stay, because the game doesn't cover them. On the route page, "Practise this arrival" keeps opening the game as it does now.
- The old `/practice/game` address keeps working and sends people to the game.

## Kept as is
Bottom tabs (Campus / Community / Saved), the game itself, the Community and Saved pages, and the look of the app. No new services.

## Check
In a browser at 375x812 and 393x852:
- Campus → Start experience → play a moment → Back to Campus (scroll kept)
- Finish here also returns to Campus
- no sideways scrolling, every button at least 44 px, focus outline visible, 0 errors

I'll record the results in the test log.

## Technical details
- `src/routes/index.tsx`: add `game: fallback(z.number().optional(), undefined)` to the page address settings. Render `<GameShowcase/>` after the results block, and render `<GamePractice onBack=… backLabel="Back to Campus"/>` when `game===1`.
- `GamePractice.tsx`: make the back label and the Ask link into props, keeping the route-page defaults.
- New `src/components/GameShowcase.tsx`: uses the images from `/game/assets/...` (no new or regenerated art) and the semantic colour tokens plus the `retro` style.
- `practice.tsx`: remove the two game links. `practice_.game.tsx`: with no `route` given, send to `/?game=1`.
