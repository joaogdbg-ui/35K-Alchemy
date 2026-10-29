import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORGANIC_V82} from '../src/organic-pack-v82.js';
import {ORGANIC_ART_V82} from '../src/organic-art-v82.js';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {ORGANIC_V41} from '../src/organic-pack-v41.js';
import {ORGANIC_V42} from '../src/organic-pack-v42.js';
import {buildThematicCampaigns} from '../src/family-campaigns-v82.js';
import {familiesFor} from '../src/discoveries.js';

const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('shared/v82-approved.json'));
const key=(a,b)=>[a,b].sort().join('|');
test('V82 is an honest 25/200 WIP checkpoint, never a content release',()=>{
 assert.equal(manifest.status,'WIP_NOT_RELEASED');
 assert.equal(manifest.cycle_complete,false);
 assert.equal(manifest.cohort_count,25);
 assert.equal(manifest.expansion_goal,200);
 assert.equal(manifest.remaining_to_goal,175);
 assert.equal(ORGANIC_V82.items.length,25);
 assert.equal(ORGANIC_V82.recipes.length,25);
 assert.equal(Object.keys(ORGANIC_ART_V82).length,25);
 assert.deepEqual(manifest.expected_catalog,{elements:5837,recipes:14174});
});
test('Each original deity or dinosaur has a unique recipe, actual SVG file and explicit family membership',()=>{
 const ids=new Set(),names=new Set(),pairs=new Set(),svg=new Set();
 for(const it of ORGANIC_V82.items){
  const entry=manifest.new_items.find(x=>x.id===it.id);
  assert.ok(entry,'manifest missing '+it.id);
  assert.ok(!ids.has(it.id));ids.add(it.id);
  assert.ok(!names.has(it.name.toLowerCase()));names.add(it.name.toLowerCase());
  assert.ok(['mythology','prehistoric'].includes(it.category));
  assert.deepEqual(it.familyCampaigns,[it.category]);
  assert.ok(familiesFor(it).includes(it.category),'grouping mismatch '+it.name);
  const recipe=ORGANIC_V82.recipes.find(x=>x[2]===it.id);
  assert.ok(recipe,'recipe missing '+it.name);
  const pair=key(recipe[0],recipe[1]);
  assert.ok(!pairs.has(pair),'duplicate pair '+pair);pairs.add(pair);
  assert.deepEqual(recipe.slice(0,2),entry.ingredients);
  const raw=read(entry.path);
  assert.equal(raw,ORGANIC_ART_V82[it.name.toLowerCase()]);
  assert.match(raw,/viewBox="0 0 100 100"/);
  assert.ok(raw.length>=410);
  assert.ok(!svg.has(raw),'same source art '+it.name);svg.add(raw);
 }
});
test('All new mythical and prehistoric discoveries are craftable in isolated Family Only from four starters',()=>{
 const allItems=DATA.items.map((x,i)=>({id:'legacy:'+i,category:x[1]}))
  .concat(PACK.items,ORGANIC_V41.items,ORGANIC_V42.items,ORGANIC_V82.items);
 const rows=[
  ...DATA.recipes.map(([a,b,c])=>['legacy:'+a,'legacy:'+b,'legacy:'+c]),
  ...PACK.recipes,...ORGANIC_V41.recipes,...ORGANIC_V42.recipes,...ORGANIC_V82.recipes
 ];
 const globals=new Map();
 for(const [a,b,out] of rows){
  const pair=key(a,b);
  if(globals.has(pair))assert.equal(globals.get(pair),out,'global pair conflict '+pair);
  globals.set(pair,out);
 }
 const campaigns=buildThematicCampaigns(globals,allItems);
 assert.equal(campaigns.find(x=>x.id==='mythology').items.length,16+18);
 assert.equal(campaigns.find(x=>x.id==='prehistoric').items.length,9+7);
 for(const family of campaigns){
  const reached=new Set(family.starters);
  let changed=true;
  while(changed){
   changed=false;
   for(const [pair,out] of family.recipes){
    const [a,b]=pair.split('|');
    assert.equal(globals.get(pair),out);
    if(reached.has(a)&&reached.has(b)&&!reached.has(out)){reached.add(out);changed=true;}
   }
  }
  assert.equal(reached.size,family.items.length,'unreachable '+family.name);
 }
});
test('V82 WIP code is registered in the application and offline builder, with old save IDs preserved',()=>{
 const app=read('client/src/app.js'),bundle=read('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V80,ORGANIC_V81,ORGANIC_V82\]/);
 assert.match(app,/const newArt=ORGANIC_ART_V82\[itemName\]\|\|ORGANIC_ART_V81/);
 assert.match(bundle,/window\.__gameverseOrganic82/);
 assert.match(bundle,/window\.__gameverseOrganicArt82/);
 assert.match(bundle,/validate-v82\.mjs/);
 assert.match(bundle,/Alchemy_10K_V82_WIP_Offline\.html/);
 assert.match(app,/35k_family_profiles_v48/);
 assert.equal(JSON.parse(read('shared/production-plan-200.json')).target_minimum_elements,10000);
});
