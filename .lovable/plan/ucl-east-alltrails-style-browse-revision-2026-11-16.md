# UCL East — AllTrails-style browse revision

Rebuild the main app around familiar browse patterns (search, category icons, Map/List, cards, detail tabs, bottom sheets) while keeping Campus Practice and the hosted game link.

## 1. Navigation and Campus browse (`/`)
- Bottom tabs stay: Campus, Community, Saved (bright purple #9A3BFF marks the active tab).
- Campus: large search field, row of rounded labelled category icons (Buildings, Food, Study, Support, plus "All"), Map/List toggle, result cards.
- Fixture data: about 8 places and 3 routes (e.g. Marshgate, One Pool Street, East Bank café, study space, Student Support desk; Stratford Station → Marshgate, Stratford International → One Pool Street, Marshgate → One Pool Street). All tagged "Illustrative".
- Search and category filter the same result set in both Map and List. Selected result is kept when switching Map/List; on Map, tapping a pin opens a small bottom sheet card, which opens the detail.
- Empty search shows a clear "No matches" message with a reset.

## 2. Place detail (`/place/$id`) and route preview (`/route/$id`)
- Place detail: thumbnail placeholder, category, short notes, related routes, Save.
- Route preview, in this order: map with selectable landmarks → title, from/to → Save and Share → tabs Overview / What to expect / Community → prominent Start directions → Practise this arrival card inside Overview.
- Tab is kept in the URL so switching tabs (and coming back) keeps the same route and tab.
- Landmark tap opens a bottom sheet: name, recognition cue, View this step. Closes with X, backdrop tap or Escape, focus returns to the pin.
- Share copies a link (with a short confirmation).

## 3. Directions and What to expect
- Start directions (`/route/$id/steps`): map with current step highlighted, bottom panel with Previous / Next, Overview (sheet listing all steps) and Help. Closing Overview or Help restores the current step; Finish clears progress.
- What to expect: icon rows for Sound, Crowds, Entrances, Places to pause. Each expands to details, observation time and source; missing data reads "Not yet recorded". A note that comfort preferences stay with the student (nothing is set for them).

## 4. Campus Practice (`/practice?route=…`)
- Exploration → Decision-making → Support and feedback, with Exit practice visible on every stage.
- Back to route returns to the originating route preview; started from Campus returns to Campus.
- Ask the community opens an editable draft linked to that route; Preview then Confirm publish.
- "Open full game" link kept inside Practice.

## 5. Community
- Feed of question and tip cards: short title, place/route chip, reply count. Category chips (Questions / Tips).
- Thread page: discussion replies plus a Reply action (demo reply saved locally).
- Route Community tab lists that route's posts plus Ask about this route.
- Returning from a thread goes back to where it was opened (feed, route tab, place).
- Published posts and demo replies survive reload.

## 6. Saved
- Lists saved places and routes together; each reopens its own detail page. Empty state links to Campus.

## Visual direction
- White background, deep purple #361A54 primary actions, #9A3BFF for active/selected and focus rings.
- Category icons: lucide icons in rounded tiles with soft tinted backgrounds (one hue per category), short visible labels, clear selected / unselected / focus states.
- Map and thumbnail placeholders: simple schematic SVG (paths, blocks, numbered pins) rather than finished illustrations; existing scenes reused in Practice.

## Technical details
- New fixtures in `src/data/demo.ts` (places, routes with steps/landmarks/expect rows, threads with routeId/placeId and replies).
- Routes: `index.tsx` (browse, search params `q`, `cat`, `view`, `sel`), `place.$id.tsx`, `route.$id.tsx` (search `tab`), `route.$id_.steps.tsx`, `practice.tsx` (search `route`, `from`), `community.*` with `from` + `ref` context, `saved.tsx`. Old `/route/preview`, `/route/steps`, `/place/marshgate` redirect to the new paths; old route picker becomes part of browse.
- Store: saved becomes a list of `{kind, id}`; step progress keyed by route; replies stored locally.
- Pure rules in `src/lib/logic.ts` with Vitest tests: filtering by search + category, Map/List keeps selection, thread back target, practice return target per route, step preserve/clear, saved toggle, publish requires non-blank text.
- Browser check at 390 px: filters, Map/List selection, tab retention, sheet dismissal, practice return.

Note: the interaction diagram mentioned in the brief wasn't attached to this message; the plan follows the brief text and the earlier architecture images.
