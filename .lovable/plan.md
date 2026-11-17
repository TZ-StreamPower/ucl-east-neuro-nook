# Audit: Community App + "Same Day, Three Paths" game

Evidence: file comparison against the uploaded game package (this turn), source reading, and the Playwright runs recorded in `docs/verification-log.md` (17 Nov). No code changed.

## Results

| # | Item | Result | Evidence / files |
|---|---|---|---|
| 1 | Game source complete | PASS | `public/game/` has index.html, game.js, style.css, skin.css, portrait.css, assets/ (scenes, sprites, materials, ambient, art-config.js, voxel-characters.js), 43 MB |
| 1b | Game assets complete | FAIL (P1) | `assets/storyboard_01-04.png` and `assets/storyboard_13-15.png` are in the upload but not copied. Used by `style.css` for welcome art and ending art, which show empty frames. Only docs/notes were meant to be left out |
| 2 | Real game, not placeholder | PASS | Local game loads in `GamePractice.tsx` iframe (`/game/index.html`); wake-up, movement, cues and choices were played |
| 3a | Entry: "Practise this arrival" | PASS | `src/routes/route.$id.tsx` (`?game=1` opens overlay) |
| 3b | Entry: Practice page "Open the game" | PASS (by code) | `src/routes/practice.tsx` → `/practice/game` → redirects to route with game open (`practice_.game.tsx`). Uses an "external link" icon though it opens in-app (P2) |
| 3c | Escape / browser back closes game | PASS (by code), NOT TESTED in browser for back | `GamePractice.tsx` |
| 4a | Choices + feedback | PASS | verification log, 393x852 |
| 4b | Story branches (3 characters) | NOT TESTED | Only Mei played; Sam and Leila not run |
| 4c | Chapters 2–5, pause | NOT TESTED | logged as Open |
| 4d | Ending, reflection, "Play another path" restart | NOT TESTED | `endingScreen`, `replayButton`, `restartButton` exist in `index.html` |
| 5a | Portrait layout 375/393/430 | PASS | no sideways scroll; cue overlap fixed in `portrait.css` |
| 5b | Touch movement buttons | PASS | `#touchControls` hold moved player |
| 5c | Landscape prompt hidden | PASS (by code) | `portraitModePrompt` suppressed in `portrait.css`; landscape itself NOT TESTED |
| 5d | Real iPhone Safari | NOT TESTED | only desktop Chromium emulation |
| 5e | Game top bar mostly desktop-sized (topbar, footer, wide welcome grid) | NOT TESTED at phone width for welcome/character/ending screens | `style.css` uses 2–3 column grids with min widths 350–430px; likely overflow on welcome/ending at 375 (P1 to verify) |
| 6a | Missing assets | FAIL (P1) | see 1b |
| 6b | Broken app links | PASS (by code) | all Link targets have route files; old preview/steps redirect |
| 6c | Runtime errors | NOT TESTED this turn | no preview error logs available; earlier runs logged none |
| 7 | Return to Community App | PASS | "Back to route" restores route, tab and scroll (468/426/349 px); "Ask" opens editable draft |
| 8 | Duplicate in-game exits | P2 | in-game "Community" / "Finish here" screens stay inside the iframe and don't return to the app; only the top bar does |

## Prioritised issues
- P0: none found among tested items.
- P1: two storyboard images missing (empty welcome/ending art). Welcome, character, ending and reflection screens not checked at phone width. Endings, restart, chapters 2–5, other characters and pause not played. No real-device check.
- P2: "Open the game" external-link icon is misleading. The game's own "Finish here" / community screen doesn't hand back to the app. Browser-back close not verified.

## Proposed next step (after approval)
Run one Playwright playthrough at 393x852 of all 5 chapters → ending → reflection → replay for each character. Capture console errors and screenshots, add the results to the verification log, then report the fixes separately. Approving this plan runs the tests only; nothing gets fixed yet.
