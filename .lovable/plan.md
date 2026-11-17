# Align prototype with BRP v1.0 (P0 + P1 gaps)

The BRP lists the next-stage acceptance work. Most of the P0 main flow already exists; this plan fills the remaining gaps and keeps a verification log.

## P0 — iPhone baseline
- Design and check at 393 x 852 and 375 x 812: single column, bottom tabs, safe-area padding, no horizontal overflow, 44 px touch targets, 16 px body text.
- On desktop, the app shows as a centred phone-width column (no fake phone frame).
- Retro outline style: dark borders and small hard shadows on cards, buttons and category tiles; mint, pale yellow and lavender icon accents alongside the two purples.

## P0 — Game connection (first acceptance loop)
- "Practise this arrival" opens a Practice intro page: what the game is, that choices stay private, Exit anytime.
- "Open the game" loads the hosted game (same-day-three-paths) in a full-screen landscape view inside the app, with a visible "Back to route" bar and "Ask the community" (opens an editable draft for that route).
- Uses the game's own intro page; no route-specific deep link promised.
- Game choices are never turned into posts automatically.

## P0 — Community loop
- Edit -> Preview -> Confirm publish already exists; add "Keep draft" and "Discard draft" with confirmation, and reopen a kept draft.
- Clear "local demo only - not visible to other students" label on publish.

## P1 — States
- Settings entry (top of Campus) for Preferences: sound, reduce motion, detail level (short / full), route preference (fewer crowds / step-free). Stored locally; reduce motion actually disables animation; detail level collapses notes.
- Loading skeleton, "couldn't load" with Retry, and offline banner (only saved items marked "Available offline"; demo toggle to simulate offline).
- Route change notice on the main route with source and updated time, plus alternative and Help.
- Community: no-replies state, Report post (reason sheet -> "Reported, thanks" confirmation).
- Content badges: Official / Student experience / Illustrative.
- Help sheet adds "App not working": find Wi-Fi, IT services, staff desk, ask a peer.

## Verification log
- Add `docs/verification-log.md` recording date, viewport, steps, expected, actual, issues, status for each acceptance item, filled from a Playwright run at both iPhone sizes.
- Scenario mapping table: 6 BRP scenarios vs current Practice/game content, uncovered ones marked "to develop".

## Technical details
- Store: add `prefs`, `drafts` (kept), `reports`, `offlineSim`; pure rules in `logic.ts` with tests (draft keep/discard, report toggle, offline availability = saved only, detail-level filter).
- New routes: `settings.tsx`, `practice.game.tsx` (iframe, landscape layout, `route` search param).
- If the hosted game blocks embedding, fall back to opening in a new tab while keeping the Back to route bar flow.
