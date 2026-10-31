import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V94: Stadium prizes — a toy per course (Champion) and five karate belts',async()=>{
 const {RACE_PRIZES,PRIZE_BY_ID,BELTS,beltSvg}=await import('../src/prizes-v94.js');
 const {COURSES,LEVELS}=await import('../src/games-v93.js');
 for(const c of COURSES){const p=RACE_PRIZES[c.id];assert.ok(p&&p.id.startsWith('prize:')&&p.art.startsWith('<svg')&&p.room.front,c.id);assert.equal(PRIZE_BY_ID[p.id],p);}
 assert.equal(BELTS.length,LEVELS.length);assert.match(beltSvg(BELTS[4]),/#2F3B44/);
 const app=src('client/src/app.js');
 assert.match(app,/const HOME_OBJECTS=\{\.\.\.HOME_OBJECTS_V89,\.\.\.Object\.fromEntries\(Object\.values\(RACE_PRIZES\)/);
 assert.match(app,/const homeDiscovered=id=>PRIZE_BY_ID\[id\]\?games\.hasPrize\(id\):discoveredAnywhere\(id\);/);
 assert.match(app,/function wearAll\(root\)/);
});
test('V94: Stadium hub shows grades and levels on the entrant card; karate is best of three with KO feedback',()=>{
 const g=src('client/src/games-v93.js');
 assert.match(g,/class="st-grades"/);assert.match(g,/Total Lv \$\{totalLv\(info\)\}/);
 assert.match(g,/if\(w\.wins>=2\)/);assert.match(g,/banner\(st,'K\.O\.','is-ko'/);assert.match(g,/countdown\(st/);
 assert.match(g,/state\.prizes\.push\(prize\.id\)/);assert.match(g,/state\.belts\[A\.id\]=b\.id/);
});
