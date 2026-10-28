#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { DATA } from '../client/src/legacy-data.js';
import { PACK } from '../client/src/creative-pack.js';
import { buildCatalog,normalizeCatalogName } from '../client/src/catalog-integrity.js';
import { ORGANIC_V55 } from '../client/src/organic-pack-v55.js';
import { ORGANIC_V56 } from '../client/src/organic-pack-v56.js';
import { ORGANIC_V57 } from '../client/src/organic-pack-v57.js';
import { ORGANIC_V58 } from '../client/src/organic-pack-v58.js';
import { ORGANIC_V61 } from '../client/src/organic-pack-v61.js';
import { ORGANIC_V59 } from '../client/src/organic-pack-v59.js';
import { ORGANIC_ART_V61 } from '../client/src/organic-art-v61.js';
const names=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53'];
const packs=[PACK];for(const n of names)packs.push(Object.values(await import('../client/src/'+n.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js'))[0]);
const before=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57,ORGANIC_V58,ORGANIC_V59]);
const after=buildCatalog(DATA,[...packs,ORGANIC_V55,ORGANIC_V56,ORGANIC_V57,ORGANIC_V58,ORGANIC_V59,ORGANIC_V61]);
function chk(c,msg){if(!c)throw new Error(msg)}
chk(before.items.length===4871&&before.recipes.size===13208,'V60 baseline changed');
chk(ORGANIC_V61.items.length===200&&ORGANIC_V61.recipes.length===200,'V61 pack count');
chk(after.items.length===5071&&after.recipes.size===13408,'V61 totals');
chk(new Set(after.items.map(x=>x.id)).size===5071,'Duplicate ID');
chk(new Set(after.items.map(x=>normalizeCatalogName(x.name))).size===5071,'Duplicate normalized names');
for(const [key,out] of before.recipes)chk(after.recipes.get(key)===out,'Historical recipe changed '+key);
const ids=new Set(ORGANIC_V61.items.map(x=>x.id));const seen=new Set();
const entries=JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons;
chk(entries.length===200&&Object.keys(ORGANIC_ART_V61).length===200,'Missing art manifest');
chk(new Set(Object.values(ORGANIC_ART_V61)).size===200,'Duplicated SVG');
for(const [a,b,result] of ORGANIC_V61.recipes){
 const key=[a,b].sort().join('|');
 chk(!seen.has(key)&&!before.recipes.has(key),'Occupied or duplicate unordered pair '+key);seen.add(key);
 chk(ids.has(result),'Not a V61 discovery '+result);chk(after.recipes.get(key)===result,'Wrong result');
}
for(const item of ORGANIC_V61.items){
 const entry=entries.find(e=>e.id===item.id), art=ORGANIC_ART_V61[item.name.toLowerCase()];
 chk(entry&&art&&art.startsWith('<svg')&&art.endsWith('</svg>'),'Missing art '+item.name);
 chk(readFileSync(entry.path,'utf8')===art,'Art differs from file '+item.name);
 chk(createHash('sha256').update(art).digest('hex')===entry.sha256,'Art hash mismatch '+item.name);
 chk(!/<script|<image\b|<foreignObject|onload=|href=|<animate/i.test(art),'Unsafe SVG '+item.name);
}
const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let changed=true;
while(changed){changed=false;for(const [key,out] of after.recipes){if(reached.has(out))continue;const [a,b]=key.split('|');if(reached.has(a)&&reached.has(b)){reached.add(out);changed=true}}}
chk(reached.size===after.items.length,'Unreachable items: '+(after.items.length-reached.size));
const app=readFileSync('client/src/app.js','utf8');
chk(app.includes('ORGANIC_V58,ORGANIC_V59,ORGANIC_V61,ORGANIC_V62,ORGANIC_V63,')&&app.includes('ORGANIC_ART_V61[itemName]'),'New pack not wired into app');
chk(app.includes("['az','A–Z'")&&app.includes("['old','Old first'")&&app.includes("['new','New first'"),'Sort regressed');
const plan=JSON.parse(readFileSync('shared/v61-approved-200.json','utf8'));
chk(plan.results.length===200&&new Set(plan.results.map(x=>x.name.toLowerCase())).size===200,'Plan invalid');
chk(new Set(plan.results.map(x=>x.branch)).size===10,'Not ten thematic branches');
if(!process.argv.includes('--quiet'))console.log('V61 VALID: 5071 unique reachable items, 13408 unique recipes, 200 SVGs, all historical results preserved');
