import test from 'node:test';
import assert from 'node:assert/strict';
import { themedArt, recolorSvg, THEME_MAPS, THEME_PROPS } from '../src/games-theme-v151.js';
import { STADIUM_ART_V95 } from '../src/stadium-art-v95.js';
import * as g from '../src/games-v93.js';
test('V151: every theme race has its own recoloured map and props', () => {
  for (const c of g.THEME_COURSES) {
    const t = themedArt(STADIUM_ART_V95, c.id);
    assert.ok(t && THEME_PROPS[c.id], c.id);
    for (const k of ['run', 'climb', 'swim', 'sky', 'mid']) assert.notEqual(t[k], STADIUM_ART_V95[k], `${c.id} ${k} recoloured`);
    const svg = g.courseSvg(g.buildCourse(g.planFor(c, 2), 3), t, { prop: t.prop, recolor: x => recolorSvg(x, t.map) });
    assert.ok(svg.startsWith('<svg'));
  }
  assert.equal(recolorSvg('#8FBF68', THEME_MAPS.inferno) === '#8FBF68', false);
});
test('V151: School tricks give game perks', () => {
  assert.deepEqual(Object.keys(g.SKILL_PERKS).sort(), ['dance', 'draw', 'drums', 'juggle', 'magic', 'sing']);
  assert.equal(g.perkOf({ sing: 5 }, 'sing'), 0.3);
  assert.equal(g.perkOf({}, 'magic'), 0);
});
test('V155: many visiting-element scenes, none triggered by the four starters', async () => {
  const src=(await import('node:fs')).readFileSync(new URL('../src/companion-engine-v86.js',import.meta.url),'utf8');
  const block=src.slice(src.indexOf('const VISITORS=['),src.indexOf('let lastVisit'));
  const kinds=[...block.matchAll(/\['([a-z]+)',\//g)].map(m=>m[1]);
  assert.ok(kinds.length>=55,`${kinds.length} scenes`);
  for(const k of kinds)assert.ok(new RegExp(`kind==='${k}'`).test(src)||new RegExp(`\n  ${k}:async`).test(src),`${k} has a scene`);
  const res=[...block.matchAll(/\['[a-z]+',(\/.*?\/)\]/g)].map(m=>eval(m[1]));
  for(const starter of ['air','earth','fire','water'])assert.ok(!res.some(re=>re.test(' '+starter+' ')),starter);
});
test('V156: duo scenes exist and duo-only toys need two companions', async () => {
  const src=(await import('node:fs')).readFileSync(new URL('../src/companion-engine-v86.js',import.meta.url),'utf8');
  for(const k of ['seesaw','pillow','board','picnic','swing'])assert.match(src,new RegExp(`\\n  ${k}:async`),k);
  assert.match(src,/return k&&\(duo\|\|!DUO_ONLY\.has\(k\)\)/);
});
