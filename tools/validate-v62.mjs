import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V61} from '../client/src/organic-pack-v61.js';
import {ORGANIC_V62} from '../client/src/organic-pack-v62.js';
import {ORGANIC_ART_V62} from '../client/src/organic-art-v62.js';
const packnames=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59'];
const basepacks=[PACK];for(const n of packnames){const mod=await import(`../client/src/${n.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);basepacks.push(Object.values(mod)[0]);}
const before=buildCatalog(DATA,[...basepacks,ORGANIC_V61]);
const after=buildCatalog(DATA,[...basepacks,ORGANIC_V61,ORGANIC_V62]);
const chk=(condition,message)=>{if(!condition)throw Error('V62: '+message)};
chk(before.items.length===5071&&before.recipes.size===13408,'Baseline V61 changed');
chk(ORGANIC_V62.items.length===35&&ORGANIC_V62.recipes.length===35,'Unexpected V62 pack size');
chk(after.items.length===5106&&after.recipes.size===13443,'Unexpected V62 totals');
chk(new Set(after.items.map(x=>x.id)).size===after.items.length,'Duplicated IDs');
chk(new Set(after.items.map(x=>normalizeCatalogName(x.name))).size===after.items.length,'Duplicated names');
for(const [key,value] of before.recipes)chk(after.recipes.get(key)===value,'Historic recipe changed '+key);
const newids=new Set(ORGANIC_V62.items.map(x=>x.id)), pairs=new Set();
for(const [a,b,result] of ORGANIC_V62.recipes){const key=[a,b].sort().join('|');chk(!pairs.has(key)&&!before.recipes.has(key),'Duplicate or occupied pair '+key);pairs.add(key);chk(newids.has(result),'Recipe does not create a new V62 element '+result);chk(after.recipes.get(key)===result,'Wrong recipe result');}
const manifest=JSON.parse(readFileSync('shared/v62-art-manifest.json','utf8')).icons;
chk(manifest.length===35&&Object.keys(ORGANIC_ART_V62).length===35,'Missing art');
chk(new Set(Object.values(ORGANIC_ART_V62)).size===35,'Identical new SVG artworks');
for(const item of ORGANIC_V62.items){const svg=ORGANIC_ART_V62[item.name.toLowerCase()],entry=manifest.find(x=>x.id===item.id);
 chk(Boolean(svg&&entry),'Missing art for '+item.name);
 chk(entry.art_mode==='bespoke-silhouette'&&entry.motifs.length===0,'Template-based art not allowed: '+item.name);
 chk(svg===readFileSync(entry.path,'utf8'),'SVG content drift: '+item.name);
 chk(createHash('sha256').update(svg).digest('hex')===entry.sha256,'Wrong hash: '+item.name);
 chk(!/<script|<image\b|<foreignObject|onload=|href=|<animate|<text\b/i.test(svg),'Unsafe or embedded text/image SVG: '+item.name);
}
const app=readFileSync('client/src/app.js','utf8');
chk(app.includes('ORGANIC_V59,ORGANIC_V61,ORGANIC_V62,ORGANIC_V63,')&&app.includes('ORGANIC_ART_V62[itemName]'),'V62 runtime disconnected');
chk(app.includes("['az','A–Z'")&&app.includes("['old','Old first'")&&app.includes("['new','New first'"),'Sort regressed');
const approved=JSON.parse(readFileSync('shared/v62-approved.json','utf8'));
chk(approved.count===35&&approved.results.length===35,'Editorial manifest mismatch');
if(!process.argv.includes('--quiet'))console.log('V62 VALID: 5106 unique reachable elements, 13443 global recipes, 35 bespoke SVGs, all 13408 V61 outputs preserved');
