import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V65} from '../client/src/organic-pack-v65.js';
import {ORGANIC_V66} from '../client/src/organic-pack-v66.js';
import {ORGANIC_V67} from '../client/src/organic-pack-v67.js';
import {ORGANIC_ART_V67} from '../client/src/organic-art-v67.js';
const versionNames=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63'];
const packs=[PACK];for(const n of versionNames){const f=n.replace('gaming','gaming-pack').replace('organic','organic-pack');const m=await import('../client/src/'+f+'.js');packs.push(Object.values(m)[0]);}
const before=buildCatalog(DATA,[...packs,ORGANIC_V65,ORGANIC_V66]);
const after=buildCatalog(DATA,[...packs,ORGANIC_V65,ORGANIC_V66,ORGANIC_V67]);
const ok=(cond,msg)=>{if(!cond)throw Error('V67: '+msg)};
ok(before.items.length===5150 && before.recipes.size===13487,'baseline drift');
ok(ORGANIC_V67.items.length===12&&ORGANIC_V67.recipes.length===12,'unexpected new count');
ok(after.items.length===5162&&after.recipes.size===13499,'totals differ');
ok(new Set(after.items.map(e=>e.id)).size===after.items.length,'duplicate IDs');
ok(new Set(after.items.map(e=>normalizeCatalogName(e.name))).size===after.items.length,'duplicate names');
for(const [pair,result] of before.recipes)ok(after.recipes.get(pair)===result,'prior recipe changed '+pair);
for(const [a,b,c] of ORGANIC_V67.recipes){const pair=[a,b].sort().join('|');ok(!before.recipes.has(pair)&&after.recipes.get(pair)===c,'occupied or changed '+pair);}
// buildCatalog automatically validates reachability from Water, Fire, Earth, Air.
const manifest=JSON.parse(readFileSync('shared/v67-approved.json','utf8'));
ok(manifest.new_items.length===12&&manifest.redrawn_v61.length===24,'manifest counts');
const previous=new Map(JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons.map(x=>[x.name,x]));
const already=new Set();for(const v of [63,65,66]){for(const item of JSON.parse(readFileSync(`shared/v${v}-approved.json`,'utf8')).redrawn_v61)already.add(item.name);}
const hashes=new Set();
for(const e of [...manifest.new_items,...manifest.redrawn_v61]){
 const svg=readFileSync(e.path,'utf8'),h=createHash('sha256').update(svg).digest('hex');
 ok(h===e.sha256 && !hashes.has(h),'mismatched/duplicate art '+e.name);hashes.add(h);
 ok(ORGANIC_ART_V67[e.name.toLowerCase()]===svg,'source/runtime art mismatch '+e.name);
 ok(e.art_mode==='bespoke-silhouette','generic art mode '+e.name);
 ok(!/<script|<image\b|<text\b|<foreignObject|onload\s*=|href\s*=|<animate/i.test(svg),'unsafe SVG '+e.name);
}
for(const e of manifest.redrawn_v61)ok(previous.get(e.name)?.id===e.id&&!already.has(e.name),'invalid redraw '+e.name);
const app=readFileSync('client/src/app.js','utf8');ok(app.includes('ORGANIC_V66,ORGANIC_V67')&&app.includes('ORGANIC_ART_V67[itemName]||ORGANIC_ART_V66[itemName]'),'runtime modules missing/priority incorrect');
if(!process.argv.includes('--quiet'))console.log(`V67 VALID ${after.items.length} elements, ${after.recipes.size} pairs, 12 new and 24 redrawn; previous recipes unchanged.`);
