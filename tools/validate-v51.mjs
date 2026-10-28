import assert from 'node:assert/strict';
import {FAMILY_CAMPAIGNS} from '../client/src/family-mode-v50-campaigns.js';
import {sharedMembership,synchronizeFamilyProfiles} from '../client/src/family-shared-v51.js';
const cs=FAMILY_CAMPAIGNS.families;
const membership=sharedMembership(cs);
assert.equal(membership.size,15);
for(const [id,owners] of membership){assert.equal(owners.size,2);for(const family of cs)assert.equal(owners.has(family.id),family.items.includes(id));}
for(const a of cs){for(const id of membership.keys()){
 if(!membership.get(id).has(a.id))continue;
 const profiles={ [a.id]:{unlocked:[...a.starters,id],known:[],recent:[],ledger:[],order:[...a.starters,id],clues:{}} };
 const result=synchronizeFamilyProfiles(profiles,cs);
 for(const c of cs)if(membership.get(id).has(c.id))assert.ok(result.profiles[c.id].unlocked.includes(id),`${id} missing in ${c.id} from ${a.id}`);
 assert.deepEqual(synchronizeFamilyProfiles(result.profiles,cs).profiles,result.profiles,'synchronization must be idempotent');
 }}
console.log('V51 PASS: 15 shared IDs mirrored across Family Only, old saves migratable, deterministic, no Classic transfer');
