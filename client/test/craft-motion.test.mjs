import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const start=app.indexOf('let activeCraftMotion=null;'),end=app.indexOf('// V54: pulsing feedback',start);
assert.ok(start>0&&end>start);
const source=app.slice(start,end);
function harness(reduce=false){
 const animations=[],nodes=[],timers=[];
 const left={getBoundingClientRect:()=>({left:24,right:140,top:140,width:116,height:116})};
 const right={dataset:{},classList:{add(){},remove(){}},innerHTML:'Ingredient',getBoundingClientRect:()=>({left:178,right:294,top:140,width:116,height:116}),animate(frames,opts){const a={playState:'running',finished:Promise.resolve(),cancel(){this.playState='idle'}};animations.push({on:'right',frames,opts});return a}};
 const card={style:{visibility:''},getBoundingClientRect:()=>({left:20,top:260,width:350,height:310}),animate(frames,opts){const a={playState:'running',finished:Promise.resolve(),cancel(){this.playState='idle'}};animations.push({on:'card',frames,opts});return a}};
 const modal={hidden:false,querySelector:()=>card};
 const document={visibilityState:'visible',addEventListener(){},body:{appendChild(n){nodes.push(n)}},createElement(){return {style:{},innerHTML:'',remove(){this.removed=true},setAttribute(){},animate(frames,opts){const a={playState:'running',finished:Promise.resolve(),cancel(){this.playState='idle'}};animations.push({on:'ghost',frames,opts});return a}}}};
 const context={document,window:{matchMedia:()=>({matches:reduce})},tab:'Play',$:id=>id==='slot0'?left:id==='slot1'?right:modal,byId:new Map([['water',{name:'Water'}],['fire',{name:'Fire'}],['steam',{name:'Steam'}]]),staticArt:()=>'<svg/>',uiName:x=>x?.name,escapeText:s=>String(s),console:{warn(){}},slots:['water','fire'],clearTimeout(){},setTimeout(fn){timers.push(fn);return timers.length},finishSlots(){context.cleared=true}};
 const motion=vm.runInNewContext(source+'\n({playCraftMotion,animateOriginalDiscoveryModal,stopCraftMotion})',context);
 return {...motion,context,right,card,modal,animations,nodes,timers};
}
async function settle(){await new Promise(resolve=>setImmediate(resolve))}
test('invalid recipe moves REAL right tile to first edge contact and back without overlap',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire',null,false),true);
 assert.equal(h.animations.length,1);
 assert.equal(h.animations[0].on,'right');
 const frames=h.animations[0].frames;
 const xs=frames.map(f=>Number(f.transform.match(/translate3d\((-?[\d.]+)(?:px)?/)[1]));
 assert.ok(xs.every(v=>v>=-38));
 assert.ok(xs.includes(-38));
 assert.equal(xs.at(-1),0);
 assert.equal(h.animations[0].opts.duration,235);
 await settle();
 assert.equal(h.context.cleared,undefined);
 for(const timer of h.timers)timer();
 assert.equal(h.context.cleared,true);
});
test('new result uses original modal card without EVER hiding or auto-closing it',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire','steam',true),true);
 h.animateOriginalDiscoveryModal('steam');
 assert.deepEqual(h.animations.map(a=>a.on),['card']);
 assert.equal(h.card.style.visibility,'');
 assert.equal(h.modal.hidden,false);
 assert.equal(h.animations[0].frames.length,3);
 assert.match(h.animations[0].frames[0].transform,/translate3d/);
 assert.match(h.animations[0].frames[1].transform,/translate3d/);
 assert.equal(h.animations[0].frames[2].transform,'translate3d(0,0,0) scale(1)');
 await settle();
 assert.equal(h.modal.hidden,false);
 assert.equal(h.card.style.visibility,'');
 assert.doesNotMatch(source,/style\.visibility='hidden'/);
 assert.match(app,/if\(showPopup\)showDiscovery\(resultId,a,b\)/);
 assert.match(app,/animateOriginalDiscoveryModal\(id\)/);
 assert.match(app,/\$('modal'\)\.dataset\.dismiss='x-only'/);
});
test('interrupting an animated discovery leaves original popup visible',()=>{
 const h=harness();
 h.playCraftMotion('water','fire','steam',true);
 h.animateOriginalDiscoveryModal('steam');
 h.stopCraftMotion();
 assert.equal(h.modal.hidden,false);
 assert.equal(h.card.style.visibility,'');
});
test('repeat fades upward from combined left tile',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire','steam',false),true);
 await settle();
 assert.deepEqual(h.animations.map(a=>a.on),['ghost','ghost']);
 assert.match(h.animations[1].frames.at(-1).transform,/-50px/);
});
test('reduce motion skips animations and retains original popup',()=>{
 const h=harness(true);
 assert.equal(h.playCraftMotion('water','fire','steam',true),false);
 assert.equal(h.animations.length,0);
 assert.match(app,/if\(!moving\)finishSlots\(\)/);
});
