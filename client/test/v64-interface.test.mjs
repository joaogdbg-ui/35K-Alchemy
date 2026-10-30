import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
test('V64: discovered count is inside the brand after the name',()=>{
 const brand=html.match(/<div class="brand">([\s\S]*?)<\/div>/)?.[1]||'';
 assert.match(brand,/brand-name/);assert.match(brand,/id="discoveredCount"/);
 assert.ok(brand.indexOf('brand-name')<brand.indexOf('id="discoveredCount"'));
});
test('V64: settings immediately precedes game-mode selector, no audio on header',()=>{
 assert.match(html,/<div class="header-end"><button[^>]*id="settingsBtn"[\s\S]*?<button[^>]*id="modeBtn"/);
 assert.doesNotMatch(html,/id="soundToggle"/);
});
test('V64: batch and hint are siblings in a single actions row, no rewarded label',()=>{
 const row=html.match(/<div class="craft-actions"[\s\S]*?<\/div>/)?.[0]||'';
 assert.match(row,/id="batchOpen"/);assert.match(row,/id="compassBtn"/);
 assert.doesNotMatch(row,/Rewarded/);
 assert.match(css,/\.craft-actions\{display:flex/);
});
test('V64: result feedback is a separate row, not wrapper of hint',()=>{
 const feedback=html.match(/<div id="combineFeedback"[\s\S]*?<\/div>/)?.[0]||'';
 assert.match(feedback,/id="combineFeedbackText"/);
 assert.doesNotMatch(feedback,/id="compassBtn"/);
 assert.match(css,/\.combine-feedback\[data-kind="repeat"\]/);
});
test('V64: repeat combinations only announce once and do not toast',()=>{
 // V83: the ghost-tile motion call joins the single announcement; still no toast.
 assert.match(js,/else \{announceCraft\('repeat','Already discovered · '\+uiName\(byId.get\(resultId\)\)\);playCraftMotion\(scene,'repeat',byId\.get\(resultId\)\);\}/);
 assert.doesNotMatch(js,/toast\(\(kind==='redundant'/);
});
test('V64: sound switch lives in Settings and persists user choice',()=>{
 assert.match(js,/id=\"settingsSoundToggle/);
 assert.match(js,/\$\('settingsSoundToggle'\)\.onclick=toggleSoundEnabled/);
 assert.match(js,/localStorage\.setItem\(SOUND_KEY,soundEnabled\?'on':'off'\)/);
});
