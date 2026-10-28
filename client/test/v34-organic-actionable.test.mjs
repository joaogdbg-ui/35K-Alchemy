import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {GAMING_V22} from '../src/gaming-pack-v22.js';
import {GAMING_V23} from '../src/gaming-pack-v23.js';
import {GAMING_V24} from '../src/gaming-pack-v24.js';
import {GAMING_V26} from '../src/gaming-pack-v26.js';
import {GAMING_V27} from '../src/gaming-pack-v27.js';
import {GAMING_V30} from '../src/gaming-pack-v30.js';
import {ORGANIC_V32} from '../src/organic-pack-v32.js';
import {ORGANIC_V34} from '../src/organic-pack-v34.js';
import {ORGANIC_ART_V34} from '../src/organic-art-v34.js';
const k=(a,b)=>[a,b].sort().join('|');
const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32];
const items=new Map(DATA.items.map(([name,category],i)=>['legacy:'+i,{name,category}]));
const recipes=new Map(DATA.recipes.map(([a,b,c])=>[k('legacy:'+a,'legacy:'+b),'legacy:'+c]));
for(const p of packs){for(const item of p.items)items.set(item.id,item);for(const [a,b,c]of p.recipes)if(!recipes.has(k(a,b)))recipes.set(k(a,b),c)}
const baseline=new Map(recipes);
test('V34 extends catalog by exactly 30 individual illustrations and 89 nonconflicting recipes',()=>{
 assert.equal(items.size,3414);assert.equal(baseline.size,8603);
 assert.equal(ORGANIC_V34.items.length,30);assert.equal(ORGANIC_V34.recipes.length,89);
 assert.equal(Object.keys(ORGANIC_ART_V34).length,30);
 const names=new Set([...items.values()].map(x=>x.name.toLowerCase()));
 for(const it of ORGANIC_V34.items){
  assert.ok(!items.has(it.id),it.id);assert.ok(!names.has(it.name.toLowerCase()),it.name);
  names.add(it.name.toLowerCase());items.set(it.id,it);
  assert.match(it.name,/^[\x20-\x7E]+$/);assert.ok(it.summary.length>35);
  const svg=ORGANIC_ART_V34[it.name.toLowerCase()];
  assert.ok(svg?.startsWith('<svg'),it.name);assert.doesNotMatch(svg,/<script|<image|<foreignObject|animation/i);
 }
 assert.equal(new Set(Object.values(ORGANIC_ART_V34)).size,30);
 for(const [a,b,out] of ORGANIC_V34.recipes){
  assert.ok(items.has(a)&&items.has(b)&&items.has(out),[a,b,out]);
  assert.ok(!recipes.has(k(a,b)),`Collision ${items.get(a).name} + ${items.get(b).name}`);
  recipes.set(k(a,b),out);
 }
 assert.equal(items.size,3444);assert.equal(recipes.size,8692);
 for(const [key,out] of baseline)assert.equal(recipes.get(key),out);
});
test('Every V34 addition is reachable and gets two or more organic recipes',()=>{
 const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 for(let pass=0;pass<80;pass++){
  const old=reached.size;
  for(const [key,out] of recipes){const [a,b]=key.split('|');if(reached.has(a)&&reached.has(b))reached.add(out)}
  if(old===reached.size)break;
 }
 assert.equal(reached.size,3444,'No unreachable islands in the full catalog');
 for(const it of ORGANIC_V34.items){
  assert.ok(reached.has(it.id),it.name);
  assert.ok(ORGANIC_V34.recipes.filter(r=>r[2]===it.id).length>=2,it.name);
 }
});
test('Family hints require two owned ingredients, honour themed collection and prefer unrevealed',()=>{
 const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(source,/currentSet\?\{ids:currentSet\.ids\}/);
 assert.match(source,/\.filter\(c=>c\.ready===2&&byId\.has\(c\.a\)&&byId\.has\(c\.b\)\)/);
 assert.match(source,/return choices\.find\(c=>c\.revealed!=='recipe'\)\|\|choices\[0\]/);
 assert.match(source,/const unseenReady=ready\.filter\(c=>hintState\.clues\[c\.out\]!=='recipe'\)/);
 assert.doesNotMatch(source,/hintState\.spent|freeHintBalance/);
});
