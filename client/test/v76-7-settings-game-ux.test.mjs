import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const src=read('client/src/app.js'),css=read('client/src/styles.css');
const pos=src.indexOf('function settings(){'),end=src.indexOf('// V28 family sweep:',pos),menu=src.slice(pos,end);
test('V76.8 shows five understandable setting groups without a tab bar or redundant actions',()=>{
 assert.ok(menu.indexOf('Sound effects')<menu.indexOf('Theme'));
 assert.ok(menu.indexOf('Theme')<menu.indexOf('Family starter packs'));
 // V84: the account row is labelled by the service it will connect to.
 assert.ok(menu.indexOf('Family starter packs')<menu.indexOf('Google Play Games'));
 assert.ok(menu.indexOf('Google Play Games')<menu.indexOf('Help &amp; about'));
 assert.doesNotMatch(menu,/role="tab"|role="tablist"|id="hintButton"|id="importBackup"|id="exportBackup"/);
});
test('V76.8 all controls are real and preserve player preferences',()=>{
 assert.match(menu,/id="settingsSoundToggle"/);
 assert.match(menu,/\$\('settingsSoundToggle'\)\.onclick=toggleSoundEnabled/);
 assert.match(src,/localStorage\.setItem\(SOUND_KEY,soundEnabled\?'on':'off'\)/);
 for(const theme of ['light','dark','system'])assert.ok(menu.includes('data-theme-choice="'+theme+'"'));
 assert.match(menu,/localStorage\.setItem\(THEME_KEY,selectedTheme\)/);
 assert.match(menu,/\$\('settingsStarterPacks'\)\.onclick=\(\)=>starterPacks\(\)/); // V124: Classic only
});
test('V76.8 Profile and Help have genuine navigation, and cloud actions remain disabled',()=>{
 assert.match(menu,/\$\('settingsProfileLink'\)\.onclick=/);
 assert.match(menu,/\$\('settingsHelpLink'\)\.onclick=/);
 assert.match(menu,/\$\('settingsBack'\)\.onclick=/);
 assert.match(menu,/id="recoverFromCloud" disabled/);
 assert.match(menu,/id="settingsLeaderboard" disabled/);
 assert.match(menu,/Google Play Games is not connected/);
 assert.equal((menu.match(/<details>/g)||[]).length,5); // V85 Shiny + V86 Companions help entries
 assert.match(menu,/Escape/);
});
test('V76.8 responsive, dark-mode UI does not consume entire game screen',()=>{
 assert.match(css,/\.modal:has\(\.settings-shell\) \.modal-card/);
 assert.match(css,/@media\(max-height:590px\)/);
 assert.match(css,/@media\(max-width:355px\)/);
 assert.match(css,/html\[data-theme="dark"\] \.settings-theme-choices/);
 assert.match(css,/\.settings-page\[hidden\]\{display:none!important\}/);
 assert.match(src,/function exportProgress\(\)/);
 assert.match(src,/function importProgress\(file\)/);
});
