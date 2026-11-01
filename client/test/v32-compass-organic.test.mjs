import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {GAMING_V22} from '../src/gaming-pack-v22.js';
import {GAMING_V23} from '../src/gaming-pack-v23.js';
import {GAMING_V24} from '../src/gaming-pack-v24.js';
import {GAMING_V26} from '../src/gaming-pack-v26.js';
import {GAMING_V27} from '../src/gaming-pack-v27.js';
import {GAMING_V30} from '../src/gaming-pack-v30.js';
import {ORGANIC_V32} from '../src/organic-pack-v32.js';
import {ORGANIC_ART_V32} from '../src/organic-art-v32.js';
const key=(a,b)=>[a,b].sort().join('|');
const packs=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27,GAMING_V30];
const items=new Map(DATA.items.map(([name],i)=>[`legacy:${i}`,name]));
const recipes=new Map(DATA.recipes.map(([a,b,c])=>[key(`legacy:${a}`,`legacy:${b}`),`legacy:${c}`]));
for(const p of packs){for(const item of p.items)items.set(item.id,item.name);for(const [a,b,c] of p.recipes)if(!recipes.has(key(a,b)))recipes.set(key(a,b),c)}
const before=new Map(recipes);
test('V32 add-on has only unique elements with English names',()=>{
 assert.equal(ORGANIC_V32.items.length,26);
 assert.equal(ORGANIC_V32.recipes.length,48);
 const ids=ORGANIC_V32.items.map(i=>i.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const it of ORGANIC_V32.items){assert.ok(!items.has(it.id));assert.match(it.name,/^[\x20-\x7E]+$/);items.set(it.id,it.name)}
});
test('V32 preserves every previous recipe without conflicting unordered pairs',()=>{
 for(const [a,b,c] of ORGANIC_V32.recipes){assert.ok(items.has(a)&&items.has(b)&&items.has(c));assert.ok(!recipes.has(key(a,b)),`${a} + ${b} conflicts`);recipes.set(key(a,b),c)}
 assert.equal(items.size,3414);assert.equal(recipes.size,8603);
 for(const [pair,result] of before)assert.equal(recipes.get(pair),result);
});
test('every V32 new element is reachable from Water, Fire, Earth, Air',()=>{
 const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 for(let i=0;i<80;i++){const count=reached.size;for(const [k,out] of recipes){const [a,b]=k.split('|');if(reached.has(a)&&reached.has(b))reached.add(out)}if(count===reached.size)break}
 for(const it of ORGANIC_V32.items)assert.ok(reached.has(it.id),it.name);
});
test('each new concept gets a meaningful, unique original drawing',()=>{
 assert.equal(Object.keys(ORGANIC_ART_V32).length,26);
 const arts=ORGANIC_V32.items.map(i=>ORGANIC_ART_V32[i.name.toLowerCase()]);
 assert.ok(arts.every(a=>a&&a.includes('<svg')&&!a.includes('animation')));
 assert.equal(new Set(arts).size,26);
});
test('the Compass is optional, non-spoiler, and preserves two navigation tabs',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(html,/id="compassBtn"/);
 assert.equal((html.match(/class="tab(?: active)?" data-view/g)||[]).length,2) // V123: Alchemy + Home (Collection removed; Games is tab-games);
 assert.match(app,/function compassCandidates\(/);
 assert.match(app,/if\(unlocked.has\(out\)\)continue/);
 assert.match(app,/if\(await earnRecipeByAd\(item.out,item.family\)\)showCompassRevealed\(item\)/);
 assert.match(app,/const SOUND_KEY='35k_audio_enabled_v31'/);
 assert.match(app,/gameverse_alchemy_v2/);
});
