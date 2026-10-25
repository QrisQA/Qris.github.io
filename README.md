# Qris — Roblox QA Tester Portfolio
Static site, no dependencies, GitHub Pages ready.

## Deploy
1. Copy everything (including the hidden `.github` folder) to the root of your repo, commit, push.
2. Repo → Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Repo → Settings → Actions → General → Workflow permissions → **Read and write permissions** → Save.
4. Repo → Actions tab → "Update game stats" → **Run workflow** (do this once now). It downloads the official icons and
   thumbnails into `assets/`, writes `data/stats.json` (visits + players), and commits them. After that it re-runs every 3 hours.
5. Open the run log and check each line shows the official game you tested.

## Edit
- Games: `games.js` (placeId = number in the Roblox URL). Order is automatic, by visits.
- Palette: `data-palette` on `<html>` in `index.html` (violet, blue, emerald, crimson, gold, ice, mono).
- Until the first Action run, cards show a lettered tile and no numbers (nothing is faked).
