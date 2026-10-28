#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { DATA } from '../client/src/legacy-data.js';
import { PACK } from '../client/src/creative-pack.js';
import { buildCatalog, normalizeCatalogName } from '../client/src/catalog-integrity.js';
import { ORGANIC_V55 } from '../client/src/organic-pack-v55.js';
import { ORGANIC_V56 } from '../client/src/organic-pack-v56.js';
import { ORGANIC_V57 } from '../client/src/organic-pack-v57.js';
import { ORGANIC_ART_V57 } from '../client/src/organic-art-v57.js';
const mod=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53'];
const packs=[PACK];for(const n of mod)packs.push(Object.values(await import('../client/src/'+n.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js'))[0]);
const old=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56]);
const full=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57]);
const assert=(c,m)=>{if(!c)throw Error(m)};
assert(old.items.length===4271&&old.recipes.size===12608,'V56 source changed');
assert(ORGANIC_V57.items.length===200&&ORGANIC_V57.recipes.length===200,'V57 exactly 200 new items + recipes');
assert(full.items.length===4471&&full.recipes.size===12808,'Wrong final totals');
assert(new Set(full.items.map(x=>x.id)).size===4471,'Duplicated ID');
assert(new Set(full.items.map(x=>normalizeCatalogName(x.name))).size===4471,'Duplicated normalized name');
for(const [k,out] of old.recipes)assert(full.recipes.get(k)===out,'Previous result mutated '+k);
const ids=new Set(ORGANIC_V57.items.map(x=>x.id));const pairs=new Set();const count=new Map();
for(const [a,b,out] of ORGANIC_V57.recipes){
  const k=[a,b].sort().join('|');assert(!pairs.has(k)&&!old.recipes.has(k),'Repeated unordered pair '+k);pairs.add(k);
  assert(ids.has(out),'Not a newly introduced output '+out);
  assert(full.recipes.get(k)===out&&a!==out&&b!==out,'Bad recipe '+k);count.set(out,(count.get(out)||0)+1);
}
const manifest=JSON.parse(readFileSync('shared/v57-art-manifest.json','utf8')).icons;
assert(manifest.length===200&&Object.keys(ORGANIC_ART_V57).length===200,'Missing SVGs');
assert(new Set(Object.values(ORGANIC_ART_V57)).size===200,'Duplicated SVG');
for(const item of ORGANIC_V57.items){
 assert(count.get(item.id)>0,'No recipe '+item.name);
 const svg=ORGANIC_ART_V57[item.name.toLowerCase()],entry=manifest.find(x=>x.id===item.id);
 assert(entry&&svg?.startsWith('<svg')&&svg.endsWith('</svg>'),'Missing SVG '+item.name);
 assert(readFileSync(entry.file,'utf8')===svg,'SVG file mismatch '+item.name);
 assert(createHash('sha256').update(svg).digest('hex')===entry.sha256,'SVG hash mismatch '+item.name);
 assert(!/<script|<image\b|<foreignObject|onload=|href=|<animate/i.test(svg),'Unsafe SVG '+item.name);
}
const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let more=true;
while(more){more=false;for(const [key,out] of full.recipes){if(reached.has(out))continue;const[a,b]=key.split('|');if(reached.has(a)&&reached.has(b)){reached.add(out);more=true;}}}
assert(reached.size===full.items.length,'Unreachable items '+(full.items.length-reached.size));
const app=readFileSync('client/src/app.js','utf8');
assert(app.includes('ORGANIC_V56,ORGANIC_V57,')&&app.includes('ORGANIC_ART_V57[itemName]'),'Pack not imported into runtime');
assert(app.includes("['az','A–Z'")&&app.includes("['old','Old first'")&&app.includes("['new','New first'"),'Sort missing');
if(!process.argv.includes('--quiet'))console.log(`V57 PASS: ${full.items.length} elements, ${full.recipes.size} unique unordered recipes, 200 new results, 200 SVGs, all reachable, history immutable`);
