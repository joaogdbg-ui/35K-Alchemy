import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const source=read('client/src/app.js');
const marker='const COLLECTION_SETS=';
const start=source.indexOf(marker);
const end=source.indexOf('];\nfor(const set of COLLECTION_SETS)',start);
assert.ok(start>=0&&end>start,'Themed collection definitions must be present');
const defs=runInNewContext('('+source.slice(start+marker.length,end+1)+')',{},{timeout:1000});
test('All 18 themed collection titles clearly describe genres or hardware rather than pseudo-brands',()=>{
 assert.equal(defs.length,18);
 assert.equal(new Set(defs.map(s=>s.id)).size,18);
 assert.equal(new Set(defs.map(s=>s.name)).size,18);
 const obscure=/\b(?:Qelvorune|Velqryon|Zerqadyn|Thrynovex|Mosskip|Windrush|Pufflet|Mooncrest|Sky Orbs|Critter Atlas|Pokémon|PlayStation|Xbox|Nintendo|Sega|Mario|Kirby|Sonic|Zelda|Dragon Ball)\b/i;
 for(const s of defs){
  assert.ok(!obscure.test(s.name),s.id+': name '+s.name);
  assert.ok(s.name.length>=12&&s.name.length<=34,s.id+': title length');
  assert.ok(s.description.length>=35&&s.description.length<=92,s.id+': description length');
  assert.ok(!obscure.test(s.description),s.id+': original brand in card');
  assert.ok(s.names.length>=3,s.id+': minimum intended collection size');
  assert.ok(['consoles','games'].includes(s.family),s.id+': family');
 }
});
test('Cards and collection detail display reviewed labels without returning to blanket IP substitutions',()=>{
 assert.ok(source.includes('escapeText(s.name)}</strong><span class="theme-set-description"'));
 assert.ok(source.includes('escapeText(s.description)'));
 assert.ok(source.includes("s?s.name:publicText(g.name)"));
 assert.ok(source.includes("setDescription.textContent=s?s.description:''"));
 assert.ok(source.includes("set.ids=set.names.map(n=>ITEMS.find"));
 assert.ok(read('client/index.html').includes('id="collectionDetailDescription"'));
 assert.ok(read('client/src/styles.css').includes('.theme-set-description'));
});
test('Themed collection IDs and historical member names remain stable for previous progress',()=>{
 assert.deepEqual(Array.from(defs,s=>s.id),['playstation','nintendo','classics','sega-hardware','xbox-history','mario-eras','sonic-eras','kirby-tour','pokemon-eras','dragon-ball-games','survival-horror','pc-classics','indie','nintendo-64','sony-portables','fighting-legends','music-games','zelda-classics']);
 assert.deepEqual(Array.from(defs,s=>s.names.length),[7,5,5,5,5,6,6,4,7,4,5,5,5,5,4,5,5,4]);
});
