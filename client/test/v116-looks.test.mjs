import test from 'node:test';import assert from 'node:assert/strict';
test('V116: meals change looks (tint, size, traits) and some items reset them',async()=>{
 const {lookAfterMeal,defaultLook,lookLabel,tintMatrix}=await import('../src/companion-engine-v86.js');
 let L=defaultLook();
 ({look:L}=lookAfterMeal(L,'Fire','','',0));assert.ok(L.k>0&&!L.head,'easy elements only tint');
 ({look:L}=lookAfterMeal(L,'Wildfire','','',5));assert.equal(L.head,'flame');
 ({look:L}=lookAfterMeal(L,'Bird'));assert.equal(L.back,'feather-wings');
 ({look:L}=lookAfterMeal(L,'Cake','','food'));assert.ok(L.size>0);
 for(let i=0;i<4;i++)({look:L}=lookAfterMeal(L,'Leaf'));assert.equal(L.head,'leaf','eating more of a new kind morphs the spot into it');assert.ok(!L.mix.head.flame,'the old trait fades out');
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
 assert.match(lookLabel(L),/Shadowy tint · Devil horns 25% · Bat wings 25% · Devil tail 25%/);
 ({look:L}=lookAfterMeal(L,'Devil Fortress','','',12));assert.equal(L.lux['back:bat-wings'],1,'hard elements make traits radiant');assert.match(lookLabel(L),/✦ Bat wings/);
 assert.equal(lookAfterMeal(defaultLook(),'Dragonfly','','',5).look.back,null,'dragonfly is not a dragon');
 assert.equal(lookAfterMeal(defaultLook(),'Seashell','','',5).look.tail,null,'seashell is not hell');
 assert.equal(tintMatrix([255,255,255],0).split(' ').length,20);
});
test('V118: element sheet previews growth, tint and traits for the on-screen companion',async()=>{
 const {lookEffects}=await import('../src/companion-engine-v86.js');const fs=await import('node:fs');
 const e=lookEffects('Demon','','',6);assert.equal(e.tint.name,'Shadowy');assert.deepEqual(e.traits.map(t=>t.slot),['head','back','tail']);
 assert.ok(lookEffects('Demon','','',2).traits.every(t=>t.locked),'easy versions only tint');assert.ok(lookEffects('Demon','','',12).traits.every(t=>t.lux));
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');assert.match(app,/function mealPreviewHtml\(id\)/);assert.match(app,/\$\{mealPreviewHtml\(id\)\}/);
});
test('V119: traits grow over meals and morph into each other',async()=>{
 const {lookAfterMeal,defaultLook,lookLabel}=await import('../src/companion-engine-v86.js');
 let {look:L,notes}=lookAfterMeal(defaultLook(),'Demon','','',6);assert.equal(L.mix.back['bat-wings'],0.25);assert.match(notes.join(),/Bat wings growing \(25%\)/);
 for(let i=0;i<3;i++)({look:L}=lookAfterMeal(L,'Demon','','',6));assert.equal(L.mix.back['bat-wings'],1);
 ({look:L,notes}=lookAfterMeal(L,'Fairy','','',6));assert.ok(L.mix.back['bat-wings']<1&&L.mix.back['butterfly-wings']>0,'blend, not swap');assert.match(notes.join(),/Bat wings morphing into butterfly wings/);
 assert.match(lookLabel(L),/Bat wings \/ butterfly wings mix/);
 const old=lookAfterMeal({head:'flame',k:0,size:0},'Snow','','',6).look;assert.ok(old.mix.head.flame>0&&old.mix.head.flake>0,'old saves become full traits that can morph');
});
test('V119b: morphing blends outlines point by point (organic, not transparency)',async()=>{
 const {morphBlend,smoothPath}=await import('../src/companion-engine-v86.js');
 const a=morphBlend('back',{'bat-wings':1}),b=morphBlend('back',{'butterfly-wings':1}),m=morphBlend('back',{'bat-wings':.5,'butterfly-wings':.5});
 assert.equal(a.pts.length,b.pts.length);const mid=m.pts[7],x=(a.pts[7][0]+b.pts[7][0])/2;assert.ok(Math.abs(mid[0]-x)<1e-9,'points are averaged');
 assert.notEqual(m.color,a.color);assert.ok(morphBlend('back',{'bat-wings':.25}).grow<1,'partly grown');assert.match(smoothPath(m.pts,10),/^M.*Q.*Z$/);
});
test('V120: powers only from radiant, grown traits; self-feeding never changes looks',async()=>{
 const E=await import('../src/companion-engine-v86.js');
 let L=E.defaultLook();for(let i=0;i<3;i++)L=E.lookAfterMeal(L,'Dragon','fantasy','',4).look;assert.equal(E.powersOf(L).length,0,'tier 2 dragon: no power');
 let R=E.defaultLook(),notes=[];for(let i=0;i<2;i++){const r=E.lookAfterMeal(R,'Dragon','fantasy','',10);R=r.look;notes.push(...r.notes);}
 assert.deepEqual(E.powersOf(R).map(p=>p.id),['fire']);assert.ok(!notes.some(n=>/power/i.test(n)),'powers are only visual');assert.doesNotMatch(E.lookLabel(R),/Fire breath/);
 assert.equal(E.lookEffects('Pebble','nature','',1).traits.length,0,'easy elements only tint/size');
});
test('V121: hand-picked themes fix false matches',async()=>{
 const E=await import('../src/companion-engine-v86.js');const fx=(n,d=10)=>E.lookEffects(n,'games','',d);
 assert.equal(fx('Halo 3').traits.length,0);assert.equal(fx('Phoenix Wright: Ace Attorney').traits.length,0);assert.equal(fx('Fire Emblem Engage').traits.length,0);
 assert.equal(fx('Dragon Egg Cradle').theme,'dragon');assert.equal(fx('Dragon Egg Cradle').resets.length,0);
 assert.equal(fx('Black Sabbath').resets.length,0);assert.equal(fx('Ice Halo').theme,'ice');assert.equal(fx('Hinokami Kagura').theme,'phoenix');
 assert.equal(fx('Dragon Quest').theme,'dragon');assert.equal(fx('Soap').resets.length,1);
 const r=E.lookAfterMeal(E.defaultLook(),'Dragon Egg Cradle','fantasy','',9);assert.ok(r.look.mix.back['dragon-wings']>0,'egg cradle does not reset');
});
