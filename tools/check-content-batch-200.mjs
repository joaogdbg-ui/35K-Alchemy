#!/usr/bin/env node
/** Enforce exactly +200 actual, original discoveries between a content PR/push and its base. */
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const err=m=>{throw Error('CONTENT-200: '+m);};
const pattern=/^client\/src\/(organic|gaming)-pack-v(\d+)\.js$/;
const norm=s=>String(s).normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
const read=p=>readFileSync(resolve(root,p),'utf8');
const json=p=>JSON.parse(read(p));
export function requireExactContentBatch(n,size=200){
 if(!Number.isInteger(n)||n<0)err('invalid element count');
 if(n&&n!==size)err('actual new IDs: '+n+'; required '+size+'. Save partial groups in an unmerged WIP branch, never ship filler');
 return n===0?'maintenance change (0 new IDs)':'content batch of '+n+' new IDs';
}
export function inspectPackDelta(oldPack,newPack,path='pack'){
 if(!Array.isArray(oldPack.items)||!Array.isArray(oldPack.recipes)||!Array.isArray(newPack.items)||!Array.isArray(newPack.recipes))err('malformed '+path);
 const olds=new Map(oldPack.items.map(i=>[i.id,i])),news=new Map(newPack.items.map(i=>[i.id,i]));
 if(olds.size!==oldPack.items.length||news.size!==newPack.items.length)err('duplicate IDs in '+path);
 for(const [id,it] of olds)if(!news.has(id)||JSON.stringify(news.get(id))!==JSON.stringify(it))err('historical item changed: '+id);
 const recipes=new Set(newPack.recipes.map(r=>JSON.stringify(r)));
 for(const r of oldPack.recipes)if(!recipes.has(JSON.stringify(r)))err('historical recipe changed in '+path);
 return newPack.items.filter(it=>!olds.has(it.id));
}
const parse=(source,path)=>{
 const m=source.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\});?\s*$/);
 if(!m)err('pack/art must be a JSON object literal: '+path);
 try{return JSON.parse(m[1]);}catch(e){err('cannot parse '+path+': '+e.message);}
};
function oldFile(base,path){
 try{return git('show',base+':'+path);}
 catch(e){if(git('ls-tree','--name-only',base,'--',path))throw e;return null;}
}
async function main(){
 const flag=process.argv.indexOf('--base'),base=process.argv[flag+1];
 if(flag<0||!base)err('must provide --base <real commit SHA> (fail closed)');
 git('rev-parse','--verify',base+'^{commit}');
 const changed=git('diff','--name-only',base,'HEAD').split('\n').filter(Boolean);
 if(changed.some(p=>['client/src/legacy-data.js','client/src/creative-pack.js'].includes(p)))err('legacy/creative catalog source changed');
 const files=changed.filter(p=>pattern.test(p));
 if(!files.length){
  if(changed.some(p=>/^client\/src\/[^/]+-pack-v\d+\.js$/.test(p)))err('unrecognized content pack change');
  console.log('CONTENT-200 PASS: documentation, UI or art-only update, no new pack IDs.');
  return;
 }
 const plan=json('shared/production-plan-200.json');
 if(plan.batch_size!==200||plan.target_minimum_elements!==10000||plan.partial_content_merges_allowed!==false)err('policy changed');
 const ids=new Set(),names=new Set(),pairs=new Set(),svgs=new Set();
 for(const file of files){
  const match=file.match(pattern),v=Number(match[2]);
  if(v<80||!existsSync(resolve(root,file)))err('historical pack edited/removed: '+file);
  const now=parse(read(file),file),before=oldFile(base,file),prev=before?parse(before,file):{items:[],recipes:[]};
  const fresh=inspectPackDelta(prev,now,file);
  if(!fresh.length&&JSON.stringify(now)!==JSON.stringify(prev))err('pack changed without additions: '+file);
  const manifestPath='shared/v'+v+'-approved.json',artPath='client/src/'+match[1]+'-art-v'+v+'.js';
  if(!existsSync(resolve(root,manifestPath))||!existsSync(resolve(root,artPath)))err('missing manifest or art map for '+file);
  const manifest=json(manifestPath),art=parse(read(artPath),artPath);
  for(const item of fresh){
   if(ids.has(item.id))err('duplicate new ID '+item.id);ids.add(item.id);
   const name=norm(item.name);if(!name||names.has(name))err('duplicate new name '+item.name);names.add(name);
   const entry=manifest.new_items?.find(x=>x.id===item.id);
   if(!entry||entry.name!==item.name||entry.category!==item.category||entry.summary!==item.summary||!['bespoke-subject','species-specific-anatomy'].includes(entry.art_mode)||(item.summary?.length||0)<40)err('editorial manifest mismatch: '+item.id);
   const direct=now.recipes.filter(r=>Array.isArray(r)&&r.length===3&&r[2]===item.id);
   if(!direct.some(r=>r[0]===entry.ingredients?.[0]&&r[1]===entry.ingredients?.[1]))err('missing manifest primary recipe '+item.id);
   for(const r of direct){const key=[r[0],r[1]].sort().join('|');if(pairs.has(key))err('new pair reused '+key);pairs.add(key);}
   const path=entry.path;if(typeof path!=='string'||!path.startsWith('client/assets/v'+v+'/')||!path.endsWith('.svg')||!existsSync(resolve(root,path)))err('missing SVG file '+item.id);
   const svg=read(path);
   if(svg.length<410||!svg.startsWith('<svg')||!svg.includes('viewBox="0 0 100 100"')||!svg.trimEnd().endsWith('</svg>'))err('SVG source invalid '+path);
   if(/<(?:script|image|use|text|foreignObject|iframe|animate)\b|\s(?:href|onload|onclick)\s*=/.test(svg))err('unsafe SVG '+path);
   if((svg.match(/<(?:path|rect|circle|line|ellipse|polygon|polyline)\b/g)||[]).length<5)err('insufficient SVG components '+path);
   const hash=createHash('sha256').update(svg).digest('hex');if(svgs.has(hash))err('same SVG reused for two items: '+path);svgs.add(hash);
   if(art[item.name.toLowerCase()]!==svg)err('runtime art differs from SVG source '+item.id);
  }
 }
 const msg=requireExactContentBatch(ids.size,plan.batch_size);
 console.log('CONTENT-200 PASS: '+msg+'; manifest, original icons and unique new recipes verified.');
 console.log('Manual aesthetic/35px and IP review still required.');
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename))main().catch(e=>{console.error(e.message);process.exitCode=1;});
