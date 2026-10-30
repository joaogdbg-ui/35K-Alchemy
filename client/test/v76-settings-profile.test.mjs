import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const js=read('client/src/app.js'),css=read('client/src/styles.css');
const start=js.indexOf('function settings(){'),end=js.indexOf('// V28 family sweep:',start);
const settings=js.slice(start,end);
test('V76.8 Settings opens as a simple overview, with separate Profile and Help screens',()=>{
 assert.ok(start>0&&end>start);
 for(const page of ['main','profile','help'])assert.ok(settings.includes('data-settings-page="'+page+'"'));
 assert.match(settings,/selectSettingsPage\('main'\)/);
 assert.doesNotMatch(settings,/role="tablist"|role="tab"|data-settings-tab=/);
 assert.match(js,/function selectSettingsPage\(next/);
 assert.match(settings,/id="settingsBack"/);
 assert.match(settings,/id="settingsProfileLink"/);
 assert.match(settings,/id="settingsHelpLink"/);
 assert.match(css,/\.settings-page\[hidden\]\{display:none!important\}/);
});
test('V76.8 Profile is truthful about local saves and unavailable cloud integration',()=>{
 assert.match(settings,/unlocked\.size\.toLocaleString/);
 assert.match(settings,/ITEMS\.length\.toLocaleString/);
 assert.match(settings,/id="settingsAccountStatus"/);
 assert.match(settings,/Not connected/);
 assert.match(settings,/id="settingsLeaderboard" disabled/);
 assert.match(settings,/id="recoverFromCloud" disabled/);
 assert.match(settings,/No cloud backup exists in this version/);
});
test('V76.8 Android-only Play Games status is read-only and cannot impersonate a player',()=>{
 const guard=js.slice(js.indexOf('function getPlayerServicesBridge(){'),js.indexOf('function selectSettingsPage('));
 assert.match(guard,/getPlatform\?\.\(\)!=='android'/);
 assert.match(guard,/cap\.Plugins\?\.AlchemyPlayerServices/);
 assert.match(guard,/typeof bridge\.getStatus==='function'/);
 assert.match(guard,/state\?\.authenticated===true/);
 assert.match(guard,/typeof state\.playerId==='string'/);
 assert.doesNotMatch(guard,/localStorage\.setItem|writeSavedGame|readSavedGame/);
});
test('V76.8 old backup code remains intact but is absent from the Settings controls',()=>{
 assert.doesNotMatch(settings,/id="exportBackup"|id="importBackup"|Import progress|Export progress|backup-actions/);
 assert.match(js,/const BACKUP_KEYS=/);
 assert.match(js,/function exportProgress\(\)/);
 assert.match(js,/function importProgress\(file\)/);
 assert.match(settings,/id="settingsSoundToggle"/);
 assert.match(settings,/id="changeGameMode"/);
 assert.match(settings,/data-theme-choice="system"/);
 assert.doesNotMatch(settings,/id="hintButton"/);
});
test('V76.8 theme, small-screen and future migration guidance are covered',()=>{
 assert.match(css,/max-height:min\(84dvh,650px\)/);
 assert.match(css,/html\[data-theme="dark"\] \.settings-section/);
 assert.match(read('docs/SETTINGS_V76_8.md'),/Restore from cloud|Recover from cloud/);
 assert.match(read('package.json'),/"version": "0\.(?:76\.8|77\.0|78\.0|79\.0|80\.[0-9]+|81\.[0-9]+|83\.[0-9]+|84\.[0-9]+)"/);
});
