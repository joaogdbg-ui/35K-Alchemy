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
import {ORGANIC_V37} from '../src/organic-pack-v37.js';
import {ORGANIC_ART_V37} from '../src/organic-art-v37.js';
const key=(a,b)=>[a,b].sort().join('|');
const items=new Map(DATA.items.map(([name],i)=>['legacy:'+i,name]));
const recipes=new Map(DATA.recipes.map(([a,b,c])=>[key('legacy:'+a,'legacy:'+b),'legacy:'+c]));
const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34];
for(const p of packs){for(const it of p.items)items.set(it.id,it.name);for(const [a,b,c] of p.recipes)if(!recipes.has(key(a,b)))recipes.set(key(a,b),c);}
const before=new Map(recipes);
test('V37 adds 36 distinct authored discoveries and 103 collision-free organic recipes',()=>{
 assert.equal(items.size,3444);assert.equal(recipes.size,8692);
 assert.equal(ORGANIC_V37.items.length,36);assert.equal(ORGANIC_V37.recipes.length,103);
 assert.equal(Object.keys(ORGANIC_ART_V37).length,36);
 const names=new Set([...items.values()].map(n=>n.toLowerCase()));
 for(const it of ORGANIC_V37.items){
  assert.ok(!items.has(it.id),it.id); assert.ok(!names.has(it.name.toLowerCase()),it.name);
  assert.ok(it.summary.length>35,it.name);
  const svg=ORGANIC_ART_V37[it.name.toLowerCase()];
  assert.ok(svg?.startsWith('<svg')&&svg.endsWith('</svg>'),it.name);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|animation|onload=|href=|<text/i);
  names.add(it.name.toLowerCase());items.set(it.id,it.name);
 }
 assert.equal(new Set(Object.values(ORGANIC_ART_V37)).size,36);
 for(const [a,b,c] of ORGANIC_V37.recipes){
  assert.ok(items.has(a)&&items.has(b)&&items.has(c),[a,b,c].join(' + '));
  const k=key(a,b); assert.ok(!recipes.has(k),'prior recipe overwritten: '+k); recipes.set(k,c);
 }
 assert.equal(items.size,3480);assert.equal(recipes.size,8795);
 for(const [k,v] of before)assert.equal(recipes.get(k),v,'existing recipe changed');
});
test('Every V37 concept reachable from the original four starters with >=2 nonduplicate recipes',()=>{
 const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 for(let pass=0;pass<100;pass++){
  const old=reached.size;
  for(const [k,out] of recipes){const [a,b]=k.split('|');if(reached.has(a)&&reached.has(b))reached.add(out)}
  if(old===reached.size)break;
 }
 assert.equal(reached.size,3480,'Catalog islands are forbidden');
 for(const it of ORGANIC_V37.items){assert.ok(reached.has(it.id),it.name);assert.ok(ORGANIC_V37.recipes.filter(r=>r[2]===it.id).length>=2,it.name);}
});
test('V37 packs are wired into source and offline build without changing saved-game keys',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 for(const marker of ['ORGANIC_V37','ORGANIC_ART_V37[itemName]','buildCatalog(DATA,'])assert.ok(app.includes(marker),marker);
 for(const marker of ['organic-pack-v37.js','organic-art-v37.js','__gameverseOrganic37','__gameverseOrganicArt37'])assert.ok(build.includes(marker),marker);
 for(const marker of ['gameverse_alchemy_v2','gameverse_dynamic_v11','gameverse_discovery_hints_v20','35k_discovery_order_v35'])assert.ok(app.includes(marker),marker);
});
