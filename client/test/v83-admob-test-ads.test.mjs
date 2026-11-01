import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('native rewarded plugin grants only from the SDK reward listener',()=>{
 const java=src('native/android/GameverseRewardedAdsPlugin.java');
 assert.match(java,/@CapacitorPlugin\(name = "GameverseRewardedAds"\)/);
 assert.match(java,/AD_UNIT_ID = "ca-app-pub-3940256099942544\/5224354917"/); // Google rewarded TEST unit
 assert.match(java,/ad\.show\(activity, rewardItem -> \{\n\s+earned\[0\] = true;/);
 assert.equal((java.match(/earned\[0\] = true/g)||[]).length,1);
 // Resolution happens on dismissal and carries the SDK flag; failures reject.
 assert.match(java,/onAdDismissedFullScreenContent\(\) \{[\s\S]*?result\.put\("earned", earned\[0\]\)/);
 assert.match(java,/onAdFailedToLoad[\s\S]*?call\.reject/);
 assert.match(java,/AD_TIMEOUT/);
 assert.match(java,/UserMessagingPlatform\.loadAndShowConsentFormIfRequired/);
 assert.match(java,/showPrivacyOptionsForm/);
});
test('Android builds package the AdMob test configuration',()=>{
 const py=src('tools/configure-android-admob.py');
 assert.match(py,/ca-app-pub-3940256099942544~3347511713/);
 assert.match(py,/play-services-ads:25\.5\.0/);
 assert.match(py,/registerPlugin\(\{n\}\.class\)/);
 assert.match(py,/\{"GameverseRewardedAdsPlugin", "AlchemyBackupPlugin", "AlchemyBillingPlugin"\} <= set\(names\)/);
 for(const wf of ['.github/workflows/android-debug.yml','.github/workflows/qa-android-preview.yml']){
  const y=src(wf);
  const edge=y.indexOf('configure-android-edge-to-edge.py'),ads=y.indexOf('configure-android-admob.py');
  assert.ok(edge>0&&ads>edge,wf+' must run AdMob config after the edge-to-edge MainActivity patch');
 }
});
test('every paid action still requires {earned:true} from the native bridge',()=>{
 const app=src('client/src/app.js');
 for(const kind of ['mode_switch','merge_to_classic','merge_to_families','recipe','batch_family','companion_switch','idle_finds','starter_pack','companion_slot','batch_all','school_skip'])assert.match(app,new RegExp(`showRewarded\\(\\{kind:'${kind}'`));
 assert.equal((app.match(/earned!==true/g)||[]).length,11);
 assert.match(app,/cap\.Plugins\?\.GameverseRewardedAds/);
 assert.match(app,/id="settingsPrivacyAds"/);
});
