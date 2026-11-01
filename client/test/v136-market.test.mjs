import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const M=await import('../src/market-v136.js');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8'),games=readFileSync(new URL('../src/games-v93.js',import.meta.url),'utf8'),java=readFileSync(new URL('../../native/android/AlchemyBillingPlugin.java',import.meta.url),'utf8');
test('V136: coins, market catalogue, accessories and lessons are consistent',()=>{
 for(const it of M.MARKET.filter(i=>i.kind==='acc'))assert.ok(M.ACCESSORIES[it.acc],it.acc);
 for(const a of Object.values(M.ACCESSORIES))assert.match(a.draw(40),/<(path|rect|circle|g|ellipse)/);
 assert.equal(M.wearableFor('Top Hat'),'top-hat');assert.equal(M.wearableFor('Scarf'),'scarf');assert.equal(M.wearableFor('Water'),null);
 assert.ok(M.coinsFor('race',4,1,{theme:true,firstGold:true})>M.coinsFor('race',0,5));assert.equal(M.LESSONS.length,6);
});
test('V136: coin packs are credited once per Play token; theme races gate at 85%',()=>{
 assert.match(java,/COIN_PACKS = \{"coins_100", "coins_550", "coins_1200", "coins_2600"\}/);assert.match(java,/public void purchaseCoins\(PluginCall call\)/);assert.match(java,/consumeAsync/);
 assert.match(app,/if\(typeof t!=='string'\|\|wallet\.tokens\.includes\(t\)\)continue/);
 assert.match(games,/>=85\):!c\.locked\|\|/);assert.match(games,/THEME_COURSES=\[/);
});
