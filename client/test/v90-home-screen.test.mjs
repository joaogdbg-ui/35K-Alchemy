import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V90: Home tab hosts companion houses; room sprites exist for every furniture piece',async()=>{
 const {HOME_OBJECTS_V89}=await import('../src/home-objects-v89.js');
 const {ROOM_SPRITES_V90}=await import('../src/room-sprites-v90.js');
 const furn=Object.entries(HOME_OBJECTS_V89).filter(([,o])=>o.kind==='furniture');
 for(const [id] of furn){const s=ROOM_SPRITES_V90[id];assert.ok(s&&s.front,id);
  if(s.layer==='object')assert.ok(s.back&&s.side,id+' needs back and side to rotate');
  if(s.layer==='floor')assert.ok(s.side,id);
  for(const v of ['front','back','side'])if(s[v])assert.doesNotMatch(s[v],/<(script|image|use|text|foreignObject)\b/,id);}
 assert.match(src('client/index.html'),/<span>Home<\/span>/);
 assert.match(src('client/src/app.js'),/roomSprites:ROOM_SPRITES_V90,applyEffect:\(cid,eff\)=>companions\.homeEffect\(cid,eff\)/);
 assert.match(src('tools/build-standalone.py'),/home-engine-v90\.js/);assert.match(src('tools/build-standalone.py'),/room-sprites-v90\.js/);
});
test('V90: placement rules — layers, rotation footprint, wall row',async()=>{
 const {fits,footprint,layoutFor}=await import('../src/home-engine-v90.js');
 const objects={bed:{size:[2,1]},rug:{size:[2,2]},frame:{size:[1,1]},sofa:{size:[3,1]}};
 const sprites={rug:{layer:'floor'},frame:{layer:'wall'},bed:{layer:'object'},sofa:{layer:'object'}};
 const L=layoutFor(4),house={furniture:[{id:'rug',x:0,y:0,r:0},{id:'frame',x:0,y:-1,r:0}]};
 assert.ok(fits(house,L,objects,sprites,{id:'bed',x:0,y:0,r:0}),'furniture can stand on a rug');
 assert.ok(!fits(house,L,objects,sprites,{id:'frame',x:0,y:-1,r:0}),'two frames cannot share a wall slot');
 assert.deepEqual(footprint(objects,{id:'sofa',r:1}),[1,3]);
 assert.ok(!fits({furniture:[]},L,objects,sprites,{id:'sofa',x:5,y:0,r:0}),'must stay inside the room');
});
test('V90: furniture really works and is capped per day',()=>{
 const eng=src('client/src/companion-engine-v86.js');
 assert.match(eng,/HOME_DAILY_CAP=200/);assert.match(eng,/function homeEffect\(id,effect\)/);
});
