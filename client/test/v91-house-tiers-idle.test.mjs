import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V91: companion houses form an upgrade chain (better = harder)',async()=>{
 const {RECIPE_POLISH_V91}=await import('../src/recipe-polish-v91.js');
 assert.deepEqual(RECIPE_POLISH_V91.adds[0],['organic89:companion-tent','legacy:24','organic89:companion-hut']);
 assert.deepEqual(RECIPE_POLISH_V91.remaps[0],['legacy:45','legacy:24','organic89:companion-hut','organic89:floorboards']);
 const {ORGANIC_V89}=await import('../src/organic-pack-v89.js');
 const r=new Map(ORGANIC_V89.recipes.map(([a,b,o])=>[o,[a,b]]));
 // each bigger house is crafted from the previous one
 assert.ok(r.get('organic89:companion-cabin').includes('organic89:companion-hut'));
 assert.ok(r.get('organic89:companion-cottage').includes('organic89:companion-cabin'));
 assert.ok(r.get('organic89:companion-villa').includes('organic89:companion-cottage'));
 assert.ok(r.get('organic89:companion-castle').includes('organic89:companion-villa'));
 assert.match(src('client/src/app.js'),/\.\.\.RECIPE_POLISH_V91\.adds/);
});
test('V91: idle discoveries only from craftable pairs, capped, free part kept, rest via real ad',()=>{
 const app=src('client/src/app.js');
 assert.match(app,/IDLE_MIN_MS=30\*60\*1000,IDLE_MAX_HOURS=8/);
 assert.match(app,/if\(unlocked\.has\(a\)&&unlocked\.has\(b\)\)\{seen\.add\(o\);out\.push/);
 assert.match(app,/showRewarded\(\{kind:'idle_finds'/);
 assert.match(app,/grant\(0,free\);/);
 assert.match(app,/const free=adFree\(\)\?finds\.length:Math\.min\(finds\.length,finds\.length>=5\?2:1\);/);
});
test('V91: furniture drag and drop with live fit feedback',()=>{
 const eng=src('client/src/home-engine-v90.js'),css=src('client/src/styles.css');
 assert.match(eng,/function wireDrag\(mount,hid,el\)/);assert.match(eng,/hold=setTimeout\(start,320\)/);
 assert.match(css,/\.home-piece\.is-dragging\.is-bad/);
});
