import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const app=src('client/src/app.js'),css=src('client/src/styles.css');
test('Settings exposes backup export, import and delete progress',()=>{
 for(const id of ['settingsExport','settingsImport','settingsDelete'])assert.match(app,new RegExp(`id="${id}"`));
 assert.match(app,/function backupBridge\(\)[\s\S]*?cap\.Plugins\?\.AlchemyBackup/);
 assert.match(app,/function importBackupText\(text\)/);
 // Families are wiped together (shared IDs re-sync); settings and privacy choices are kept.
 assert.match(app,/target==='families'\?familyKeys/);
 assert.match(app,/const save=\(\)=>\{if\(progressWiping\)return;/);
 assert.match(app,/id="wipeConfirm">Delete permanently/);
 const java=src('native/android/AlchemyBackupPlugin.java');
 assert.match(java,/@CapacitorPlugin\(name = "AlchemyBackup"\)/);
 assert.match(java,/FileProvider\.getUriForFile/);
});
test('every discovery shows a witty line or the element description',()=>{
 assert.equal((app.match(/\(wittyDiscovery\(it\)\|\|it\.summary\)\?/g)||[]).length,2);
 assert.match(app,/'YOUR COLLECTION'/);
 assert.doesNotMatch(app,/planned elements/);
});
test('inventory filters and compact density persist',()=>{
 assert.match(app,/const INVENTORY_VIEW_KEY='alchemy10k_inventory_view_v1'/);
 assert.match(app,/inventoryShow==='open'\)ids=ids\.filter\(id=>!elementIsComplete\(id\)\)/);
 assert.match(app,/inventoryShow==='saved'\)ids=ids\.filter\(id=>favorites\.has\(id\)\)/);
 assert.match(app,/inventoryDensity==='compact'\?\{w:100,h:48\}:\{w:145,h:62\}/);
 assert.match(css,/\.virtual-inner\.is-compact \.element-chip\{height:42px/);
});
test('timed hint: one every 10 minutes, only when the ad is unavailable or failed',()=>{
 assert.match(app,/TIMED_HINT_COOLDOWN_MS=10\*60\*1000/);
 assert.match(app,/if\(failed\)return \(await offerTimedHint\('failed'\)\)&&grantRecipeHint\(elementId\);/);
 // A dismissed (not earned) ad still never reveals the recipe.
 assert.match(app,/if\(response\?\.earned!==true\)\{toast\('Ad not completed · Recipe still hidden','error'\);[\s\S]*?return false;\}/);
});
