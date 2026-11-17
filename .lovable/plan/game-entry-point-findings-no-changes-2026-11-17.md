# Game entry point: findings (no changes)

## 1. Game source integrated: YES
`public/game/` has index.html, game.js, style.css, skin.css, portrait.css, and assets/ (scenes, sprites, materials, ambient, art-config.js, voxel-characters.js, storyboard_01-04.png, storyboard_13-15.png). URL set in `src/data/demo.ts:70` (`GAME_URL = "/game/index.html"`).

## 2. Game route: YES, as an overlay, not a page of its own
- `src/routes/route.$id.tsx`: search param `game=1` shows `src/components/GamePractice.tsx`, a full-screen iframe of `/game/index.html` with "Back to route" and "Ask".
- `src/routes/practice_.game.tsx`: `/practice/game?route=<id>` redirects to `/route/<id>?tab=overview&game=1`.
- Direct URL example: `/route/stratford-marshgate?tab=overview&game=1`. The raw game is at `/game/index.html`.

## 3. What launches it
- Route detail page, Overview tab: the card **"Practise this arrival"** (`route.$id.tsx:54-56`). This is the main entry.
- Practice page `/practice`: **"Open the game"** links (`practice.tsx:31` and `:58`), which go to `/practice/game`.
- No bottom-tab item (Campus / Community / Saved) opens it. To get there: Campus, then a route card, then "Practise this arrival".

## 4. Published version (https://ucl-east-neuro-nook.lovable.app)
- `/game/index.html` returns 200, so the game is live.
- App pages return 307. That is just the redirect that adds default search params (for example `/` goes to `/?q=&cat=all&view=list`), not an error.
- `/game/assets/storyboard_13-15.png` returns **404**, so the live site is an older build. It lacks the storyboard image fix and probably the "Finish here" return fix. Publishing the current version would fix both.
- Not checked in a browser on the live site: whether "Practise this arrival" actually opens the game overlay. That is inferred from the code plus the 200 response.

## Suggested next step
Publish the current preview, then run one browser check on the live URL.
