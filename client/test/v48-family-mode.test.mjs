import test from 'node:test';
import assert from 'node:assert/strict';
import {FAMILY_CAMPAIGNS} from '../src/family-mode-v48.js';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {buildCatalog} from '../src/catalog-integrity.js';
import {familyFor} from '../src/discoveries.js';
const packs=[PACK];
for(const name of ['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47']){
 const mod=await import('../src/'+name.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js');
 packs.push(Object.values(mod)[0]);
}
const {items,recipes:classic}=buildCatalog(DATA,packs);
const byId=new Map(items.map(x=>[x.id,x]));
const campaign=FAMILY_CAMPAIGNS.families.find(x=>x.id==='nature');
const cRecipes=new Map(campaign.recipes);
const ids=new Set(campaign.items);
const starters=new Set(campaign.starters);

test('V48 Classic recipe map frozen',()=>{
 assert.equal(items.length,3963);assert.equal(classic.size,12069);
});
test('Family only exactly four unique nature starters',()=>{
 assert.equal(starters.size,4);
 assert.deepEqual([...starters].map(id=>byId.get(id).name),['Water','Fire','Earth','Air']);
});
test('All Nature & Science elements are visible and only Nature & Science elements',()=>{
 assert.equal(ids.size,393);
 assert.deepEqual(ids,new Set(items.filter(x=>familyFor(x)==='nature').map(x=>x.id)));
});
test('Family recipes are unordered, unique, within one family and never override Classic',()=>{
 assert.equal(cRecipes.size,campaign.recipes.length);
 assert.equal(cRecipes.size,1646);
 for(const [pair,out] of cRecipes){
  const [a,b]=pair.split('|');
  assert.ok(a<=b,'canonical ingredient ordering');
  for(const id of [a,b,out])assert.ok(ids.has(id),'out-of-family ingredient or result');
  const earlier=classic.get(pair);
  if(earlier)assert.equal(earlier,out,'classic result must remain the same');
 }
});
test('Every family-only item reachable from just four starters',()=>{
 const seen=new Set(starters);
 for(let i=0;i<393;i++){
  const previous=seen.size;
  for(const [pair,out] of cRecipes){const [a,b]=pair.split('|');if(seen.has(a)&&seen.has(b))seen.add(out);}
  if(seen.size===previous)break;
 }
 assert.equal(seen.size,ids.size);
});
test('V48 contains no browser-side developer bypass of required rewarded mode switch',async()=>{
 const {readFileSync}=await import('node:fs');
 const code=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.doesNotMatch(code,/__V48_PREVIEW|Preview switch · No Ad|if\(preview\)/);
 assert.match(code,/result\?\.earned!==true/);
 assert.match(code,/showRewarded\(\{kind:'mode_switch'/);
});
