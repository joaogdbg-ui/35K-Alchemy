import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ORGANIC_V67} from '../src/organic-pack-v67.js';
import {ORGANIC_ART_V67} from '../src/organic-art-v67.js';
const m=JSON.parse(readFileSync('shared/v67-approved.json','utf8'));
test('V67 introduces twelve unambiguous fresh elements, no duplicate ID/name',()=>{
 assert.equal(ORGANIC_V67.items.length,12);
 assert.equal(new Set(ORGANIC_V67.items.map(e=>e.id)).size,12);
 assert.equal(new Set(ORGANIC_V67.items.map(e=>e.name.toLowerCase())).size,12);
});
test('V67 has exactly twelve unordered distinct recipes and each yields a new element',()=>{
 const recipes=ORGANIC_V67.recipes;assert.equal(recipes.length,12);
 assert.equal(new Set(recipes.map(x=>x.slice(0,2).sort().join('|'))).size,12);
 const ids=new Set(ORGANIC_V67.items.map(e=>e.id));assert.ok(recipes.every(e=>ids.has(e[2])));
});
test('V67 thirty-six bespoke source SVGs exactly equal their runtime representation',()=>{
 const all=[...m.new_items,...m.redrawn_v61];assert.equal(all.length,36);
 const hashes=new Set();for(const e of all){const svg=readFileSync(e.path,'utf8');const hash=createHash('sha256').update(svg).digest('hex');assert.equal(hash,e.sha256);assert.equal(ORGANIC_ART_V67[e.name.toLowerCase()],svg);assert.ok(!hashes.has(hash),e.name);hashes.add(hash);}
});
test('V67 redrawn V61 art keeps IDs and leaves earlier approved subjects alone',()=>{
 const originals=new Map(JSON.parse(readFileSync('shared/v61-art-manifest.json','utf8')).icons.map(x=>[x.name,x.id]));
 const prior=new Set();for(const v of [63,65,66])for(const e of JSON.parse(readFileSync(`shared/v${v}-approved.json`,'utf8')).redrawn_v61)prior.add(e.name);
 assert.equal(m.redrawn_v61.length,24);for(const e of m.redrawn_v61){assert.equal(e.id,originals.get(e.name));assert.ok(!prior.has(e.name));}
});
test('V67 artwork takes precedence while previous V66 artwork stays available',()=>{
 const app=readFileSync('client/src/app.js','utf8');assert.ok(app.includes('ORGANIC_V66,ORGANIC_V67'));
 assert.ok(app.includes('ORGANIC_ART_V67[itemName]||ORGANIC_ART_V66[itemName]'));
});
