import {DATA} from '../client/src/legacy-data.js';import {PACK} from '../client/src/creative-pack.js';import {buildCatalog} from '../client/src/catalog-integrity.js';import {FAMILIES,familyFor} from '../client/src/discoveries.js';
import {readFileSync,writeFileSync} from 'node:fs';
const mods=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47'];
const packs=[PACK];for(const name of mods){const path=name.replace('gaming','gaming-pack').replace('organic','organic-pack');const m=await import(`../client/src/${path}.js`);packs.push(Object.values(m)[0]);}
const {items,recipes}=buildCatalog(DATA,packs),byId=new Map(items.map(it=>[it.id,it])),byName=new Map(items.map(it=>[it.name.toLowerCase(),it]));
const nature=items.filter(it=>familyFor(it)==='nature'),natureIds=new Set(nature.map(it=>it.id));
const key=(a,b)=>[a,b].sort().join('|');
const internal=new Map([...recipes].filter(([p,o])=>{const [a,b]=p.split('|');return natureIds.has(a)&&natureIds.has(b)&&natureIds.has(o)}));
const suggested=readFileSync(new URL('../shared/v48-nature-editorial.txt',import.meta.url),'utf8').split(/\r?\n/).map(l=>l.trim()).filter(x=>x&&!x.startsWith('#'));
const additions=[],rejections=[],unresolved=[];
for(const row of suggested){const [targetName,candidatesRaw]=row.split('|').map(s=>s.trim());if(!candidatesRaw)throw Error('Invalid line '+row);const target=byName.get(targetName.toLowerCase());if(!target||!natureIds.has(target.id))throw Error('Bad target '+targetName);if(additions.some(x=>x.out===target.id))throw Error('Duplicate curated target '+targetName);
 let chosen=null;for(const c of candidatesRaw.split(';').map(s=>s.trim())){const parts=c.split('+').map(s=>s.trim());if(parts.length!==2){rejections.push(`${targetName}: malformed ${c}`);continue;}const [a,b]=parts.map(n=>byName.get(n.toLowerCase()));if(!a||!b||!natureIds.has(a.id)||!natureIds.has(b.id)){rejections.push(`${targetName}: unavailable ${c}`);continue;}const k=key(a.id,b.id);if(recipes.has(k)||additions.some(x=>x.pair===k)){rejections.push(`${targetName}: pair occupied ${c}`);continue;}if(a.id===target.id||b.id===target.id){rejections.push(`${targetName}: self-dependency ${c}`);continue;}chosen={pair:k,out:target.id,ingredients:[a.name,b.name],name:target.name};break;}
 if(!chosen){unresolved.push(targetName);continue;}additions.push(chosen);
}
const all=new Map([...internal,...additions.map(x=>[x.pair,x.out])]);const seeds=['Water','Fire','Earth','Air'].map(n=>byName.get(n.toLowerCase()).id),reachable=new Set(seeds);let improved=true;while(improved){improved=false;for(const [p,o] of all){const [a,b]=p.split('|');if(reachable.has(a)&&reachable.has(b)&&!reachable.has(o)){reachable.add(o);improved=true;}}}
const missing=nature.filter(it=>!reachable.has(it.id)).map(x=>x.name);
const reachableRecipes=new Map([...all].filter(([p,o])=>{const [a,b]=p.split('|');return reachable.has(a)&&reachable.has(b)&&reachable.has(o)}));
const out={version:48,families:[{id:'nature',name:'Nature & Science',starters:seeds,items:[...reachable],recipes:[...reachableRecipes],curatedCount:additions.filter(x=>reachableRecipes.has(x.pair)).length,originalCount:internal.size,totalFamilyElements:nature.length}]};
writeFileSync(new URL('../shared/v48-family-data.json',import.meta.url),JSON.stringify(out));
writeFileSync(new URL('../client/src/family-mode-v48.js',import.meta.url),'export const FAMILY_CAMPAIGNS='+JSON.stringify(out)+';\n');
writeFileSync(new URL('../shared/v48-family-editorial-report.json',import.meta.url),JSON.stringify({accepted:additions.filter(x=>reachableRecipes.has(x.pair)),rejected:rejections,unresolved,excluded:missing,reachable:reachable.size,familySize:nature.length},null,2));
console.log(`Family nature pilot: ${reachable.size}/${nature.length} reachable items / ${reachableRecipes.size} recipes, added ${additions.length} curated, ${unresolved.length} unresolved outputs, ${rejections.length} rejected pairs`);
