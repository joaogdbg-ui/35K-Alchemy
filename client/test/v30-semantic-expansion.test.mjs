import test from 'node:test';
import assert from 'node:assert/strict';
import {DATA} from '../src/legacy-data.js';
import {PACK} from '../src/creative-pack.js';
import {GAMING_V22} from '../src/gaming-pack-v22.js';
import {GAMING_V23} from '../src/gaming-pack-v23.js';
import {GAMING_V24} from '../src/gaming-pack-v24.js';
import {GAMING_V26} from '../src/gaming-pack-v26.js';
import {GAMING_V27} from '../src/gaming-pack-v27.js';
import {GAMING_V30} from '../src/gaming-pack-v30.js';
import {GAMEVERSE_ART_V30_SEMANTIC} from '../src/gameverse-art-v30-semantic.js';
const key=(a,b)=>[a,b].sort().join('|');
const old=[PACK,GAMING_V22,GAMING_V23,GAMING_V24,GAMING_V26,GAMING_V27];
const items=new Map(DATA.items.map(([name],id)=>[`legacy:${id}`,name]));
const recipes=new Map(DATA.recipes.map(([a,b,c])=>[key(`legacy:${a}`,`legacy:${b}`),`legacy:${c}`]));
for(const p of old){for(const o of p.items)items.set(o.id,o.name);for(const [a,b,c] of p.recipes){if(!recipes.has(key(a,b)))recipes.set(key(a,b),c);}}
test('V30 introduces only English curated real game titles and preserves existing recipe answers',()=>{
 assert.equal(GAMING_V30.items.length,26);assert.equal(GAMING_V30.recipes.length,78);
 assert.ok(GAMING_V30.items.every(x=>x.category==='game'&&/^gaming30:/.test(x.id)));
 assert.ok(!GAMING_V30.items.some(x=>/\b(jogo|noite|espada|disquete|corrida)\b/i.test(x.name)));
 for(const x of GAMING_V30.items){assert.ok(!items.has(x.id));items.set(x.id,x.name);}
 for(const [a,b,c] of GAMING_V30.recipes){assert.ok(items.has(a)&&items.has(b)&&items.has(c));assert.ok(!recipes.has(key(a,b)),`Overwrites recipe ${a}+${b}`);recipes.set(key(a,b),c);}
 assert.equal(items.size,3388);assert.equal(recipes.size,8555);
});
test('V30 all new elements remain reachable from four primordial ingredients',()=>{
 for(const it of GAMING_V30.items)items.set(it.id,it.name);
 for(const [a,b,c] of GAMING_V30.recipes) recipes.set(key(a,b),c);
 const reached=new Set(['legacy:0','legacy:1','legacy:2','legacy:3']);
 for(let t=0;t<75;t++){const before=reached.size;for(const [k,out] of recipes){const [a,b]=k.split('|');if(reached.has(a)&&reached.has(b))reached.add(out);}if(reached.size===before)break;}
 assert.ok(GAMING_V30.items.every(x=>reached.has(x.id)));
});
test('V30 visual semantic gate ensures exact meaningful named icons, not generic guesses',()=>{
 const must=['sun','sky','wind','crystal','moon','star','earth','ocean','rain','cloud','lightning','sword','dragon','camera','battery','river','tree','forest'];
 for(const name of must){assert.ok(GAMEVERSE_ART_V30_SEMANTIC[name],`Missing custom artwork for ${name}`);assert.ok(GAMEVERSE_ART_V30_SEMANTIC[name].includes('<svg'))}
 assert.notEqual(GAMEVERSE_ART_V30_SEMANTIC.sun,GAMEVERSE_ART_V30_SEMANTIC.star);
 assert.notEqual(GAMEVERSE_ART_V30_SEMANTIC.sky,GAMEVERSE_ART_V30_SEMANTIC.wind);
 assert.notEqual(GAMEVERSE_ART_V30_SEMANTIC.wind,GAMEVERSE_ART_V30_SEMANTIC.crystal);
 assert.equal(Object.keys(GAMEVERSE_ART_V30_SEMANTIC).length,104);
 const gameImages=GAMING_V30.items.map(it=>GAMEVERSE_ART_V30_SEMANTIC[it.name.toLowerCase()]);
 assert.ok(gameImages.every(Boolean),'Every V30 game must have a curated, semantic image');
 assert.equal(new Set(gameImages).size,GAMING_V30.items.length,'V30 game illustrations must be visually distinct');
});
