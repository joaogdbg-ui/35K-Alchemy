import test from 'node:test';import assert from 'node:assert/strict';
test('V116: meals change looks (tint, size, traits) and some items reset them',async()=>{
 const {lookAfterMeal,defaultLook,lookLabel,tintMatrix}=await import('../src/companion-engine-v86.js');
 let L=defaultLook();
 ({look:L}=lookAfterMeal(L,'Fire'));assert.ok(L.k>0&&L.head==='flame');
 ({look:L}=lookAfterMeal(L,'Bird'));assert.equal(L.back,'wings');
 ({look:L}=lookAfterMeal(L,'Cake','','food'));assert.ok(L.size>0);
 ({look:L}=lookAfterMeal(L,'Leaf'));assert.equal(L.head,'leaf','newer head trait replaces the old one');
 for(let i=0;i<20;i++)({look:L}=lookAfterMeal(L,'Lava'));assert.ok(L.k<=0.45,'tint is capped');
 const k=L.k;({look:L}=lookAfterMeal(L,'Soap'));assert.ok(L.k<k,'soap washes colour off');
 ({look:L}=lookAfterMeal(L,'Mirror'));assert.equal(L.head,null);
 ({look:L}=lookAfterMeal(L,'Phoenix Feather'));assert.deepEqual(L,defaultLook(),'phoenix resets everything');
 assert.match(lookLabel({tint:[255,138,61],k:.2,size:.04,head:'leaf',back:null,aura:'sparkle'}),/Warm tint · Leaf sprout · Sparkles · Size \+4%/);
 assert.equal(tintMatrix([255,255,255],0).split(' ').length,20);
});
