import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8'),eng=readFileSync(new URL('../src/companion-engine-v86.js',import.meta.url),'utf8'),css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8'),java=readFileSync(new URL('../../native/android/AlchemyBillingPlugin.java',import.meta.url),'utf8'),html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('V125: second slot unlocks only by Play purchase or 2000 elements + 20 earned ads',()=>{
 assert.match(app,/SLOT2_MIN_ELEMENTS=2000,SLOT2_ADS=20/);
 assert.match(app,/function slot2Unlocked\(\)\{return slot2\.bought\|\|\(slot2\.ads>=SLOT2_ADS&&classicDiscoveredCount\(\)>=SLOT2_MIN_ELEMENTS\);\}/);
 assert.match(app,/showRewarded\(\{kind:'companion_slot'/);assert.match(app,/if\(st\.companionSlot===true&&!slot2\.bought\)/);
 assert.match(java,/SLOT_ID = "companion_slot"/);assert.match(java,/public void purchaseCompanionSlot\(PluginCall call\)/);
});
test('V125: duo games, growth bonus, idle boost and animation states exist',()=>{
 for(const g of ['spar','throwing','tag','hideSeek','ballGame'])assert.match(eng,new RegExp(`async function ${g}\\(`));
 assert.match(eng,/return g\*\(typeof duoActive==='function'&&duoActive\(\)\?1\.25:1\)/);
 assert.match(app,/const duo=companions\.duoPair\?\.\(\)\|\|\[\]/);
 for(const a of ['duo-guard','duo-punch','duo-kick','duo-header','duo-hit','duo-block','duo-windup','duo-throw','duo-laugh','duo-cheer','duo-cover','duo-search','duo-peek','duo-hide','duo-bow','duo-charge'])assert.ok(css.includes(`data-anim="${a}"`),a);
 assert.match(html,/id="packsBtn"/);
});
