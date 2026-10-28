import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog} from '../client/src/catalog-integrity.js';
import {ORGANIC_V65} from '../client/src/organic-pack-v65.js';
import {ORGANIC_V66} from '../client/src/organic-pack-v66.js';
import {ORGANIC_V67} from '../client/src/organic-pack-v67.js';
import {ORGANIC_V68} from '../client/src/organic-pack-v68.js';
import {ORGANIC_ART_V70} from '../client/src/organic-art-v70.js';
const assert=(pass,msg)=>{if(!pass)throw new Error('V70: '+msg)};
const manifest=JSON.parse(readFileSync('shared/v70-approved.json','utf8'));
const orig=JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons;
const used=new Set();for(const v of [63,65,66,67,68,69])for(const e of JSON.parse(readFileSync(`shared/v${v}-approved.json`,'utf8')).redrawn_v61)used.add(e.name);
const remaining=orig.filter(e=>e.art_mode==='motif-composite'&&!used.has(e.name));
assert(remaining.length===14,'legacy motif backlog before V70 must be 14');
assert(manifest.new_items.length===0,'no new elements in art clean-up');
assert(manifest.redrawn_v61.length===14,'exactly 14 redraws');
const sources=new Map(remaining.map(e=>[e.name,e.id]));
const unique=new Set(),hashes=new Set();
for(const e of manifest.redrawn_v61){
 assert(!unique.has(e.name),'duplicate redraw'); unique.add(e.name);
 assert(sources.get(e.name)===e.id,'source ID changed: '+e.name);
 const svg=readFileSync(e.path,'utf8');
 assert(createHash('sha256').update(svg).digest('hex')===e.sha256,'asset fingerprint changed: '+e.name);
 assert(!hashes.has(e.sha256),'duplicate visual asset SHA');hashes.add(e.sha256);
 assert(e.art_mode==='bespoke-silhouette'&&svg.includes('viewBox="0 0 100 100"'),'invalid SVG art mode');
 assert(!/<script|<image\b|<text\b|<foreignObject|onload\s*=|href\s*=|<animate/i.test(svg),'unsafe SVG');
 assert(ORGANIC_ART_V70[e.name.toLowerCase()]===svg,'embedded image does not match SVG: '+e.name);
}
assert(unique.size===14 && remaining.every(e=>unique.has(e.name)),'unresolved original motif icon');
assert(Object.keys(ORGANIC_ART_V70).length===14,'unexpected runtime asset count');
const packs=[PACK];for(const n of ['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63']){
 const f=n.replace('gaming','gaming-pack').replace('organic','organic-pack');const x=await import('../client/src/'+f+'.js');packs.push(Object.values(x)[0]);
}
const cur=buildCatalog(DATA,[...packs,ORGANIC_V65,ORGANIC_V66,ORGANIC_V67,ORGANIC_V68]);
assert(cur.items.length===5172&&cur.recipes.size===13509,'catalog drift');
const app=readFileSync('client/src/app.js','utf8');
assert(app.includes('ORGANIC_ART_V70[itemName]||ORGANIC_ART_V69[itemName]'),'V70 art priority missing');
assert(app.includes('alchemy-android-immersive'),'Android layout class missing');
const css=readFileSync('client/src/styles.css','utf8');
assert(css.includes('html.alchemy-android-immersive .app')&&css.includes('padding-top:clamp(8px, env(safe-area-inset-top, 0px), 14px)'),'Android compact header regression');
assert(css.includes('clamp(176px,22dvh,190px)'),'compact workspace regression');
const build=readFileSync('tools/build-standalone.py','utf8');
assert(build.includes('window.__gameverseOrganicArt70')&&build.includes('35K_Alchemy_V70_Offline.html'),'build does not include V70');
if(!process.argv.includes('--quiet'))console.log('V70 VALID: 14/14 completed, 0 legacy motifs remaining, 5172 elements, 13509 recipes, UI compact.');
