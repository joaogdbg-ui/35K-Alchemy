import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

test('Android 16+ Capacitor uses correct WebView safe-area insets', () => {
  const cfg = JSON.parse(read('capacitor.config.json'));
  assert.equal(cfg.appId, 'com.joaogdbg.alchemy35k');
  assert.equal(cfg.plugins.SystemBars.insetsHandling, 'css');
  assert.equal(cfg.plugins.SystemBars.initialViewportFitValueHint, 'cover');
  assert.equal(cfg.plugins.SystemBars.hidden, false);
  assert.match(read('client/index.html'), /viewport-fit=cover/);
});

test('Crafting header and navigation avoid system bars without hardcoded pixels', () => {
  const css = read('client/src/styles.css');
  assert.match(css, /padding-top:\s*var\(--safe-area-inset-top,\s*env\(safe-area-inset-top,\s*0px\)\)/);
  assert.match(css, /padding-left:\s*var\(--safe-area-inset-left/);
  assert.match(css, /padding-right:\s*var\(--safe-area-inset-right/);
  assert.match(css, /--safe:\s*var\(--safe-area-inset-bottom/);
  assert.match(css, /calc\(56px \+ var\(--safe\)\)/);
});

test('Native Android Activity and game theme support edge-to-edge and readable status icons', () => {
  const workflow = read('.github/workflows/android-debug.yml');
  const native = read('tools/configure-android-edge-to-edge.py');
  const app = read('client/src/app.js');
  assert.match(workflow, /python tools\/configure-android-edge-to-edge\.py/);
  assert.match(native, /EdgeToEdge\.enable\(this\)/);
  assert.match(native, /Build\.VERSION\.SDK_INT >= Build\.VERSION_CODES\.R/);
  assert.match(app, /Capacitor\?\.Plugins\?\.SystemBars/);
  assert.match(app, /setStyle\(\{style:dark\?'DARK':'LIGHT'\}\)/);
});
