// V83 content QA: +200 Mythology & Gods / Prehistory & Dinosaurs discoveries.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V80} from '../client/src/organic-pack-v80.js';
import {ORGANIC_V81} from '../client/src/organic-pack-v81.js';
import {ORGANIC_V82} from '../client/src/organic-pack-v82.js';
import {ORGANIC_V83} from '../client/src/organic-pack-v83.js';
import {ORGANIC_ART_V83} from '../client/src/organic-art-v83.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v53-campaigns.js';
import {buildThematicCampaigns} from '../client/src/family-campaigns-v82.js';
import {reconcileLegacyFamilies} from '../client/src/family-compatibility-v82.js';

const insist=(value,message)=>{if(!value)throw Error('V83 QA: '+message);};
const approved=JSON.parse(readFileSync('shared/v83-approved.json','utf8'));
const fresh=ORGANIC_V83.items;
insist(approved.version===83&&approved.cycle_complete===true&&approved.new_items.length===200,'manifest must describe exactly 200 items');
insist(fresh.length===200,'exactly +200 new items');
insist(fresh.filter(i=>i.familyCampaigns?.[0]==='mythology').length===100&&fresh.filter(i=>i.familyCampaigns?.[0]==='prehistoric').length===100,'100 mythology + 100 prehistory');
insist(Object.keys(ORGANIC_ART_V83).length===200,'one SVG per new element');

const vs=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79'];
const packs=[PACK];
for(const v of vs){const module=await import('../client/src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');packs.push(Object.values(module)[0]);}
packs.push(ORGANIC_V80,ORGANIC_V81,ORGANIC_V82);
const before=buildCatalog(DATA,packs);
const after=buildCatalog(DATA,[...packs,ORGANIC_V83]);
insist(before.items.length===6012,'V82 baseline is 6,012 elements, found '+before.items.length);
insist(after.items.length===6212,'catalog must reach 6,212 elements');
insist(after.recipes.size===before.recipes.size+ORGANIC_V83.recipes.length,'every V83 recipe is a new unordered pair');
for(const [pair,result] of before.recipes)insist(after.recipes.get(pair)===result,'historical pair overwritten '+pair);
insist(new Set(after.items.map(x=>normalizeCatalogName(x.name))).size===after.items.length,'normalized name uniqueness');

const known=new Set(before.items.map(x=>x.id)),names=new Set(before.items.map(x=>normalizeCatalogName(x.name)));
const freshIds=new Set(fresh.map(x=>x.id)),hashes=new Set();
for(const entry of approved.new_items){
 const it=fresh.find(x=>x.id===entry.id);
 insist(it&&it.name===entry.name&&it.summary===entry.summary&&it.category===entry.category,'manifest mismatch '+entry.id);
 insist(it.summary.length>=40&&it.summary.length<=200,'summary length '+it.name);
 insist(!it.wit||it.wit.length<=110,'witty line too long '+it.name);
 insist(!names.has(normalizeCatalogName(it.name)),'name collides with catalog '+it.name);
 const recipe=ORGANIC_V83.recipes.find(r=>r[2]===it.id);
 insist(recipe&&recipe[0]===entry.ingredients[0]&&recipe[1]===entry.ingredients[1],'primary recipe mismatch '+it.name);
 insist(known.has(recipe[0])&&known.has(recipe[1]),'ingredient not available before '+it.name+' (order the blueprint by dependency)');
 const raw=readFileSync(entry.path,'utf8');
 insist(raw.startsWith('<svg')&&raw.includes('viewBox="0 0 100 100"')&&raw.trimEnd().endsWith('</svg>')&&raw.length>=410,'invalid SVG '+it.name);
 insist((raw.match(/<(?:path|rect|circle|line|ellipse|polygon|polyline)\b/g)||[]).length>=5,'too little SVG content '+it.name);
 insist(!/<(?:script|image|use|text|foreignObject|iframe|animate)\b|\s(?:href|onload|onclick)\s*=/.test(raw),'unsafe SVG '+it.name);
 insist(ORGANIC_ART_V83[it.name.toLowerCase()]===raw,'runtime SVG differs from source '+it.name);
 const h=createHash('sha256').update(raw).digest('hex');insist(!hashes.has(h),'duplicate drawing '+it.name);hashes.add(h);
 known.add(it.id);names.add(normalizeCatalogName(it.name));
}
// Alternative recipes may only point at elements that existed before V83.
for(const r of ORGANIC_V83.recipes)if(!freshIds.has(r[2]))insist(before.items.some(x=>x.id===r[2]),'alternative recipe for unknown element '+r[2]);

const reconciled=reconcileLegacyFamilies(new Map(after.recipes),FAMILY_CAMPAIGNS.families);
const thematic=buildThematicCampaigns(reconciled.recipes,after.items); // throws if a family cannot be completed
const families=[...reconciled.families,...thematic];
for(const family of families){
 const allowed=new Set(family.items),reached=new Set(family.starters);
 for(let changed=true;changed;){changed=false;for(const [pair,result] of family.recipes){const [a,b]=pair.split('|');if(reached.has(a)&&reached.has(b)&&allowed.has(result)&&!reached.has(result)){reached.add(result);changed=true;}}}
 insist(reached.size===allowed.size,'family incomplete '+family.name+' '+reached.size+'/'+allowed.size);
}
const myth=thematic.find(x=>x.id==='mythology'),pre=thematic.find(x=>x.id==='prehistoric');
insist(myth.items.length===209,'Mythology & Gods must hold 209 items, found '+myth.items.length);
insist(pre.items.length===216,'Prehistory & Dinosaurs must hold 216 items, found '+pre.items.length);
if(!process.argv.includes('--quiet'))console.log(`V83 QA PASS: ${after.items.length} elements, ${after.recipes.size} catalog recipes (+${ORGANIC_V83.recipes.length}); Mythology & Gods ${myth.items.length}/${myth.items.length}, Prehistory & Dinosaurs ${pre.items.length}/${pre.items.length} independently completable. 35px art review and IP review remain manual.`);
