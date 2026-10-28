import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('No credit balance, credit purchase or fake ad reward',()=>{
 assert.doesNotMatch(app,/freeHintBalance|hintState\.spent|grantClue\(/);
 assert.doesNotMatch(html,/hintCreditCount|familyRecipe|Use 2 credits|Use 1 credit/);
 assert.match(app,/response\?\.earned!==true/);
 assert.match(app,/if\(response\?\.earned!==true\)/);
});
test('Compass and family hint open rewarded recipe flow',()=>{
 assert.match(app,/earnRecipeByAd\(item.out,item.family\)/);
 assert.match(app,/revealRecipeWithAd\(candidate.id\)/);
 assert.match(html,/Watch Ad · Reveal Recipe/);
 assert.match(app,/hintState\.clues\[elementId\]='recipe';saveHints\(\)/);
 assert.match(app,/function explainAdUnavailable\(\)/);
});
test('UI has two navigation tabs and preserves previous save keys',()=>{
 assert.equal((html.match(/class="tab(?: active)?" data-view/g)||[]).length,2);
 for(const key of ['gameverse_alchemy_v2','gameverse_dynamic_v11','gameverse_discovery_hints_v20'])assert.ok(app.includes(key));
});
