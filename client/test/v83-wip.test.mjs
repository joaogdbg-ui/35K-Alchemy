import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {ORGANIC_V41} from '../src/organic-pack-v41.js';
import {ORGANIC_V42} from '../src/organic-pack-v42.js';
import {ORGANIC_V82} from '../src/organic-pack-v82.js';
import {ORGANIC_V83} from '../src/organic-pack-v83.js';
import {ORGANIC_ART_V83} from '../src/organic-art-v83.js';
import {buildThematicCampaigns} from '../src/family-campaigns-v82.js';

const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('shared/v83-progress.json'));
const pair=(a,b)=>[a,b].sort().join('|');

test('V83 stays a non-integrated, non-published 200-item WIP',()=>{
  assert.equal(manifest.status,'WIP_NOT_INTEGRATED_NOT_RELEASED');
  assert.equal(manifest.expansion_goal,200);
  assert.ok(manifest.authored_candidates>0 && manifest.authored_candidates<200);
  assert.equal(manifest.authored_candidates,ORGANIC_V83.items.length);
  assert.equal(manifest.remaining,200-ORGANIC_V83.items.length);
  assert.equal(ORGANIC_V83.items.length,ORGANIC_V83.recipes.length);
  assert.equal(Object.keys(ORGANIC_ART_V83).length,ORGANIC_V83.items.length);
});

test('Every V83 draft discovery has its own name, global pair and source-matched subject illustration',()=>{
  const ids=new Set(),names=new Set(),pairs=new Set(),drawings=new Set();
  const knownNames=new Set([
    ...DATA.items.map(x=>String(x[0]).toLowerCase()),
    ...PACK.items.map(x=>x.name.toLowerCase()),
    ...ORGANIC_V41.items.map(x=>x.name.toLowerCase()),
    ...ORGANIC_V42.items.map(x=>x.name.toLowerCase()),
    ...ORGANIC_V82.items.map(x=>x.name.toLowerCase())
  ]);
  const historicalPairs=new Map();
  for(const [a,b,out] of [
    ...DATA.recipes.map(([a,b,c])=>['legacy:'+a,'legacy:'+b,'legacy:'+c]),
    ...PACK.recipes,...ORGANIC_V41.recipes,...ORGANIC_V42.recipes,...ORGANIC_V82.recipes
  ]){
    const k=pair(a,b);
    if(historicalPairs.has(k))assert.equal(historicalPairs.get(k),out,'historic mismatch '+k);
    historicalPairs.set(k,out);
  }
  for(const entry of manifest.new_items){
    const it=ORGANIC_V83.items.find(x=>x.id===entry.id);
    assert.ok(it,'missing candidate '+entry.id);
    assert.ok(!ids.has(it.id),'reused id '+it.id);ids.add(it.id);
    assert.ok(!names.has(it.name.toLowerCase()),'reused candidate name '+it.name);
    assert.ok(!knownNames.has(it.name.toLowerCase()),'reused known name '+it.name);
    names.add(it.name.toLowerCase());
    assert.deepEqual(it.familyCampaigns,entry.familyCampaigns);
    assert.ok(Array.isArray(it.familyCampaigns)&&it.familyCampaigns.every(f=>f==='mythology'),'unsupported Family Only membership '+it.name);
    const recipes=ORGANIC_V83.recipes.filter(x=>x[2]===it.id);
    assert.equal(recipes.length,1,'one new primary recipe '+it.name);
    const [a,b]=recipes[0],k=pair(a,b);
    assert.ok(!pairs.has(k),'reused candidate pair '+k);pairs.add(k);
    assert.ok(!historicalPairs.has(k),'conflicting old pair '+k);
    assert.deepEqual(entry.ingredients,[a,b]);
    const original=read(entry.path);
    assert.equal(ORGANIC_ART_V83[it.name.toLowerCase()],original);
    assert.match(original,/viewBox="0 0 100 100"/);
    assert.ok(original.length>400);
    assert.ok(!drawings.has(original),'identical SVG '+it.name);
    drawings.add(original);
  }
});

