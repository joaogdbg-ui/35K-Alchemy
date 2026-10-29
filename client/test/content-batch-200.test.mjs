import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {requireExactContentBatch,inspectPackDelta} from '../../tools/check-content-batch-200.mjs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('Mandatory 200 gate: 0 technical changes or exactly 200 content IDs, never 1..199 or 201',()=>{
 assert.match(requireExactContentBatch(0),/maintenance/);
 assert.match(requireExactContentBatch(200),/200/);
 for(const n of [1,8,20,25,40,50,160,199,201,400])assert.throws(()=>requireExactContentBatch(n),/required 200/);
});
test('Gate recognizes added IDs but forbids rewriting historic items or recipes',()=>{
 const old={items:[{id:'old',name:'Old'}],recipes:[['a','b','old']]};
 const next={items:[...old.items,{id:'new',name:'New'}],recipes:[...old.recipes,['old','a','new']]};
 assert.deepEqual(inspectPackDelta(old,next).map(x=>x.id),['new']);
 assert.throws(()=>inspectPackDelta(old,{items:[{id:'old',name:'Renamed'}],recipes:old.recipes}),/historical item/);
 assert.throws(()=>inspectPackDelta(old,{items:old.items,recipes:[]}),/historical recipe/);
 assert.throws(()=>inspectPackDelta(old,{items:[...old.items,...old.items],recipes:old.recipes}),/duplicate IDs/);
});
test('Production policy has a pinned and arithmetically honest baseline',()=>{
 const p=JSON.parse(read('shared/production-plan-200.json'));
 assert.equal(p.batch_size,200);assert.equal(p.baseline_elements,5612);
 assert.equal(p.baseline_recipes,13949);assert.equal(p.target_minimum_elements,35000);
 assert.equal(p.deliveries_to_target,Math.ceil((p.target_minimum_elements-p.baseline_elements)/200));
 assert.equal(p.baseline_elements+200*p.deliveries_to_target,35012);
 assert.equal(p.next_delivery_outline.finish_v80+p.next_delivery_outline.begin_v81,200);
 assert.match(read('docs/WORKING_RULES_PT.md'),/OBRIGATÓRIO/);
});
