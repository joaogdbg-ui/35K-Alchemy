import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('V112: house objects move while used and residents stand in their centre',async()=>{
 const h=await import('../src/home-engine-v90.js');
 assert.equal(h.motionOf('organic89:running-wheel'),'wheel');assert.equal(h.motionOf('organic89:treadmill'),'treadmill');assert.equal(h.motionOf('organic40:bicycle'),'bike');
 assert.equal(h.motionOf('organic89:trampoline'),'tramp');assert.equal(h.motionOf('organic89:seesaw'),'rock');assert.equal(h.motionOf('x','',"swim"),'pool');
 const src=fs.readFileSync(new URL('../src/home-engine-v90.js',import.meta.url),'utf8');assert.match(src,/x:f\.x\+\(w-1\)\/2/);assert.match(src,/className='home-motion'/);
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');assert.match(app,/games\.hasPrize\(id\):companionOwned\(id\)/,'starter Frog can live in houses');
});
