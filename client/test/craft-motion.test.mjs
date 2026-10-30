import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const start = app.indexOf('let activeCraftMotion=null;');
const end = app.indexOf('// V54: pulsing feedback', start);
assert.ok(start >= 0 && end > start, 'Craft motion remains in the main app');
const source = app.slice(start, end);

function harness() {
  const animations = [], nodes = [];
  const slot0 = { getBoundingClientRect: () => ({left:24, top:140, width:116, height:116}) };
  const slot1 = { getBoundingClientRect: () => ({left:178, top:140, width:116, height:116}),
    innerHTML: '<span class="slot-art">Ingredient</span>', animate(){} };
  const items = new Map([
    ['water', {name:'Water'}],
    ['fire', {name:'Fire'}],
    ['steam', {name:'Steam'}]
  ]);
  const document = {
    visibilityState: 'visible',
    body: { appendChild(node){nodes.push(node);} },
    addEventListener(){},
    createElement(){
      return {
        style: {}, innerHTML:'', removed:false,
        setAttribute(){}, remove(){this.removed=true;},
        animate(frames,opts){animations.push({frames,opts});return {finished:Promise.resolve()};}
      };
    }
  };
  const ctx = {
    document, window: { innerWidth:390, innerHeight:820, matchMedia:()=>({matches:false}) },
    tab:'Play', $:id=>id==='slot0'?slot0:slot1, byId:items,
    staticArt:()=>'<svg></svg>', escapeText:s=>String(s), uiName:i=>i?.name||'',
    setTimeout:fn=>{queueMicrotask(fn);return 1;},
    clearTimeout(){}
  };
  const motion = vm.runInNewContext(source+'\n({playCraftMotion,stopCraftMotion})',ctx);
  return {...motion, animations, nodes};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('invalid pair flies toward left tile, bumps, and returns within 300ms',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire',null,false),true);
 await settle();
 assert.equal(h.animations.length,1);
 assert.equal(h.animations[0].opts.duration,295);
 assert.match(h.animations[0].frames.at(-1).transform,/translate3d\(0,0,0\)/);
 assert.ok(h.nodes.every(node=>node.removed));
});

test('existing result moves left and fades upward, without fullscreen reveal',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire','steam',false),true);
 await settle();
 assert.equal(h.animations.length,2);
 assert.match(h.animations[1].frames.at(-1).transform,/\-48px/);
 assert.ok(!h.nodes.some(n=>n.className==='craft-motion-full'));
});

test('new discovery expands to viewport and does not require modal dismissal',async()=>{
 const h=harness();
 assert.equal(h.playCraftMotion('water','fire','steam',true),true);
 await settle();
 assert.equal(h.animations.length,3);
 assert.ok(h.nodes.some(node=>node.className==='craft-motion-full'));
 assert.match(h.animations[1].frames.at(-1).transform,/scale\(1\)/);
 assert.ok(h.nodes.every(node=>node.removed));
});

test('new input can instantly interrupt an active animation',async()=>{
 const h=harness();
 h.playCraftMotion('water','fire','steam',true);
 h.stopCraftMotion();
 assert.ok(h.nodes.every(node=>node.removed));
 await settle();
 assert.equal(h.animations.length,1);
});

test('reduced-motion users keep the old result modal path',()=>{
 const h=harness();
 // This remains a static guard against accidentally delaying a combine.
 assert.match(source, /prefers-reduced-motion: reduce/);
 assert.match(app, /if\(showPopup\)showDiscovery\(resultId,a,b\)/);
 assert.match(app, /finishSlots\(\);completeCombination\(result,a,b,cached\?'recipe':'redundant',!animated\)/);
 h.stopCraftMotion();
});
