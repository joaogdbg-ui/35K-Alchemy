import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V83} from '../client/src/organic-pack-v83.js';
import {ORGANIC_ART_V83} from '../client/src/organic-art-v83.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v53-campaigns.js';
import {buildThematicCampaigns} from '../client/src/family-campaigns-v82.js';
import {reconcileLegacyFamilies} from '../client/src/family-compatibility-v82.js';
import {familyFor} from '../client/src/discoveries.js';
const requireOk=(ok,msg)=>{if(!ok)throw Error('V83 QA: '+msg);};
const manifest=JSON.parse(readFileSync('shared/v83-approved.json','utf8'));
requireOk(manifest.status==='QA_PENDING_UNMERGED'&&manifest.version===83,'must be a QA-only candidate');
requireOk(manifest.expansion_goal===200&&manifest.cohort_count===200&&manifest.new_items.length===200,'must be a complete exactly-200 authored cohort');
requireOk(ORGANIC_V83.items.length===200&&ORGANIC_V83.recipes.length===200&&Object.keys(ORGANIC_ART_V83).length===200,'200 entries, recipes and drawings');
const vs=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79','organic-v80','organic-v81','organic-v82'];
const packs=[PACK];
for(const v of vs){const path='../client/src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js';const mod=await import(path);packs.push(Object.values(mod)[0]);}
const before=buildCatalog(DATA,packs);
const after=buildCatalog(DATA,[...packs,ORGANIC_V83]);
requireOk(before.items.length===6012&&before.recipes.size===14349,'baseline must be 6012 IDs/14349 recipes');
requireOk(after.items.length===6212&&after.recipes.size===14549,'V83 must add exactly 200 real IDs and unique recipes');
for(const [key,value] of before.recipes)requireOk(after.recipes.get(key)===value,'historic global pair changed '+key);
const indexed=new Map(ORGANIC_V83.items.map((it,i)=>[it.id,i])),oldnames=new Set(before.items.map(it=>normalizeCatalogName(it.name))),newpairs=new Set(),artHashes=new Set();
for(const entry of manifest.new_items){
 const it=ORGANIC_V83.items.find(x=>x.id===entry.id);
 requireOk(it&&it.name===entry.name&&it.summary===entry.summary&&it.category===entry.category,'manifest disagreement '+entry.id);
 requireOk(it.summary.length>=40&&it.summary.length<=190,'summary length '+entry.id);
 requireOk(['bespoke-subject','species-specific-anatomy'].includes(entry.art_mode),'art provenance '+entry.id);
 requireOk(!oldnames.has(normalizeCatalogName(it.name)),'duplicate old name '+it.name);
 oldnames.add(normalizeCatalogName(it.name));
 requireOk(Array.isArray(it.familyCampaigns)&&it.familyCampaigns.every(x=>['mythology','prehistoric'].includes(x)),'unknown campaign membership '+it.name);
 requireOk(it.familyCampaigns.length===0 || familyFor(it)===it.familyCampaigns[0],'wrong Discoveries family '+it.name);
 const proposed=ORGANIC_V83.recipes.filter(r=>r[2]===it.id);
 requireOk(proposed.length===1,'one primary recipe required '+it.name);
 const [a,b,out]=proposed[0];
 requireOk(a===entry.ingredients[0]&&b===entry.ingredients[1],'manifest ingredient mismatch '+it.name);
 for(const inp of [a,b])if(indexed.has(inp))requireOk(indexed.get(inp)<indexed.get(out),'forward WIP recipe dependency '+it.name);
 const key=[a,b].sort().join('|');
 requireOk(!newpairs.has(key)&&!before.recipes.has(key),'reused primary pair '+it.name);newpairs.add(key);
 requireOk(after.recipes.get(key)===it.id,'wrong primary output '+it.name);
 const raw=readFileSync(entry.path,'utf8');
 requireOk(raw.length>=410&&raw.startsWith('<svg')&&raw.trimEnd().endsWith('</svg>'),'bad SVG '+it.name);
 requireOk(raw.includes('viewBox="0 0 100 100"')&&(raw.match(/<(?:path|rect|circle|line|ellipse|polygon|polyline)\b/g)||[]).length>=5,'SVG too sparse '+it.name);
 requireOk(!/<(?:script|image|use|text|foreignObject|iframe|animate)\b|\s(?:href|onload|onclick)\s*=/.test(raw),'unsafe source art '+it.name);
 requireOk(raw===ORGANIC_ART_V83[it.name.toLowerCase()],'runtime SVG/source mismatch '+it.name);
 const signature=createHash('sha256').update(raw).digest('hex');requireOk(!artHashes.has(signature),'identical reused SVG '+it.name);artHashes.add(signature);
}
const repaired=reconcileLegacyFamilies(new Map(after.recipes),FAMILY_CAMPAIGNS.families);
for(const [key,value] of after.recipes)requireOk(repaired.recipes.get(key)===value,'reconciliation changed an authored pair '+key);
const thematic=buildThematicCampaigns(repaired.recipes,after.items);
const mythology=thematic.find(x=>x.id==='mythology'),prehistoric=thematic.find(x=>x.id==='prehistoric');
requireOk(mythology.items.length===159&&prehistoric.items.length===141,'closed thematic campaign totals');
for(const family of thematic){
 const reached=new Set(family.starters);
 for(let i=0;i<family.items.length+2;i++){
  const old=reached.size;
  for(const [pair,out] of family.recipes){const [a,b]=pair.split('|');requireOk(repaired.recipes.get(pair)===out,'non-global family pair '+pair);if(reached.has(a)&&reached.has(b))reached.add(out);}
  if(old===reached.size)break;
 }
 requireOk(reached.size===family.items.length,'incomplete family '+family.name);
}
if(!process.argv.includes('--quiet'))console.log('V83 QA PASS: 6,212 IDs, 14,549 authored pairs, 200 unique icon sources, isolated Mythology 159 and Prehistory 141. NOT RELEASED.');
