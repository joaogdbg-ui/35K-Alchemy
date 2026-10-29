import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('V73 moves only the two slots rather than moving the Hint or controls',()=>{
 const css=source('client/src/styles.css');
 const scoped=css.slice(css.indexOf('/* V73: move ONLY'));
 assert.match(scoped,/\.workspace-content\{transform:none\}/);
 assert.match(scoped,/\.craft-row\{transform:translateY\(14px\)\}/);
 assert.doesNotMatch(scoped,/\.craft-actions\s*\{[^}]*transform/);
 assert.doesNotMatch(scoped,/\.combine-feedback\s*\{[^}]*transform/);
 assert.match(scoped,/max-height:700px/);
});
test('V73 is wired into the offline app, catalog and art',()=>{
 const app=source('client/src/app.js'),build=source('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V71,ORGANIC_V72,ORGANIC_V73\]/);
 assert.match(app,/ORGANIC_ART_V73\[itemName\]\|\|ORGANIC_ART_V72/);
 assert.match(build,/window\.__gameverseOrganic73/);
 assert.match(build,/35K_Alchemy_V73_Offline\.html/);
});
