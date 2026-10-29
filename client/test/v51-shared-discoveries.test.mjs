import test from 'node:test';
import assert from 'node:assert/strict';
import {FAMILY_CAMPAIGNS} from '../src/family-mode-v50-campaigns.js';
import {sharedMembership,synchronizeFamilyProfiles} from '../src/family-shared-v51.js';
import {readFileSync} from 'node:fs';
const cs=FAMILY_CAMPAIGNS.families;
const nature=cs.find(c=>c.id==='nature');
const people=cs.find(c=>c.id==='people');
const membership=sharedMembership(cs);
const shared=[...membership.keys()];
const item=(id)=>cs.find(c=>c.id===id);
const state=(c, extra=[])=>({unlocked:[...c.starters,...extra],known:[],recent:[],last:null,ledger:[],order:[...c.starters,...extra],clues:{}});
const sync=(profiles)=>synchronizeFamilyProfiles(profiles,cs);

test('V51 exactly 15 shared items, each with both campaign memberships',()=>{
 assert.equal(shared.length,15);
 for(const id of shared)assert.deepEqual([...membership.get(id)].sort(),['nature','people']);
});
test('Discover Nature shared item: automatically unlock it in previously unplayed People',()=>{
 const id=shared[0];const result=sync({nature:state(nature,[id])});
 assert.ok(result.profiles.people.unlocked.includes(id));
 assert.deepEqual(result.received.people,[id]);
 assert.equal(result.profiles.people.unlocked.length,people.starters.length+1);
 assert.equal(result.profiles.people.known.length,0,'recipes are not automatically learned');
 assert.equal(result.profiles.people.last,null,'auto-sharing should not fake a latest craft');
 assert.equal(result.profiles.people.ledger.find(([x])=>x===id)?.[1].source,'family-shared');
});
test('Discover People shared item: unlock it in Nature, preserving its existing progress',()=>{
 const id=shared[1];const solo=nature.items.find(x=>!membership.has(x)&&!nature.starters.includes(x));
 const previous={nature:{...state(nature,[solo]),known:['private-pair'],clues:{hint:'kept'},last:solo},people:state(people,[id])};
 const result=sync(previous);
 assert.ok(result.profiles.nature.unlocked.includes(id));
 assert.ok(result.profiles.nature.unlocked.includes(solo));
 assert.deepEqual(result.profiles.nature.known,['private-pair']);
 assert.deepEqual(result.profiles.nature.clues,{hint:'kept'});
 assert.equal(result.profiles.nature.last,solo);
 assert.ok(!result.profiles.people.unlocked.includes(solo),'non-shared elements stay private');
});
test('Synchronizing twice is idempotent, without duplicated IDs, ledgers or history',()=>{
 const first=sync({nature:state(nature,shared.slice(0,4)),people:state(people,[shared[3],shared[4]])});
 const second=sync(first.profiles);
 assert.deepEqual(second.profiles,first.profiles);
 for(const c of cs){const p=second.profiles[c.id];assert.equal(new Set(p.unlocked).size,p.unlocked.length);assert.equal(new Set(p.ledger.map(([k])=>k)).size,p.ledger.length);}
});
test('V50 legacy family save migrates without replacing its unrelated unlocked entries',()=>{
 const old={people:state(people,shared.slice(0,2)),nature:state(nature)};
 const migrated=sync(JSON.parse(JSON.stringify(old)));
 assert.deepEqual(migrated.profiles.people.known,old.people.known);
 for(const id of shared.slice(0,2))assert.ok(migrated.profiles.nature.unlocked.includes(id));
 assert.equal(migrated.profiles.people.unlocked.length,people.starters.length+2);
});
test('Cross-mode separation: Classic state is not an input or modified by shared synchronization',()=>{
 const classic={unlocked:['legacy:0','legacy:1'],known:['classic-recipe']};
 const result=sync({nature:state(nature,[shared[0]]),classic});
 assert.deepEqual(result.profiles.classic,classic);
 assert.equal(result.profiles.people.unlocked.includes(shared[0]),true);
});
test('Profiles never gain elements outside their family or unrelated normal elements',()=>{
 const solo=nature.items.find(x=>!membership.has(x)&&!nature.starters.includes(x));
 const result=sync({nature:state(nature,[solo,shared[0]]),people:state(people)});
 for(const c of cs)for(const id of result.profiles[c.id].unlocked)assert.ok(c.items.includes(id));
 assert.ok(!result.profiles.people.unlocked.includes(solo));
});
test('Runtime saves cross-family discoveries and picker counts inherited progress',()=>{
 const js=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(js,/familyProfiles=synchronizeFamilyProfiles\(familyProfiles,ALL_CAMPAIGNS\)\.profiles/g);
 assert.match(js,/familyProfiles\[currentFamilyId\]=snapshotPlayState\(\)/);
 assert.match(js,/familyProfiles\[f\.id\]\?\.unlocked/);
 assert.match(js,/if\(result\?\.earned!==true\)/);
});
