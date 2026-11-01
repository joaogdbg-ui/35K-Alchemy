import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('V108: medals and trophies belong to the companion that won them',async()=>{
 const P=await import('../src/prizes-v94.js');
 const t=P.personalPrize('pond','organic38:frog','Frog','<svg viewBox="0 0 10 10" id="x"><g/></svg>');
 assert.equal(t.id,'prize:pond:organic38:frog');assert.equal(t.name,"Frog's Pond Fountain");assert.match(t.art,/^<svg/);assert.ok(t.room.front);
 assert.deepEqual(P.parsePersonalPrize(t.id),{course:'pond',cid:'organic38:frog'});assert.equal(P.parsePersonalPrize('prize:pond-fountain'),null);
 const g=fs.readFileSync(new URL('../src/games-v93.js',import.meta.url),'utf8');
 assert.match(g,/const myRaces=\(\)=>prog\(pick\(\)\)\.races/);assert.match(g,/Old shared progress moves to the companion/);
 assert.ok(!/state\.races\[/.test(g),'no shared race progress left');
});
