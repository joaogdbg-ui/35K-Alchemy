import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const js=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const info=JSON.parse(readFileSync(new URL('../../shared/v49-ip-name-screening.json',import.meta.url),'utf8'));

test('V49 opening selector shows exactly two high-level options',()=>{
 const fn=js.slice(js.indexOf('function modePicker('),js.indexOf('function familyCardArtwork('));
 assert.match(fn,/data-mode-choice="classic"/);
 assert.match(fn,/data-mode-choice="families"/);
 assert.doesNotMatch(fn,/data-campaign-id=/);
});
test('V49 keeps image-backed family choice separate and disables incomplete campaigns',()=>{
 const fn=js.slice(js.indexOf('function familyModePicker('),js.indexOf('async function requestModeActivation('));
 assert.match(fn,/familyCardArtwork\(f\)/);
 assert.match(fn,/familyCampaigns\.get\(f\.id\)/);
 assert.match(fn,/Coming Soon/);
 assert.match(fn,/\$\{ready\?'':'disabled'\}/);
 assert.match(css,/\.family-campaign-gallery/);
});
test('V49 first choice free; later changes await rewarded SDK earned event',()=>{
 const fn=js.slice(js.indexOf('async function requestModeActivation('),js.indexOf('function showPendingCount('));
 assert.match(fn,/if\(firstChoice\)/);
 assert.match(fn,/if\(!rewardedAvailable\(\)\)/);
 assert.match(fn,/showRewarded\(\{kind:'mode_switch'/);
 assert.match(fn,/if\(result\?\.earned!==true\)/);
 assert.doesNotMatch(fn,/preview|demoReward|mockReward/i);
});
test('V49 does not silently rename catalog or destroy Classic ID stability',()=>{
 assert.match(js,/const MODE_SELECTION_KEY='35k_mode_selected_v48'/);
 assert.match(js,/const \{items: ITEMS,recipes:classicRecipes\} = buildCatalog/);
 assert.match(js,/const familyCampaigns=new Map/);
});
test('V49 IP report is a triage tool, not a mass-replacement instruction',()=>{
 assert.equal(info.catalog.elements,3963);
 assert.equal(info.catalog.recipes,12069);
 assert.ok(info.totalMatchedRecords>100);
 assert.ok(info.flagged.some(x=>/PlayStation/i.test(x.name)));
 assert.ok(info.flagged.some(x=>/Sonic/i.test(x.name)));
 assert.ok(info.examples.every(x=>x.status==='not cleared'));
});
test('V49 legal naming guidance requires independent review before clearance',()=>{
 const guide=readFileSync(new URL('../../docs/IP_NAMING_GUIDELINES_V49.md',import.meta.url),'utf8');
 assert.match(guide,/not legal clearance/);
 assert.match(guide,/No catalog display name has been changed/);
 assert.match(guide,/Google Play/);
});
