import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import { DATA } from '../src/legacy-data.js';
import { PACK } from '../src/creative-pack.js';
import { GAMING_V22 } from '../src/gaming-pack-v22.js';
import { GAMING_V23 } from '../src/gaming-pack-v23.js';
import { GAMING_V24 } from '../src/gaming-pack-v24.js';
import { GAMING_V26 } from '../src/gaming-pack-v26.js';
import { GAMING_V27 } from '../src/gaming-pack-v27.js';
import { GAMING_V30 } from '../src/gaming-pack-v30.js';
import { ORGANIC_V32 } from '../src/organic-pack-v32.js';
import { ORGANIC_V34 } from '../src/organic-pack-v34.js';
import { ORGANIC_V37 } from '../src/organic-pack-v37.js';
import { ORGANIC_V38 } from '../src/organic-pack-v38.js';
import { ORGANIC_ART_V38 } from '../src/organic-art-v38.js';
const key=(a,b)=>[a,b].sort().join('|');
const items=new Map(DATA.items.map(([name],i)=>['legacy:'+i,name]));
const recipes=new Map(DATA.recipes.map(([a,b,c])=>[key('legacy:'+a,'legacy:'+b),'legacy:'+c]));
const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37];
for(const pack of packs){for(const it of pack.items)items.set(it.id,it.name);for(const [a,b,c] of pack.recipes)if(!recipes.has(key(a,b)))recipes.set(key(a,b),c);}
const names=new Set([...items.values()].map(s=>s.toLowerCase()));
const oldRecipes=new Map(recipes);
test('V38: 78 new canonical names, 78 original icons, 203 nonconflicting recipes',()=>{
 assert.equal(items.size,3480);assert.equal(recipes.size,8795);
 assert.equal(ORGANIC_V38.items.length,78);assert.equal(ORGANIC_V38.recipes.length,203);
 assert.equal(Object.keys(ORGANIC_ART_V38).length,78);
 assert.equal(new Set(Object.values(ORGANIC_ART_V38)).size,78);
 for(const it of ORGANIC_V38.items){
  assert.ok(!items.has(it.id),it.id);assert.ok(!names.has(it.name.toLowerCase()),it.name);
  assert.ok(it.id.startsWith('organic38:'));assert.ok(it.summary.length>=30,it.name);
  assert.ok(['nature','life','science','material','technology','culture'].includes(it.category));
  const svg=ORGANIC_ART_V38[it.name.toLowerCase()];
  assert.ok(svg?.startsWith('<svg')&&svg.endsWith('</svg>'),it.name);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|animate|onload=|href=|<text|<use/i,it.name);
  assert.ok(svg.length>300,it.name);
  items.set(it.id,it.name); names.add(it.name.toLowerCase());
 }
 for(const [a,b,c] of ORGANIC_V38.recipes){
  assert.ok(items.has(a)&&items.has(b)&&items.has(c),[a,b,c]);
  const k=key(a,b);assert.ok(!recipes.has(k),'recipe collision: '+k);recipes.set(k,c);
 }
 assert.equal(items.size,3558);assert.equal(recipes.size,8998);
 for(const [k,result] of oldRecipes)assert.equal(recipes.get(k),result,'changed prior recipe '+k);
});
test('V39: all 3,558 playable elements are reachable; every new result has 2+ recipes',()=>{
 const reachable=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 let rounds=0;
 for(;rounds<120;rounds++){
  const before=reachable.size;
  for(const [k,out] of recipes){const [a,b]=k.split('|');if(reachable.has(a)&&reachable.has(b))reachable.add(out);}
  if(before===reachable.size)break;
 }
 assert.equal(reachable.size,3558);
 for(const it of ORGANIC_V38.items){
  assert.ok(reachable.has(it.id));
  const paths=ORGANIC_V38.recipes.filter(x=>x[2]===it.id);
  assert.ok(paths.length>=2,`${it.name} has ${paths.length} recipes`);
 }
});
test('V38: icon registry and offline bundle wired, stable save keys retained',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V39_Offline.html',import.meta.url),'utf8');
 for(const marker of ['ORGANIC_V38','ORGANIC_ART_V38[itemName]','buildCatalog(DATA,'])assert.ok(app.includes(marker),marker);
 for(const marker of ['organic-pack-v38.js','organic-art-v38.js','__gameverseOrganic38','__gameverseOrganicArt38'])assert.ok(build.includes(marker),marker);
 for(const marker of ['gameverse_alchemy_v2','gameverse_dynamic_v11','gameverse_discovery_hints_v20','35k_discovery_order_v35'])assert.ok(app.includes(marker),marker);
 assert.ok(html.includes('ORGANIC_V38'));assert.ok(html.includes('V39 Offline'));
 assert.ok(!html.includes('src="./src/app.js"'));
});
