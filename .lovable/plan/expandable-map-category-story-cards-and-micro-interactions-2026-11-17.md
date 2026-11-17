# Expandable map, category story cards and micro-interactions

Builds on top of the current version. The white pages, the app's layout and the game itself stay as they are.

## 1. Expandable map (P0)
- **Small map:** the Navigate map gets an Expand button in its corner and a lavender "Expand map" button underneath. Tapping the map also opens it.
- **Explore map:** a near-full-screen view with:
  - a close (X) button;
  - pinch-to-zoom and drag-to-pan;
  - + and − buttons and a home button that resets the view;
  - the selected route highlighted and pins you can tap.
- **Opening animation:** the map grows into place in about 220 ms, with a plain fade when reduce motion is on.
- **Tapping a pin** marks it with a ring and a check, and opens a small bottom sheet with:
  - the place name;
  - noise and lighting;
  - calm stars and how busy it is;
  - the latest feedback from this phone, for example "You said: Too loud";
  - two buttons: **View details**, which opens the place page for Marshgate and One Pool Street, and **Route here**, which sets it as the destination.
- **Remembered between pages:** zoom, position, the selected pin, the destination and the Calmest/Quickest choice are kept when you go to Campus and come back.
- **Labelling:** the map stays a drawn, schematic picture marked "Schematic · not to scale", never shown as live maps.
- **Later:** the map is built so a Google Earth Studio picture or a real map can replace the drawing later. No new map service is added.

## 2. Story card changes with the category (P0)
The game can't start at a particular chapter; it only opens at the beginning. So every Play button opens the same working game, and only the card's picture, title, short description and sticker change.

| Category | Title | Description | Picture from the game |
|---|---|---|---|
| All | Same Day, Three Paths | One campus. Different experiences. | atrium + Mei, Sam, Leila |
| Buildings | Finding your way | Explore entrances and campus routes. | route scene |
| Food | Ordering food | Navigate queues, menus and conversations. | lunch scene |
| Study | Learning together | Explore lectures and group work. | classroom scene |
| Support | Finding support | Ask for help when things change. | evening home scene (closest existing art) |

- The card keeps its large size; the picture crossfades in about 190 ms and the card doesn't jump.
- The sticker shows the category's icon and colour, plus its name, so it doesn't rely on colour alone.
- One shared card with a settings list per category, not five separate cards.

## 3. Micro-interactions (P1)
- **Buttons and outlined cards:** when pressed, they move down about 3 px, the hard shadow shrinks and they scale to 0.98, all in 120 ms; they spring back when released.
- **Categories:** the chosen tile gets a ring, a lavender background and a small check sticker, so it doesn't rely on colour alone.
- **Ratings:**
  - Tapping a star fills it with a short pop.
  - Choices you've picked show a check.
  - After Confirm, a "Rating saved" sticker with a check shows on the page; tap Update to change your rating.
- **Walk feedback:** the picked icon gets a check and a "Saved" sticker on the stage card.
- **Save / bookmark:** the bookmark smoothly changes from outline to filled and briefly shows "Saved", with no pop-up window.

## 4. Motion tokens and accessibility
- **Shared timings:** press 120 ms, selection 160 ms, crossfade 190 ms, map opening 220 ms, all with gentle easing and no bounce, flashing or looping.
- **Reduce motion:** the phone's reduce-motion setting and the app's own Reduce motion preference both turn movement into instant changes.
- **Touch and contrast:** every control stays at least 44 × 44 px, with the same strong text contrast.

## 5. Testing
Tested at 375, 390 and 430 px wide:
- **Map:** expand it, zoom with the buttons and a pinch, drag, reset, tap a pin and open its sheet, close the map, then go to Campus and back to check the zoom and destination are kept.
- **Story cards:** each category shows a different title and picture, and every Play button opens the game.
- **Interactions:** the press effect, rating confirmation and bookmark change work.
- **Reduce motion:** with it on, there's no movement.
- **Layout:** no sideways scrolling.

Results go in the verification log, kept separate from what isn't tested yet.

## Technical details
- `src/styles.css`:
  - add motion tokens (`--dur-press` and friends, `--ease-out`);
  - extend `@utility retro` with a `transition` and `&:active` (`translate(3px,3px)`, `box-shadow` 0, `scale(.98)`) for interactive elements only (button, a);
  - add the `.reduce-motion` and `@media (prefers-reduced-motion)` overrides, plus `fade-in` and `pop` keyframes.
- `src/components/scenes/EastBankMap.tsx`: accept a `transform` and an optional `backgroundSrc` (the slot for a future Earth Studio image).
- New `src/components/MapExplorer.tsx`:
  - a full-screen overlay using Pointer Events for drag and two-finger pinch, and a non-passive wheel listener for zoom around the cursor;
  - zoom clamped between 1 and 4, with buttons zooming around the centre;
  - `touch-action: none`, and no new libraries.
- New `src/components/PlaceSheet.tsx`: the sheet shown when a pin is tapped.
- Map state (`zoom`, `x`, `y`, selected pin) lives in a `mapView` key in store sessionStorage. The destination and mode stay in the `navigate` URL search, which the Navigate tab link now keeps.
- `src/data/stories.ts`: `STORIES: Record<Cat|"all", {title, desc, cover, sprites?}>`. `GameShowcase` takes a `cat` prop, with `key`-less crossfade layers for the image.
- `SaveShare.tsx`: filled Bookmark when saved, plus an inline "Saved" status. `RateSheet` and `FeedbackTray` get check states.
- A new pure helper for zoom-to-point is added to `logic.ts`, with tests (it keeps the anchor point fixed and stays within the zoom limits).
