// Run locally: node tools/sync-games.mjs   (Node 18+, needs internet)
// For every game with a placeId in games.js it: looks up the experience via Roblox's public APIs,
// prints name + creator so YOU can confirm it is the right one, downloads the official square icon
// to assets/icons/<slug>.png, and rewrites `order` by visits (visit counts are only printed here,
// never written to the site). NOTE: written without network access, so it has not been run by the author.
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'games.js'); const src=fs.readFileSync(file,'utf8');
const m=src.match(/\/\*DATA\*\/([\s\S]*?)\/\*END\*\//); const games=JSON.parse(m[1]);
const j=async u=>{const r=await fetch(u); if(!r.ok) throw new Error(r.status+' '+u); return r.json()};
fs.mkdirSync(path.join(root,'assets/icons'),{recursive:true});
const rows=[];
for(const g of games.filter(g=>g.placeId)){
  try{
    const {universeId}=await j(`https://apis.roblox.com/universes/v1/places/${g.placeId}/universe`);
    const d=(await j(`https://games.roblox.com/v1/games?universeIds=${universeId}`)).data[0];
    const t=(await j(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=256x256&format=Png&returnPolicy=PlaceHolder&isCircular=false`)).data[0];
    if(t?.imageUrl&&t.state==='Completed'){const b=Buffer.from(await (await fetch(t.imageUrl)).arrayBuffer()); fs.writeFileSync(path.join(root,'assets/icons',g.slug+'.png'),b)}
    rows.push({g,visits:d.visits}); console.log(`${g.title}  ->  "${d.name}" by ${d.creator.name}  [icon: ${t?.state}]`);
  }catch(e){console.warn('FAILED',g.title,e.message)}
}
rows.sort((a,b)=>b.visits-a.visits).forEach((r,i)=>r.g.order=i+1);
console.log('\nOrder by visits (terminal only):'); rows.forEach(r=>console.log(r.g.order,r.g.title,r.visits.toLocaleString()));
fs.writeFileSync(file,src.replace(m[0],'/*DATA*/ '+JSON.stringify(games,null,2)+' /*END*/'));
console.log('\nUpdated games.js. Check each name/creator above matches the official game you tested.');
