# Architecture

## Stack and routing

React 19 and TypeScript run in TanStack Start with TanStack Router, Vite and Lovable's Vite configuration. Tailwind CSS and Radix UI primitives provide the UI. Vitest and Testing Library cover logic and components. Playwright covers browser flows.

File-based routes live in `src/routes/`, with `__root.tsx` as the app shell. Primary URLs are `/`, `/navigate`, `/community` and `/saved`. Supporting URLs include `/place/$id`, `/route/$id`, `/route/$id/steps`, `/reflect`, `/practice` and `/settings`. Search parameters use Zod validators with fallbacks. The router plugin owns `src/routeTree.gen.ts`.

## Navigation and sensory data

`src/data/sensory.ts` defines the East Bank graph, seed ratings and feedback options. `src/data/geo.ts` maps graph nodes to OSM-derived coordinates and connects places and route previews to the graph. Pure rules in `src/lib/logic.ts` include `planRoute`, `nearestCalm`, `routeStats` and `combineRating`. The latter combines local ratings with seeds.

`GeoMap`, `NavMap` and `MapExplorer` render MapLibre views using OpenFreeMap tiles with OSM attribution and a schematic fallback. `FeedbackTray`, `RateSheet` and Reflect collect observations. Replaceable feedback SVGs live in `src/assets/feedback/`. Bundled route previews and scene artwork live in `src/assets/maps/` and `src/assets/scenes/`. Optional photos follow the [drop-in naming guide](../src/assets/photos/README.md).

## State and community

`src/lib/store.tsx` stores saved items, questions, replies, experiences, kept drafts, reports, preferences, ratings and walk feedback in localStorage. Steps, active drafts, practice state, simulated offline state and map view use sessionStorage. Demo data and post helpers feed Community and Saved. A Reflect share creates a local experience.

## Game

`public/game/` contains the editable standalone HTML, JavaScript, CSS and art package. `GamePractice` opens a same-origin iframe at `/game/index.html` from Explore or route detail with `?game=1`. The originating screen stays mounted to preserve scroll and route tabs. `src/lib/gameFrame.ts` helps identify the loaded game document. The overlay handles load failure, retry and exit. Portrait integration layout belongs in `public/game/portrait.css`.
