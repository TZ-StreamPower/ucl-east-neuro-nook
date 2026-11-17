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
