#!/usr/bin/env node
/**
 * Alchemy 10k: verify primary editorial family budgets, global catalog ceiling,
 * and 100%-independent Families Only campaigns without treating shared IDs as new.
 */
import {readFileSync,readdirSync} from 'node:fs';
import {DATA} from '../client/src/legacy-data.js';
import {PACK} from '../client/src/creative-pack.js';
import {buildCatalog} from '../client/src/catalog-integrity.js';
import {FAMILIES} from '../client/src/discoveries.js';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v53-campaigns.js';
import {sharedMembership} from '../client/src/family-shared-v51.js';
const fail=reason=>{throw Error('FAMILY-10K: '+reason)};
const assert=(condition,reason)=>{if(!condition)fail(reason)};
const blueprint=JSON.parse(readFileSync(new URL('../shared/family-targets-10k.json',import.meta.url),'utf8'));
const plan=JSON.parse(readFileSync(new URL('../shared/production-plan-200.json',import.meta.url),'utf8'));
assert(blueprint.targetUniqueElements===10000&&plan.target_minimum_elements===10000,'10k target mismatch');
assert(blueprint.families.length===9&&FAMILIES.length===9,'expected nine editorial families');
assert(new Set(blueprint.families.map(f=>f.id)).size===9,'duplicate family IDs');
assert(blueprint.families.reduce((n,f)=>n+f.target,0)===10000,'primary budgets do not sum to 10,000');
assert(blueprint.families.reduce((n,f)=>n+f.baseline,0)===5812,'V81 baseline category counts must total 5,812');
const gaming=new Set(['games','consoles','arcades']);
assert(blueprint.families.filter(f=>gaming.has(f.id)).reduce((n,f)=>n+f.target,0)===5350,'gaming budget must be 53.5%');
const byCategory=new Map();
for(const family of FAMILIES){
 assert(blueprint.families.some(f=>f.id===family.id),'unknown display family '+family.id);
 for(const category of family.categories){
  assert(!byCategory.has(category),'category duplicated between families: '+category);
  byCategory.set(category,family.id);
 }
}
assert(byCategory.get('food')==='people','food incorrectly sent to Fantasy');
const packs=[PACK];
for(const name of readdirSync(new URL('../client/src/',import.meta.url)).filter(name=>/^(?:gaming|organic)-pack-v\d+\.js$/.test(name))){
 const mod=await import('../client/src/'+name);
 const data=Object.values(mod)[0];
 assert(Array.isArray(data.items)&&Array.isArray(data.recipes),'malformed '+name);
 packs.push(data);
}
const catalog=buildCatalog(DATA,packs);
assert(catalog.items.length<=10000,'catalog exceeds exact hard cap');
const primaryCounts=new Map(FAMILIES.map(f=>[f.id,0]));
for(const item of catalog.items){
 const family=byCategory.get(item.category);
 assert(family, 'unmapped category "'+item.category+'" in '+item.id);
 primaryCounts.set(family,primaryCounts.get(family)+1);
}
assert([...primaryCounts.values()].reduce((a,b)=>a+b,0)===catalog.items.length,'primary IDs duplicate or missing');
for(const f of blueprint.families){
 const current=primaryCounts.get(f.id);
 assert(current>=f.baseline,'published category unexpectedly shrank: '+f.id);
 assert(current<=f.target,'category budget exceeded: '+f.id+' '+current+'/'+f.target);
 const display=FAMILIES.find(x=>x.id===f.id);
 assert(display?.name===f.name,'display family changed '+f.id);
 assert(f.starters.length===4&&f.starters.every(x=>x.status==='proposal-not-validated'),'unreviewed starter proposals need explicit validation');
}
if(catalog.items.length===10000){
 for(const f of blueprint.families)assert(primaryCounts.get(f.id)===f.target,'10k primary family unfinished '+f.id);
}
const available=new Set(blueprint.campaignRules.active);
const actual=new Set(FAMILY_CAMPAIGNS.families.map(f=>f.id));
assert(available.size===actual.size&&[...actual].every(id=>available.has(id)),'campaign availability roadmap differs from actual game');
for(const family of FAMILY_CAMPAIGNS.families){
 const allowed=new Set(family.items),reachable=new Set(family.starters);
 assert(family.starters.length===4&&new Set(family.starters).size===4,'invalid starters '+family.id);
 assert(allowed.size===family.items.length,'duplicate campaign member '+family.id);
 assert(family.starters.every(id=>allowed.has(id)),'starter missing from family '+family.id);
 for(let cycle=0;cycle<=allowed.size+1;cycle++){
  let added=false;
  for(const [pair,out] of family.recipes){const [a,b]=pair.split('|');
   assert(allowed.has(a)&&allowed.has(b)&&allowed.has(out),'recipe escapes campaign '+family.id);
   if(reachable.has(a)&&reachable.has(b)&&!reachable.has(out)){reachable.add(out);added=true;}
  }
  if(!added)break;
 }
 assert(reachable.size===allowed.size,'family cannot reach all its elements independently '+family.id+' '+reachable.size+'/'+allowed.size);
}
const shared=sharedMembership(FAMILY_CAMPAIGNS.families);
assert(shared.size>=31,'shared IDs unexpectedly lost');
if(!process.argv.includes('--quiet')){
 console.log('Alchemy 10k: '+catalog.items.length+'/10000 unique elements, '+catalog.recipes.size+' recipes.');
 console.log('Primary editorial budgets:');
 for(const f of blueprint.families)console.log(f.id+': '+primaryCounts.get(f.id)+' / '+f.target);
 console.log('Families Only: '+FAMILY_CAMPAIGNS.families.length+' verified independently completable campaigns; '+shared.size+' shared IDs.');
}
