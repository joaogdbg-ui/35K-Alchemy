import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ORGANIC_ART_V70} from '../src/organic-art-v70.js';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const m=JSON.parse(read('shared/v70-approved.json'));
test('V70 completes the 14 remaining original V61 motifs without adding recipes',()=>{
 assert.equal(m.new_items.length,0);assert.equal(m.redrawn_v61.length,14);
 assert.equal(Object.keys(ORGANIC_ART_V70).length,14);
 const orig=JSON.parse(read('shared/v61-art-manifest.json')).icons;
 const already=new Set();for(const v of [63,65,66,67,68,69])for(const x of JSON.parse(read(`shared/v${v}-approved.json`)).redrawn_v61)already.add(x.name);
 const left=orig.filter(x=>x.art_mode==='motif-composite'&&!already.has(x.name));
 assert.equal(left.length,14);
 assert.deepEqual(new Set(m.redrawn_v61.map(e=>e.name)),new Set(left.map(e=>e.name)));
});
test('V70 SVG assets retain unique hashes and match runtime exactly',()=>{
 const hashes=new Set();for(const e of m.redrawn_v61){const svg=read(e.path);const sha=createHash('sha256').update(svg).digest('hex');assert.equal(sha,e.sha256);assert.equal(ORGANIC_ART_V70[e.name.toLowerCase()],svg);assert.ok(!hashes.has(sha));hashes.add(sha);}
});
test('V70 Android compact layout is scoped to native immersive build only',()=>{
 const css=read('client/src/styles.css'),app=read('client/src/app.js');
 assert.match(css,/html\.alchemy-android-immersive \.app/);
 assert.match(css,/padding-top:clamp\(8px, env\(safe-area-inset-top, 0px\), 14px\)/);
 assert.match(app,/getPlatform\?\.\(\)===\'android\'/);
});
