import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const src=read('client/src/app.js'),css=read('client/src/styles.css');
const pos=src.indexOf('function settings(){'),end=src.indexOf('// V28 family sweep:',pos),menu=src.slice(pos,end);
test('V76.7 Settings opens directly into the casual-game preferences tab, not account settings',()=>{
 assert.ok(menu.indexOf('data-settings-tab="game"')<menu.indexOf('data-settings-tab="profile"'));
 assert.ok(menu.indexOf('data-settings-tab="profile"')<menu.indexOf('data-settings-tab="help"'));
 assert.match(menu,/selectSettingsTab\('game'\)/);
 assert.match(menu,/Sound effects/);
 assert.match(menu,/data-theme-choice="light"/);
 assert.match(menu,/data-theme-choice="dark"/);
 assert.match(menu,/data-theme-choice="system"/);
 assert.match(menu,/id="changeGameMode"/);
 assert.doesNotMatch(menu,/id="hintButton"|id="exportBackup"|id="importBackup"/);
});
test('V76.7 profile does not invent an online account, leaderboard, or cloud restore',()=>{
 assert.match(menu,/id="settingsAccountName">Local player/);
 assert.match(menu,/id="settingsAccountStatus" role="status" data-state="offline">Not connected/);
 assert.match(menu,/id="settingsLeaderboard" disabled/);
 assert.match(menu,/id="recoverFromCloud" disabled/);
 assert.match(menu,/Nothing has been uploaded/);
 assert.match(src,/function getPlayerServicesBridge\(\)/);
 assert.match(src,/state\?\.authenticated===true/);
});
test('V76.7 help uses self-contained HTML disclosure controls; no dead buttons or external dependency',()=>{
 for(const subject of ['How do I discover elements?','How do hints and families work?','Where is my progress saved?'])
  assert.ok(menu.includes(subject),subject);
 assert.equal((menu.match(/<details class="settings-help-item">/g)||[]).length,3);
 assert.match(menu,/Uninstalling or clearing app data may erase it/i);
 assert.match(css,/\.settings-help-item\[open\] summary:after/);
 assert.match(css,/\.settings-pane\[hidden\]\{display:none!important\}/);
 assert.match(css,/@media\(max-width:375px\)/);
 assert.match(css,/@media\(max-height:620px\)/);
 assert.match(css,/html\[data-theme="dark"\] \.settings-game-panel/);
});
test('V76.7 unchanged mechanics and backed-up save paths survive redesign',()=>{
 for(const re of [/function importProgress\(file\)/,/function exportProgress\(\)/,/const BACKUP_KEYS=/,/function mergeModal\(\)/,/function modePicker\(/])
  assert.match(src,re);
 assert.match(menu,/\$\('settingsSoundToggle'\)\.onclick=toggleSoundEnabled/);
 assert.match(menu,/localStorage\.setItem\(THEME_KEY,selectedTheme\)/);
 assert.doesNotMatch(menu,/getRewardBridge\(\)\.showRewarded/);
});
