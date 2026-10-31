import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
test('V105: recipes are order-free everywhere; recorded paths must still make the element',()=>{
 assert.match(app,/const pairKey=\(a,b\)=>\[a,b\]\.sort\(\)\.join\('\|'\)/);
 for(const f of ['family-campaigns-v85.js','family-compatibility-v82.js'])assert.match(fs.readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),/\[a,b\]\.sort\(\)\.join\('\|'\)/,f);
 assert.match(app,/recipes\.get\(pairKey\(recorded\[0\],recorded\[1\]\)\)===id/);
});
test('V105: new games start with the Frog; companions and races make sounds',()=>{
 assert.match(app,/const STARTER_COMPANION='organic38:frog'/);
 const eng=fs.readFileSync(new URL('../src/companion-engine-v86.js',import.meta.url),'utf8');
 assert.match(eng,/if\(!loaded&&starter&&metaById\.has\(starter\)\)/);
 for(const k of ['boop','purr','nom','refuse','knock','levelup'])assert.match(eng,new RegExp('sfx\\.'+k+'\\(\\)'),k);
 const g=fs.readFileSync(new URL('../src/games-v93.js',import.meta.url),'utf8');assert.match(g,/sfx\.paddle:k==='wall'\?sfx\.grip/);assert.match(g,/navigator\.vibrate\?\.\(15\)/);
});
