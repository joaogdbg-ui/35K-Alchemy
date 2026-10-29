import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('src/app.js',root),'utf8');
const html = readFileSync(new URL('index.html',root),'utf8');
const css = readFileSync(new URL('src/styles.css',root),'utf8');
test('V25 maintains just two tabs and existing storage keys',()=>{
 assert.match(html,/<title>35K Alchemy — V(?:2[6-9](?:\.\d+)?|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]) (?:Offline|English Edition)<\/title>/);
 assert.equal((html.match(/class="tab(?: active)?"/g)||[]).length,2);
 for(const key of ['gameverse_alchemy_v2','gameverse_dynamic_v11','gameverse_discovery_hints_v20','gameverse_ledger_v16'])assert.ok(source.includes(key));
});
test('V25 unknown, recipe-known, found are explicitly different and recipes never unlock on reveal',()=>{
 assert.match(source,/function elementState\(id\)/);
 assert.match(source,/hintState\.clues\[id\]==='recipe'\?'recipe'/);
 assert.match(css,/\.discover-entry\.recipe\{background:#e9e9e9/);
 const reveal=source.slice(source.indexOf('async function grantClue'),source.indexOf('function unlockInFamily'));
 assert.ok(!reveal.includes('unlocked.add'));
});
test('V25 does not fabricate global player percentage',()=>{
 assert.match(source,/const OFFLINE_PLAYER_STATS=null/);
 assert.match(source,/Player discovery rate · — \(offline\)/);
 assert.match(source,/sampleSize>=100/);
 assert.match(html,/Community discovery percentages require real anonymous aggregate data/);
});
test('V25 offers functional offline filters, themed sets, and independent favorites',()=>{
 for(const scope of ['recipe','recent','useful','completed','favorites'])assert.ok(html.includes(`data-dscope="${scope}"`));
 assert.match(html,/id="recentBtn"/);
 assert.match(html,/id="playFamily"/);
 for(const name of ['Qelvorune Generations','Pocket Console Heritage','Retro Game Classics'])assert.ok(source.includes(name));
 assert.match(source,/function saveExtras\(\)/);
 assert.match(source,/function toggleFavorite\(id\)/);
});
test('V25 backup only exports approved local progress keys',()=>{
 assert.match(source,/const BACKUP_KEYS=/);
 assert.match(source,/format:'35k-alchemy-backup'/);
 assert.match(source,/Object\.hasOwn\(state\.data,k\)/);
 assert.match(source,/confirm\('Import saved progress/);
 assert.match(source,/function importProgress\(file\)/);
});
