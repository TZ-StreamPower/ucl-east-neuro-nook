# Visual coherence pass + iPhone-ready game screen

Direction from the visual prompt: **soft neo-brutalism with a light sticker style**. That means cream and deep purple, a few muted accent colours, 2px outlines and hard shadows, and less text. The game's story and inner screens stay unchanged.

## 1. Shared look (one system across every page)
- **Colours:** a cream page background (#F6F0E6) and deep purple ink (#321747), plus four soft accents: lavender #E6DBF2, lime #DCE6AE, yellow #F3D88E and blue #BBDCE3. Each category gets one accent: Buildings lavender, Food yellow, Study blue, Support lime. Bright purple stays for focus and selected states only.
- **Cards and buttons:** one card style and one button style: 2px outline, 12-16 px corners, a 3-4 px hard shadow, 8 px spacing steps, 16 px minimum text and 44 px minimum touch size. No dotted backgrounds and no constant motion.
- **Four icon levels, each with one job:**
  - **L1 hero, 64-120 px:** the game artwork and large sticker icons on the main features.
  - **L2 functional sticker, 32-48 px:** Save (star), Done (check), Close (cross), each in a filled, outlined round "sticker".
  - **L3 navigation, 20-24 px:** tabs and categories. The category tiles become coloured squares with outlines and shadows.
  - **L4 metadata, 12-16 px:** a clock with "5 min", walking distance, status.

  Stars, checks and crosses always mean the same thing.

## 2. Less text, stronger focal points
- **Campus:** a short header ("Campus" plus one line, "Your campus, your pace."). The game card stays the hero with its art at about 60%. The button becomes **Play →** with a large star sticker. Result cards get smaller: icon, name, and "clock 5 min" in place of sentences. The repeated "Illustrative" lines shrink into one small tag.
- **Route and place pages:** shorter text, metadata shown as icon chips (time, steps, quiet), and Save and Share as stickers.
- **Community:** readable post cards, a small place chip, and a compact "+ Post" sticker button.
- **Saved:** small, easy-to-scan rows, each with a star and a type label (Place, Route, Post, Experience).
- **Practice:** trimmed to short lines with icons.
- Copy rules applied everywhere, for example "Estimated walking time: 5 minutes" becomes a clock icon and "5 min".

## 3. Game screen fitted to iPhone
- **Bug found while checking:** opening the game straight from a link (for example after a refresh) left it stuck on "Loading practice…" on a 393x852 phone screen. The game had loaded before the app noticed. The fix is to detect a game that has already loaded.
- **Top bar:** slimmer (44 px buttons, icon plus short label "Campus" and "Ask"), sitting below the notch. The game fills the rest of the screen, using dynamic viewport height so the Safari toolbar doesn't cut it off.
- **Touch:** stop the background page from bouncing or scrolling behind the game, turn off double-tap zoom, and respect the bottom home bar. These changes go only in the overlay and in `portrait.css`, as the project rules require.
- **Calmer transition:** a short fade-in when the game opens, switched off when "reduce motion" is on.

## Check
- **Browser runs at 375, 390 and 430 px:** Campus → Play → play one moment → Finish here and Back to Campus both return to Campus. I'll also open the game directly from a link to test the loading fix. Every page is checked for sideways scrolling and for buttons under 44 px.
- **Pages to look at:** Campus, a route page, a place page, Community, Saved and Practice.
- **Results:** recorded in the test log as PASS, FAIL or NOT TESTED.

## Technical details
- **`src/styles.css`:** new semantic tokens (`--canvas`, `--ink`, `--accent-lavender`, `--accent-lime`, `--accent-yellow`, `--accent-blue`), category tokens remapped to these accents, and the `retro` utility tuned to a 2px border and 3px shadow. Also a `sticker` utility and a `@media (prefers-reduced-motion)` guard.
- **New `src/components/ui-kit.tsx`:** `Sticker`, `IconTile`, `MetaChip`, `FeatureCard` and `EmptyState`, used by the pages.
- **Pages edited:** `Browse.tsx` (CAT_STYLE), `GameShowcase.tsx`, `index.tsx`, `route.$id.tsx`, `place.$id.tsx`, `community.index.tsx`, `PostCard.tsx`, `saved.tsx`, `practice.tsx` and `Shell.tsx` (bottom tabs).
- **Game overlay:** `GamePractice.tsx` checks the iframe's `readyState === "complete"` on mount, uses a safe-area top bar and `overscroll-behavior: none`. `public/game/portrait.css` gets `touch-action: manipulation` and a bottom safe-area inset.
- **Untouched:** no backend, and none of the game's JS, story or art.
