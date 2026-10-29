import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('Alchemy 10k branding is consistent across browser, launcher and native app',()=>{
 const html=read('client/index.html'),app=read('client/src/app.js');
 const pkg=JSON.parse(read('package.json')),cap=JSON.parse(read('capacitor.config.json'));
 assert.match(html,/<title>Alchemy 10k — Offline<\/title>/);
 assert.match(html,/class="brand-name">Alchemy <span class="brand-word">10k/);
 assert.match(html,/10,000 element goal/);
 assert.match(html,/alchemy-10k-icon\.svg/);
 assert.match(app,/const ALCHEMY_TARGET_ELEMENTS=10000/);
 assert.match(app,/Alchemy 10k <span>v0\.81\.0/);
 assert.equal(cap.appName,'Alchemy 10k');
 assert.equal(cap.appId,'com.joaogdbg.alchemy35k'); // Existing installation/saves preserved.
 assert.equal(pkg.name,'alchemy-10k');
 assert.match(read('tools/prepare-android-web.py'),/Alchemy_10k_V81_Offline\.html/);
 assert.match(read('tools/build-standalone.py'),/Alchemy_10k_V81_Offline\.html/);
 assert.match(read('tools/generate-launcher-icons.py'),/alchemy-10k-icon\.svg/);
});
test('Rebrand never changes stored save formats, progress keys or rewarded-ad receipts',()=>{
 const app=read('client/src/app.js');
 for(const key of ['gameverse_alchemy_v2','gameverse_dynamic_v11','35k_mode_selected_v48','35k_family_profiles_v48','35k_family_merge_pending_v60','35k_inventory_sort_v55','35k_discovery_order_v35','35k-alchemy-backup']){
  assert.ok(app.includes(key),'missing backwards-compatible identifier: '+key);
 }
 assert.match(app,/Alchemy_10k_Backup_/);
});
