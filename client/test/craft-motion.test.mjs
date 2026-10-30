import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const start = app.indexOf('let activeCraftMotion=null;');
const end = app.indexOf('// V54: pulsing feedback', start);
assert.ok(start >= 0 && end > start, 'Craft motion remains in the main app');
const source = app.slice(start, end);

function harness(reduce=false) {
 const animations=[],nodes=[];
 const leftRect={left:24,right:140,top:140,width:116,height:116};
 const slot0={getBoundingClientRect:()=>leftRect};
 const slot1={getBoundingClientRect:()=>({left:178,top:140,width:116,height:116}),innerHTML:'<span class="slot-art">Ingredient</span>',animate(){}};
 const modalCard={
  style:{visibility:''},getBoundingClientRect:()=>({left:20,top:260,width:350,height:310}),
  animate(frames,opts){const a={playState:'running',cancelled:false,finished:Promise.resolve(),cancel(){this.cancelled=true;}};animations.push({node:'modal',frames,opts,animation:a});return a;}
 };
 const modal={hidden:false,querySelector:selector=>selector==='.modal-card'?modalCard:null};
 const items=new Map([['water',{name:'Water'}],['fire',{name:'Fire'}],['steam',{name:'Steam'}]]);
 const document={
  visibilityState:'visible',
  body:{appendChild(node){nodes.push(node);}},
  addEventListener(){},
  createElement(){return {dataset:{},style:{},innerHTML:'',removed:false,setAttribute(){},remove(){this.removed=true;},animate(frames,opts){animations.push({node:'ghost',frames,opts});return {finished:Promise.resolve()};}};}
 };
 const ctx={
  document,window:{innerWidth:390,innerHeight:820,matchMedia:()=>({matches:reduce})},
  tab:'Play',$:id=>id==='slot0'?slot0:id==='slot1'?slot1:modal,byId:items,
  staticArt:()=>'<svg></svg>',escapeText:s=>String(s),uiName:i=>i?.name||'',
  setTimeout:()=>1,clearTimeout(){},console:{warn(){}}
 };
 const motion=vm.runInNewContext(source+'\n({playCraftMotion,stopCraftMotion,attachDiscoveryMotion})',ctx);
 return {...motion,animations,nodes,modalCard,modal};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('incompatible right tile contacts left edge without overlap and bounces away',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire',null,false),true);
 await settle();
 const frames=h.animations[0].frames;
 // Left outer edge ends at x=140. Right tile begins at x=178.
 // Every left edge throughout the motion is at least x=140.
 const xs=frames.map(frame=>Number(frame.transform.match(/translate3d\((-?[0-9.]+)px/)[1]));
 assert.ok(xs.every(x=>x>=-38), 'right tile must never enter the left tile');
 assert.ok(xs.includes(-38),'right tile touches the left edge precisely');
 assert.equal(h.animations[0].opts.duration,270);
 assert.equal(h.nodes[0].dataset.motion,'invalid');
 assert.ok(h.nodes.every(n=>n.removed));
});
test('known result fuses and flies up without a discovery dialog',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire','steam',false),true);
 await settle();
 assert.deepEqual(h.animations.map(a=>a.opts.duration),[165,300]);
 assert.match(h.animations[1].frames.at(-1).transform,/-48px/);
 assert.equal(h.modalCard.style.visibility,'');
});
test('new result grows into ORIGINAL modal card and remains open until X',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire','steam',true),true);
 h.attachDiscoveryMotion('steam');
 assert.equal(h.modalCard.style.visibility,'hidden');
 await settle();
 assert.deepEqual(h.animations.map(a=>a.opts.duration),[165,390]);
 assert.equal(h.animations[1].node,'modal');
 assert.match(h.animations[1].frames[0].transform,/scale\(/);
 assert.equal(h.modalCard.style.visibility,'');
 assert.equal(h.modal.hidden,false);
 assert.ok(h.nodes.every(n=>n.removed));
 assert.doesNotMatch(css,/craft-motion-full/);
 assert.match(app,/\$('modal'\)\.dataset\.dismiss='x-only';\s*attachDiscoveryMotion\(id\)/);
});
test('interrupted entrance restores the same modal rather than hiding it',async()=>{
 const h=harness();
 h.playCraftMotion('water','fire','steam',true);
 h.attachDiscoveryMotion('steam');
 h.stopCraftMotion();
 assert.equal(h.modalCard.style.visibility,'');
 assert.equal(h.modal.hidden,false);
 assert.ok(h.nodes.every(n=>n.removed));
 await settle();
});
test('reduced motion uses original persistent modal without animation',()=>{
 const h=harness(true);
 assert.equal(h.playCraftMotion('water','fire','steam',true),false);
 assert.match(source,/prefers-reduced-motion: reduce/);
 assert.match(app,/if\(showPopup\)showDiscovery\(resultId,a,b\)/);
 assert.match(app,/finishSlots\(\);completeCombination\(result,a,b,cached\?'recipe':'redundant'\);return;/);
});
