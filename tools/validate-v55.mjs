#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {ORGANIC_V55} from '../client/src/organic-pack-v55.js';
import {ORGANIC_ART_V55} from '../client/src/organic-art-v55.js';
import {buildCatalog} from '../client/src/catalog-integrity.js';
const paths=['gaming-pack-v22','gaming-pack-v23','gaming-pack-v24','gaming-pack-v26','gaming-pack-v27','gaming-pack-v30','organic-pack-v32','organic-pack-v34','organic-pack-v37','organic-pack-v38','organic-pack-v40','organic-pack-v41','organic-pack-v42','organic-pack-v43','organic-pack-v44','organic-pack-v45','organic-pack-v46','organic-pack-v47','organic-pack-v50','organic-pack-v52','organic-pack-v53'];
const packs=[PACK];for(const path of paths)packs.push(Object.values(await import(`../client/src/${path}.js`))[0]);
const old=buildCatalog(DATA,packs),now=buildCatalog(DATA,[...packs,ORGANIC_V55]);
const errors=[];function assert(c,msg){if(!c)errors.push(msg);}
assert(old.items.length===4071&&old.recipes.size===12285,'V54 baseline changed');
assert(ORGANIC_V55.items.length===100,'Must have 100 new unique elements');
assert(now.items.length===4171&&now.recipes.size===12461,'V55 totals differ from 100 / 176 additions');
assert(new Set(ORGANIC_V55.items.map(i=>i.name.toLowerCase())).size===100,'New names duplicate');
for(const [k,v] of old.recipes)assert(now.recipes.get(k)===v,'Older combination changed '+k);
const targetIds=new Set(ORGANIC_V55.items.map(x=>x.id));
const outputs=new Map();
for(const recipe of ORGANIC_V55.recipes){
 const [a,b,out]=recipe;assert(targetIds.has(out),'V55 recipe outputs existing element '+out);
 outputs.set(out,(outputs.get(out)||0)+1);
 assert(a!==out&&b!==out,'Output requires itself '+out);
}
const manifest=JSON.parse(readFileSync('shared/v55-art-manifest.json'));
const entries=new Map(manifest.icons.map(x=>[x.id,x]));
assert(manifest.icons.length===100,'V55 icon manifest length');
assert(Object.keys(ORGANIC_ART_V55).length===100,'V55 SVG coverage');
assert(new Set(Object.values(ORGANIC_ART_V55)).size===100,'Duplicate V55 SVG artworks');
for(const item of ORGANIC_V55.items){
 assert(outputs.get(item.id)>=1,'No new result recipe '+item.name);
 const entry=entries.get(item.id),svg=ORGANIC_ART_V55[item.name.toLowerCase()];
 assert(entry&&svg?.startsWith('<svg')&&svg.endsWith('</svg>'),'Missing icon '+item.name);
 if(entry&&svg){
  const actual=readFileSync(entry.path,'utf8');
  assert(actual===svg,'SVG not in sync '+item.name);
  assert(createHash('sha256').update(svg).digest('hex')===entry.sha256,'SVG hash wrong '+item.name);
  assert(!/<script|<image\b|<foreignObject|onload=|href=|<animate/i.test(svg),'Unsafe external asset '+item.name);
 }
}
const discovered=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
let changed=true;while(changed){changed=false;for(const [pair,result] of now.recipes){if(discovered.has(result))continue;const [a,b]=pair.split('|');if(discovered.has(a)&&discovered.has(b)){discovered.add(result);changed=true;}}}
assert(discovered.size===now.items.length,`${now.items.length-discovered.size} unreachable elements`);
const frontend=readFileSync('client/src/app.js','utf8'),html=readFileSync('client/index.html','utf8');
assert(html.includes('id="recentBtn" class="filter-pill sort-button"'),'Old Recent UI still visible');
assert(frontend.includes("['az','A–Z'")&&frontend.includes("['old','Old first'")&&frontend.includes("['new','New first'"),'Sort choices missing');
assert(frontend.includes("localStorage.setItem(SORT_KEY,sortChoice)"),'Sort selection not persisted');
if(errors.length){console.error(errors.slice(0,30).join('\n'));process.exit(1);}
if(!process.argv.includes('--quiet'))console.log(`V55 PASS: ${now.items.length} items, ${now.recipes.size} deterministic recipes, 100 unique SVGs, no unreachable items; 3 Sort choices`);
