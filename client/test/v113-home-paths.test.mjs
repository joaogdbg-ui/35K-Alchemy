import test from 'node:test';import assert from 'node:assert/strict';
test('V113: residents path around furniture (no walking through objects)',async()=>{
 const {findPath}=await import('../src/home-engine-v90.js');
 const L={cols:5,rows:4};const b=new Set([1,6,11].map(k=>k)); // a wall of furniture at x=1, rows 0..2
 const p=findPath(L,b,{x:0,y:0},{x:2,y:0});
 assert.ok(p&&p.length>2,'goes around');for(const t of p)assert.ok(!b.has(t.y*5+t.x),'never steps on blocked tiles');
 assert.equal(findPath(L,new Set([0+5*1,1,1+5]),{x:0,y:0},{x:4,y:3}),null,'boxed in = no path');
 const onto=findPath(L,new Set([12]),{x:0,y:2},{x:2,y:2});assert.deepEqual(onto.at(-1),{x:2,y:2},'the target piece itself is enterable');
});
