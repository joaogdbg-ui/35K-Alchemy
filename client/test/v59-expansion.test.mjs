import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA } from '../src/legacy-data.js';
import { PACK } from '../src/creative-pack.js';
import { buildCatalog,normalizeCatalogName } from '../src/catalog-integrity.js';
import { ORGANIC_V59 } from '../src/organic-pack-v59.js';
import { ORGANIC_ART_V59 } from '../src/organic-art-v59.js';
const base=['gaming-v22','gaming-v23','gaming-v24','gaming-v26','gaming-v27','gaming-v30','organic-v32','organic-v34','organic-v37','organic-v38','organic-v40','organic-v41','organic-v42','organic-v43','organic-v44','organic-v45','organic-v46','organic-v47','organic-v50','organic-v52','organic-v53'];
const packs=[PACK];for(const n of base)packs.push(Object.values(await import('../src/'+n.replace('gaming','gaming-pack').replace('organic','organic-pack')+'.js'))[0]);
for(const n of [55,56,57,58])packs.push(Object.values(await import(`../src/organic-pack-v${n}.js`))[0]);
const before=buildCatalog(DATA,packs),after=buildCatalog(DATA,[...packs,ORGANIC_V59]);
test('V59 has precisely 200 unique new discoveries and source names',()=>{
 assert.equal(ORGANIC_V59.items.length,200);assert.equal(new Set(ORGANIC_V59.items.map(i=>normalizeCatalogName(i.name))).size,200);
 assert.equal(after.items.length,4871);assert.equal(after.recipes.size,13208);
});
test('V59 never overwrites the unordered result of any old pair',()=>{
 for(const [k,out] of before.recipes)assert.equal(after.recipes.get(k),out,k);
 for(const [a,b,result] of ORGANIC_V59.recipes)assert.equal(after.recipes.get([b,a].sort().join('|')),result);
});
test('V59 results are all new IDs and have individual nonempty vector graphics',()=>{
 const ids=new Set(ORGANIC_V59.items.map(x=>x.id));
 assert.equal(Object.keys(ORGANIC_ART_V59).length,200);
 assert.equal(new Set(Object.values(ORGANIC_ART_V59)).size,200);
 for(const row of ORGANIC_V59.items){assert.ok(ids.has(row.id));assert.match(ORGANIC_ART_V59[row.name.toLowerCase()],/^<svg/)}
 for(const [,,output] of ORGANIC_V59.recipes)assert.ok(ids.has(output));
});
test('V59 uses already-discoverable ingredients and never duplicates pair keys',()=>{
 const prior=new Set(before.items.map(i=>i.id)),seen=new Set();
 for(const [a,b] of ORGANIC_V59.recipes){assert.ok(prior.has(a)&&prior.has(b));const k=[a,b].sort().join('|');assert.ok(!seen.has(k)&&!before.recipes.has(k));seen.add(k)}
});
test('V59 names remain globally unique',()=>{
 assert.equal(new Set(after.items.map(x=>normalizeCatalogName(x.name))).size,after.items.length);
});
