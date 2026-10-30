import test from 'node:test';
import assert from 'node:assert/strict';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {GAMING_V22} from '../src/gaming-pack-v22.js';
import {groupFamilies, recipesForTarget} from '../src/discoveries.js';
const pk=(a,b)=>[a,b].sort().join('|');
const old=[...DATA.items.map(([name,category],i)=>({id:`legacy:${i}`,name,category})),...PACK.items];
const all=[...old,...GAMING_V22.items], ids=new Set(all.map(i=>i.id));
const oldRec=new Map(DATA.recipes.map(([a,b,o])=>[pk(`legacy:${a}`,`legacy:${b}`),`legacy:${o}`]));
for(const [a,b,o] of PACK.recipes)if(!oldRec.has(pk(a,b)))oldRec.set(pk(a,b),o);
const map=new Map(oldRec);for(const [a,b,o] of GAMING_V22.recipes)map.set(pk(a,b),o);
test('V22 has exactly the audited additive item/recipe totals',()=>{
 assert.equal(old.length,2774);assert.equal(oldRec.size,5078);
 assert.equal(all.length,2962);assert.equal(map.size,6986);
 assert.equal(GAMING_V22.items.length,188);assert.equal(GAMING_V22.recipes.length,1908);
 assert.equal(ids.size,all.length);
});
test('old recipe outputs and old catalog IDs stay identical',()=>{
 for(const [key,o] of oldRec)assert.equal(map.get(key),o,key);
});
test('new recipes reference existing IDs and no recipe key has been reused',()=>{
 const seen=new Set();for(const [a,b,o] of GAMING_V22.recipes){assert.ok(ids.has(a));assert.ok(ids.has(b));assert.ok(ids.has(o));const key=pk(a,b);assert.ok(!oldRec.has(key));assert.ok(!seen.has(key));seen.add(key);}
});
test('new games are reachable from original four starters',()=>{
 const found=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);let changed=true;
 while(changed){changed=false;for(const [key,result] of map){const [a,b]=key.split('|');if(found.has(a)&&found.has(b)&&!found.has(result)){found.add(result);changed=true;}}}
 for(const item of GAMING_V22.items)assert.ok(found.has(item.id),`Unreachable: ${item.name}`);
});
test('game entries have reverse recipes and belong to discoveries families',()=>{
 const found=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);const g=groupFamilies(all,found);
 assert.equal(new Set(Object.values(g).flatMap(v=>v.ids)).size,2962);
 for(const it of GAMING_V22.items){assert.ok(g.games.ids.includes(it.id),it.name);assert.ok(recipesForTarget(it.id,map,found).some(p=>p.a!==it.id&&p.b!==it.id),it.name);}
});
