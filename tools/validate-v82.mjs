import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V80} from '../client/src/organic-pack-v80.js';
import {ORGANIC_V81} from '../client/src/organic-pack-v81.js';
import {ORGANIC_V82} from '../client/src/organic-pack-v82.js';
import {ORGANIC_ART_V82} from '../client/src/organic-art-v82.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v53-campaigns.js';
import {buildThematicCampaigns} from '../client/src/family-campaigns-v82.js';
import {reconcileLegacyFamilies} from '../client/src/family-compatibility-v82.js';

const insist=(value,message)=>{if(!value)throw Error('V82 QA: '+message);};
const approved=JSON.parse(readFileSync('shared/v82-approved.json','utf8'));
insist(approved.version===82&&approved.status==='QA_PENDING_UNMERGED','QA candidate must not claim publication');
insist(approved.expansion_goal===200&&approved.cycle_complete===true,'exactly 200 content candidates completed');
insist(approved.cohort_count===ORGANIC_V82.items.length &&
  approved.new_items.length===ORGANIC_V82.items.length &&
  approved.expansion_progress===ORGANIC_V82.items.length &&
  approved.remaining_to_goal===200-ORGANIC_V82.items.length,'exact 200 candidate content count');
insist(ORGANIC_V82.items.length===200&&ORGANIC_V82.recipes.length===200,'release candidate must contain exactly +200');
insist(ORGANIC_V82.items.length===ORGANIC_V82.recipes.length &&
  Object.keys(ORGANIC_ART_V82).length===ORGANIC_V82.items.length,'one new recipe and SVG per new element');

const vs=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79'];
const packs=[PACK];
for(const v of vs){
 const path='../client/src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js';
 const module=await import(path);packs.push(Object.values(module)[0]);
}
packs.push(ORGANIC_V80,ORGANIC_V81);
const before=buildCatalog(DATA,packs);
const after=buildCatalog(DATA,[...packs,ORGANIC_V82]);
insist(before.items.length===5812&&before.recipes.size===14149,'historical V81 baseline');
insist(after.items.length===5812+ORGANIC_V82.items.length,'true new ID count');
insist(after.recipes.size===14149+ORGANIC_V82.recipes.length,'true new pair count');
for(const [pair,result] of before.recipes)insist(after.recipes.get(pair)===result,'historical pair overwritten '+pair);
insist(new Set(after.items.map(x=>normalizeCatalogName(x.name))).size===after.items.length,'normalized name uniqueness');
const itemNames=new Set(before.items.map(x=>normalizeCatalogName(x.name)));
const knownIds=new Set(before.items.map(x=>x.id));
const newPairs=new Set(),svgHashes=new Set();
for(const entry of approved.new_items){
 const it=ORGANIC_V82.items.find(x=>x.id===entry.id);
 insist(it&&it.name===entry.name&&it.summary===entry.summary&&it.category===entry.category,'manifest item mismatch '+entry.id);
 insist(Array.isArray(it.familyCampaigns)&&it.familyCampaigns.length===1 &&
  it.familyCampaigns[0]===(it.category==='mythology'?'mythology':'prehistoric'),'family membership absent '+it.id);
 insist(!knownIds.has(it.id),'duplicate historical ID '+it.id);
 insist(!itemNames.has(normalizeCatalogName(it.name)),'duplicate historical name '+it.name);
 insist(it.summary.length>=50&&it.summary.length<=190,'summary length '+it.name);
 insist(['bespoke-subject','species-specific-anatomy'].includes(entry.art_mode),'not original subject art '+it.name);
 const recipe=ORGANIC_V82.recipes.find(r=>r[2]===it.id);
 insist(recipe&&recipe[0]===entry.ingredients[0]&&recipe[1]===entry.ingredients[1],'primary recipe mismatch '+it.name);
 insist(knownIds.has(recipe[0])&&knownIds.has(recipe[1]),'ingredient not yet available '+it.name);
 const pair=[recipe[0],recipe[1]].sort().join('|');
 insist(!before.recipes.has(pair)&&!newPairs.has(pair),'pair collision '+pair);
 insist(after.recipes.get(pair)===it.id,'wrong output '+it.name);
 const raw=readFileSync(entry.path,'utf8');
 insist(raw.length>=410&&raw.startsWith('<svg')&&raw.trimEnd().endsWith('</svg>'),'invalid SVG file '+it.name);
 insist(raw.includes('viewBox="0 0 100 100"'),'wrong illustration size '+it.name);
 insist((raw.match(/<(?:path|rect|circle|line|ellipse|polygon|polyline)\b/g)||[]).length>=5,'too little SVG content '+it.name);
 insist(!/<(?:script|image|use|text|foreignObject|iframe|animate)\b|\s(?:href|onload|onclick)\s*=/.test(raw),'unsafe SVG '+it.name);
 insist(ORGANIC_ART_V82[it.name.toLowerCase()]===raw,'runtime SVG does not match source '+it.name);
 const hash=createHash('sha256').update(raw).digest('hex');
 insist(!svgHashes.has(hash),'duplicate drawing '+it.name);svgHashes.add(hash);
 knownIds.add(it.id);itemNames.add(normalizeCatalogName(it.name));newPairs.add(pair);
}
// Runtime reconciliation is part of the playable global recipe book, not a separate
// Family Only override. The V53 data included missing family pairs and eight
// historical collisions; the Classic result always takes precedence.
const reconciled=reconcileLegacyFamilies(new Map(after.recipes),FAMILY_CAMPAIGNS.families);
insist(reconciled.addedGlobalRecipes.length===205,'expected 205 globally repaired historical family recipes');
insist(reconciled.oldConflicts.length===8,'expected exactly eight resolved historical family conflicts');
insist(reconciled.recipes.size===after.recipes.size+205,'reconciled global total is wrong');
for(const [pair,result] of after.recipes)
 insist(reconciled.recipes.get(pair)===result,'reconciliation changed an existing Classic result '+pair);
const families=[...reconciled.families,...buildThematicCampaigns(reconciled.recipes,after.items)];
for(const family of families){
 const allowed=new Set(family.items),known=new Set(family.starters);
 insist(family.starters.length===4&&new Set(family.starters).size===4,'invalid family starters '+family.name);
 for(let loop=0;loop<=family.items.length+1;loop++){
  const beforeSize=known.size;
  for(const [pair,result]of family.recipes){
   const [a,b]=pair.split('|');
   insist(reconciled.recipes.get([a,b].sort().join('|'))===result,'family recipe diverges from global pair '+pair);
   if(known.has(a)&&known.has(b)&&allowed.has(result))known.add(result);
  }
  if(beforeSize===known.size)break;
 }
 insist(known.size===allowed.size&&family.items.every(x=>known.has(x)),'family incomplete '+family.name);
}
insist(families.find(x=>x.id==='mythology').items.length===16+ORGANIC_V82.items.filter(x=>x.category==='mythology').length,'mythology totals');
insist(families.find(x=>x.id==='prehistoric').items.length===9+ORGANIC_V82.items.filter(x=>x.category==='prehistoric').length,'prehistory totals');
if(!process.argv.includes('--quiet')) console.log('V82 QA candidate: '+after.items.length+' IDs / '+after.recipes.size+' authored catalog recipes / '+reconciled.recipes.size+' playable global recipes, '+ORGANIC_V82.items.length+'/200 new items. Not a published release.');
