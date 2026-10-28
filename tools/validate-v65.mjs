import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V65} from '../client/src/organic-pack-v65.js';import {ORGANIC_ART_V65} from '../client/src/organic-art-v65.js';
const versions=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63'];
const packs=[PACK];for (const n of versions){const f=n.replace('gaming','gaming-pack').replace('organic','organic-pack');const m=await import('../client/src/'+f+'.js');packs.push(Object.values(m)[0]);}
const old=buildCatalog(DATA,packs);const now=buildCatalog(DATA,[...packs,ORGANIC_V65]);const assert=(v,m)=>{if(!v)throw Error('V65: '+m)};
assert(old.items.length===5124&&old.recipes.size===13461,'V64 baseline drift');
assert(ORGANIC_V65.items.length===12&&ORGANIC_V65.recipes.length===12,'unexpected content counts');
assert(now.items.length===5136&&now.recipes.size===13473,'catalog counts');
assert(new Set(now.items.map(e=>e.id)).size===now.items.length,'duplicate ids');
assert(new Set(now.items.map(e=>normalizeCatalogName(e.name))).size===now.items.length,'duplicate names');
for(const [k,v] of old.recipes)assert(now.recipes.get(k)===v,'historical recipe changed: '+k);
const newIds=new Set(ORGANIC_V65.items.map(x=>x.id));for(const [a,b,c] of ORGANIC_V65.recipes){const key=[a,b].sort().join('|');assert(!old.recipes.has(key),'occupied pair');assert(newIds.has(c),'non new result');assert(now.recipes.get(key)===c,'missing recipe');}
const unlocked=new Set(now.items.slice(0,4).map(x=>x.id));let more=true;while(more){more=false;for(const [key,target] of now.recipes){const [a,b]=key.split('|');if(unlocked.has(a)&&unlocked.has(b)&&!unlocked.has(target)){unlocked.add(target);more=true;}}}assert(unlocked.size===now.items.length,'unreachable results: '+(now.items.length-unlocked.size));
const m=JSON.parse(readFileSync('shared/v65-approved.json','utf8'));assert(m.new_items.length===12&&m.redrawn_v61.length===20,'manifest count');
const old61=JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons;const byname=new Map(old61.map(x=>[x.name,x]));const old63=JSON.parse(readFileSync('shared/v63-approved.json','utf8'));const completed=new Set(old63.redrawn_v61.map(x=>x.name));
const hashes=new Set();for(const e of [...m.new_items,...m.redrawn_v61]){const svg=readFileSync(e.path,'utf8');assert(createHash('sha256').update(svg).digest('hex')===e.sha256,'changed SVG');assert(ORGANIC_ART_V65[e.name.toLowerCase()]===svg,'runtime art drift');assert(!/<script|<image\b|<text\b|<foreignObject|onload=|href=|<animate/i.test(svg),'unsafe svg');assert(!hashes.has(e.sha256),'duplicate art');hashes.add(e.sha256);assert(e.art_mode==='bespoke-silhouette','generic art');}
for(const e of m.redrawn_v61)assert(byname.get(e.name)?.art_mode==='motif-composite'&&!completed.has(e.name),'redrawn item invalid');
const app=readFileSync('client/src/app.js','utf8');assert(app.includes('ORGANIC_V63,ORGANIC_V65'),'runtime expansion missing');assert(app.includes('ORGANIC_ART_V65[itemName]||ORGANIC_ART_V63[itemName]'),'art priority');
if(!process.argv.includes('--quiet'))console.log('V65 VALID',now.items.length,'elements',now.recipes.size,'recipes; 12 new, 20 art corrections, all reachable');
