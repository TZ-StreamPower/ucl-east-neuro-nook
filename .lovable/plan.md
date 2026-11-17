# White canvas, sensory ratings and an East Bank navigation map

## 1. Back to a white canvas (readability)
- Page background returns to white; cards stay white with the dark outline and small hard shadow.
- Keep the purple buttons and the four coloured category tiles; body text goes back to full-contrast dark.
- Cream/lavender only as small accents (selected tab sticker, tags), never behind running text.

## 2. Sensory rating system
Each place gets three star ratings (1-5) shown as icon rows, not paragraphs:
- **Noise** (speaker icon): 1 = quiet, 5 = very loud
- **Lighting** (sun icon): too dark / comfortable / too bright, shown on a 3-step scale plus stars for comfort
- **Overall calm** (overwhelm): 1 = overwhelming, 5 = calm
- **Availability now**: Free / Busy / Full chip

Where it shows:
- Place cards in Campus list: three tiny icon meters.
- Place page: a "How it feels" block with averages, rating count and "Rate this space" button opening a bottom sheet (tap stars, one tap per row, Preview → Confirm, same pattern as community posts).
- Filters on Campus: "Quiet", "Soft light", "Not busy" chips so people can find a calmer space fast.
- Ratings are labelled "Illustrative" for seeded values and "Your rating" for the user's own.

## 3. Navigation feature (new main tab: Navigate)
Bottom nav becomes Campus / Navigate / Community / Saved.

Scope (new places in the data, grouped by area):
- Stratford station (main concourse, exits)
- UCL East: Marshgate, One Pool Street
- Loughborough University London and UCL at Here East
- UAL London College of Fashion (East Bank)
- DLR: Stratford, Stratford International, Pudding Mill Lane
- V&A East (museum) and V&A East Storehouse

Navigate screen:
- Full-height illustrated map (inline SVG, same style as current scenes) with every place as a coloured pin; pins tinted by current calm rating.
- Pick From and To (search sheet), choose "Calmest" or "Quickest" route; calmest avoids low-rated spaces.
- Immersive walk mode: step-by-step cards with a moving "you" marker along the line, Next / Back, big landmark pictures, "I need a break" button that shows the nearest calm-rated space and reroutes.
- During the walk, a floating "How is it here?" button opens a quick graphic feedback tray (noise, light, crowd, overwhelm icons). One tap records feedback against the current segment; it then feeds the ratings in section 2.
- Feedback icons use placeholders now, swapped for your graphic assets when you send them (file names fixed so swapping is drop-in).

## 4. Out of scope
- No real GPS or live crowd data; positions and seeded ratings are illustrative.
- Ratings stay on this device (like saved items) unless you want them shared between users, which would need sign-in and online storage.
- No publishing.

## Technical details
- `src/styles.css`: `--background`, `--muted` back to white/neutral; keep `retro` utility.
- `src/data/demo.ts`: add `Area` and new places with `xy` on a wider East Bank map; seeded `sensory` ratings; walk segments for new routes.
- `src/lib/logic.ts`: `averageRating`, `calmScore`, `calmestPath` (weighted shortest path over a small graph), `nearestCalm`; unit tests in `logic.test.ts` (e.g. calmest route skips a place with noise 5).
- `src/lib/store.tsx`: `ratings` and `walkFeedback` in localStorage.
- New `src/routes/navigate.tsx` (search params `from`, `to`, `mode`, `step` via zodValidator + fallback), `src/components/SensoryMeter.tsx`, `RateSheet.tsx`, `FeedbackTray.tsx`, `src/components/scenes/EastBankMap.tsx`; feedback icons in `src/assets/feedback/` as replaceable SVGs.
- `Shell.tsx`: add Navigate tab; `place.$id.tsx` and `Browse.tsx`: meters, filters, rate sheet.
- Playwright at 375/393: rate a place, filter Quiet, plan Stratford → V&A East calmest, walk, give feedback, take a break; log in `docs/verification-log.md`.
