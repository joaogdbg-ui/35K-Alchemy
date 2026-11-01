import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MARKET, MARKET_ELEMENT, wearableFor } from '../src/market-v136.js';
import { ORGANIC_V139 } from '../src/organic-pack-v139.js';
import { HOUSE_LAYOUTS, HOUSE_GROWTH, EXT_INFO } from '../src/home-engine-v90.js';

const ids = new Set(ORGANIC_V139.items.map(i => i.id));
test('V139: every Market item maps to a real element', () => {
  for (const it of MARKET) assert.ok(it.element, `${it.id} has an element`);
  for (const el of Object.values(MARKET_ELEMENT)) if (el.startsWith('organic139:')) assert.ok(ids.has(el), el);
});
test('V139: each new element has a recipe', () => {
  const made = new Set(ORGANIC_V139.recipes.map(r => r.result ?? r[2] ?? r.output));
  for (const id of ids) assert.ok(JSON.stringify(ORGANIC_V139.recipes).includes(id), id);
});
test('V139: grand castle is the top house and complements exist', () => {
  assert.ok(HOUSE_LAYOUTS[10] && HOUSE_GROWTH[10] > HOUSE_GROWTH[8]);
  assert.deepEqual(Object.keys(EXT_INFO).sort(), ['floor', 'garden', 'pool']);
  const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /'organic139:grand-castle':\{kind:'house',capacity:10\}/);
  const castle = MARKET.find(m => m.element === 'organic139:grand-castle');
  assert.ok(castle.price > MARKET.find(m => m.element === 'organic89:companion-castle').price);
});
test('V139: new wearables are recognised', () => {
  assert.equal(wearableFor('Star Glasses'), 'star-glasses');
  assert.equal(wearableFor('Sports Cap'), 'cap');
  assert.equal(wearableFor('Hero Cape'), 'cape');
});
test('V139: app.js parses (tests do not import it)', async () => {
  const { spawnSync } = await import('node:child_process');
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const f = mkdtempSync(tmpdir() + '/v139-') + '/app.mjs';
  writeFileSync(f, readFileSync(new URL('../src/app.js', import.meta.url), 'utf8'));
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
});
