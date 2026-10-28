#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog, normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V55} from '../client/src/organic-pack-v55.js';
import {ORGANIC_V56} from '../client/src/organic-pack-v56.js';
import {ORGANIC_ART_V56} from '../client/src/organic-art-v56.js';
const mod=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53'];
const packs=[PACK];for(const n of mod){packs.push(Object.values(await import('../client/src/'+n.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js'))[0]);}
const old=buildCatalog(DATA,[...packs,ORGANIC_V55]);const next=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56]);
function assert(ok,msg){if(!ok)throw new Error(msg);}
assert(old.items.length===4171&&old.recipes.size===12461,'V55 baseline changed');
assert(ORGANIC_V56.items.length===100,'100 new elements required');
assert(next.items.length===4271&&next.recipes.size===12608,'V56 counts changed');
assert(new Set(next.items.map(x=>x.id)).size===next.items.length,'Duplicate identifiers');
assert(new Set(next.items.map(x=>normalizeCatalogName(x.name))).size===next.items.length,'Duplicate normalised names');
for(const [k,v] of old.recipes)assert(next.recipes.get(k)===v,'Older deterministic recipe changed '+k);
const newIds=new Set(ORGANIC_V56.items.map(x=>x.id));const routeCount=new Map();const keys=new Set();
for(const [a,b,out] of ORGANIC_V56.recipes){
 assert(newIds.has(out),'V56 recipe does not unlock a new element: '+out);
 assert(a!==out&&b!==out,'Recipe requires its own output: '+out);
 const k=[a,b].sort().join('|');assert(!keys.has(k),'Repeated unordered pair '+k);keys.add(k);
 assert(next.recipes.get(k)===out,'Unexpected unordered recipe result '+k);
 routeCount.set(out,(routeCount.get(out)||0)+1);
}
const entries=JSON.parse(readFileSync('shared/v56-art-manifest.json')).icons;
assert(entries.length===100,'100 icon entries required');
assert(Object.keys(ORGANIC_ART_V56).length===100,'100 SVG assets required');
assert(new Set(Object.values(ORGANIC_ART_V56)).size===100,'Duplicate SVG artwork');
for(const item of ORGANIC_V56.items){
 assert(routeCount.get(item.id)>=1,'Undiscoverable V56 result '+item.name);
 const meta=entries.find(x=>x.id===item.id),svg=ORGANIC_ART_V56[item.name.toLowerCase()];
 assert(meta&&svg?.startsWith('<svg')&&svg.endsWith('</svg>'),'Missing art '+item.name);
 assert(svg===readFileSync(meta.path,'utf8'),'Artwork mismatch '+item.name);
 assert(createHash('sha256').update(svg).digest('hex')===meta.sha256,'Checksum mismatch '+item.name);
 assert(!/<script|<image\b|<foreignObject|onload=|href=|<animate/i.test(svg),'Untrusted SVG '+item.name);
}
const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let more=true;
while(more){more=false;for(const [pair,out] of next.recipes){if(reached.has(out))continue;const [a,b]=pair.split('|');if(reached.has(a)&&reached.has(b)){reached.add(out);more=true;}}}
assert(reached.size===next.items.length,'Some elements unreachable: '+(next.items.length-reached.size));
const ui=readFileSync('client/src/app.js','utf8');assert(ui.includes('ORGANIC_V55,ORGANIC_V56,')&&ui.includes('ORGANIC_ART_V56[itemName]'),'V56 pack missing from game');
assert(ui.includes('ORGANIC_ART_V56[itemName]'),'V56 artwork missing from renderer');
assert(ui.includes("['az','A–Z'")&&ui.includes("['old','Old first'")&&ui.includes("['new','New first'"),'Sort regression');
if(!process.argv.includes('--quiet'))console.log(`V56 PASS: ${next.items.length} unique elements; ${next.recipes.size} deterministic recipes; ${ORGANIC_V56.items.length} new results, ${ORGANIC_V56.recipes.length} new recipes, 100 verified art assets`);
