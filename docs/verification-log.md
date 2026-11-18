# Verification log — BRP v1.0 next stage

| Date | Viewport | Steps | Expected | Actual | Issues | Status |
|---|---|---|---|---|---|---|
| 2026-11-17 | 393x852, 375x812 | Open Stratford Station → Marshgate route | No horizontal overflow; change notice visible | As expected | — | Verified (automated) |
| 2026-11-17 | 393x852, 375x812 | Route → Practise this arrival → Open the game | Game view opens with Back to route + Ask the community | Opens; game frame was still blank when captured | Game content load inside frame not visually confirmed | Partly verified |
| 2026-11-17 | 393x852, 375x812 | Game → Ask the community → Keep draft | Draft kept, returns to route; kept draft shown in Community | As expected | — | Verified (automated) |
| 2026-11-17 | 393x852, 375x812 | Write → Preview → Publish → Confirm → Report | Post opens; "Reported, thanks" shown | As expected | — | Verified (automated) |
| 2026-11-17 | 393x852, 375x812 | Preferences: Short detail, Simulate offline → unsaved route | "Couldn't load" with Retry | As expected | — | Verified (automated) |
| — | — | Discard draft, reduce motion, Help "App not working" | — | Not run | — | Implemented, not verified |

## Scenario mapping (BRP §3)

| Scenario | App guide | Practice / game | Status |
|---|---|---|---|
| Wayfinding — Stratford Station to campus | Routes, landmarks, directions | In-app Practice + game intro | Covered |
| Sensory overload — busy canteen | What to expect rows | Not in in-app Practice; game chapter not mapped | To develop |
| Unpredictability — match-day crowds | Route change notice (illustrative) | Not implemented | To develop |
| Social — leaving class | Community tips | Not implemented | To develop |
| Social — joining group discussion | Community tips | Not implemented | To develop |
| App can't load | Help: App not working; offline banner | — | Covered (simulated) |

## 2026-11-17 · Portrait game integration (Playwright, Chromium, touch)
| Item | Viewport | Steps | Expected | Actual | Status |
|---|---|---|---|---|---|
| Open from route | 375x812, 393x852, 430x932 | Route → Practise this arrival | Local game loads full-screen, Back to route visible | Loaded, no horizontal scroll | Pass |
| Return keeps place | same | Back to route | Same route, tab and scroll | Scroll 468/426/349 restored exactly | Pass |
| Wake-up, move | 393x852 | Start → Mei → Begin → Wake up → hold → | Player moves | Moved, triggered "Route preview" cue | Pass |
| Cue layout | 393x852 | Approach cue | Scene + controls stay usable | Was covering scene and actions → compacted in portrait.css | Fixed |
| Full map / Follow me | 393x852 | Toggle | Camera framing changes | Works | Pass |
| Choice + feedback | 393x852 | Explore response options → pick | Info card with follow-up choices | Works, scrollable | Pass |
| Pause, chapters 2–5, landscape, real iPhone Safari | — | — | — | Not tested | Open |

## 2026-11-17 · Full runtime audit + P1 fixes (Playwright, Chromium)
| Item | Viewport | Result | Status |
|---|---|---|---|
| All 5 chapters → ending, for Mei, Sam, Leila | 393x852, 375x812, 1280x900 | Every chapter progressed after 3 moments (choice → detail → confirm); ending reached for all 3 | Pass |
| Ending → Reflect → Community → Explore another path / Play another path | same | Returns to character screen | Pass |
| Layout overflow (welcome, character, ending, reflection, community) | same | scrollWidth = viewport | Pass |
| Missing assets | same | storyboard_13-15.png 404 → restored both storyboard images from package; 0 failed requests after | Fixed |
| App → Practise this arrival → start → Back to route | 393, 1280 | Scroll restored (400/381) | Pass |
| In-game "Finish here" | 393, 1280 | Previously stayed inside the game; now returns to route | Fixed |
| Escape / browser back close game | 393, 1280 | Close | Pass |
| Production build, real iPhone Safari, landscape, pause, Chinese language | — | Not run | Not tested |

