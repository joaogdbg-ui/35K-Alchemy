import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V89: +200 elements, mostly Home & Living, wired into app and offline build',async()=>{
 const {ORGANIC_V89}=await import('../src/organic-pack-v89.js');
 const {ORGANIC_ART_V89}=await import('../src/organic-art-v89.js');
 assert.equal(ORGANIC_V89.items.length,200);
 assert.ok(ORGANIC_V89.items.every(i=>i.id.startsWith('organic89:')&&i.summary.length>=40));
 assert.ok(ORGANIC_V89.items.filter(i=>i.category==='home').length>=150);
 assert.equal(Object.keys(ORGANIC_ART_V89).length,200);
 const app=src('client/src/app.js'),build=src('tools/build-standalone.py');
 assert.match(app,/GAMING_V30,ORGANIC_V89,ORGANIC_V85/);
 assert.match(app,/const FAMILY_DATA=mergeFamilyData\(FAMILY_DATA_V85,FAMILY_DATA_V89\);/);
 for(const f of ['organic-pack-v89.js','organic-art-v89.js','family-data-v89.js','home-objects-v89.js'])assert.ok(build.includes(f),f);
});
test('V89: Home & Living has its own 4 starters; six companion houses grow 1→8',async()=>{
 const {FAMILIES}=await import('../src/discoveries.js');
 const {FAMILY_DATA_V89}=await import('../src/family-data-v89.js');
 const {HOME_OBJECTS_V89}=await import('../src/home-objects-v89.js');
 assert.ok(FAMILIES.some(f=>f.id==='home'&&f.categories.includes('home')));
 const h=FAMILY_DATA_V89.families.home;assert.equal(new Set(h.starters).size,4);
 assert.ok(h.starters.every(s=>h.addMembers.includes(s)));
 assert.ok(!h.starters.some(s=>['legacy:0','legacy:1','legacy:2','legacy:3'].includes(s)));
 const houses=Object.values(HOME_OBJECTS_V89).filter(o=>o.kind==='house').map(o=>o.capacity).sort((a,b)=>a-b);
 assert.deepEqual(houses,[1,2,3,4,6,8]);
 const effects=new Set(['run','swim','power','fly','stamina','hp','mood','food','discovery','decor']);
 const furn=Object.values(HOME_OBJECTS_V89).filter(o=>o.kind==='furniture');
 assert.ok(furn.length>=120);
 for(const o of furn){assert.ok(effects.has(o.effect));assert.ok(o.size.every(n=>n>=1&&n<=3));}
 for(const st of ['run','swim','power','fly','stamina','hp'])assert.ok(furn.filter(o=>o.effect===st).length>=3,st);
});
