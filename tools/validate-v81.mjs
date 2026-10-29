import {readFileSync} from 'node:fs';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V80} from '../client/src/organic-pack-v80.js';
import {ORGANIC_ART_V80} from '../client/src/organic-art-v80.js';
import {ORGANIC_V81} from '../client/src/organic-pack-v81.js';
import {ORGANIC_ART_V81} from '../client/src/organic-art-v81.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v53-campaigns.js';
const check=(yes,message)=>{if(!yes)throw Error('V81: '+message)};
const approved=JSON.parse(readFileSync('shared/v81-approved.json','utf8'));
check(approved.version===81&&approved.cohort_count===40&&approved.new_items.length===40,'manifest count');
check(approved.expansion_goal===200&&approved.expansion_progress===40&&approved.remaining_to_goal===160&&approved.cycle_complete===false,'V81 new editorial cycle');
const vs=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79'];
const packs=[PACK];
for(const v of vs){const mod=await import('../client/src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');packs.push(Object.values(mod)[0]);}
packs.push(ORGANIC_V80);
const prior=buildCatalog(DATA,packs),complete=buildCatalog(DATA,[...packs,ORGANIC_V81]);
check(prior.items.length===5772&&prior.recipes.size===14109,'V80 baseline catalog totals');
check(complete.items.length===5812&&complete.recipes.size===14149,'exactly +200 since published V80B');
check(complete.items.length===approved.expected_catalog.elements&&complete.recipes.size===approved.expected_catalog.recipes,'manifest catalog totals');
check(ORGANIC_V81.items.length===40&&ORGANIC_V81.recipes.length===40&&Object.keys(ORGANIC_ART_V81).length===40,'V81 data/art coverage');
for(const [pair,result] of prior.recipes)check(complete.recipes.get(pair)===result,'historical recipe changed '+pair);
const ids=new Set(prior.items.map(it=>it.id)),names=new Set(prior.items.map(it=>normalizeCatalogName(it.name))),pairs=new Set(),arts=new Set(Object.values(ORGANIC_ART_V80));
for(const item of approved.new_items){
 const it=ORGANIC_V81.items.find(x=>x.id===item.id);
 check(it&&it.name===item.name&&it.summary===item.summary&&it.category===item.category,'manifest mismatch '+item.id);
 check(!ids.has(it.id),'duplicate ID '+it.id);
 const n=normalizeCatalogName(it.name);check(!names.has(n),'duplicate normalized name '+it.name);names.add(n);
 check(it.summary.length>=40&&it.summary.length<=180,'summary length '+it.name);
 const r=ORGANIC_V81.recipes.find(x=>x[2]===it.id);
 check(r&&r[0]===item.ingredients[0]&&r[1]===item.ingredients[1],'primary recipe '+item.id);
 check(ids.has(r[0])&&ids.has(r[1]),'ingredient not yet reachable '+it.name);
 const key=[r[0],r[1]].sort().join('|');
 check(!prior.recipes.has(key)&&!pairs.has(key),'global pair collision '+key);pairs.add(key);
 check(complete.recipes.get(key)===it.id,'recipe output mismatch '+it.name);
 ids.add(it.id);
 const raw=readFileSync(item.path,'utf8');
 check(raw.length>=410&&raw.startsWith('<svg')&&raw.includes('viewBox="0 0 100 100"'),'invalid source art '+it.name);
 check(!/<(?:script|image|text|foreignObject|animate|use)\b|\s(?:href|onclick|onload)\s*=/i.test(raw),'unsafe artwork '+it.name);
 check(!arts.has(raw),'reused SVG subject '+it.name);arts.add(raw);
 check(ORGANIC_ART_V81[it.name.toLowerCase()]===raw,'runtime/source illustration mismatch '+it.name);
}
for(const family of FAMILY_CAMPAIGNS.families){
 const allowed=new Set(family.items),reachable=new Set(family.starters);
 check(family.starters.length===4&&new Set(family.starters).size===4,'family starters not unique '+family.id);
 check(family.items.length===allowed.size,'family duplicated item '+family.id);
 for(let round=0;round<allowed.size+2;round++){
  let added=false;
  for(const [pair,out] of family.recipes){const [a,b]=pair.split('|');if(reachable.has(a)&&reachable.has(b)&&allowed.has(out)&&!reachable.has(out)){reachable.add(out);added=true;}}
  if(!added)break;
 }
 check(reachable.size===allowed.size&&[...allowed].every(id=>reachable.has(id)),'Family Only campaign not independently completable '+family.id);
}
const app=readFileSync('client/src/app.js','utf8'),builder=readFileSync('tools/build-standalone.py','utf8');
check(app.includes('ORGANIC_V79,ORGANIC_V80,ORGANIC_V81]'),'V81 Classic registration missing');
check(app.includes('const newArt=ORGANIC_ART_V81[itemName]||ORGANIC_ART_V80[itemName]'),'V81 SVG lookup absent');
check(builder.includes('window.__gameverseOrganic81')&&builder.includes('window.__gameverseOrganicArt81'),'V81 absent from offline bundle');
if(!process.argv.includes('--quiet'))console.log('V81 content PASS: 5812 elements, 14149 global recipes, 200 newly authored since V80B.');
