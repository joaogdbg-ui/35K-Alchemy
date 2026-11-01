import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('V114: returning to Home shows what residents trained while you were away',()=>{
 const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(app,/function homeAwaySummary\(\)/);assert.match(app,/if\(wasHome&&tab!=='Pets'\)homeAwaySince=Date\.now\(\);else if\(!wasHome&&tab==='Pets'\)setTimeout\(homeAwaySummary,350\)/);
 assert.match(app,/WHILE YOU WERE AWAY/);
});
test('V115: harder-to-make elements make companions grow more',async()=>{
 const {feedDepthMult}=await import('../src/companion-engine-v86.js');
 assert.ok(feedDepthMult(0)<feedDepthMult(5)&&feedDepthMult(5)<feedDepthMult(10));assert.equal(feedDepthMult(0),0.6);assert.equal(feedDepthMult(20),1.8);assert.equal(feedDepthMult(undefined),1);
});