test('Mythology campaign can build ALL provisional V83 members from only its four starters',()=>{
  const allItems=DATA.items.map((x,i)=>({id:'legacy:'+i,category:x[1]}))
    .concat(PACK.items,ORGANIC_V41.items,ORGANIC_V42.items,ORGANIC_V82.items,ORGANIC_V83.items);
  const allRecipes=[
    ...DATA.recipes.map(([a,b,c])=>['legacy:'+a,'legacy:'+b,'legacy:'+c]),
    ...PACK.recipes,...ORGANIC_V41.recipes,...ORGANIC_V42.recipes,...ORGANIC_V82.recipes,...ORGANIC_V83.recipes
  ];
  const global=new Map();
  for(const [a,b,c] of allRecipes){
    const k=pair(a,b);
    if(global.has(k))assert.equal(global.get(k),c,'global conflict '+k);
    global.set(k,c);
  }
  const myth=buildThematicCampaigns(global,allItems).find(x=>x.id==='mythology');
  assert.ok(myth);
  assert.equal(myth.items.length,109+ORGANIC_V83.items.filter(x=>x.familyCampaigns.includes('mythology')).length);
  const reached=new Set(myth.starters);
  for(let round=0;round<myth.items.length;round++){
    const prev=reached.size;
    for(const [k,result] of myth.recipes){
      const [a,b]=k.split('|');
      if(reached.has(a)&&reached.has(b))reached.add(result);
    }
    if(reached.size===prev)break;
  }
  assert.equal(reached.size,myth.items.length,'WIP mythology must be autonomously reachable');
});


test('V83 draft names and recipes do not collide with ANY historical organic pack',async()=>{
  const {readdirSync}=await import('node:fs');
  const files=readdirSync(new URL('../src/',import.meta.url))
    .filter(x=>/^organic-pack-v\d+\.js$/.test(x)&&Number(x.match(/v(\d+)/)[1])<83);
  const names=new Map(),pairs=new Map();
  const record=(name,id)=>{const normalized=String(name).normalize('NFKC').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');if(!names.has(normalized))names.set(normalized,id);};
  DATA.items.forEach((row,i)=>record(row[0],'legacy:'+i));
  PACK.items.forEach(row=>record(row.name,row.id));
  for(const [a,b,c] of DATA.recipes)pairs.set(pair('legacy:'+a,'legacy:'+b),'legacy:'+c);
  for(const [a,b,c] of PACK.recipes)pairs.set(pair(a,b),c);
  for(const f of files){
    const mod=await import(new URL('../src/'+f,import.meta.url).href);
    const found=Object.values(mod).find(v=>v&&Array.isArray(v.items)&&Array.isArray(v.recipes));
    assert.ok(found,'missing organic content export '+f);
    for(const item of found.items)record(item.name,item.id);
    for(const [a,b,c] of found.recipes)pairs.set(pair(a,b),c);
  }
  for(const item of ORGANIC_V83.items){
    const k=String(item.name).normalize('NFKC').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
    assert.ok(!names.has(k),'V83 name collides with historic ID '+item.name+' -> '+names.get(k));
  }
  for(const [a,b,c] of ORGANIC_V83.recipes)
    assert.ok(!pairs.has(pair(a,b)),'V83 pair conflicts with old result '+a+' + '+b+' = '+pairs.get(pair(a,b))+' (wanted '+c+')');
});


test('V83 games, arcade and fantasy discoveries use actual supported family categories',async()=>{
 const {familyFor}=await import('../src/discoveries.js');
 const valid=new Set(['gamecraft','arcade','fantasy']);
 for(const item of ORGANIC_V83.items){
  assert.ok(item.category!=='gaming','unsupported category '+item.name);
  if(item.familyCampaigns?.length===0){
   assert.ok(valid.has(item.category),'unsupported game-item category '+item.name);
   const expected=item.category==='gamecraft'?'games':item.category==='arcade'?'arcades':'fantasy';
   assert.equal(familyFor(item),expected,'wrong Discoveries family for '+item.name);
  }
 }
});


test('Every new V83 recipe references its WIP ancestors before the output',()=>{
 const index=new Map(ORGANIC_V83.items.map((item,i)=>[item.id,i]));
 for(const [a,b,out] of ORGANIC_V83.recipes){
  const order=index.get(out);assert.ok(Number.isInteger(order),'unknown output '+out);
  for(const ancestor of [a,b])if(ancestor.startsWith('organic83:')){
   assert.ok(index.has(ancestor),'missing proposed ancestor '+ancestor);
   assert.ok(index.get(ancestor)<order,'forward dependency '+ancestor+' -> '+out);
  }
 }
});
