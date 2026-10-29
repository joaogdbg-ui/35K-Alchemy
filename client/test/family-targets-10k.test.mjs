import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FAMILIES} from '../src/discoveries.js';
import {FAMILY_CAMPAIGNS} from '../src/family-mode-v53-campaigns.js';
import {sharedMembership} from '../src/family-shared-v51.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const plan=JSON.parse(read('shared/family-targets-10k.json'));
test('Nine primary budgets partition exactly 10,000 real elements; gaming occupies 53.5%',()=>{
 assert.equal(plan.gameName,'Alchemy 10k');assert.equal(plan.families.length,9);
 assert.equal(plan.families.reduce((n,f)=>n+f.target,0),10000);
 assert.equal(plan.families.reduce((n,f)=>n+f.baseline,0),5812);
 const gaming=plan.families.filter(f=>['games','consoles','arcades'].includes(f.id));
 assert.equal(gaming.reduce((n,f)=>n+f.target,0),5350);
 for(const f of plan.families){
  assert.equal(f.remaining,f.target-f.baseline);
  assert.equal(f.starters.length,4);
  assert.ok(f.starters.every(s=>s.status==='proposal-not-validated'));
 }
});
test('Every family category has exactly one editorial owner, including food',()=>{
 const seen=new Map();
 for(const f of FAMILIES)for(const category of f.categories){
  assert.equal(seen.has(category),false,category+' has duplicate primary family');
  seen.set(category,f.id);
 }
 assert.equal(seen.get('food'),'people');
 assert.deepEqual(new Set(FAMILIES.map(f=>f.id)),new Set(plan.families.map(f=>f.id)));
});
test('Only two campaign graphs are activated; shared discoveries remain single global IDs',()=>{
 const ready=FAMILY_CAMPAIGNS.families.map(f=>f.id).sort();
 assert.deepEqual(ready,['nature','people']);
 assert.deepEqual(plan.campaignRules.active.slice().sort(),ready);
 assert.equal(plan.campaignRules.planned.length,7);
 assert.ok(sharedMembership(FAMILY_CAMPAIGNS.families).size>=31);
 for(const f of FAMILY_CAMPAIGNS.families)assert.equal(f.starters.length,4);
});
test('10k scope does not change Android installation identity or classic save keys',()=>{
 const cap=JSON.parse(read('capacitor.config.json'));const app=read('client/src/app.js');
 assert.equal(cap.appName,'Alchemy 10k');
 assert.equal(cap.appId,'com.joaogdbg.alchemy35k');
 assert.match(app,/gameverse_alchemy_v2/);
 assert.match(app,/35k_family_profiles_v48/);
 assert.match(app,/ALCHEMY_TARGET_ELEMENTS=10000/);
});