## 2026-11-17 Campus game showcase
- Playwright 375x812, 393x852: Campus shows "Same Day, Three Paths" card above results; Start experience (48px) opens game overlay; Back to Campus closes it; no horizontal overflow; 0 page errors. Vitest passes.

## 2026-11-17 Visual pass + iPhone game fit
- Playwright 375x812, 390x844, 430x932 (touch): direct /?game=1 loads (was stuck on "Loading practice…") PASS; Campus Play → start → Finish here returns to Campus PASS; no horizontal overflow on /, route, place, community, saved, practice PASS; 0 page errors.
- NOT TESTED: real iPhone Safari (notch/home bar insets), reduced-motion setting.

## 2026-11-17 · White canvas, sensory ratings, Navigate
Playwright 393×852 (/tmp/browser/nav/check_nav.py): Stratford→Marshgate calmest 16 min avoids Orbit plaza, quickest 12 min; walk → "Too loud" feedback saved; "I need a break" → Go there restarts walk; Quiet study room rated (Preview→Confirm, "includes yours"); Campus "Quiet" filter → 5 results; no overflow, 0 page errors. Unit tests: src/lib/sensory.test.ts (8). Not tested: real iPhone, final graphic assets.

## 2026-11-17 · Expandable map, category story cards, micro-interactions
Playwright (/tmp/browser/nav/check_map.py) at 375/390/430×852: Food/Study/Support/Buildings each show their own story title; Play opens the game; Explore map opens, Zoom in ×2 + drag changes transform; tapping Orbit plaza opens its sheet; Route here sets destination; Campus → Navigate keeps destination and restores the same zoom/pan; no overflow, 0 page errors. prefers-reduced-motion → cover transition 0s. Unit tests 31 pass (zoomAt anchor + clamp).
Not tested: real two-finger pinch on a device, real iPhone Safari.

## 2026-11-17 · P0 baseline: LF normalisation + typecheck script
Changes: added `.gitattributes` (`* text=auto eol=lf`, binary rules), `.editorconfig` (LF), `"endOfLine": "lf"` in `.prettierrc`, `typecheck` script (`tsc --noEmit`); local `core.autocrlf=false`; working-tree CRLF→LF via `sed 's/\r$//'` on tracked text files only (no Prettier run, no other content change; `git diff` vs HEAD is limited to the config files above).

| Check | Command | Result |
|---|---|---|
| Line endings | `git ls-files --eol` | 142 text files `i/lf w/lf`, 63 binary; 0 CRLF |
| Lint | `npm run lint` | **Fail: 1955 errors, 11 warnings** (was 7996 / 11). Errors are all `prettier/prettier` style (not CR) in 42 files: `public/game/game.js` 1148, `public/game/assets/art-config.js` 43, `src/data/demo.ts` 66, and dense one-line code in `src/routes/*`. 0 non-Prettier errors. |
| Typecheck | `npm run typecheck` | Pass, no errors |
| Tests | `npm test` | Pass, 3 files / 32 tests |
| Build | `npm run build` | Pass |

Correction to the earlier audit: the 7,996 errors were CR errors **plus** ~1,955 genuine Prettier style errors that CR messages had masked. Line endings are fixed; the remaining style errors are deferred (not reformatted here to avoid unrelated churn; options: `prettier --write src`, ignore `public/game` in ESLint).

Non-blocking warnings (`react-refresh/only-export-components`, hot-reload only; not refactored): `src/components/Browse.tsx:5`; `src/components/SensoryMeter.tsx:4,5,6`; `src/components/ui/{badge:32, button:49, form:163, navigation-menu:111, sidebar:743, toggle:42}.tsx`; `src/lib/store.tsx:37`.

Note: `git status` still lists files as modified because the index stat cache is stale (`git update-index --refresh` reports "needs update"); `git diff` / `git diff HEAD` show no content change for them.

## 2026-11-17 · Sprint 1 — Runtime reliability (game iframe)
Change: `GamePractice` now verifies the frame holds the real game (`#welcomeScreen` + `#finishButton`, `src/lib/gameFrame.ts`) before showing it; a 404/SPA-fallback/blank document, or no usable game within 12 s, shows "Couldn't load the game" + Retry (cache-busted `?retry=n`). Escape is also hooked inside the frame; Finish hook only attaches once per document. No game assets/mechanics changed.

