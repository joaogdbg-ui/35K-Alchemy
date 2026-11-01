import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V55} from '../src/organic-pack-v55.js';
import {ORGANIC_ART_V55} from '../src/organic-art-v55.js';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {buildCatalog} from '../src/catalog-integrity.js';
const pathNames=['gaming-pack-v22','gaming-pack-v23','gaming-pack-v24','gaming-pack-v26','gaming-pack-v27','gaming-pack-v30','organic-pack-v32','organic-pack-v34','organic-pack-v37','organic-pack-v38','organic-pack-v40','organic-pack-v41','organic-pack-v42','organic-pack-v43','organic-pack-v44','organic-pack-v45','organic-pack-v46','organic-pack-v47','organic-pack-v50','organic-pack-v52','organic-pack-v53'];
const oldPacks=[PACK];for(const path of pathNames)oldPacks.push(Object.values(await import(`../src/${path}.js`))[0]);
const old=buildCatalog(DATA,oldPacks),curr=buildCatalog(DATA,[...oldPacks,ORGANIC_V55]);
const app=readFileSync('client/src/app.js','utf8'),index=readFileSync('client/index.html','utf8');
test('V55 contains exactly 100 original concepts and 176 actionable new-result routes',()=>{
 assert.equal(ORGANIC_V55.items.length,100);assert.equal(ORGANIC_V55.recipes.length,176);
 assert.equal(curr.items.length,4171);assert.equal(curr.recipes.size,12461);
 const names=new Set(ORGANIC_V55.items.map(i=>i.name.toLowerCase()));assert.equal(names.size,100);
});
test('V55 changes no historic A+B results, including reversing the operands',()=>{
 for(const [key,out] of old.recipes)assert.equal(curr.recipes.get(key),out);
 for(const [a,b,r] of ORGANIC_V55.recipes)assert.equal(curr.recipes.get([a,b].sort().join('|')),r);
});
test('All V55 outputs are new and supported by at least one logical route',()=>{
 const outputs=new Set(ORGANIC_V55.items.map(i=>i.id));const counts=new Map();
 for(const [a,b,id] of ORGANIC_V55.recipes){assert(outputs.has(id));counts.set(id,(counts.get(id)||0)+1);assert.notEqual(a,id);assert.notEqual(b,id);}
 assert(ORGANIC_V55.items.every(i=>counts.get(i.id)>=1));
});
test('Every V55 concept has its own self-contained unique artwork',()=>{
 assert.equal(Object.keys(ORGANIC_ART_V55).length,100);
 assert.equal(new Set(Object.values(ORGANIC_ART_V55)).size,100);
 for(const it of ORGANIC_V55.items){const svg=ORGANIC_ART_V55[it.name.toLowerCase()];assert(svg.startsWith('<svg'));assert(!/<image\b|<script\b|href=|onload=/.test(svg));}
});
test('V55 Sort replaces Recent with A-Z, Old first, New first in the same compact row',()=>{
 assert.match(index,/id="recentBtn" class="tool-chip sort-button"/); // V127 tool chips
 for(const label of ['A–Z','Old first','New first'])assert(app.includes(label));
 assert.match(app,/sortChoice==='old'\|\|sortChoice==='new'/);
 assert.match(app,/playVirtual\.refresh\(\)/);
});
test('V55 sorting is stored and does not alter discovery progress',()=>{
 assert.match(app,/const SORT_KEY='35k_inventory_sort_v55'/);
 assert.match(app,/localStorage\.setItem\(SORT_KEY,sortChoice\)/);
 assert.match(app,/const rank=new Map\(discoveryOrder\.map/);
 assert.match(app,/ids\.sort\(\(a,b\)=>sortChoice==='old'/);
});
test('V55 online-free bundling keeps 2 Family Only campaigns untouched',()=>{
 assert.match(app,/family-mode-v53-campaigns\.js/);
 assert.match(app,/family-shared-v51\.js/);
 assert.match(app,/ORGANIC_V53,ORGANIC_V55/);
});
test('V55 growth over V54 is below 1 MB in the offline file',()=>{
 const {size:oldSize}=JSON.parse(readFileSync('shared/v55-build-sizes.json','utf8')).v54;
 const {size:newSize}=JSON.parse(readFileSync('shared/v55-build-sizes.json','utf8')).v55;
 assert(newSize>oldSize&&newSize-oldSize<1024*1024);
});
