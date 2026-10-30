import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src = p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('combiner motion animates ghost tiles, never the real slots',()=>{
 const app=src('client/src/app.js');
 // The scene is captured before the slots are cleared, so taps are never blocked.
 assert.match(app,/const scene=captureCraftScene\(\);finishSlots\(\);/);
 assert.match(app,/g\.className='craft-slot filled craft-ghost'/);
 assert.match(app,/document\.body\.appendChild\(g\)/);
 // Three outcomes: no recipe (touch and bounce), repeat (merge and rise), new (merge and morph).
 assert.match(app,/playCraftMotion\(takeCraftScene\(\),'invalid'\)/);
 assert.match(app,/playCraftMotion\(scene,'repeat',byId\.get\(resultId\)\)/);
 assert.match(app,/showDiscovery\(resultId,a,b,scene\)/);
 assert.match(app,/playCraftMotion\(scene,'new',it\)/);
 // A new ingredient dismisses only the ghost covering its slot.
 assert.match(app,/settleGhosts\(index\);slots\[index\]=id;/);
 // The discovery window still closes only with X and any morph is cleaned when dialogs change.
 assert.match(app,/dataset\.dismiss='x-only';\n playCraftMotion/);
 assert.match(app,/function showModal\(content\)\{cancelCraftMorph\(\);/);
 assert.match(app,/prefers-reduced-motion: reduce/);
});
test('ghost tiles have fixed positioning and respect reduced motion',()=>{
 const css=src('client/src/styles.css');
 assert.match(css,/\.craft-ghost\.craft-ghost\{position:fixed;margin:0;z-index:70;pointer-events:none/);
 assert.match(css,/\.craft-ghost\.is-morphing\{z-index:90/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.craft-ghost\{display:none!important\}\}/);
 const standalone=src('client/standalone.html');
 assert.ok(standalone.includes('.craft-ghost.craft-ghost{position:fixed'));
 assert.ok(standalone.includes('function captureCraftScene()'));
});
