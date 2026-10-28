import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILY_CAMPAIGNS } from '../src/family-mode-v53-campaigns.js';
import { eligibleFamilyMerge, mergeIntoClassicState, verifyMergePending } from '../src/family-merge-v60.js';
const [nature,people]=FAMILY_CAMPAIGNS.families;
const catalog=new Map([...new Set([...nature.items,...people.items])].map(id=>[id,{id}]));
const starters=new Set(FAMILY_CAMPAIGNS.families.flatMap(f=>f.starters));
const shared=nature.items.find(id=>people.items.includes(id)&&!starters.has(id));
const natureOnly=nature.items.find(id=>!people.items.includes(id)&&!starters.has(id));
const peopleOnly=people.items.find(id=>!nature.items.includes(id)&&!starters.has(id));
const profiles=()=>({nature:{unlocked:[...nature.starters,shared,natureOnly],order:[...nature.starters,shared,natureOnly]},people:{unlocked:[...people.starters,shared,peopleOnly],order:[...people.starters,shared,peopleOnly]}});

test('V60 collects only earned, valid Family Only discoveries; shared ID is transferred once',()=>{
 const c=eligibleFamilyMerge(profiles(),FAMILY_CAMPAIGNS.families,[],catalog);
 assert.equal(c.ids.length,3);assert.deepEqual(new Set(c.ids),new Set([shared,natureOnly,peopleOnly]));
 assert.equal(c.byFamily.nature,2);assert.equal(c.byFamily.people,2);
});
test('V60 never transfers unearned family starter ingredients, including shared starters',()=>{
 const p={nature:{unlocked:[...nature.starters]},people:{unlocked:[...people.starters]}};
 assert.deepEqual(eligibleFamilyMerge(p,FAMILY_CAMPAIGNS.families,[],catalog).ids,[]);
});
test('V60 excludes already owned Classic entries and forged IDs outside family membership',()=>{
 const p=profiles();p.nature.unlocked.push('bogus:id',peopleOnly);
 const c=eligibleFamilyMerge(p,FAMILY_CAMPAIGNS.families,[shared],catalog);
 assert.deepEqual(new Set(c.ids),new Set([natureOnly,peopleOnly]));
});
test('V60 supports older family saves lacking discovery order',()=>{
 const p={nature:{unlocked:[...nature.starters,natureOnly]}};
 assert.deepEqual(eligibleFamilyMerge(p,FAMILY_CAMPAIGNS.families,[],catalog).ids,[natureOnly]);
});
test('V60 merges IDs without changing recipes, known pairs, original ledger or last discovery',()=>{
 const initial={unlocked:['legacy:0'],known:['1|2'],recent:['legacy:0'],last:'legacy:0',ledger:[['legacy:0',{at:'2020'}]],order:['legacy:0'],clues:{abc:'recipe'}};
 const merged=mergeIntoClassicState(initial,[natureOnly,peopleOnly,natureOnly],catalog,'2026-10-28T00:00:00Z');
 assert.deepEqual(merged.unlocked,['legacy:0',natureOnly,peopleOnly]);
 assert.deepEqual(merged.known,initial.known);assert.equal(merged.last,initial.last);assert.deepEqual(merged.clues,initial.clues);
 assert.equal(merged.ledger.find(([id])=>id===natureOnly)[1].source,'family-merge');
 assert.equal(merged.ledger.find(([id])=>id==='legacy:0')[1].at,'2020');
});
test('V60 repeated merge is idempotent and preserves chronological unlock order',()=>{
 const old={unlocked:[],order:[],ledger:[],recent:[],known:[]};
 const once=mergeIntoClassicState(old,[natureOnly,peopleOnly],catalog,'2026-10-28');
 const twice=mergeIntoClassicState(once,[peopleOnly,natureOnly],catalog,'2026-10-29');
 assert.deepEqual(twice,once);
});
test('V60 rejects missing, malformed or fake partial ad credit documents',()=>{
 assert.equal(verifyMergePending({v:1,completed:1,ids:[natureOnly]}),true);
 assert.equal(verifyMergePending({v:1,completed:2,ids:[natureOnly]}),true);
 for(const x of [{v:2,completed:1,ids:[natureOnly]},{v:1,completed:3,ids:[natureOnly]},{v:1,completed:1,ids:[]},{v:1,completed:1,ids:[2]},null]) assert.equal(verifyMergePending(x),false);
});
test('V60 runtime displays two distinct opt-in ads and never uses HTML fake rewards',()=>{
 const code=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const markup=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(code,/if\(reward\?\.earned!==true\)/);
 assert.match(code,/showRewarded\(\{kind:'merge_to_classic',step,total:2/);
 assert.match(code,/if\(step===1\)\{mergeModal\(\);return;\}/);
 assert.match(code,/mergePending\.completed=step/);
 assert.match(code,/persistClassicSnapshot\(result\)/);
 assert.match(markup,/id="mergeClassicBtn"/);
 assert.doesNotMatch(code, /fakeAdReward|simulateMergeReward|setTimeout\(.*earned:true/);
});
