import test from 'node:test';
import assert from 'node:assert/strict';
import { ORGANIC_V184 } from '../src/organic-pack-v184.js';
import { ORGANIC_ART_V184 } from '../src/organic-art-v184.js';

test('V184: 200 food elements with unique ids and names', () => {
  assert.equal(ORGANIC_V184.items.length, 200);
  assert.equal(new Set(ORGANIC_V184.items.map(i => i.id)).size, 200);
  assert.equal(new Set(ORGANIC_V184.items.map(i => i.name.toLowerCase())).size, 200);
});
test('V184: every element has art, a summary and a recipe that makes it', () => {
  const made = new Set(ORGANIC_V184.recipes.map(r => r[2]));
  for (const it of ORGANIC_V184.items) {
    assert.ok(ORGANIC_ART_V184[it.name.toLowerCase()]?.startsWith('<svg'), it.name);
    assert.ok(it.summary.length >= 40 && it.wit && it.trivia, it.name);
    assert.ok(made.has(it.id), it.name);
  }
});
test('V184: recipes never repeat a pair and never use an element to make itself', () => {
  const seen = new Set();
  for (const [a, b, r] of ORGANIC_V184.recipes) {
    const k = [a, b].sort().join('|');
    assert.ok(!seen.has(k), k); seen.add(k);
    assert.ok(a !== r && b !== r, r);
  }
});
