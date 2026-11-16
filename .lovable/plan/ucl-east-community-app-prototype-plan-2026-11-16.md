# UCL East Community App — prototype plan

A mobile-first clickable prototype (390 px reference, works down to 320 px) following PRD v1.4, the connected wireframe board and the lo-fi screens. Demo content only, browser-local storage, no accounts or backend.

## Visual direction
- **App layer:** white canvas, deep purple `#361A54` for headings and the single primary action, bright purple `#9A3BFF` only for small focus and selection markers. Clear sans-serif (DM Sans, shared with the game), 16 px+ body text, 44 px touch targets, 20 px side margins.
- **Scene art:** original isometric SVG scenes in warm sand, soft sage and muted terracotta (station exit, route segment, Marshgate entrance), plus three landmark pins and three choice illustrations. The same landmark silhouettes appear in the guide and in Practice.
- **Bridge to the Game layer:** the hosted game uses a warm paper background (`#f6f0e5`), Fraunces headings and teal/coral accents. Campus Practice keeps the app's buttons, back controls and purple actions, but sits on that warm paper tone with Fraunces scene titles. Students then move app → Practice → game without a jarring change in look. Practice exit always returns to the app's white surface.
- Reduced motion is respected. No sound, autoplay or automatic advance.

## Screens (routes)
```text
/                    C1 Campus home (tabs visible)
/route               C2 Route picker (From / To illustrated tiles, search + empty message)
/route/preview       C3 Route preview (schematic, pins, What to expect, View map + text list, Save)
/route/steps         C4 Step 1–3, Previous / Next / See all steps / Finish, arrival state
/route/help          C5 Get help (keeps step index, links to official Visit Us page)
/practice            P1 Exploration  -> P2 Decision (3 equal tiles) -> P3 Feedback
/community           T1 Demo discussion list + route thread with sample reply
/community/new       T2 Composer: prefilled route, Preview, Publish demo question
/saved               S1 Saved route or empty state
```
Bottom tabs Campus / Community / Saved on the tab roots.

## Behaviour
- Practice remembers where it started: from C3 it returns to C3, from C1 it returns to C1. Back to route from feedback always opens C3.
- P3 feedback copy matches the PRD table for each choice. Back to choices keeps the selection. Ask the community opens a prefilled, editable draft.
- Route step progress survives Help, overview and tab switches. It clears on Finish route and resumes when directions reopen.
- Saved route and published questions survive a reload. Draft and practice choice last for the session. Closing the composer publishes nothing.
- Each view change moves focus to the new heading, focus outlines are visible, and every hotspot and pin is a named button.

## Technical details
- TanStack file routes under `src/routes`, page title and description set for each route.
- Small client store (React context + localStorage for saved and published items, sessionStorage for step, draft, practice choice and origin).
- SVG scene components in `src/components/scenes`, with fixtures in `src/data/demo.ts`.
- Design tokens in `src/styles.css`, including a `practice` surface token for the game-bridge paper tone. Fonts are loaded through the root head.
- Vitest tests for the rules: practice return target, step preservation and clearing, save and publish persistence, and blank-question blocking.
- The hosted game is linked as an optional "Open full game" from P1. It is not embedded.
