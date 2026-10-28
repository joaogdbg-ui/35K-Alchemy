import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const pack=JSON.parse(fs.readFileSync(path.join(root,'client/src/gaming-pack-v26.js'),'utf8').split(' = ',2)[1].trim().replace(/;$/,''));
const app=fs.readFileSync(path.join(root,'client/src/app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'client/index.html'),'utf8');
test('V26 ships 214 explicitly named games and 551 unordered unique recipes',()=>{
 assert.equal(pack.version,26);assert.equal(pack.items.length,214);assert.equal(pack.recipes.length,551);
 assert.equal(new Set(pack.items.map(x=>x.id)).size,214);
 assert.equal(new Set(pack.recipes.map(([a,b])=>[a,b].sort().join('|'))).size,551);
 assert.ok(pack.items.some(i=>i.name==='Kirby and the Rainbow Curse'));
 assert.ok(pack.items.some(i=>i.name==='Knuckles\' Chaotix'));
});
test('V26 never overwrites prior published recipes',()=>{
 assert.ok(app.includes('buildCatalog(DATA,['));
 const guard=fs.readFileSync(path.join(root,'client/src/catalog-integrity.js'),'utf8');
 assert.match(guard,/duplicate unordered recipe/);
 assert.match(guard,/duplicate name/);
});
test('V26 new game unlocks persist across future versions and exports',()=>{
 assert.match(app,/unlocked:u\.filter\(i=>!i\.startsWith\('legacy:'\)\)/);
 assert.match(app,/const EXTRA_STORAGE='35k_alchemy_extras_v25'/);
 assert.match(app,/format:'35k-alchemy-backup'/);
});
test('V26 has 18 local sets, two tabs and truthful offline rates',()=>{
 assert.equal((html.match(/class="tab(?: active)?" data-view/g)||[]).length,2);
 assert.ok(app.includes('Kirby Adventures'));assert.ok(app.includes('Dragon Ball Games'));
 assert.ok(app.includes('Player discovery rate · — (offline)'));
});
