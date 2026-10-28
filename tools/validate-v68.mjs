import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V65} from '../client/src/organic-pack-v65.js';
import {ORGANIC_V66} from '../client/src/organic-pack-v66.js';
import {ORGANIC_V67} from '../client/src/organic-pack-v67.js';
import {ORGANIC_V68} from '../client/src/organic-pack-v68.js';
import {ORGANIC_ART_V68} from '../client/src/organic-art-v68.js';
const versionNames=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63'];
const packs=[PACK];for(const n of versionNames){const f=n.replace('gaming','gaming-pack').replace('organic','organic-pack');const m=await import('../client/src/'+f+'.js');packs.push(Object.values(m)[0]);}
const prev=buildCatalog(DATA,[...packs,ORGANIC_V65,ORGANIC_V66,ORGANIC_V67]);
const after=buildCatalog(DATA,[...packs,ORGANIC_V65,ORGANIC_V66,ORGANIC_V67,ORGANIC_V68]);
const ok=(p,msg)=>{if(!p)throw Error(`V68 ${msg}`)};
ok(prev.items.length===5162&&prev.recipes.size===13499,'V67 baseline drift');
ok(ORGANIC_V68.items.length===10&&ORGANIC_V68.recipes.length===10,'new count');
ok(after.items.length===5172&&after.recipes.size===13509,'totals');
ok(new Set(after.items.map(e=>e.id)).size===after.items.length,'duplicate IDs');
ok(new Set(after.items.map(e=>normalizeCatalogName(e.name))).size===after.items.length,'duplicate names');
for(const [k,v] of prev.recipes)ok(after.recipes.get(k)===v,'prior result changed '+k);
const newIds=new Set(ORGANIC_V68.items.map(e=>e.id));const seen=new Set();
for(const [a,b,c] of ORGANIC_V68.recipes){const pair=[a,b].sort().join('|');ok(!seen.has(pair)&&!prev.recipes.has(pair),'reused pair '+pair);seen.add(pair);ok(newIds.has(c)&&after.recipes.get(pair)===c,'result invalid '+pair);}
const manifest=JSON.parse(readFileSync('shared/v68-approved.json','utf8'));
ok(manifest.new_items.length===10&&manifest.redrawn_v61.length===24,'manifest counts');
const old61=new Map(JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons.map(e=>[e.name,e.id]));
const used=new Set();for(const v of [63,65,66,67])for(const e of JSON.parse(readFileSync(`shared/v${v}-approved.json`,'utf8')).redrawn_v61)used.add(e.name);
const hashes=new Set();
for(const e of [...manifest.new_items,...manifest.redrawn_v61]){
 const svg=readFileSync(e.path,'utf8');const hash=createHash('sha256').update(svg).digest('hex');
 ok(hash===e.sha256&&!hashes.has(hash),'art missing, changed or exact duplicate '+e.name);hashes.add(hash);
 ok(ORGANIC_ART_V68[e.name.toLowerCase()]===svg,'runtime art differs '+e.name);
 ok(e.art_mode==='bespoke-silhouette','generic art mode');ok(!/<script|<image\b|<text\b|<foreignObject|onload\s*=|href\s*=|<animate/i.test(svg),'unsafe svg');
}
for(const e of manifest.redrawn_v61)ok(old61.get(e.name)===e.id&&!used.has(e.name),'redraw invalid '+e.name);
const app=readFileSync('client/src/app.js','utf8');ok(app.includes('ORGANIC_V67,ORGANIC_V68])')&&app.includes('ORGANIC_ART_V68[itemName]||ORGANIC_ART_V67[itemName]'),'runtime priority broken');
if(!process.argv.includes('--quiet'))console.log('V68 VALID 5,172 elements, 13,509 recipes, 10 new, 24 redrawn.');
