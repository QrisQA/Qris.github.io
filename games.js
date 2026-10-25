/* Single source of truth for the games list.
   - Only entries with a placeId are shown on the site (no unverified links).
   - placeId = the number in https://www.roblox.com/games/<placeId>/...
   - `order` is rank by visits (1 = most visited); `node tools/sync-games.mjs` recalculates it.
   Keep the markers below: the sync script edits the JSON between them. */
window.GAMES = /*DATA*/ [
  {"slug":"escape-tsunami-for-brainrots","title":"Escape Tsunami For Brainrots","role":"Tester","placeId":131623223084840,"order":1},
  {"slug":"break-and-steal-an-egg","title":"Break and Steal an Egg","role":"Tester","placeId":null,"order":2},
  {"slug":"huss-valley","title":"Huss Valley","role":"Tester","placeId":107535308163741,"order":3},
  {"slug":"destroy-a-vault","title":"Destroy a Vault","role":"One-Time Tester","placeId":null,"order":null},
  {"slug":"bunsikjip-restaurant","title":"Bunsikjip Restaurant","role":"One-Time Tester","placeId":null,"order":null},
  {"slug":"san-diego-roleplay","title":"San Diego Roleplay","role":"Tester","placeId":null,"order":null},
  {"slug":"build-a-base-and-steal","title":"Build a Base and Steal","role":"Tester","placeId":null,"order":null},
  {"slug":"parkour-or-die","title":"Parkour or Die!","role":"Tester","placeId":null,"order":null},
  {"slug":"soccer-zero","title":"Soccer: Zero","role":"Tester","placeId":null,"order":null},
  {"slug":"knife-vs-gun-duels","title":"Knife VS Gun DUELS","role":"Tester","placeId":null,"order":null},
  {"slug":"larp-your-character","title":"Larp Your Character","role":"Tester","placeId":null,"order":null}
] /*END*/;
