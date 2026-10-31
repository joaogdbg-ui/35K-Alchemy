import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V93: Games tab appears only with a house and a companion',()=>{
 const html=src('client/index.html'),app=src('client/src/app.js');
 assert.match(html,/class="tab tab-games" data-view="Games" hidden/);assert.match(html,/id="viewGames"/);
 assert.match(app,/return homes\.ownedHouses\(\)\.length>0&&companions\.unlocked\(\)\.length>0;/);
 assert.match(src('tools/build-standalone.py'),/games-v93\.js/);
});
test('V93: Chao-style races — stat per section, stamina, five levels, medals',async()=>{
 const g=await import('../src/games-v93.js');
 assert.equal(g.COURSES.length,6);assert.equal(g.LEVELS.length,5);
 for(const c of g.COURSES)assert.ok(c.plan.every(t=>['run','swim','fly','climb'].includes(t)),c.id);
 assert.ok(g.statSpeed(99)>g.statSpeed(0));assert.ok(g.energyMax(99)>g.energyMax(0));
 assert.equal(g.medalFor(1),'gold');assert.equal(g.medalFor(3),'bronze');assert.equal(g.medalFor(4),null);
 const o=g.opponentStats(g.COURSES[0],4,1),o0=g.opponentStats(g.COURSES[0],0,1);assert.ok(o.swim>o0.swim);
});
test('V93: companion tiles show the level; game rewards use growth multipliers',()=>{
 const eng=src('client/src/companion-engine-v86.js');
 assert.match(eng,/<em class="pet-ava-lv">Lv \$\{totalLevel\(c\.id\)\}<\/em>/);
 assert.match(eng,/function gameReward\(id,stats,amount\)\{[^}]*growth\(id,st\)/);
});
