import {readFileSync} from 'node:fs';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog,normalizeCatalogName} from '../client/src/catalog-integrity.js';
import {ORGANIC_V80} from '../client/src/organic-pack-v80.js';
import {ORGANIC_ART_V80} from '../client/src/organic-art-v80.js';
const check=(b,m)=>{if(!b)throw Error('V80B: '+m);};
const m=JSON.parse(readFileSync('shared/v80-approved.json','utf8'));
check(m.version===80&&m.cohort_count===m.new_items.length&&m.expansion_progress===m.cohort_count&&m.remaining_to_goal===m.expansion_goal-m.cohort_count&&m.cycle_complete===(m.cohort_count===m.expansion_goal),'cohort metadata');
check(ORGANIC_V80.items.length===m.cohort_count&&ORGANIC_V80.recipes.length===m.cohort_count&&Object.keys(ORGANIC_ART_V80).length===m.cohort_count,'cohort sizes');
const vs=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53','organic-v55','organic-v56','organic-v57','organic-v58','organic-v59','organic-v61','organic-v62','organic-v63','organic-v65','organic-v66','organic-v67','organic-v68','organic-v71','organic-v72','organic-v73','organic-v74','organic-v75','organic-v76','organic-v77','organic-v78','organic-v79'];
const packs=[PACK];
for(const v of vs){const mod=await import('../client/src/'+v.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');packs.push(Object.values(mod)[0]);}
const prior=buildCatalog(DATA,packs),next=buildCatalog(DATA,[...packs,ORGANIC_V80]);
check(prior.items.length===5572&&prior.recipes.size===13909,'V79 baseline changed');
check(next.items.length===m.expected_catalog.elements&&next.recipes.size===m.expected_catalog.recipes,'catalog totals wrong');
for(const [key,result] of prior.recipes)check(next.recipes.get(key)===result,'old formula changed '+key);
const knownIds=new Set(prior.items.map(x=>x.id)),reachableIds=new Set(knownIds),knownNames=new Set(prior.items.map(x=>normalizeCatalogName(x.name))),newIds=new Set(),pairs=new Set(),arts=new Set();
for(const approved of m.new_items){
 const it=ORGANIC_V80.items.find(x=>x.id===approved.id);
 check(it&&it.name===approved.name&&it.summary===approved.summary&&approved.art_mode==='bespoke-subject','source mismatch '+approved.id);
 check(!knownIds.has(it.id)&&!newIds.has(it.id),'reused ID '+it.id);newIds.add(it.id);
 const n=normalizeCatalogName(it.name);check(!knownNames.has(n),'reused normalized name '+it.name);knownNames.add(n);
 check(it.summary.length>=40&&it.summary.length<=180,'invalid summary '+it.name);
 check(!/\b(?:nintendo|playstation|xbox|sega|pokemon|mario|sonic|zelda|kirby)\b/i.test(it.name+' '+it.summary),'brand name '+it.name);
 const recipe=ORGANIC_V80.recipes.find(r=>r[2]===it.id);check(recipe&&JSON.stringify(recipe.slice(0,2))===JSON.stringify(approved.ingredients),'manifest recipe mismatch');
 check(recipe.slice(0,2).every(id=>reachableIds.has(id)),'unreachable ingredient '+it.name);
 const key=recipe.slice(0,2).sort().join('|');check(!prior.recipes.has(key)&&!pairs.has(key),'pair collision '+key);pairs.add(key);
 check(next.recipes.get(key)===it.id,'unexpected result '+it.name);reachableIds.add(it.id);
 const raw=readFileSync(approved.path,'utf8');
 check(raw.length>=410&&raw.startsWith('<svg')&&raw.includes('viewBox="0 0 100 100"'),'invalid SVG '+it.name);
 check(!/<(?:script|image|text|foreignObject|animate|use)\b|\s(?:href|onclick|onload)\s*=/i.test(raw),'unsafe SVG '+it.name);
 check(!arts.has(raw)&&ORGANIC_ART_V80[it.name.toLowerCase()]===raw,'duplicate/source mismatch '+it.name);arts.add(raw);
}
const app=readFileSync('client/src/app.js','utf8'),build=readFileSync('tools/build-standalone.py','utf8');
check(app.includes('ORGANIC_V78,ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82]'),'missing Classic V80');
check(app.includes('ORGANIC_ART_V81[itemName]||ORGANIC_ART_V80[itemName]||ORGANIC_ART_V79[itemName]'),'V80 illustration not displayed');
check(build.includes('window.__gameverseOrganic80')&&build.includes('window.__gameverseOrganicArt80'),'offline integration incomplete');
if(!process.argv.includes('--quiet'))console.log(`V80 COMPLETE PASS: ${next.items.length} elements / ${next.recipes.size} recipes; ${m.cohort_count}/200, pending +200 release.`);
