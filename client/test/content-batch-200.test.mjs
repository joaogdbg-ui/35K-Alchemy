import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {requireExactContentBatch,inspectPackDelta,requiredContentBatchSize} from '../../tools/check-content-batch-200.mjs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const plan=JSON.parse(read('shared/production-plan-200.json'));

test('Next content delivery: exactly 188 (5812 -> 6000), not 187 or 189 or 200',()=>{
 assert.equal(requiredContentBatchSize(plan,{baseDescendsFromAnchor:true,contentPackChangedSinceAnchor:false}),188);
 assert.match(requireExactContentBatch(188,188),/188 new IDs/);
 for(const n of [1,8,20,25,40,100,160,187,189,199,200,201,250])
  assert.throws(()=>requireExactContentBatch(n,188),/required 188/);
 assert.match(requireExactContentBatch(0,188),/maintenance/);
});
test('After the rounding batch is in the base, every future expansion is +200 only',()=>{
 assert.equal(requiredContentBatchSize(plan,{baseDescendsFromAnchor:true,contentPackChangedSinceAnchor:true}),200);
 assert.equal(requiredContentBatchSize(plan,{baseDescendsFromAnchor:false,contentPackChangedSinceAnchor:false}),200);
 assert.match(requireExactContentBatch(200),/200 new IDs/);
 for(const n of [1,8,20,25,40,50,160,188,199,201,250,400])assert.throws(()=>requireExactContentBatch(n),/required 200/);
 assert.match(requireExactContentBatch(0),/maintenance/);
});
test('Exception policy is pinned and cannot be reconfigured to e.g. 250',()=>{
 const corrupt={...plan,batch_size:250};assert.throws(()=>requiredContentBatchSize(corrupt),/permanent/);
 const corrupt2={...plan,one_time_rounding_exception:{...plan.one_time_rounding_exception,required_new_elements:250}};
 assert.throws(()=>requiredContentBatchSize(corrupt2,{baseDescendsFromAnchor:true}),/unauthorized/);
});
test('Gate recognizes added IDs but forbids rewriting historical items or recipes',()=>{
 const old={items:[{id:'old',name:'Old'}],recipes:[['a','b','old']]};
 const next={items:[...old.items,{id:'new',name:'New'}],recipes:[...old.recipes,['old','a','new']]};
 assert.deepEqual(inspectPackDelta(old,next).map(x=>x.id),['new']);
 assert.throws(()=>inspectPackDelta(old,{items:[{id:'old',name:'Renamed'}],recipes:old.recipes}),/historical item/);
 assert.throws(()=>inspectPackDelta(old,{items:old.items,recipes:[]}),/historical recipe/);
 assert.throws(()=>inspectPackDelta(old,{items:[...old.items,...old.items],recipes:old.recipes}),/duplicate IDs/);
});
test('Arithmetic is exact: a single +188, then 145 separate +200 deliveries',()=>{
 assert.equal(plan.baseline_elements,5812);
 assert.equal(plan.baseline_recipes,14149);
 assert.equal(plan.batch_size,200);
 assert.equal(plan.target_minimum_elements,35000);
 assert.equal(plan.expected_after_next_delivery_elements,6000);
 assert.equal(plan.expected_after_next_delivery_recipes_at_least,14337);
 assert.equal(plan.next_delivery_outline.finish_v81+plan.next_delivery_outline.begin_v82,188);
 assert.equal(plan.deliveries_to_target_after_rounding,(35000-6000)/200);
 assert.equal(5812+188+145*200,35000);
 assert.match(read('docs/WORKING_RULES_PT.md'),/OBRIGATÓRIO/);
});
