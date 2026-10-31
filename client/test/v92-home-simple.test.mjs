import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V92: houses give growth multipliers (future gains only), better house = bigger multiplier',async()=>{
 const {HOUSE_GROWTH,growthMultiplier}=await import('../src/home-engine-v90.js');
 const caps=[1,2,3,4,6,8];for(let i=1;i<caps.length;i++)assert.ok(HOUSE_GROWTH[caps[i]]>HOUSE_GROWTH[caps[i-1]]);
 const objects={t:{effect:'run'},u:{effect:'run'},v:{effect:'run'},w:{effect:'run'},x:{effect:'run'}};
 assert.equal(growthMultiplier(2,{furniture:[]},objects,'run'),1.2);
 assert.equal(growthMultiplier(2,{furniture:[{id:'t'}]},objects,'run'),1.38);
 assert.equal(growthMultiplier(1,{furniture:['t','u','v','w','x'].map(id=>({id}))},objects,'run'),1.76,'furniture bonus capped at +60%');
 const eng=src('client/src/companion-engine-v86.js');
 assert.match(eng,/feedPlan\(meta,item\)\.map\(c=>\(\{\.\.\.c,amount:Math\.round\(c\.amount\*growth\(meta\.id,c\.stat\)\)\}\)\)/);
 assert.doesNotMatch(eng,/stats\[[^\]]+\]\.level\s*\*=?\s*growth/,'multipliers never touch stored stats');
});
test('V92: Home tab is a compact roster; taps open stats; house chips open info',()=>{
 const eng=src('client/src/companion-engine-v86.js'),home=src('client/src/home-engine-v90.js');
 assert.match(eng,/class="pets-avatars"/);assert.match(eng,/root\.querySelectorAll\('\[data-card\]'\)\.forEach\(b=>b\.onclick=\(\)=>openCard/);
 assert.match(eng,/<details class="pets-help">/);
 assert.match(home,/forEach\(b=>b\.onclick=\(\)=>houseInfo\(mount,b\.dataset\.house\)\)/);
 assert.match(home,/\$\{statsHtml\?\.\(cid\)\|\|''\}/);
});