| Check | Command | Result |
|---|---|---|
| Unit/component | `npm test` | Pass, 5 files / 43 tests (11 new: `gameFrame.test.ts`, `GamePractice.test.tsx`) |
| Typecheck | `npm run typecheck` | Pass |
| Build | `npm run build` | Pass |
| Lint | `npm run lint` | 1938 errors (Prettier style debt in pre-existing files, was 1955) / 11 warnings. New and changed files lint clean. |
| Browser smoke | `npm run e2e` (Chrome, 393×852 touch, dev server :8080) | Pass 5/5, run 3× |

E2E (`e2e/campus-game.spec.ts`): Campus → game → Back keeps scroll and drops `game=1`; Escape closes from page and from inside the frame; in-game Finish returns to Campus; 404'd `/game/index.html` → Retry → recovers; direct `/?game=1` loads with no horizontal overflow.
Not tested: real iPhone Safari, landscape, pause, route-page (`/route/$id?game=1`) in the browser (shares the component; covered by unit tests only), Chinese language.

## 2026-11-18 · Visual & IA sprint (Explore / Navigate map / Community / Reflect)
| Check | Command | Result |
|---|---|---|
| Unit/component | `npm test` | Pass, 6 files / 51 tests (new: `geo.test.ts` data integrity, reflection/route-stat helpers) |
| Typecheck / build | `npm run typecheck`, `npm run build` | Pass |
| Browser | `npm run e2e` (Chrome, 393×852 touch, software WebGL) | Pass 13/13: 4 sections; Explore featured + map view; Navigate map ready with 14 pins, Calm 16 min vs Quick 12 min cards, overlay toggle, place sheet, expand map; walk Finish → Reflect; 3 community layouts + Save; Reflect independent ratings + share → appears in Community; place page section order; offline tiles → schematic fallback; game flows from Sprint 1 |
| Lint | `npm run lint` | 1847 Prettier errors (pre-existing/dense edited files; all new files clean), 19 warnings (11 original + `toneOf`, `artForCat`) |
| Visual | Screenshots of Explore, Navigate, Community, Reflect reviewed manually at 393×852 | Real OSM map renders with route, alternative, markers, attribution |

Data provenance: node positions from OpenStreetMap (Nominatim/Overpass, 2026-11-18); 5 flagged `approx`. Walking times, route lines and sensory ratings are illustrative; seeded community posts are demonstration data.
Not tested: real iPhone Safari, touch pinch, landscape, a commercial/self-hosted tile provider, field accuracy of `approx` nodes.

## 2026-11-18 · Visual pass 2 (checkpoint-2, 390×844, `.preview/checkpoint-2/`, git-ignored)
Reviewed checkpoint-1 Community/Navigate, then: restyled basemap (lavender flat building footprints, lavender pedestrian paths, blue water, soft parks), landmark text labels, icon markers (station / building / river / green), attribution collapsed behind the (i) button (still present); route previews now OpenStreetMap-based images (`src/assets/maps/*.jpg`, generated by `scripts/gen-images.mjs`, © OSM contributors credit on image); card/place/post imagery now uses downsized copies of the game's own scene art (`src/assets/scenes/*.jpg`; originals in `public/game` untouched), overridable by real photos in `src/assets/photos/`; Experience cards: scrim, sensory stickers + location tag on the image, 2-line caption, alternating 4:3 / 4:5 proportions, neutral tag labels ("Dim light"); feed alternates experiences and route reviews; place map pin has an icon; tiny thumbnails show "© OSM".
Results: `npm test` 51/51, `npm run typecheck` pass, `npm run build` pass, `npm run e2e` 13/13, no horizontal overflow on Explore / Explore map / Navigate / Community / Place, 0 page errors, 0 broken images after scrolling. Lint: 1848 Prettier errors (pre-existing dense files), 16 warnings.
Not verified: real iPhone Safari; baked route-preview images show demo ratings at generation time (re-run `node scripts/gen-images.mjs` after changing graph/seeds).
