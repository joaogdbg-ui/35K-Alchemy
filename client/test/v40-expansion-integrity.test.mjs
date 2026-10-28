import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
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
import {ORGANIC_V38} from '../src/organic-pack-v38.js';
import {ORGANIC_V40} from '../src/organic-pack-v40.js';
import {ORGANIC_ART_V40} from '../src/organic-art-v40.js';
import {buildCatalog,normalizeCatalogName} from '../src/catalog-integrity.js';
const old=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38];
const key=(a,b)=>[a,b].sort().join('|');
const paths=Map.groupBy?.(ORGANIC_V40.recipes, row=>row[2]) || null;

test('V40: 64 new elements, 128 curated unique unordered recipes, unchanged prior recipes',()=>{
 const before=buildCatalog(DATA,old),after=buildCatalog(DATA,[...old,ORGANIC_V40]);
 assert.equal(before.items.length,3558);assert.equal(before.recipes.size,8998);
 assert.equal(after.items.length,3622);assert.equal(after.recipes.size,9126);
 for(const [pair,result] of before.recipes) assert.equal(after.recipes.get(pair),result,'changed historical recipe: '+pair);
 assert.equal(new Set(after.items.map(x=>normalizeCatalogName(x.name))).size,after.items.length);
 assert.equal(new Set(after.items.map(x=>x.id)).size,after.items.length);
 for(const item of ORGANIC_V40.items) assert.equal(ORGANIC_V40.recipes.filter(row=>row[2]===item.id).length,2,`${item.name} requires two valid paths`);
});

test('V40: illustrated icons are original standalone static SVGs, complete and unique',()=>{
 assert.equal(ORGANIC_V40.items.length,64);
 assert.equal(Object.keys(ORGANIC_ART_V40).length,64);
 assert.equal(new Set(Object.values(ORGANIC_ART_V40)).size,64);
 for(const item of ORGANIC_V40.items){
  const svg=ORGANIC_ART_V40[item.name.toLowerCase()];
  assert.ok(svg?.startsWith('<svg')&&svg.endsWith('</svg>'),item.name);
  assert.ok(svg.length>300,item.name);
  assert.doesNotMatch(svg,/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i,item.name);
  assert.ok(existsSync(new URL(`../assets/v40/${item.id.split(':')[1]}.svg`,import.meta.url)),`missing source SVG ${item.id}`);
  assert.ok(item.summary.length>45,`incomplete description ${item.name}`);
 }
});

test('V40: critical connected narrative recipes are present as authored',()=>{
 const catalog=buildCatalog(DATA,[...old,ORGANIC_V40]);
 const byName=new Map(catalog.items.map(i=>[i.name,i.id]));
 for(const [a,b,out] of [
  ['Stone','Space','Asteroid'], ['Asteroid','Fire','Meteor'],['Meteor','Earth','Meteorite'],
  ['Moon','Sun','Eclipse'],['Bird','Tree','Nest'],['Forest','Plant','Deer'],
  ['Rhythm','Drum','Beat'],['Clock','Melody','Music Box'],
  ['Electricity','Gear','Motor'],['Mud','Tool','Pottery'],['Pottery','Kiln','Ceramic']
 ]){
  assert.equal(catalog.recipes.get(key(byName.get(a),byName.get(b))),byName.get(out),`${a}+${b} => ${out}`);
 }
});

test('V40: strict catalog prevents future duplicates across old and new packs',()=>{
 assert.throws(()=>buildCatalog(DATA,[...old,ORGANIC_V40,{items:[{id:'test:fake',name:'  black HOLE  '}],recipes:[]}],{checkReachability:false}),/duplicate name/);
 assert.throws(()=>buildCatalog(DATA,[...old,ORGANIC_V40,{items:[{...ORGANIC_V40.items[0],name:'Other Comet'}],recipes:[]}],{checkReachability:false}),/duplicate ID/);
 const [a,b,c]=ORGANIC_V40.recipes[0];
 assert.throws(()=>buildCatalog(DATA,[...old,ORGANIC_V40,{items:[],recipes:[[b,a,c]]}],{checkReachability:false}),/duplicate unordered recipe/);
});

test('V40: builder, browser and build-time validator all depend on new canonical pack',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const builder=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const validator=readFileSync(new URL('../../tools/validate-catalog.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V40_Offline.html',import.meta.url),'utf8');
 for(const marker of ['ORGANIC_V40','ORGANIC_ART_V40[itemName]','buildCatalog(DATA,'])assert.ok(app.includes(marker));
 assert.match(builder,/check=True/);
 for(const marker of ['organic-pack-v40.js','organic-art-v40.js','__gameverseOrganic40','__gameverseOrganicArt40'])assert.ok(builder.includes(marker),marker);
 assert.ok(validator.includes('ORGANIC_V40'));
 assert.ok(html.includes('V40 Offline')&&html.includes('ORGANIC_V40'));
 assert.ok(!html.includes('src="./src/app.js"'));
});
