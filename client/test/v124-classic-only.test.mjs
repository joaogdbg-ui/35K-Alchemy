import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8'),html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('V124: Classic is the only mode; family progress migrates once; starter packs need 2 earned ads',()=>{
 assert.doesNotMatch(app,/modePicker\(true\)/);assert.match(app,/migrateFamiliesIntoClassic\(\); \/\/ V124/);
 assert.match(app,/CLASSIC_ONLY_KEY='alchemy10k_classic_only_v124'/);
 assert.match(app,/showRewarded\(\{kind:'starter_pack',family:fid,step,total:2\}\)/);assert.match(app,/if\(step<2\)\{starterPackCredit=/);
 assert.match(html,/id="looksChip"/);assert.match(app,/if\(looksFilter\)ids=ids\.filter\(looksMatch\)/);
});
