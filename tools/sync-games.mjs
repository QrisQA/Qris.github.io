// Node 18+. Run by the GitHub Action (or locally: node tools/sync-games.mjs).
// Reads games.js, asks Roblox's public APIs for visits / players / icon / thumbnail,
// saves images to assets/, writes data/stats.json, and prints name + creator for verification.
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=fs.readFileSync(path.join(root,'games.js'),'utf8');
const games=JSON.parse(src.slice(src.indexOf('['),src.lastIndexOf(']')+1));
const j=async u=>{const r=await fetch(u,{headers:{accept:'application/json'}}); if(!r.ok) throw new Error(r.status+' '+u); return r.json()};
const save=async(url,file)=>{const r=await fetch(url); if(!r.ok) return false; fs.writeFileSync(path.join(root,file),Buffer.from(await r.arrayBuffer())); return true};
fs.mkdirSync(path.join(root,'assets/icons'),{recursive:true}); fs.mkdirSync(path.join(root,'assets/thumbs'),{recursive:true}); fs.mkdirSync(path.join(root,'data'),{recursive:true});
// place -> universe (batch endpoint)
const uni={};
for(const g of games){ try{ uni[g.placeId]=(await j(`https://apis.roblox.com/universes/v1/places/${g.placeId}/universe`)).universeId }catch(e){ console.warn('NO UNIVERSE',g.title,e.message) } }
const ids=Object.values(uni).filter(Boolean).join(',');
const info=Object.fromEntries((await j(`https://games.roblox.com/v1/games?universeIds=${ids}`)).data.map(d=>[d.id,d]));
const icons=Object.fromEntries((await j(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=256x256&format=Png&returnPolicy=PlaceHolder&isCircular=false`)).data.map(d=>[d.targetId,d]));
const thumbs=Object.fromEntries((await j(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`)).data.map(d=>[d.universeId,d.thumbnails?.[0]]));
const out={updated:new Date().toISOString(),games:{}};
for(const g of games){
  const u=uni[g.placeId], d=info[u]; if(!d){console.warn('MISSING',g.title);continue}
  out.games[g.placeId]={name:d.name,creator:d.creator?.name,visits:d.visits,playing:d.playing};
  const i=icons[u]; if(i?.state==='Completed'&&i.imageUrl) await save(i.imageUrl,`assets/icons/${g.slug}.png`);
  const t=thumbs[u]; if(t?.state==='Completed'&&t.imageUrl) await save(t.imageUrl,`assets/thumbs/${g.slug}.png`);
  console.log(`${g.title.padEnd(32)} -> "${d.name}" by ${d.creator?.name}`);
}
fs.writeFileSync(path.join(root,'data/stats.json'),JSON.stringify(out,null,1));
console.log('\nCheck each line above is the official game you tested.');
