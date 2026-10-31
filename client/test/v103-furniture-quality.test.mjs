import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('V103: harder-to-make furniture gives bigger bonuses; picker and chips explain them',async()=>{
 const h=await import('../src/home-engine-v90.js');
 assert.deepEqual([2,6,8,10,13,undefined].map(d=>h.pieceQuality(d).pct),[10,15,20,25,30,30]);
 const objects={a:{effect:'run'},b:{effect:'run'},c:{effect:'decor'}};const q={a:0.1,b:0.3,c:0};
 assert.equal(h.growthMultiplier(2,{furniture:[{id:'a'},{id:'b'},{id:'c'}]},objects,'run',id=>q[id]),1.68);
 const src=fs.readFileSync(new URL('../src/home-engine-v90.js',import.meta.url),'utf8');
 assert.match(src,/<small>\$\{bonusText\(id\)\}/,'picker shows each piece\'s bonus');
 assert.match(src,/function bonusSheet\(hid,focus\)/,'tapping a chip explains where it comes from');
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');assert.match(app,/depthOf:id=>routeDepth\.get\(id\)/);
});
test('V104: long press opens the element sheet; gate stones are walked to, not teleported',()=>{
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(app,/navigator\.vibrate\?\.\(12\);elementInfo\(id\);\},480\)/);assert.match(app,/function elementInfo\(id\)/);
 const g=fs.readFileSync(new URL('../src/games-v93.js',import.meta.url),'utf8');
 assert.match(g,/q\.ph==='go'/);assert.match(g,/smooth walking inside alchemy gates/);
});
