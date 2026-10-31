import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('Original launcher sources and native/web integration have no third-party logo or remote dependency',()=>{
 for(const path of ['client/assets/brand/35k-alchemy-icon.svg','client/assets/brand/35k-alchemy-foreground.svg']){
  const svg=read(path);assert.match(svg,/^<svg\b/);assert.match(svg,/<\/svg>\s*$/);
  assert.doesNotMatch(svg,/<(?:script|image|text|foreignObject|use)\b|xlink:href|<font\b/i);
  // V88: launcher = alchemy flask + garden + original companion creature + care heart.
  for(const part of ['Central flask','companion creature','garden inside the flask','virtual pet','#4F6470'])assert.ok(svg.includes(part),part);
 }
 assert.match(read('.github/workflows/android-debug.yml'),/python tools\/generate-launcher-icons\.py/);
 assert.match(read('tools/build-standalone.py'),/data:image\/svg\+xml/);
 for(const target of ['ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png','mipmap-anydpi-v26'])assert.ok(read('tools/generate-launcher-icons.py').includes(target),target);
});
