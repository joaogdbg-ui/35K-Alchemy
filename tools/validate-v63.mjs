import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V61} from '../client/src/organic-pack-v61.js';
import {ORGANIC_V62} from '../client/src/organic-pack-v62.js';
import {ORGANIC_V63} from '../client/src/organic-pack-v63.js';
import {ORGANIC_ART_V63} from '../client/src/organic-art-v63.js';
const names=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59'];
const packs=[PACK];for(const n of names){const mod=await import(`../client/src/${n.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);packs.push(Object.values(mod)[0]);}
const old=buildCatalog(DATA,[...packs,ORGANIC_V61,ORGANIC_V62]);
const cat=buildCatalog(DATA,[...packs,ORGANIC_V61,ORGANIC_V62,ORGANIC_V63]);
const fail=(c,message)=>{if(!c)throw Error('V63: '+message)};
fail(old.items.length===5106&&old.recipes.size===13443,'V62 baseline changed');
fail(ORGANIC_V63.items.length===18&&ORGANIC_V63.recipes.length===18,'Unexpected new content count');
fail(cat.items.length===5124&&cat.recipes.size===13461,'Unexpected catalog totals');
fail(new Set(cat.items.map(e=>e.id)).size===cat.items.length,'Duplicate IDs');
fail(new Set(cat.items.map(e=>normalizeCatalogName(e.name))).size===cat.items.length,'Duplicate normalized names');
for(const [key,id] of old.recipes)fail(cat.recipes.get(key)===id,'Historic recipe changed '+key);
const ids=new Set(ORGANIC_V63.items.map(e=>e.id));const pairs=new Set();
for(const [a,b,c] of ORGANIC_V63.recipes){const key=[a,b].sort().join('|');fail(!old.recipes.has(key)&&!pairs.has(key),'Occupied/repeated pair '+key);pairs.add(key);fail(ids.has(c),'New recipe does not produce new element');fail(cat.recipes.get(key)===c,'New recipe missing '+key);}
const unlocked=new Set(cat.items.slice(0,4).map(x=>x.id));let changed=true;
while(changed){changed=false;for(const [key,c] of cat.recipes){const [a,b]=key.split('|');if(unlocked.has(a)&&unlocked.has(b)&&!unlocked.has(c)){unlocked.add(c);changed=true;}}}
fail(unlocked.size===cat.items.length,`Unreachable elements ${cat.items.length-unlocked.size}`);
const manifests=JSON.parse(readFileSync('shared/v63-approved.json','utf8'));
fail(manifests.new_items.length===18&&manifests.redrawn_v61.length===20,'Incorrect art manifests');
const old61=JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons;
const former=new Map(old61.map(a=>[a.name,a]));
const hashes=new Set();
for(const entry of [...manifests.new_items,...manifests.redrawn_v61]){
 const svg=readFileSync(entry.path,'utf8');
 fail(ORGANIC_ART_V63[entry.name.toLowerCase()]===svg,'Runtime art drift '+entry.name);
 fail(!/<script|<image\b|<text\b|<foreignObject|onload=|href=|<animate/i.test(svg),'Unsafe SVG '+entry.name);
 const sha=createHash('sha256').update(svg).digest('hex');fail(sha===entry.sha256,'Art hash mismatch '+entry.name);fail(!hashes.has(sha),'Duplicate art '+entry.name);hashes.add(sha);
 fail(entry.art_mode==='bespoke-silhouette','Non bespoke art '+entry.name);
}
for(const entry of manifests.redrawn_v61)fail(former.get(entry.name)?.art_mode==='motif-composite'&&entry.id===former.get(entry.name).id,'Invalid historic art override '+entry.name);
const app=readFileSync('client/src/app.js','utf8');
fail(app.includes('ORGANIC_V61,ORGANIC_V62,ORGANIC_V63,'),'V63 recipe pack not in runtime');
fail(app.includes('ORGANIC_ART_V63[itemName]||ORGANIC_ART_V62[itemName]'),'Redrawn legacy override not first');
fail(app.includes('eligibleFamilyMerge'),'Merge unchanged / unavailable');
if(!process.argv.includes('--quiet'))console.log(`V63 VALID ${cat.items.length} elements ${cat.recipes.size} recipes; 18 new subject icons, 20 V61 legacy redraws; historic recipes immutable; fully reachable`);
