import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
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
import {ORGANIC_V41} from '../src/organic-pack-v41.js';
import {ORGANIC_V42} from '../src/organic-pack-v42.js';
import {ORGANIC_ART_V42} from '../src/organic-art-v42.js';
import {buildCatalog,normalizeCatalogName} from '../src/catalog-integrity.js';
const prior=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30,ORGANIC_V32,ORGANIC_V34,ORGANIC_V37,ORGANIC_V38,ORGANIC_V40,ORGANIC_V41];
const plan=JSON.parse(readFileSync(new URL('../../shared/v42-editorial-plan.json',import.meta.url),'utf8'));
const manifest=JSON.parse(readFileSync(new URL('../../shared/v42-art-manifest.json',import.meta.url),'utf8'));
const pair=(a,b)=>[a,b].sort().join('|');

test('V42: 64 editorial additions, 128 new unordered pairs, no historic recipe altered',()=>{
 const prev=buildCatalog(DATA,prior),next=buildCatalog(DATA,[...prior,ORGANIC_V42]);
 assert.equal(prev.items.length,3702);assert.equal(prev.recipes.size,9286);
 assert.equal(next.items.length,3766);assert.equal(next.recipes.size,9414);
 for(const [k,v] of prev.recipes)assert.equal(next.recipes.get(k),v,`changed prior recipe: ${k}`);
 assert.equal(new Set(next.items.map(x=>normalizeCatalogName(x.name))).size,3766);
 assert.equal(new Set(next.items.map(x=>x.id)).size,3766);
});
test('V42: four thematic branches of 16 names, two valid different routes for each',()=>{
 assert.equal(plan.length,64);assert.equal(ORGANIC_V42.items.length,64);assert.equal(ORGANIC_V42.recipes.length,128);
 for(let i=0;i<4;i++)assert.equal(new Set(plan.slice(i*16,i*16+16).map(p=>p.name)).size,16);
 const cat=buildCatalog(DATA,[...prior,ORGANIC_V42]);const ids=new Map(cat.items.map(i=>[i.name,i.id]));
 for(const row of plan){
  assert.equal(row.paths.length,2,row.name);
  assert.equal(ORGANIC_V42.recipes.filter(r=>r[2]===row.id).length,2,row.name);
  for(const [a,b] of row.paths)assert.equal(cat.recipes.get(pair(ids.get(a),ids.get(b))),row.id,`${a}+${b}`);
 }
});
test('V42: 64 independent authored SVGs are byte-identical with valid manifest and no external content',()=>{
 assert.equal(manifest.icons.length,64);assert.equal(Object.keys(ORGANIC_ART_V42).length,64);
 assert.equal(new Set(Object.values(ORGANIC_ART_V42)).size,64);
 for(const item of ORGANIC_V42.items){
  const svg=ORGANIC_ART_V42[item.name.toLowerCase()],m=manifest.icons.find(e=>e.id===item.id);
  assert.ok(m,item.name);assert.ok(svg?.length>340,item.name);
  const path=new URL('../../'+m.path,import.meta.url);assert.ok(existsSync(path));
  const src=readFileSync(path,'utf8');assert.equal(src,svg,item.name);
  assert.equal(createHash('sha256').update(src).digest('hex'),m.sha256,item.name);
  assert.doesNotMatch(src,/<script|<image|<foreignObject|<animate|onload=|href=|<text|<use/i,item.name);
 }
});
test('V42: each category has concrete chain recipes, not merely disconnected additions',()=>{
 const cat=buildCatalog(DATA,[...prior,ORGANIC_V42]);const ids=new Map(cat.items.map(i=>[i.name,i.id]));
 for(const [a,b,out] of [
  ['Cave','Water','Stalactite'],['Stalactite','Earth','Stalagmite'],['Limestone','Pressure','Marble'],
  ['Forest','Sea','Mangrove'],['Frog','Pond','Tadpole'],['Clam','Rock','Mussel'],
  ['Pastry','Butter','Croissant'],['Pancake','Tool','Waffle'],['Sugar','Heat','Caramel'],
  ['Camera','Glass','Lens'],['Crystal','Light','Prism'],['Film','Camera','Photograph'],['Lens','Light','Aperture']
 ])assert.equal(cat.recipes.get(pair(ids.get(a),ids.get(b))),ids.get(out),`${a}+${b} != ${out}`);
});
test('V42: existing build gate rejects duplicate names, exact IDs, reversed pairs, missing input refs',()=>{
 const all=[...prior,ORGANIC_V42];
 assert.throws(()=>buildCatalog(DATA,[...all,{items:[{id:'test:a',name:'  cRoIsSaNt '}],recipes:[]}],{checkReachability:false}),/duplicate name/i);
 assert.throws(()=>buildCatalog(DATA,[...all,{items:[{id:'organic42:croissant',name:'New Name'}],recipes:[]}],{checkReachability:false}),/duplicate id/i);
 const [a,b,out]=ORGANIC_V42.recipes[0];
 assert.throws(()=>buildCatalog(DATA,[...all,{items:[],recipes:[[b,a,out]]}],{checkReachability:false}),/duplicate unordered recipe/i);
 assert.throws(()=>buildCatalog(DATA,[...all,{items:[],recipes:[['bogus',b,out]]}],{checkReachability:false}),/unknown|missing|invalid/i);
});
test('V42: current bundle, app, validation and build tool include V42, with priority over prior art',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../../tools/build-standalone.py',import.meta.url),'utf8');
 const gate=readFileSync(new URL('../../tools/validate-catalog.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('../../35K_Alchemy_V42_Offline.html',import.meta.url),'utf8');
 assert.match(app,/ORGANIC_ART_V42\[itemName\]\|\|ORGANIC_ART_V41/);
 assert.ok(gate.includes('v42-art-manifest.json'));
 for(const s of ['ORGANIC_V42','ORGANIC_ART_V42','__gameverseOrganic42','__gameverseOrganicArt42'])assert.ok(build.includes(s),s);
 for(const s of ['V42 Offline','ORGANIC_V42','__gameverseOrganicArt42'])assert.ok(html.includes(s),s);
 assert.ok(!html.includes('src="./src/app.js"'));
});
