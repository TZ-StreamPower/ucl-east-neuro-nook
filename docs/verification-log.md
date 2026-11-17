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
