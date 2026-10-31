import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const src=p=>readFileSync(resolve(root,p),'utf8');
test('V87: first companion free, later switches need a rewarded ad with a 5-minute grace',()=>{
 const app=src('client/src/app.js'),eng=src('client/src/companion-engine-v86.js');
 assert.match(app,/COMPANION_GRACE_MS=5\*60\*1000/);
 assert.match(app,/showRewarded\(\{kind:'companion_switch'/);
 assert.match(app,/requestActivation:requestCompanionActivation/);
 assert.match(app,/This standalone HTML does not simulate ads/);
 assert.match(eng,/if\(!state\.firstFreeUsed\)return setActive\(id\);/);
 assert.match(eng,/Choose · ad/);assert.match(eng,/Choose · free/);
});
test('V87: companion discoveries are flagged in the sheet and with a tab badge',()=>{
 const app=src('client/src/app.js'),html=src('client/index.html'),css=src('client/src/styles.css'),eng=src('client/src/companion-engine-v86.js');
 assert.match(html,/<i class="tab-badge" id="petsBadge" hidden/);
 assert.match(app,/NEW COMPANION/);assert.match(app,/Companion element!/);assert.match(app,/id="meetCompanion"/);
 assert.match(app,/if\(tab==='Pets'\)companions\.markSeen\(\);else companions\.syncSeen\(\);/);
 assert.match(eng,/function markSeen\(\)/);assert.match(css,/\.tab-badge\{/);
});
test('V87: Chao-style petting, emotion orb, belly and renaming are drawn, never written over the companion',async()=>{
 const eng=src('client/src/companion-engine-v86.js');
 for(const k of ['heart:','spiral:','bowl:','burst:'])assert.ok(eng.includes(k),k);
 assert.match(eng,/function startPetting\(\)/);assert.match(eng,/PET_MOOD_CAP=12/);
 assert.match(eng,/BELLY_DECAY_MS=6\*60\*1000/);assert.match(eng,/NICK_MAX=16/);
 const emotes=eng.match(/const EMOTE_SVG=\{[\s\S]*?\n \};/)[0];
 assert.doesNotMatch(emotes,/<text\b/,'emotion orb uses shapes only');
 const m=await import('../src/companion-engine-v86.js');
 assert.equal(m.HUNGRY_SELF_FEED_MS[1],120000);
});
