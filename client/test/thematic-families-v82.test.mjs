import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {ORGANIC_V41} from '../src/organic-pack-v41.js';
import {ORGANIC_V42} from '../src/organic-pack-v42.js';
import {THEMATIC_CAMPAIGN_BLUEPRINTS,buildThematicCampaigns} from '../src/family-campaigns-v82.js';
import {FAMILIES,familiesFor} from '../src/discoveries.js';

const globalPairs = new Map();
const items = DATA.items.map((x,i)=>({id:'legacy:'+i,name:x[0]}));
items.push(...PACK.items,...ORGANIC_V41.items,...ORGANIC_V42.items);
const allRecipes=[
 ...DATA.recipes.map(([a,b,c])=>['legacy:'+a,'legacy:'+b,'legacy:'+c]),
 ...PACK.recipes,...ORGANIC_V41.recipes,...ORGANIC_V42.recipes
];
for (const [a,b,c] of allRecipes) {
 const pair=[a,b].sort().join('|');
 if(globalPairs.has(pair))assert.equal(globalPairs.get(pair),c,'global conflict '+pair);
 globalPairs.set(pair,c);
}
const families=buildThematicCampaigns(globalPairs,items);
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');

function isolatedClosure(f){
 const found=new Set(f.starters);
 let updated=true;
 while(updated){updated=false;
  for(const [key,c] of f.recipes){
   const [a,b]=key.split('|');
   if(found.has(a)&&found.has(b)&&!found.has(c)){found.add(c);updated=true;}
  }
 }
 return found;
}

test('The new thematic campaigns have four unique thematic starters and reach 100% independently',()=>{
 assert.equal(families.length,2);
 for(const f of families){
  assert.equal(f.starters.length,4);
  assert.equal(new Set(f.starters).size,4);
  assert.equal(new Set(f.items).size,f.items.length);
  assert.ok(f.starters.every(x=>f.items.includes(x)));
  const complete=isolatedClosure(f);
  assert.equal(complete.size,f.items.length,'unreachable family item: '+f.id);
  assert.deepEqual([...new Set(f.items)].filter(id=>!complete.has(id)),[]);
  for(const [pair,result] of f.recipes)assert.equal(globalPairs.get(pair),result,'global A+B mismatch '+pair);
 }
 assert.equal(families.find(f=>f.id==='mythology').items.length,16);
 assert.equal(families.find(f=>f.id==='prehistoric').items.length,9);
});
test('Thematic family membership retains unique stable catalog IDs and original primary groups',()=>{
 for(const b of THEMATIC_CAMPAIGN_BLUEPRINTS){
  assert.ok(FAMILIES.some(f=>f.id===b.id));
  for(const id of b.items)assert.ok(familiesFor({id,category:'nature'}).includes(b.id),id);
 }
 assert.ok(familiesFor({id:'legacy:64',category:'culture'}).includes('mythology'));
 assert.ok(familiesFor({id:'legacy:64',category:'culture'}).includes('prehistoric'));
 assert.equal(familiesFor({id:'legacy:64',category:'culture'})[0],'people');
});
test('UI, Android identity, offline builder, content plan and no-ad integrity are wired',()=>{
 const app=read('client/src/app.js'),build=read('tools/build-standalone.py');
 assert.match(app,/buildThematicCampaigns\(classicRecipes,ITEMS\)/);
 assert.match(app,/sharedMembership\(ALL_CAMPAIGNS\)/);
 assert.match(app,/eligibleFamilyMerge\(familyProfiles,ALL_CAMPAIGNS/);
 assert.match(app,/THEMATIC_FAMILY_ART/);
 assert.match(build,/family-campaigns-v82\.js/);
 assert.match(build,/window\.__familyCampaigns82/);
 assert.match(read('client/index.html'),/Alchemy <span class="brand-word">10K<\/span>/);
 const config=JSON.parse(read('capacitor.config.json'));
 assert.equal(config.appName,'Alchemy 10K');
 assert.equal(config.appId,'com.joaogdbg.alchemy35k'); // Keep old saves and Android upgrade path.
 const plan=JSON.parse(read('shared/production-plan-200.json'));
 assert.equal(plan.target_minimum_elements,10000);
 assert.equal(plan.batch_size,200);
 assert.equal(plan.baseline_elements,5812);
 assert.equal(plan.deliveries_to_target,21);
});
