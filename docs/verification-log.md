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
