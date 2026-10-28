#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V55} from '../client/src/organic-pack-v55.js';
import {ORGANIC_V56} from '../client/src/organic-pack-v56.js';
import {ORGANIC_V57} from '../client/src/organic-pack-v57.js';
import {ORGANIC_V58} from '../client/src/organic-pack-v58.js';
import {ORGANIC_ART_V58} from '../client/src/organic-art-v58.js';
const mod=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53'];
const packs=[PACK];for(const n of mod)packs.push(Object.values(await import('../client/src/'+n.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js'))[0]);
const before=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57]);
const after=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57,ORGANIC_V58]);
function check(ok,message){if(!ok)throw Error(message)}
check(before.items.length===4471&&before.recipes.size===12808,'Historical V57 count mutated');
check(ORGANIC_V58.items.length===200&&ORGANIC_V58.recipes.length===200,'Expected 200 new items and recipes');
check(after.items.length===4671&&after.recipes.size===13008,'Unexpected V58 catalog totals');
check(new Set(after.items.map(i=>i.id)).size===4671,'Duplicate IDs');
check(new Set(after.items.map(i=>normalizeCatalogName(i.name))).size===4671,'Duplicate normalized names');
for(const [key,value] of before.recipes)check(after.recipes.get(key)===value,'Previous recipe mutated '+key);
const newIds=new Set(ORGANIC_V58.items.map(i=>i.id));const seen=new Set();const artManifest=JSON.parse(readFileSync('shared/v58-art-manifest.json','utf8')).icons;
check(artManifest.length===200&&Object.keys(ORGANIC_ART_V58).length===200,'Missing art');
check(new Set(Object.values(ORGANIC_ART_V58)).size===200,'Same SVG used for two outputs');
for(const [a,b,out] of ORGANIC_V58.recipes){const k=[a,b].sort().join('|');check(!seen.has(k)&&!before.recipes.has(k),'Recipe collision '+k);seen.add(k);check(newIds.has(out)&&a!==out&&b!==out,'Recipe not a new discovery');check(after.recipes.get(k)===out,'Pair output mismatch');}
for(const item of ORGANIC_V58.items){const entry=artManifest.find(x=>x.id===item.id);const svg=ORGANIC_ART_V58[item.name.toLowerCase()];check(entry&&svg?.startsWith('<svg')&&svg.endsWith('</svg>'),'Missing SVG '+item.name);check(readFileSync(entry.file,'utf8')===svg,'Incorrect SVG file '+item.name);check(createHash('sha256').update(svg).digest('hex')===entry.sha256,'Bad SVG checksum '+item.name);check(!/<script|<image\b|<foreignObject|onload=|href=|<animate/i.test(svg),'Unsafe SVG '+item.name);}
const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let changed=true;
while(changed){changed=false;for(const [key,out] of after.recipes){if(reached.has(out))continue;const [a,b]=key.split('|');if(reached.has(a)&&reached.has(b)){reached.add(out);changed=true;}}}
check(reached.size===after.items.length,'Unreachable elements '+(after.items.length-reached.size));
const ui=readFileSync('client/src/app.js','utf8');check(ui.includes('ORGANIC_V57,ORGANIC_V58,')&&ui.includes('ORGANIC_ART_V58[itemName]'),'V58 not integrated into app');
check(ui.includes("['az','A–Z'")&&ui.includes("['old','Old first'")&&ui.includes("['new','New first'"),'Sort regressed');
const plan=JSON.parse(readFileSync('shared/v58-editorial-plan.json','utf8'));
check(plan.results.length===200&&new Set(plan.results.map(r=>r.name.toLowerCase())).size===200,'Plan invalid');
const domains=new Set(plan.results.map(r=>r.branch));check(domains.size===9,'Expected nine editorial branches');
if(!process.argv.includes('--quiet'))console.log('V58 PASS: 4671 items, 13008 recipes, 200 brand new discoveries and 200 unique SVGs; 0 duplicates and 0 unreachable');
