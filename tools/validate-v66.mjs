import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V65} from '../client/src/organic-pack-v65.js';
import {ORGANIC_V66} from '../client/src/organic-pack-v66.js';
import {ORGANIC_ART_V66} from '../client/src/organic-art-v66.js';
const versions=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63'];
const packs=[PACK];for(const n of versions){const f=n.replace('gaming','gaming-pack').replace('organic','organic-pack');const m=await import('../client/src/'+f+'.js');packs.push(Object.values(m)[0]);}
const base=buildCatalog(DATA,[...packs,ORGANIC_V65]);
const now=buildCatalog(DATA,[...packs,ORGANIC_V65,ORGANIC_V66]);
const assert=(v,m)=>{if(!v)throw Error('V66 '+m)};
assert(base.items.length===5136&&base.recipes.size===13473,'V65 baseline drift');
assert(ORGANIC_V66.items.length===14&&ORGANIC_V66.recipes.length===14,'unexpected new counts');
assert(now.items.length===5150&&now.recipes.size===13487,'V66 catalog totals');
assert(new Set(now.items.map(x=>x.id)).size===now.items.length,'duplicate ID');
assert(new Set(now.items.map(x=>normalizeCatalogName(x.name))).size===now.items.length,'duplicate normalized name');
for(const [k,v] of base.recipes)assert(now.recipes.get(k)===v,'historical recipe changed: '+k);
const fresh=new Set(ORGANIC_V66.items.map(x=>x.id));
for(const [a,b,c] of ORGANIC_V66.recipes){const k=[a,b].sort().join('|');assert(!base.recipes.has(k),'occupied recipe '+k);assert(now.recipes.get(k)===c&&fresh.has(c),'incorrect new recipe '+k);}
const unlocked=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let change=true;
while(change){change=false;for(const [k,v] of now.recipes){const [a,b]=k.split('|');if(unlocked.has(a)&&unlocked.has(b)&&!unlocked.has(v)){unlocked.add(v);change=true;}}}
assert(unlocked.size===now.items.length,'unreachable: '+(now.items.length-unlocked.size));
const m=JSON.parse(readFileSync('shared/v66-approved.json','utf8'));
assert(m.new_items.length===14&&m.redrawn_v61.length===20,'manifest counts');
const redone=new Set([...JSON.parse(readFileSync('shared/v63-approved.json','utf8')).redrawn_v61,...JSON.parse(readFileSync('shared/v65-approved.json','utf8')).redrawn_v61].map(x=>x.name));
const previous=new Map(JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons.map(x=>[x.name,x]));
let hashes=new Set();
for(const e of [...m.new_items,...m.redrawn_v61]){
 const svg=readFileSync(e.path,'utf8'); const h=createHash('sha256').update(svg).digest('hex');
 assert(h===e.sha256&&!hashes.has(h),'art hash mismatch or duplicate '+e.name); hashes.add(h);
 assert(ORGANIC_ART_V66[e.name.toLowerCase()]===svg,'runtime art mismatch '+e.name);
 assert(e.art_mode==='bespoke-silhouette','non bespoke '+e.name);
 assert(!/<script|<image\b|<text\b|<foreignObject|onload=|href=|<animate/i.test(svg),'unsafe svg '+e.name);
}
for(const e of m.redrawn_v61)assert(previous.get(e.name)?.id===e.id&&previous.get(e.name)?.art_mode==='motif-composite'&&!redone.has(e.name),'invalid redraw '+e.name);
const app=readFileSync('client/src/app.js','utf8');
assert(app.includes('ORGANIC_V65,ORGANIC_V66,'),'V66 runtime content missing');
assert(app.includes('ORGANIC_ART_V66[itemName]||ORGANIC_ART_V65[itemName]'),'V66 art not prioritized');
if(!process.argv.includes('--quiet'))console.log(`V66 VALID ${now.items.length} elements / ${now.recipes.size} recipes, 14 new and 20 redraws, all reachable`);
