import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('UI never prints raw canonical game name for player recipes and hints',()=>{
 const s=read('client/src/app.js');
 assert.match(s,/const PUBLIC_LABELS=buildPublicNameIndex\(ITEMS\)/);
 assert.match(s,/function uiName\(item\)/);
 assert.doesNotMatch(s,/escapeText\(byId\.get\([^)]*\)\.name\)/);
 assert.doesNotMatch(s,/escapeText\((?:it|item)\.name\)/);
 assert.match(s,/const itemName=String\(item\.name\|\|''\)\.toLowerCase\(\)/); // Art lookup stays stable.
});
test('Offline bundler embeds aliases and CI gates IP screening',()=>{
 const build=read('tools/build-standalone.py');
 const workflow=read('.github/workflows/android-debug.yml');
 assert.match(build,/window\.__ipSafeNames/);
 assert.match(workflow,/node tools\/audit-ip-safe-names\.mjs/);
});
