import test from 'node:test';
import assert from 'node:assert/strict';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {FAMILIES, familyFor, groupFamilies, recipesForTarget, candidatesForFamily} from '../src/discoveries.js';
const items=[...DATA.items.map(([name,category,year,note],i)=>({id:`legacy:${i}`,name,category,year,note})),...PACK.items];
const itemMap=new Map(items.map(item=>[item.id,item]));
const pk=(a,b)=>[a,b].sort().join('|');
const recipes=new Map(DATA.recipes.map(([a,b,o])=>[pk(`legacy:${a}`,`legacy:${b}`),`legacy:${o}`]));
for(const [a,b,o] of PACK.recipes){if(!recipes.has(pk(a,b)))recipes.set(pk(a,b),o);}
const initial=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
test('all 2774 original V19 element IDs preserved',()=>{
 assert.equal(items.length,2774);assert.equal(itemMap.size,2774);assert.equal(recipes.size,5078);
});
test('every element maps to one of the nine visible families',()=>{
 assert.equal(FAMILIES.length,9);
 const ids=new Set(FAMILIES.map(f=>f.id));
 for(const item of items)assert.ok(ids.has(familyFor(item)),item.name);
 const groups=groupFamilies(items,initial);
 assert.equal(Object.values(groups).reduce((n,g)=>n+g.total,0),2774);
 assert.equal(Object.values(groups).reduce((n,g)=>n+g.found,0),4);
 assert.ok(groups.games.total>300);
});
test('all unknown elements are available for four-character placeholder without exposing names',()=>{
 const groups=groupFamilies(items,initial);
 const unknown=Object.values(groups).flatMap(g=>g.ids).filter(id=>!initial.has(id));
 assert.equal(unknown.length,2770);
 assert.ok(unknown.every(id=>itemMap.has(id)));
});
test('recipe hints are tied to actual catalog combinations',()=>{
 const groups=groupFamilies(items,initial);
 const available=candidatesForFamily(groups.nature,initial,recipes,{});
 assert.ok(available.length>0);
 const each=available[0];
 assert.ok(itemMap.has(each.a)&&itemMap.has(each.b));
 assert.equal(recipes.get(pk(each.a,each.b)),each.id);
 assert.ok(each.ready>=0&&each.ready<=2);
});
test('ingredients for target include multiple paths where available',()=>{
 const target=[...recipes.values()].find(id=>recipesForTarget(id,recipes,initial).length>1);
 assert.ok(target);
 for(const pair of recipesForTarget(target,recipes,initial))assert.equal(recipes.get(pk(pair.a,pair.b)),target);
});
test('family-restricted candidate selection never chooses an unlocked element',()=>{
 const groups=groupFamilies(items,initial);
 for(const group of Object.values(groups))for(const c of candidatesForFamily(group,initial,recipes,{})){
  assert.ok(group.ids.includes(c.id));assert.ok(!initial.has(c.id));
  assert.equal(recipes.get(pk(c.a,c.b)),c.id);
 }
});
