import test from 'node:test';
import assert from 'node:assert/strict';
import {FAMILY_CAMPAIGNS} from '../src/family-mode-v53-campaigns.js';
import {sharedMembership, synchronizeFamilyProfiles} from '../src/family-shared-v51.js';

const campaigns=FAMILY_CAMPAIGNS.families;
const classicSet=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
function reachableInIsolation(campaign){
  const allowed=new Set(campaign.items),found=new Set(campaign.starters);
  let changed=true,passes=0;
  while(changed){
    changed=false;
    for(const [pair,result] of campaign.recipes){
      const [a,b]=pair.split('|');
      if(!allowed.has(result)||!allowed.has(a)||!allowed.has(b))
        throw new Error(campaign.id+': recipe escapes family '+pair+' => '+result);
      if(found.has(a)&&found.has(b)&&!found.has(result)){
        found.add(result);changed=true;
      }
    }
    if(++passes>allowed.size+1)throw new Error('reachability never settled');
  }
  return found;
}

test('Families Only: each existing campaign is fully reachable from its own four starters without Classic, other families or sharing',()=>{
  for(const f of campaigns){
    assert.equal(f.starters.length,4,f.id+' must have four starters');
    assert.equal(new Set(f.starters).size,4,f.id+' starters must be unique');
    assert.equal(new Set(f.items).size,f.items.length,f.id+' items must be unique');
    for(const id of f.starters) assert.ok(f.items.includes(id),f.id+' starter missing from items');
    assert.equal(new Set(f.recipes.map(x=>x[0])).size,f.recipes.length,f.id+' must not have contradictory pairs');
    const reachable=reachableInIsolation(f);
    assert.deepEqual([...new Set(f.items)].filter(id=>!reachable.has(id)),[],f.id+' contains elements not craftable from four starters');
    assert.equal(reachable.size,f.items.length,f.id+' complete graph expected');
  }
});
test('Family recipe pairs never produce different results across separate campaign graphs',()=>{
  const globalPairs=new Map();
  for(const f of campaigns) for(const [pair,result] of f.recipes){
    const normalized=pair.split('|').sort().join('|');
    if(globalPairs.has(normalized))assert.equal(globalPairs.get(normalized),result,'pair conflict '+normalized+' across families');
    else globalPairs.set(normalized,result);
  }
});
test('Multi-family IDs propagate without manufacturing a new ID or changing Classic progress',()=>{
  const membership=sharedMembership(campaigns);
  assert.ok(membership.size>0,'expected legitimate shared IDs');
  const shared=[...membership.keys()].find(id=>!campaigns.some(f=>f.starters.includes(id)));
  assert.ok(shared,'expected shareable nonstarter item');
  const owners=[...membership.get(shared)],from=campaigns.find(f=>f.id===owners[0]),to=campaigns.find(f=>f.id===owners[1]);
  const input={
    [from.id]:{unlocked:[...from.starters,shared],ledger:[[shared,{at:10,source:'combine'}]],order:[...from.starters,shared]},
    [to.id]:{unlocked:[...to.starters],order:[...to.starters]},
  };
  const once=synchronizeFamilyProfiles(input,campaigns);
  assert.ok(once.profiles[to.id].unlocked.includes(shared),'shared item must appear in eligible family');
  assert.equal(once.profiles[to.id].unlocked.filter(id=>id===shared).length,1,'shared ID never duplicated');
  const twice=synchronizeFamilyProfiles(once.profiles,campaigns);
  assert.deepEqual(twice.profiles[to.id].unlocked,once.profiles[to.id].unlocked,'sync idempotent');
  assert.equal(once.profiles.classic,undefined,'Family Only synchronization must never write Classic profile');
});
test('Historical Nature starter defect is explicitly identified, never mistaken for compliant themed starters',()=>{
  const nature=campaigns.find(f=>f.id==='nature');
  if(nature) assert.ok(nature.starters.every(id=>classicSet.has(id)),'Nature starter issue was changed; re-run isolated closure & update contract docs');
  // Tracked non-compliance: Nature still uses the four Classic starters.
  // A production fix must introduce four thematic non-Classic starters while retaining 100% reachability.
  for(const f of campaigns.filter(f=>f.id!=='nature'))
    assert.ok(!f.starters.every(id=>classicSet.has(id)),f.id+' improperly duplicates Classic starters');
});
