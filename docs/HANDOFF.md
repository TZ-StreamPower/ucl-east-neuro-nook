# Neuro Nook team handoff

Snapshot of the working tree on 18 November 2026. See the [PRD](PRD.md), [architecture](ARCHITECTURE.md) and [roadmap](../roadmap.md) for the product scope and remaining work.

## Implemented

- Explore offers featured cards, category and sensory filters, place and route details, list and map views, and an entry to the portrait game.
- Navigate offers Calmest and Quickest routes, sensory overlays, place sheets, checkpoints, walking feedback and a calmer-break option. Finishing a walk or route directions leads to Reflect, where ratings can be saved locally and optionally shared as a Community experience.
- Community supports experience, question and route review cards, drafts, preview and confirmation, replies and reporting. Saved collects bookmarked places, routes and posts. Settings and Practice cover preferences and guided scenarios.
- Same Day, Three Paths opens over Explore or a route detail. Back, Escape and the game's Finish action close the overlay. Failed loads offer Retry.

## Data and limitations

OpenStreetMap locations underpin the map. Five graph locations are marked approximate. Route geometry is drawn between graph nodes, and walking times and sensory ratings are illustrative. Community seeds are team-written demo posts. Publishing, reports and preferences use browser storage. The prototype has no shared community backend or live tracking. Public tiles require network access, with a schematic fallback. Campus photos remain optional replacements for the bundled artwork.

## Verification and next steps

The latest recorded visual checkpoint reports 51 unit/component tests and 13 Chromium browser tests passing, plus successful typecheck and build. Lint still reported 1,848 Prettier errors and 16 warnings. The [verification log](verification-log.md) retains earlier runs and their scope. Packaging did not rerun application checks.

Remaining coverage includes real iPhone Safari, two-finger pinch, landscape, game pause and Chinese-language play. Earlier Chromium runs reached the ending for all three characters. The current route-overlay reliability changes still need a targeted browser run. The AllTrails UX Interaction Architecture reference was unavailable in the workspace.

Start with local setup in the [README](../README.md). Use the archived `visual-reference/` folder alongside the verification log, then pick up the [prioritised roadmap](../roadmap.md).
