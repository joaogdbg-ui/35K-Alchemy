import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('V73 moves only the two slots rather than moving the Hint or controls',()=>{
 const css=source('client/src/styles.css');
 // V84: the combiner is one card; the Hint row and the feedback line are never translated.
 const scoped=css;
 assert.match(scoped,/\.craft-card\{/);
 assert.doesNotMatch(scoped,/\.craft-actions\s*\{[^}]*transform/);
 assert.doesNotMatch(scoped,/\.combine-feedback\s*\{[^}]*transform/);
 assert.match(scoped,/@media\(max-height:680px\) and \(max-width:849px\)/);
});
test('V73 is wired into the offline app, catalog and art',()=>{
 const app=source('client/src/app.js'),build=source('tools/build-standalone.py');
 assert.match(app,/ORGANIC_V71,ORGANIC_V72,ORGANIC_V73,ORGANIC_V74,ORGANIC_V75,ORGANIC_V76,ORGANIC_V77,ORGANIC_V78,ORGANIC_V79,ORGANIC_V80,ORGANIC_V81,ORGANIC_V82,ORGANIC_V83\]/);
 assert.match(app,/ORGANIC_ART_V76\[itemName\]\|\|ORGANIC_ART_V75/);
 assert.match(build,/window\.__gameverseOrganic73/);
 assert.match(build,/35K_Alchemy_V76_Offline\.html/);
});
