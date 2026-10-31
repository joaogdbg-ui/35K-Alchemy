import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const app=readFileSync(new URL('src/app.js',root),'utf8');

test('primary navigation keeps the Play view (labelled Alchemy since V95)',()=>{
 assert.match(html,/data-view="Play"[^>]*>.*<span>Alchemy<\/span>/);
 assert.match(html,/data-view="Play"/);
 assert.match(html,/data-view="World"/);
 assert.doesNotMatch(html,/data-view="Collection"/);
 assert.doesNotMatch(html,/data-dtab="book"/);
 assert.doesNotMatch(html,/id="discoverBook"/);
});
test('Discoveries retains family, mystery and hint UI',()=>{
 for(const id of ['familiesGrid','discoverVirtual','familyHint','discoverSearch'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/data-dscope="missing"/);
 assert.match(app,/Recipe hidden · Tap to reveal with an ad/);
});
test('discovered elements show an inline recipe and alternate routes',()=>{
 assert.match(app,/function discoveredRecipes/);
 assert.match(app,/Recipe · /);
 assert.match(app,/data-paths=/);
 assert.match(app,/function openRecipePaths/);
});
test('original camera asset exists and tapping a known element uses direct craft input',()=>{
 assert.ok(existsSync(new URL('assets/camera.svg',root)));
 assert.match(app,/if\(unlocked\.has\(id\)\)\{switchTab\('Play'\);insertDirect\(id\);return;\}/);
 assert.match(app,/if\(\/camera\|photograph/);
});
