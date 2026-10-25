# Qris — Roblox QA Tester Portfolio
Static site, no dependencies, GitHub Pages ready. Put all files at the repo root.

## Updating player counts / visits (every few days)
Edit `data/stats.json` on GitHub (pencil icon): fill in `playing` and `visits` per game (e.g. "45K", "243.9M", "5.7B"),
set `updated` to today's date, and commit. Leave a value blank to hide it. Cards re-sort by visits once every game has a visits value.
(Or just send the numbers to Claude and get a ready file back.)

## Other edits
- Games, roles, thumbnails: `games.js`. Palette: `data-palette` on `<html>` in `index.html`.
- Thumbnails load from Roblox's CDN; if one ever breaks, the card shows a lettered tile instead.
