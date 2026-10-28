import { DATA } from '../client/src/legacy-data.js';
import { PACK } from '../client/src/creative-pack.js';
import { buildCatalog } from '../client/src/catalog-integrity.js';
import { familyFor } from '../client/src/discoveries.js';
import { FAMILY_CAMPAIGNS } from '../client/src/family-mode-v48.js';
import {readFileSync} from 'node:fs';
const packs=[PACK];for(const n of ['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47']){const mod=await import(`../client/src/${n.replace('gaming','gaming-pack').replace('organic','organic-pack')}.js`);packs.push(Object.values(mod)[0]);}
const {items,recipes:classic}=buildCatalog(DATA,packs),byId=new Map(items.map(x=>[x.id,x]));
if(items.length!==3963||classic.size!==12069)throw Error('V47 catalog changed unexpectedly');
if(FAMILY_CAMPAIGNS.version!==48)throw Error('Invalid version');
if(!Array.isArray(FAMILY_CAMPAIGNS.families)||FAMILY_CAMPAIGNS.families.length!==1)throw Error('Unexpected family campaigns');
for(const c of FAMILY_CAMPAIGNS.families){
 const ids=new Set(c.items),seeds=new Set(c.starters),r=new Map(c.recipes);
 if(ids.size!==c.items.length||seeds.size!==4||c.recipes.length!==r.size)throw Error('IDs, starters or pair duplicates');
 if(c.id!=='nature'||ids.size!==393)throw Error('Nature & Science not complete');
 if(c.starters.some(x=>!ids.has(x)))throw Error('Starter not in family');
 const fullFamily=items.filter(x=>familyFor(x)===c.id);
 if(fullFamily.length!==ids.size||fullFamily.some(x=>!ids.has(x.id)))throw Error('Family-only catalog incomplete');
 for(const [pair,result] of r){const two=pair.split('|');if(two.length!==2||two[0]>two[1]||two.some(x=>!ids.has(x))||!ids.has(result))throw Error('Invalid or cross-family recipe '+pair);
 const original=classic.get(pair);if(original && original!==result)throw Error('Classic pair changed meaning '+pair);
 }
 const reached=new Set(seeds);let changed=true,loops=0;
 while(changed){if(++loops>ids.size+1)throw Error('Non-converging graph');changed=false;for(const [key,out] of r){const [a,b]=key.split('|');if(reached.has(a)&&reached.has(b)&&!reached.has(out)){reached.add(out);changed=true;}}}
 if(reached.size!==ids.size)throw Error('Unreachable family elements: '+[...ids].filter(x=>!reached.has(x)).map(x=>byId.get(x)?.name).join(','));
}
const report=JSON.parse(readFileSync(new URL('../shared/v48-family-editorial-report.json',import.meta.url),'utf8'));
if(report.excluded.length!==0||report.reachable!==393)throw Error('Editorial report inconsistent');
if(!process.argv.includes('--quiet'))console.log(`V48 family mode verified: ${items.length} classic items, ${classic.size} fixed classic recipes; 393 family elements, ${FAMILY_CAMPAIGNS.families[0].recipes.length} unambiguous family recipes, fully reachable.`);
