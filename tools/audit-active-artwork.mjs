#!/usr/bin/env node
/**
 * Active original-vector structure audit — NOT a copyright or trade-dress clearance.
 * This detects pasted raster art, external links, SVG text/logos and active scripts.
 * It does not recognise character likenesses or protect names/marks automatically.
 */
import {readFileSync} from 'node:fs';
const versions=[32,34,37,38,40,41,42,43,44,45,46,47,50,52,53,55,56,57,58,59,61,62,63,65,66,67,68,69,70,71,72,73,74,75,76];
const sources=[...versions.map(v=>'organic-art-v'+v+'.js'),'gameverse-art-v30-semantic.js'];
let examined=0, failures=[], groups=[];
const unsafe=/<(?:script|image|text|foreignObject|iframe|audio|video)\b|\s(?:href|xlink:href|onload|onerror|onclick|onmouseover)\s*=|\b(?:javascript:|data:image\/(?:png|jpe?g|webp|gif))|\burl\s*\(\s*['"]?\s*https?:/i;
for(const path of sources){
  const m=await import('../client/src/'+path);
  const artworks=Object.values(m).find(v=>v&&typeof v==='object'&&!Array.isArray(v));
  if(!artworks)throw Error('Artwork module has no exported map: '+path);
  let count=0;
  for(const [key,svg] of Object.entries(artworks)){
    count++;examined++;
    if(typeof svg!=='string'||!/^<svg\b/i.test(svg.trim())||!/<\/svg>\s*$/i.test(svg.trim())||unsafe.test(svg))
      failures.push({source:path,key,why:'not self-contained SVG or embeds external/text/script content'});
  }
  groups.push(path+': '+count);
}
const approved=JSON.parse(readFileSync(new URL('../shared/v76-approved.json',import.meta.url),'utf8'));
const v76=(await import('../client/src/organic-art-v76.js')).ORGANIC_ART_V76;
for(const item of approved.new_items){
  const key=item.name.toLowerCase();
  const raw=readFileSync(new URL('../'+item.path,import.meta.url),'utf8');
  if(v76[key]!==raw)failures.push({source:item.path,key,why:'V76 runtime SVG and source mismatch'});
}
if(failures.length){
  console.error(JSON.stringify({examined,failures:failures.slice(0,24)},null,2));
  process.exitCode=1;
}else{
  console.log('ACTIVE ART STATIC AUDIT PASS: '+examined+' SVGs across '+sources.length+' maps, V76 source correspondence verified.');
}
console.log('Limitation: static lint cannot verify ownership, similarity to third-party character/console designs, licenses or screenshots.');
