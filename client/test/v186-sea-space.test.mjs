import test from 'node:test';
import assert from 'node:assert/strict';
import { ORGANIC_V186 } from '../src/organic-pack-v186.js';
import { ORGANIC_ART_V186 } from '../src/organic-art-v186.js';

test('V186: 165 deep sea and space elements with unique ids and names', () => {
  assert.equal(ORGANIC_V186.items.length, 165);
  assert.equal(new Set(ORGANIC_V186.items.map(i => i.id)).size, 165);
  assert.equal(new Set(ORGANIC_V186.items.map(i => i.name.toLowerCase())).size, 165);
});
test('V186: every element has art, a summary and a recipe that makes it', () => {
  const made = new Set(ORGANIC_V186.recipes.map(r => r[2]));
  for (const it of ORGANIC_V186.items) {
    assert.ok(ORGANIC_ART_V186[it.name.toLowerCase()]?.startsWith('<svg'), it.name);
    assert.ok(it.summary.length >= 40 && it.wit && it.trivia, it.name);
    assert.ok(made.has(it.id), it.name);
  }
});
test('V186: recipes never repeat a pair and never use an element to make itself', () => {
  const seen = new Set();
  for (const [a, b, r] of ORGANIC_V186.recipes) {
    const k = [a, b].sort().join('|');
    assert.ok(!seen.has(k), k); seen.add(k);
    assert.ok(a !== r && b !== r, r);
  }
});
