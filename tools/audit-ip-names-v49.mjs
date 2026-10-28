// A conservative editorial screening tool, NOT a legal clearance opinion.
// Never automatically change the live catalog or IDs based on fuzzy matches.
import {writeFileSync} from 'node:fs';
import { DATA } from '../client/src/legacy-data.js';
import { PACK } from '../client/src/creative-pack.js';
import { buildCatalog } from '../client/src/catalog-integrity.js';
const packs=[PACK];
for(const name of ['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47']){
 const mod=await import('../client/src/'+name.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');packs.push(Object.values(mod)[0]);
}
const {items,recipes}=buildCatalog(DATA,packs);
// Screening patterns intentionally overinclusive, including titles and franchise words.
const signatures=[
 ['PlayStation',/\bplaystation\b|\bps\s?[1-5]\b/i],['Nintendo',/\bnintendo\b/i],['Xbox',/\bxbox\b/i],
 ['Sonic',/\bsonic\b/i],['Mario',/\bmario\b/i],['Pokemon',/\bpok[eé]mon\b/i],
 ['Zelda',/\bzelda\b/i],['Minecraft',/\bminecraft\b/i],['Star Wars',/\bstar wars\b/i],
 ['Dragon Ball',/\bdragon ball\b/i],['Final Fantasy',/\bfinal fantasy\b/i],
 ['Sega',/\bsega\b/i],['Atari',/\batari\b/i],['Disney',/\bdisney\b/i],
 ['Marvel',/\bmarvel\b/i],['Batman',/\bbatman\b/i],['Spider-Man',/\bspider[ -]?man\b/i],
 ['Kirby',/\bkirby\b/i],['Mega Man',/\bmega man\b/i],['Assassin\'s Creed',/\bassassin.s creed\b/i],
 ['Halo',/\bhalo\b/i],['Metal Gear',/\bmetal gear\b/i]
];
const matches=items.flatMap(item=>signatures.filter(([,rx])=>rx.test(item.name)).map(([series])=>({id:item.id,name:item.name,category:item.category,signal:series})));
const summary=Object.fromEntries(signatures.map(([series])=>[series,matches.filter(m=>m.signal===series).length]).filter(([,n])=>n>0));
const report={
 version:49,purpose:'Editorial screening of possibly protected names, NOT a definitive legal classification',
 catalog:{elements:items.length,recipes:recipes.size},
 totalMatchedRecords:new Set(matches.map(m=>m.id)).size,
 warning:'These are heuristic keyword hits only: many protected names may not match, and some matches may be generic words. Review individually; do not autogenerate mock names.',
 policy:'Never rename IDs or recipes. Adopt fictional names only after distinctiveness and clearance review; check names AND artwork, sound, descriptions and store listing.',
 examples:[
 {reference:'PlayStation',userSuggested:'PolyStation',status:'not cleared',reason:'Very similar and PolyStation is also known as a real-world clone-console label; a more independent invention is preferable.'},
 {reference:'Sonic',userSuggested:'Soarnic',status:'not cleared',reason:'Phonetically and conceptually close; must be evaluated together with artwork and characterization.'}
 ],
 countsBySignal:summary, flagged:matches
};
writeFileSync(new URL('../shared/v49-ip-name-screening.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`IP screening: ${items.length} items, ${report.totalMatchedRecords} distinct keyword hits, ${matches.length} matched signals. No catalog names changed.`);
