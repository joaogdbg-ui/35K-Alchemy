import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const source=read('client/src/app.js'),css=read('client/src/styles.css');
const start=source.indexOf('function settings(){'),finish=source.indexOf('// V28 family sweep:',start),settings=source.slice(start,finish);
test('V76.7: Settings has three keyboard accessible, scrollable tabs with Game default',()=>{
 assert.ok(start>0&&finish>start);assert.match(settings,/role="tablist"/);
 for(const tab of ['game','profile','help']){
  assert.ok(settings.includes('data-settings-tab="'+tab+'"'));
  assert.ok(settings.includes('data-settings-panel="'+tab+'"'));
 }
 assert.match(settings,/selectSettingsTab\('game'\)/);
 assert.match(source,/event\.key==='Home'/);
 assert.match(css,/\.settings-pane\[hidden\]\{display:none!important\}/);
 assert.match(source,/function showModal\(content\)\{\$\('modal'\)\.removeAttribute\('aria-labelledby'\)/);
 assert.match(css,/max-height:min\(86dvh,740px\)/);
 assert.match(css,/html\[data-theme="dark"\] \.settings-shell/);
});
test('V76.7: Profile accurately shows local stats without fake cloud connections',()=>{
 assert.match(settings,/unlocked\.size\.toLocaleString/);
 assert.match(settings,/ITEMS\.length\.toLocaleString/);
 assert.match(settings,/id="settingsAccountStatus"/);
 assert.match(settings,/Not connected/);
 assert.match(settings,/Cloud saves not active yet/);
 assert.match(settings,/id="recoverFromCloud" disabled/);
 assert.match(settings,/id="settingsLeaderboard" disabled/);
 assert.match(settings,/Nothing has been uploaded/);
});
test('V76.7: Native player identity is read-only, confirmed, Android-only and not stored as a fake login',()=>{
 const guard=source.slice(source.indexOf('function getPlayerServicesBridge(){'),source.indexOf('function selectSettingsTab('));
 assert.match(guard,/getPlatform\?\.\(\)!=='android'/);
 assert.match(guard,/cap\.Plugins\?\.AlchemyPlayerServices/);
 assert.match(guard,/typeof bridge\.getStatus==='function'/);
 assert.match(guard,/state\?\.authenticated===true/);
 assert.match(guard,/typeof state\.playerId==='string'/);
 assert.match(guard,/name\.textContent=/);
 assert.doesNotMatch(guard,/localStorage\.setItem|writeSavedGame|readSavedGame/);
});
test('V76.7: Import and export are not visible in Settings but old local saves remain compatible',()=>{
 assert.doesNotMatch(settings,/id="exportBackup"|id="importBackup"|Import progress|Export progress|backup-actions/);
 assert.match(source,/const BACKUP_KEYS=/);
 assert.match(source,/function exportProgress\(\)/);
 assert.match(source,/function importProgress\(file\)/);
 assert.match(settings,/id="settingsSoundToggle"/);
 assert.match(settings,/id="changeGameMode"/);
 assert.doesNotMatch(settings,/id="hintButton"/);
 assert.match(settings,/data-theme-choice="system"/);
});
test('V76.7: Google setup requirements and rollback are explicitly documented',()=>{
 const docs=read('docs/PLAY_GAMES_FOUNDATION_V76_6.md');
 for(const word of ['SnapshotsClient','Play Console','Saved Games','conflict','rollback','Player','OAuth'])assert.ok(docs.includes(word),word);
 assert.match(read('package.json'),/"version": "0\.76\.7"/);
});
