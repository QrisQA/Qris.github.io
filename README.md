# Qris — Roblox QA Tester Portfolio
Static site (HTML/CSS/JS, no dependencies). Works on GitHub Pages.

## Files
index.html · styles.css · script.js · games.js (game list) · assets/icons/ · tools/sync-games.mjs · favicon.svg

## Add or fix a game
1. Open the game on roblox.com and copy the number from the URL: `roblox.com/games/<placeId>/...`
2. Put it in `games.js` as `placeId`. Games without a placeId are NOT shown (no guessed links).
3. Run `node tools/sync-games.mjs` (Node 18+). It prints the game name + creator for you to confirm,
   downloads the official icon into `assets/icons/`, and re-sorts `order` by visits. No stats appear on the site.
Cards without an icon file show a clean lettered tile instead.

## Change palette
In `index.html` set `<html data-palette="violet">` to `blue`, `emerald`, `crimson`, `gold`, `ice` or `mono`
(presets live at the top of `styles.css`; all colours/spacing are CSS variables).

## Deploy to GitHub Pages
1. Put all files at the root of your repo (replace the old ones).  2. Commit and push.
3. Repo → Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
4. Your site appears at `https://<username>.github.io/<repo>/` after a minute or two.
