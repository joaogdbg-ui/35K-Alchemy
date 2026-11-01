import test from 'node:test';import assert from 'node:assert/strict';
test('V116: meals change looks (tint, size, traits) and some items reset them',async()=>{
 const {lookAfterMeal,defaultLook,lookLabel,tintMatrix}=await import('../src/companion-engine-v86.js');
 let L=defaultLook();
 ({look:L}=lookAfterMeal(L,'Fire','','',0));assert.ok(L.k>0&&!L.head,'easy elements only tint');
 ({look:L}=lookAfterMeal(L,'Wildfire','','',5));assert.equal(L.head,'flame');
 ({look:L}=lookAfterMeal(L,'Bird'));assert.equal(L.back,'feather-wings');
 ({look:L}=lookAfterMeal(L,'Cake','','food'));assert.ok(L.size>0);
 ({look:L}=lookAfterMeal(L,'Leaf'));assert.equal(L.head,'leaf','newer head trait replaces the old one');
 for(let i=0;i<20;i++)({look:L}=lookAfterMeal(L,'Lava'));assert.ok(L.k<=0.62,'tint is capped');
 const k=L.k;({look:L}=lookAfterMeal(L,'Soap'));assert.ok(L.k<k,'soap washes colour off');
 ({look:L}=lookAfterMeal(L,'Mirror'));assert.equal(L.head,null);
 ({look:L}=lookAfterMeal(L,'Cosmic Egg'));assert.deepEqual(L,defaultLook(),'egg / rebirth resets everything');
 assert.match(lookLabel({tint:[255,138,61],k:.2,size:.04,head:'leaf',back:null,aura:'sparkle'}),/Warm tint · Leaf sprout · Sparkles · Size \+4%/);
});
test('V117: themed sets (demon) and radiant traits from hard elements',async()=>{
 const {lookAfterMeal,defaultLook,lookLabel,tintMatrix}=await import('../src/companion-engine-v86.js');
 let {look:L}=lookAfterMeal(defaultLook(),'Demon','','',6);
 assert.equal(L.head,'devil-horns');assert.equal(L.back,'bat-wings');assert.equal(L.tail,'devil-tail');assert.ok(L.k>0);
 assert.match(lookLabel(L),/Shadowy tint · Devil horns · Bat wings · Devil tail/);
 ({look:L}=lookAfterMeal(L,'Devil Fortress','','',12));assert.equal(L.lux.back,1,'hard elements make traits radiant');assert.match(lookLabel(L),/✦ Bat wings/);
 assert.equal(lookAfterMeal(defaultLook(),'Dragonfly','','',5).look.back,null,'dragonfly is not a dragon');
 assert.equal(lookAfterMeal(defaultLook(),'Seashell','','',5).look.tail,null,'seashell is not hell');
 assert.equal(tintMatrix([255,255,255],0).split(' ').length,20);
});
