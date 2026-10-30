import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('V33 has a single complete-recipe rewarded action and no credit spending',()=>{
  // V83 (owner decision 30/10/2026): a single timed hint every 10 minutes is allowed when no ad
  // can be shown; credit balances and spending remain forbidden.
  assert.doesNotMatch(app,/freeHintBalance|hintState\.spent|Use 1 credit|Use 2 credits|compassReveal|freeRecipe/);
  assert.match(app,/async function earnRecipeByAd/);
  assert.match(app,/hintState\.clues\[elementId\]='recipe'/);
  assert.match(html,/id="familyHint"[^>]*>.*Watch Ad · Reveal Recipe/);
});
test('native Android integration is required; a web shim is not an ad provider',()=>{
  assert.match(app,/cap\.getPlatform\(\)!=='android'/);
  assert.match(app,/cap\.Plugins\?\.GameverseRewardedAds/);
  assert.doesNotMatch(app,/window\.GameverseRewardedAds/);
  assert.match(app,/if\(!native\)return \(await offerTimedHint\('unavailable'\)\)&&grantRecipeHint\(elementId\);/);
});
test('failed / cancelled ads never reveal recipes',()=>{
  assert.match(app,/if\(response\?\.earned!==true\)\{toast\('Ad not completed/);
  assert.match(app,/if\(await earnRecipeByAd\(item.out,item.family\)\)showCompassRevealed\(item\)/);
  assert.match(app,/if\(option&&await earnRecipeByAd\(id,activeFamily\)\)showRecipeReward\(id,option\)/);
});
test('previously revealed recipes and backups remain readable',()=>{
  assert.match(app,/const HINT_STORAGE='gameverse_discovery_hints_v20'/);
  assert.match(app,/value\?\.v===20&&value\.clues/);
  assert.match(app,/JSON\.stringify\(\{v:20,clues:hintState\.clues\}\)/);
  assert.match(app,/if\(hintState\.clues\[item.out\]==='recipe'\)\{showCompassRevealed\(item\);return;\}/);
});
