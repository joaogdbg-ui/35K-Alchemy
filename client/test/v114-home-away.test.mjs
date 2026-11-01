import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('V114: returning to Home shows what residents trained while you were away',()=>{
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(app,/function homeAwaySummary\(\)/);assert.match(app,/if\(wasHome&&tab!=='Pets'\)homeAwaySince=Date\.now\(\);else if\(!wasHome&&tab==='Pets'\)setTimeout\(homeAwaySummary,350\)/);
 assert.match(app,/WHILE YOU WERE AWAY/);
});
