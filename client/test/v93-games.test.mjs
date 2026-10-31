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
test('V97: higher levels are longer and more varied; climb sections are a standing wall',async()=>{
 const g=await import('../src/games-v93.js');
 for(const c of g.COURSES){const lens=[0,1,2,3,4].map(l=>g.planFor(c,l).length);assert.deepEqual(lens,[6,8,10,12,14],c.id);
  const kinds=l=>new Set(g.planFor(c,l).map(x=>x.t)).size;assert.ok(kinds(4)>=kinds(0),c.id);
  const total=l=>g.planFor(c,l).reduce((n,x)=>n+x.len,0);assert.ok(total(4)>total(0)*2,c.id);}
 const src=(await import('node:fs')).readFileSync(new URL('../src/games-v93.js',import.meta.url),'utf8');
 assert.match(src,/class="g-wall"/);assert.match(src,/const WALL=170;/);
});
