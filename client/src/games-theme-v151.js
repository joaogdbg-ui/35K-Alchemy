/* V151: themed race maps. The regular stadium art is recoloured per theme (same shapes, same style),
 * a themed sky/backdrop is used, and the bushes along the route are replaced by themed props.
 * Pure (no DOM, no imports) so tools/build-standalone.py can inline it. */
const hex2rgb=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];};
const rgb2hsl=([r,g,b])=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return [h,s,l];};
const hsl2hex=([h,s,l])=>{s=Math.max(0,Math.min(1,s));l=Math.max(0,Math.min(1,l));const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');};
/** Each theme maps colour families to [hue, saturation ×, lightness +]. g = greens, b = browns/oranges, w = blues (water), s = blues in the sky. */
export const THEME_MAPS={
 heaven:{g:[48,.45,.26],b:[42,.35,.24],w:[198,.55,.14],s:[205,.55,.12],n:.06},
 inferno:{g:[14,.85,-.14],b:[6,.55,-.24],w:[20,1.8,-.04],s:[8,.85,-.22],n:-.12},
 dragonpeak:{g:[158,.5,-.06],b:[212,.2,-.04],w:[192,.7,0],s:[178,.35,.02],n:-.02},
 glade:{g:[105,.95,.06],b:[328,.38,.12],w:[172,.95,.06],s:[288,.42,.06],n:.04},
 deepsea:{g:[44,.55,.14],b:[352,.6,.06],w:[206,.95,-.12],s:[202,.95,-.3],n:-.08}};
function classify([h,s,l]){if(s<.14)return 'n';if(h>=62&&h<172)return 'g';if(h>=172&&h<258)return 'w';if(h<62||h>=330)return 'b';return null;}
/** Recolour every #hex in an SVG string. `sky` = treat blues as sky instead of water. */
export function recolorSvg(svg,map,sky=false){if(!svg||!map)return svg;
 return svg.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g,m=>{const c=rgb2hsl(hex2rgb(m));const k=classify(c);if(!k)return m;
  if(k==='n')return map.n?hsl2hex([c[0],c[1],c[2]+map.n*(c[2]>.85?0:1)]):m;
  const t=map[k==='w'&&sky?'s':k];if(!t)return m;return hsl2hex([t[0],Math.min(1,c[1]*t[1]+.06),c[2]+t[2]]);});}
const fx=n=>(+n).toFixed(1);
/** Themed props drawn where the regular course has bushes (x, y = ground point). */
export const THEME_PROPS={
 heaven:(x,y,r)=>r<.5?`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#c9b48a" stroke-width="2"><ellipse cx="0" cy="-10" rx="22" ry="11" fill="#fffdf4"/><ellipse cx="-12" cy="-16" rx="12" ry="9" fill="#ffffff"/><ellipse cx="10" cy="-19" rx="13" ry="10" fill="#ffffff"/></g>`:`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#b08a4a" stroke-width="2"><rect x="-8" y="-58" width="16" height="56" rx="2" fill="#f7eccf"/><path d="M-4 -54v48M4 -54v48" stroke="#e2cf9c"/><rect x="-12" y="-64" width="24" height="8" rx="2" fill="#f3d98c"/><rect x="-12" y="-6" width="24" height="6" rx="2" fill="#f3d98c"/></g>`,
 inferno:(x,y,r)=>`<g transform="translate(${fx(x)} ${fx(y)})"><path d="M-16 0q2-14 10-16q8 4 10 16Z" fill="#3a2422" stroke="#1f1212" stroke-width="2"/><path class="g-flame" d="M-6 -14q-8-12 2-26q2 10 8 8q2 12-4 18Z" fill="#ff8a2a" stroke="#c4361a" stroke-width="1.6"/><path d="M-3 -16q-2-8 3-14q1 6 4 6q0 6-3 8Z" fill="#ffd36a"/></g>`,
 dragonpeak:(x,y,r)=>r<.5?`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#2f5a4a" stroke-width="2"><path d="M0 -52L14 -18H6L18 0H-18L-6 -18H-14Z" fill="#4f8a72"/><rect x="-3" y="0" width="6" height="6" fill="#6b4f36"/></g>`:`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#3b4f7a" stroke-width="2"><path d="M-10 0L-6 -26L0 -40L6 -24L10 0Z" fill="#9fc6f0"/><path d="M0 -40L0 0" stroke="#ffffff" stroke-width="1.5" opacity=".7"/><path d="M8 0l4 -14l5 14Z" fill="#7fa8e0"/></g>`,
 glade:(x,y,r)=>r<.5?`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#7a3f5a" stroke-width="2"><rect x="-4" y="-16" width="8" height="16" rx="3" fill="#fff4e6"/><path d="M-16 -14q16-20 32 0Z" fill="#ef7f9b"/><circle cx="-6" cy="-19" r="2.5" fill="#fff"/><circle cx="5" cy="-21" r="2" fill="#fff"/></g>`:`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#5e7a3c" stroke-width="1.6">${[-12,0,12].map((d,i)=>`<path d="M${d} 0v-${14+i*5}" fill="none"/><circle class="g-glow" cx="${d}" cy="-${16+i*5}" r="5" fill="${['#f3c24a','#9b7fc4','#7fe0d0'][i]}" stroke="#ffffff"/>`).join('')}</g>`,
 deepsea:(x,y,r)=>r<.5?`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#a8324a" stroke-width="2" fill="none"><path d="M0 0V-30M0 -18L-12 -30M0 -24L10 -38M-12 -30v-8M10 -38l6 -4" stroke-width="5" stroke="#ef6f7f"/><path d="M0 0V-30M0 -18L-12 -30M0 -24L10 -38" stroke-width="1.5"/></g>`:`<g transform="translate(${fx(x)} ${fx(y)})" stroke="#2f6a3a" stroke-width="2"><path class="g-sway" d="M-6 0q-8-14 0-26q8-12 0-26" fill="none" stroke="#4fae6a" stroke-width="5"/><path d="M6 0q6-10 0-20q-6-10 2-20" fill="none" stroke="#6fc488" stroke-width="4"/></g>`};
/** The art set for a themed course: recoloured textures + sky/mid + props. */
export function themedArt(base,id){const map=THEME_MAPS[id];if(!map)return null;const out={};
 for(const k of ['run','swim','fly','climb','mid'])out[k]=recolorSvg(base[k],map,false);
 out.sky=recolorSvg(base.sky,map,true);out.map=map;out.prop=THEME_PROPS[id]||null;return out;}

/* ===== V193: every companion races in its own world — same course and obstacles, its own colours, scenery and particles ===== */
const G=(x,y,inner,st='#657D89')=>`<g transform="translate(${fx(x)} ${fx(y)})" stroke="${st}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
const tree=(trunk,leaf,leaf2,shape)=>shape==='pine'?`<rect x="-3" y="-8" width="6" height="8" fill="${trunk}"/><path d="M0 -56L15 -22H7L19 -6H-19L-7 -22H-15Z" fill="${leaf}"/>`:`<rect x="-4" y="-22" width="8" height="22" rx="2" fill="${trunk}"/><circle cx="-10" cy="-30" r="12" fill="${leaf2}"/><circle cx="8" cy="-34" r="15" fill="${leaf}"/><circle cx="0" cy="-46" r="11" fill="${leaf2}"/>`;
export const PROP_LIB={
 pixeltree:(x,y)=>G(x,y,`<rect x="-4" y="-20" width="8" height="20" fill="#8a5f3c"/><path d="M-16 -20h32v-12h-8v-10h-6v-8h-4v8h-6v10h-8Z" fill="#6fbf58"/><rect x="-10" y="-30" width="6" height="6" fill="#a8e088" stroke="none"/>`),
 pixelblock:(x,y)=>G(x,y,`<rect x="-12" y="-24" width="24" height="24" fill="#f2c24e"/><path d="M-4 -18h8v6h-4v4M0 -6v1" fill="none" stroke="#7a4a12" stroke-width="3"/>`),
 antenna:(x,y)=>G(x,y,`<path d="M0 0V-44" fill="none" stroke-width="4" stroke="#8fa3ad"/><path d="M0 0V-44" fill="none"/><circle class="g-glow" cx="0" cy="-48" r="5" fill="#ff6b5a"/><path d="M-12 -30h24M-8 -20h16" fill="none"/><rect x="-9" y="-6" width="18" height="6" fill="#6e828c"/>`),
 gear:(x,y)=>G(x,y,`<circle cx="0" cy="-16" r="14" fill="#a9bac2"/><circle cx="0" cy="-16" r="5" fill="#4f6269"/><path d="M0 -34v6M0 -4v6M-18 -16h6M12 -16h6M-13 -29l4 4M9 -7l4 4M13 -29l-4 4M-9 -7l-4 4" fill="none" stroke-width="4"/>`),
 banner:(x,y)=>G(x,y,`<path d="M0 0V-54" fill="none" stroke="#8a5f3c" stroke-width="4"/><path d="M2 -52h22l-6 9 6 9H2Z" fill="#e0675a"/><circle cx="0" cy="-56" r="3" fill="#ffd166"/>`),
 swordstone:(x,y)=>G(x,y,`<path d="M-18 0Q-16 -16 0 -16Q16 -16 18 0Z" fill="#a9b0b6"/><path d="M0 -14V-44" fill="none" stroke="#dce6ea" stroke-width="5"/><path d="M0 -14V-44M-8 -38h16" fill="none"/><circle cx="0" cy="-47" r="3" fill="#ffd166"/>`),
 pinedark:(x,y)=>G(x,y,tree('#4a3a32','#2f5a4a','#2f5a4a','pine'),'#1f3a30'),
 tombstone:(x,y)=>G(x,y,`<path d="M-12 0V-22Q-12 -34 0 -34Q12 -34 12 -22V0Z" fill="#b7b0c2"/><path d="M0 -26v14M-5 -21h10" fill="none"/>`,'#5c5470'),
 easel:(x,y)=>G(x,y,`<path d="M-14 0L-4 -40M14 0L4 -40M0 0V-14" fill="none" stroke="#a0683c" stroke-width="3"/><rect x="-14" y="-42" width="28" height="24" fill="#fffdf4"/><circle cx="-5" cy="-33" r="4" fill="#e0675a" stroke="none"/><circle cx="5" cy="-28" r="4" fill="#7cc3e0" stroke="none"/><circle cx="2" cy="-36" r="3" fill="#ffd166" stroke="none"/>`),
 paintpot:(x,y)=>G(x,y,`<path d="M-11 0V-16h22V0Z" fill="#dce6ea"/><path d="M-11 -16q11 -8 22 0q-4 6 -6 0q-5 10 -10 0q-3 5 -6 0Z" fill="#f2a7b8"/><path d="M6 -16L16 -36" fill="none" stroke="#a0683c" stroke-width="3"/>`),
 bamboo:(x,y)=>G(x,y,`<path d="M-8 0V-52M6 0V-40" fill="none" stroke="#7fbf5a" stroke-width="6"/><path d="M-8 0V-52M6 0V-40M-11 -16h6M-11 -34h6M3 -14h6M3 -28h6" fill="none" stroke="#3f7a3c"/><path d="M-8 -44q12 -8 18 0q-10 6 -18 0Z" fill="#9ad67a" stroke="#3f7a3c"/>`),
 lantern:(x,y)=>G(x,y,`<path d="M0 0V-20" fill="none" stroke="#6b4f36" stroke-width="4"/><rect x="-10" y="-40" width="20" height="20" rx="4" fill="#ffd9a8"/><rect class="g-glow" x="-5" y="-36" width="10" height="12" rx="2" fill="#ff9a4a" stroke="none"/><path d="M-13 -40h26l-4 -6h-18Z" fill="#c9483c"/>`),
 iceberg:(x,y)=>G(x,y,`<path d="M-18 0L-8 -30L0 -18L8 -42L18 0Z" fill="#dff3f8"/><path d="M8 -42L10 0M-8 -30L-4 0" fill="none" stroke="#a8d8ea"/>`,'#6fa8c9'),
 igloo:(x,y)=>G(x,y,`<path d="M-20 0Q-20 -26 0 -26Q20 -26 20 0Z" fill="#f4fbfd"/><path d="M-7 0v-9q7 -8 14 0v9Z" fill="#5f7f96"/><path d="M-18 -10h36M-12 -19h24" fill="none" stroke="#a8d8ea"/>`,'#6fa8c9'),
 mic:(x,y)=>G(x,y,`<path d="M0 0V-34M-10 0h20" fill="none" stroke="#4f4a52" stroke-width="3"/><rect x="-6" y="-52" width="12" height="20" rx="6" fill="#dce6ea"/><path d="M-6 -44h12" fill="none"/>`,'#3a3550'),
 speaker:(x,y)=>G(x,y,`<rect x="-13" y="-36" width="26" height="36" rx="3" fill="#3a3550"/><circle class="g-glow" cx="0" cy="-12" r="8" fill="#ff7ad9"/><circle cx="0" cy="-28" r="4" fill="#7fe0d0"/>`,'#1f1a30'),
 torii:(x,y)=>G(x,y,`<path d="M-12 0V-40M12 0V-40" fill="none" stroke="#c9483c" stroke-width="5"/><path d="M-20 -42h40l-3 -7h-34ZM-15 -32h30" fill="#c9483c" stroke="#7a2a22"/>`,'#7a2a22'),
 pylon:(x,y)=>G(x,y,`<path d="M-12 0L-4 -54h8L12 0Z" fill="#8fa3ad"/><path d="M-9 -18h18M-7 -34h14M-10 -8L8 -30M10 -8L-8 -30" fill="none"/><circle class="g-glow" cx="0" cy="-56" r="4" fill="#ffd166"/>`),
 maple:(x,y)=>G(x,y,tree('#8a5f3c','#e8843c','#f2b84b'),'#8a4a1c'),
 mushroom:(x,y)=>G(x,y,`<rect x="-4" y="-14" width="8" height="14" rx="3" fill="#fff4e6"/><path d="M-15 -12q15 -20 30 0Z" fill="#e0675a"/><circle cx="-5" cy="-17" r="2.5" fill="#fff" stroke="none"/><circle cx="5" cy="-19" r="2" fill="#fff" stroke="none"/>`),
 moonstump:(x,y)=>G(x,y,`<path d="M-12 0V-14q12 -6 24 0V0Z" fill="#6b4f36"/><ellipse cx="0" cy="-14" rx="12" ry="4" fill="#c9a078"/><circle class="g-glow" cx="12" cy="-40" r="8" fill="#ffe9a8" stroke="#c9b06a"/>`,'#3a2a20'),
 berrybush:(x,y)=>G(x,y,`<circle cx="-10" cy="-8" r="11" fill="#6fa65a"/><circle cx="6" cy="-12" r="14" fill="#8fbf68"/><circle cx="-8" cy="-10" r="3" fill="#c9384e" stroke="none"/><circle cx="4" cy="-16" r="3" fill="#c9384e" stroke="none"/><circle cx="12" cy="-8" r="3" fill="#7a5aa6" stroke="none"/>`,'#3f6a3c'),
 reeds:(x,y)=>G(x,y,`<path class="g-sway" d="M-8 0q-4 -22 0 -44M2 0q4 -18 0 -36M10 0q-2 -14 2 -28" fill="none" stroke="#5f9a4a" stroke-width="3"/><rect x="-11" y="-50" width="6" height="14" rx="3" fill="#8a5f3c"/><rect x="-1" y="-42" width="6" height="12" rx="3" fill="#8a5f3c"/>`,'#3f6a3c'),
 lily:(x,y)=>G(x,y,`<ellipse cx="0" cy="-4" rx="18" ry="6" fill="#6fbf7a"/><path d="M0 -6q-10 -10 0 -20q10 10 0 20ZM0 -6q-14 -4 -14 -14q12 0 14 14ZM0 -6q14 -4 14 -14q-12 0 -14 14Z" fill="#f7b9d0" stroke="#c9788a"/>`,'#3f7a4a'),
 riverrock:(x,y)=>G(x,y,`<path d="M-18 0Q-18 -16 -4 -16Q8 -22 16 -8Q20 0 18 0Z" fill="#a9b6be"/><path d="M-10 -8q6 -6 12 -2" fill="none" stroke="#dce6ea"/>`),
 crystal:(x,y)=>G(x,y,`<path d="M-10 0L-7 -26L0 -40L7 -24L11 0Z" fill="#c99bf0"/><path d="M0 -40V0" fill="none" stroke="#fff" opacity=".7"/><path d="M9 0l4 -14l5 14Z" fill="#9b7fc4"/>`,'#5c4e8a'),
 redcrystal:(x,y)=>G(x,y,`<path d="M-10 0L-7 -26L0 -40L7 -24L11 0Z" fill="#ff8a5a"/><path d="M0 -40V0" fill="none" stroke="#ffe08a" opacity=".8"/><path d="M9 0l4 -14l5 14Z" fill="#c9483c"/>`,'#7a2a22'),
 flame:(x,y)=>G(x,y,`<path d="M-16 0q2 -14 10 -16q8 4 10 16Z" fill="#3a2422" stroke="#1f1212"/><path class="g-flame" d="M-6 -14q-8 -12 2 -26q2 10 8 8q2 12 -4 18Z" fill="#ff8a2a" stroke="#c4361a"/><path d="M-3 -16q-2 -8 3 -14q1 6 4 6q0 6 -3 8Z" fill="#ffd36a" stroke="none"/>`),
 cabinet:(x,y)=>G(x,y,`<path d="M-12 0V-44h20l4 8V0Z" fill="#5c4e8a"/><rect class="g-glow" x="-8" y="-38" width="14" height="12" fill="#7fe0d0"/><circle cx="-4" cy="-18" r="2.5" fill="#e0675a" stroke="none"/><circle cx="3" cy="-18" r="2.5" fill="#ffd166" stroke="none"/>`,'#2a2540'),
 deadtree:(x,y)=>G(x,y,`<path d="M0 0V-34M0 -20L-12 -34M0 -26L10 -42M-12 -34v-8M10 -42l6 -4" fill="none" stroke="#5c5470" stroke-width="5"/>`,'#3a3550'),
 tower:(x,y)=>G(x,y,`<rect x="-8" y="-40" width="16" height="40" fill="#b7a6c2"/><path d="M-12 -40L0 -62L12 -40Z" fill="#7a5aa6"/><rect class="g-glow" x="-3" y="-30" width="6" height="9" rx="3" fill="#ffe08a" stroke="none"/><path d="M0 -62v-6" fill="none"/>`,'#4f3a7a'),
 boulder:(x,y)=>G(x,y,`<path d="M-20 0Q-22 -22 -6 -26Q10 -34 20 -14Q24 0 20 0Z" fill="#b8ad9c"/><path d="M-10 -14q8 -6 14 0M4 -22q6 2 8 8" fill="none" stroke="#8a7f72"/>`),
 bigflower:(x,y)=>G(x,y,`<path d="M0 0V-34" fill="none" stroke="#5f9a4a" stroke-width="4"/><circle cx="0" cy="-42" r="7" fill="#ffd166"/>${[0,60,120,180,240,300].map(a=>`<ellipse cx="0" cy="-54" rx="5" ry="8" fill="#f2a7b8" transform="rotate(${a} 0 -42)"/>`).join('')}<circle cx="0" cy="-42" r="6" fill="#ffd166"/>`,'#8a4a5a'),
 carrot:(x,y)=>G(x,y,`<path d="M-12 0q2 -14 6 -14q4 0 6 14ZM2 0q2 -18 6 -18q4 0 6 18Z" fill="#e8843c"/><path d="M-6 -14q-6 -10 0 -16q6 6 0 16M8 -18q-6 -12 0 -18q6 6 0 18" fill="#8fbf68" stroke="#3f7a3c"/>`,'#8a4a1c'),
 fork:(x,y)=>G(x,y,`<path d="M0 0V-30" fill="none" stroke="#dce6ea" stroke-width="5"/><path d="M0 0V-30M-8 -52v14q0 8 8 8q8 0 8 -8v-14M0 -52v20" fill="none"/>`),
 palm:(x,y)=>G(x,y,`<path d="M0 0Q4 -24 -2 -44" fill="none" stroke="#a0683c" stroke-width="5"/><path d="M-2 -44q-18 -10 -24 4q14 -4 24 -4ZM-2 -44q18 -12 26 2q-14 -4 -26 -2ZM-2 -44q-8 -18 -20 -14q10 4 20 14ZM-2 -44q10 -18 22 -12q-12 2 -22 12Z" fill="#5fae5a" stroke="#2f6a3a"/>`,'#6b4426'),
 tent:(x,y)=>G(x,y,`<path d="M-20 0L0 -32L20 0Z" fill="#e9c98f"/><path d="M0 -32V0M-6 0L0 -14L6 0Z" fill="#a0683c"/><path d="M0 -32v-8" fill="none"/><path d="M0 -40h8l-2 3 2 3H0Z" fill="#e0675a"/>`,'#6b4426'),
 beehive:(x,y)=>G(x,y,`<path d="M-13 0V-8q0 -6 3 -8q-1 -8 4 -10q0 -8 6 -8q6 0 6 8q5 2 4 10q3 2 3 8V0Z" fill="#f2c24e"/><path d="M-10 -16h20M-13 -8h26M-6 -26h12" fill="none" stroke="#b8862a"/><ellipse cx="0" cy="-3" rx="4" ry="3" fill="#6b4426"/>`,'#8a5a12'),
 sunflower:(x,y)=>G(x,y,`<path d="M0 0V-36M0 -16q-10 -2 -12 -10M0 -22q10 -2 12 -8" fill="none" stroke="#5f9a4a" stroke-width="3"/><circle cx="0" cy="-44" r="12" fill="#ffd166"/><circle cx="0" cy="-44" r="6" fill="#8a5f3c"/>`,'#b8862a'),
 tripod:(x,y)=>G(x,y,`<path d="M-12 0L0 -30L12 0M0 -30V0" fill="none" stroke="#4f6269" stroke-width="3"/><rect x="-10" y="-44" width="20" height="14" rx="3" fill="#4f6269"/><circle cx="0" cy="-37" r="5" fill="#bfe3ee"/>`,'#2f3a40'),
 signpost:(x,y)=>G(x,y,`<path d="M0 0V-40" fill="none" stroke="#8a5f3c" stroke-width="4"/><path d="M-2 -40h20l6 6 -6 6h-20Z" fill="#f2c27e"/><path d="M2 -22h-18l-6 6 6 6h18Z" fill="#e3a85c"/>`,'#6b4426'),
 column:(x,y)=>G(x,y,`<rect x="-8" y="-46" width="16" height="42" fill="#f1e6cc"/><path d="M-4 -44v38M4 -44v38" fill="none" stroke="#d9c8a0"/><rect x="-12" y="-52" width="24" height="7" rx="2" fill="#e3d2a8"/><rect x="-12" y="-6" width="24" height="6" rx="2" fill="#e3d2a8"/>`,'#a08a5a'),
 pot:(x,y)=>G(x,y,`<path d="M-10 -24h20q-2 4 2 8q8 14 -4 16H-8q-12 -2 -4 -16q4 -4 2 -8Z" fill="#c9733a"/><path d="M-11 -10q11 4 22 0" fill="none" stroke="#f2c27e" stroke-dasharray="3 3"/>`,'#7a3a1c'),
 crag:(x,y)=>G(x,y,`<path d="M-18 0L-10 -34L-2 -20L6 -52L18 0Z" fill="#b8ad9c"/><path d="M6 -52L4 0M-10 -34L-8 0" fill="none" stroke="#8a7f72"/><path d="M2 -44l4 -8 5 9Z" fill="#fff" stroke="none"/>`),
 nest:(x,y)=>G(x,y,`<path d="M-16 -8q16 12 32 0q-2 10 -16 10t-16 -10Z" fill="#a0683c"/><ellipse cx="-5" cy="-10" rx="5" ry="6" fill="#fff8ec"/><ellipse cx="5" cy="-10" rx="5" ry="6" fill="#fff8ec"/>`,'#6b4426'),
 firetree:(x,y)=>G(x,y,tree('#6b3a2a','#ff9a3a','#ffd166'),'#b8501c'),
 pyramid:(x,y)=>G(x,y,`<path d="M-22 0L0 -36L22 0Z" fill="#e9c98f"/><path d="M0 -36L6 0" fill="none" stroke="#c9a06a"/><path d="M0 -36L22 0H6Z" fill="#d9b06e" stroke="none"/><path d="M-22 0L0 -36L22 0Z" fill="none"/>`,'#8a6a3a'),
 brazier:(x,y)=>G(x,y,`<path d="M-4 0V-18M4 0V-18" fill="none" stroke="#4a3a4a" stroke-width="3"/><path d="M-12 -26h24l-4 10h-16Z" fill="#4a3a4a"/><path class="g-flame" d="M0 -26q-10 -10 -2 -24q2 8 6 6q4 10 -4 18Z" fill="#ff7a2a" stroke="#c4361a"/>`,'#2a1f2a'),
 cloud:(x,y)=>G(x,y,`<ellipse cx="0" cy="-10" rx="22" ry="11" fill="#fffdf4"/><ellipse cx="-12" cy="-16" rx="12" ry="9" fill="#fff"/><ellipse cx="10" cy="-19" rx="13" ry="10" fill="#fff"/>`,'#c9b48a'),
 fern:(x,y)=>G(x,y,`<path class="g-sway" d="M0 0Q-2 -24 -14 -36M0 0Q2 -28 12 -42M0 0Q-10 -10 -20 -12M0 0Q10 -12 20 -16" fill="none" stroke="#4f9a4a" stroke-width="4"/><path d="M0 0Q-2 -24 -14 -36M0 0Q2 -28 12 -42" fill="none" stroke="#2f6a3a" stroke-width="1"/>`,'#2f6a3a'),
 cycad:(x,y)=>G(x,y,`<path d="M-5 0V-22h10V0Z" fill="#8a5f3c"/><path d="M-5 -6h10M-5 -14h10" fill="none"/><path d="M0 -22q-20 -4 -24 -18q14 2 24 18ZM0 -22q20 -4 24 -18q-14 2 -24 18ZM0 -22q-6 -18 0 -30q6 12 0 30Z" fill="#5fae5a" stroke="#2f6a3a"/>`,'#6b4426'),
 volcano:(x,y)=>G(x,y,`<path d="M-22 0L-7 -34h14L22 0Z" fill="#7a6a5e"/><path d="M-7 -34h14l3 7q-5 5 -9 1q-5 5 -11 -1Z" fill="#ff7a2a" stroke="#c4361a"/><path class="g-flame" d="M0 -36q-4 -8 0 -14q4 6 0 14Z" fill="#ffd166" stroke="none"/>`,'#4a3a32'),
 snowpine:(x,y)=>G(x,y,`<rect x="-3" y="-8" width="6" height="8" fill="#6b4f36"/><path d="M0 -56L15 -22H7L19 -6H-19L-7 -22H-15Z" fill="#4f8a72"/><path d="M0 -56L8 -38H-8ZM-12 -22h24l-4 -8h-16Z" fill="#fff" stroke="none"/>`,'#2f5a4a'),
 bone:(x,y)=>G(x,y,`<path d="M-14 -6L14 -18" fill="none" stroke="#f4eee2" stroke-width="7"/><path d="M-14 -6L14 -18" fill="none" stroke-width="1.5"/><circle cx="-16" cy="-3" r="4.5" fill="#f4eee2"/><circle cx="-18" cy="-9" r="4.5" fill="#f4eee2"/><circle cx="16" cy="-21" r="4.5" fill="#f4eee2"/><circle cx="18" cy="-15" r="4.5" fill="#f4eee2"/>`,'#8a7f72'),
 moaihead:(x,y)=>G(x,y,`<path d="M-11 0V-34q0 -12 11 -12q11 0 11 12V0Z" fill="#8f8a86"/><path d="M-9 -30h18M0 -30v14l-4 2M-5 -8h10" fill="none" stroke="#4f4a46"/>`,'#4f4a46'),
 fan:(x,y)=>G(x,y,`<path d="M0 -4L-22 -26Q0 -46 22 -26Z" fill="#e0675a"/><path d="M0 -4L-12 -34M0 -4L0 -38M0 -4L12 -34" fill="none" stroke="#7a2a22"/><circle cx="0" cy="-4" r="3" fill="#ffd166"/>`,'#7a2a22'),
 rosebush:(x,y)=>G(x,y,`<circle cx="-9" cy="-8" r="11" fill="#4f8a4a"/><circle cx="7" cy="-12" r="13" fill="#5f9a5a"/><circle cx="-8" cy="-12" r="4" fill="#e0575a"/><circle cx="6" cy="-18" r="4.5" fill="#e0575a"/><circle cx="13" cy="-8" r="3.5" fill="#f2a7b8"/>`,'#2f5a3a'),
 streetlamp:(x,y)=>G(x,y,`<path d="M0 0V-48q0 -8 10 -8" fill="none" stroke="#3a3550" stroke-width="4"/><path d="M4 -56h12l-2 10h-8Z" fill="#3a3550"/><circle class="g-glow" cx="10" cy="-44" r="6" fill="#ffe9a8" stroke="none"/><rect x="-5" y="-4" width="10" height="4" fill="#3a3550"/>`,'#1f1a30'),
 plume:(x,y)=>G(x,y,`<path class="g-sway" d="M0 0Q-14 -24 -10 -48Q-2 -30 0 0ZM0 0Q0 -30 6 -54Q10 -30 0 0ZM0 0Q14 -22 20 -42Q8 -30 0 0Z" fill="#ff7ad9" stroke="#a03a8a"/><path d="M0 0Q0 -30 6 -54" fill="#ffd166" stroke="none" opacity=".0"/><circle cx="0" cy="-2" r="4" fill="#ffd166"/>`,'#a03a8a'),
 drum:(x,y)=>G(x,y,`<path d="M-13 -20v16q13 8 26 0v-16" fill="#3fa8b8"/><ellipse cx="0" cy="-20" rx="13" ry="5" fill="#fff8ec"/><path d="M-13 -20l8 18M13 -20l-8 18M0 -15v19" fill="none" stroke="#ffd166"/>`,'#1f6a7a'),
 skullcandle:(x,y)=>G(x,y,`<path d="M-11 -14q0 -14 11 -14q11 0 11 14q0 6 -4 8v6h-14v-6q-4 -2 -4 -8Z" fill="#fff8ec"/><circle cx="-4" cy="-14" r="3" fill="#7a3a8a"/><circle cx="4" cy="-14" r="3" fill="#7a3a8a"/><path d="M-3 -4v4M0 -4v4M3 -4v4" fill="none"/><path class="g-flame" d="M0 -30q-4 -8 0 -12q4 4 0 12Z" fill="#ffb04a" stroke="#c4361a"/>`,'#4a2a5a'),
 marigold:(x,y)=>G(x,y,`<path d="M-8 0V-14M8 0V-20M0 0V-10" fill="none" stroke="#5f9a4a" stroke-width="3"/><circle cx="-8" cy="-18" r="7" fill="#ffa23a"/><circle cx="8" cy="-24" r="8" fill="#ffb84a"/><circle cx="0" cy="-12" r="5" fill="#ff8a2a"/>`,'#a85a12')};
/** id → [world name, greens, browns, water, sky, neutral lightness, propA, propB, particle colour] */
const CT={
 'organic74:pixel-dinosaur-sprite':['Pixel Plains',[95,1.1,.02],[30,.8,0],[200,1,0],[195,.9,.04],0,'pixeltree','pixelblock','#a8e088'],
 'legacy:123':['Circuit City',[178,.35,-.04],[215,.25,-.02],[190,.9,0],[210,.3,-.06],-.04,'antenna','gear','#7fe0d0'],
 'legacy:118':['Castle Road',[110,.8,0],[25,.5,0],[210,.9,0],[205,.8,.02],0,'banner','swordstone','#ffd166'],
 'legacy:1277':['Moonlit Woods',[150,.4,-.2],[250,.25,-.22],[230,.6,-.2],[240,.5,-.34],-.16,'pinedark','tombstone','#dfe6ff'],
 'organic34:pixel-artist':['Paint Meadow',[320,.7,.08],[40,.8,.08],[190,1,.06],[280,.4,.1],.02,'easel','paintpot','#f2a7b8'],
 'pack:panda':['Bamboo Grove',[100,.9,-.02],[45,.4,.06],[170,.6,.04],[160,.3,.1],0,'bamboo','lantern','#c8f0a8'],
 'pack:penguin':['Ice Shelf',[195,.3,.3],[205,.25,.26],[205,.9,.02],[200,.5,.1],.06,'iceberg','igloo','#ffffff'],
 'pack:singer':['Neon Stage',[290,.8,-.1],[320,.6,-.14],[190,1.2,-.04],[265,.7,-.28],-.12,'mic','speaker','#ff7ad9'],
 'legacy:566':['Dusk Dojo',[140,.35,-.14],[350,.4,-.16],[225,.5,-.12],[20,.6,-.1],-.08,'torii','lantern','#f2a7b8'],
 'legacy:609':['Mecha Bay',[210,.25,-.08],[20,.5,-.1],[200,.6,-.06],[215,.35,-.12],-.06,'pylon','gear','#ffd166'],
 'organic40:fox':['Autumn Wood',[32,.95,.02],[18,.7,-.04],[195,.6,.02],[38,.5,.12],0,'maple','mushroom','#e8843c'],
 'organic40:owl':['Night Forest',[165,.4,-.2],[30,.35,-.2],[220,.6,-.18],[232,.55,-.32],-.14,'pinedark','moonstump','#ffe9a8'],
 'organic40:hedgehog':['Berry Hedge',[85,.9,0],[12,.6,0],[190,.8,.02],[200,.7,.06],0,'berrybush','mushroom','#c9384e'],
 'organic38:frog':['Lily Marsh',[125,.9,-.02],[80,.4,-.04],[165,.8,-.02],[175,.5,.06],0,'reeds','lily','#c8f0a8'],
 'organic42:otter':['River Bend',[105,.7,.02],[28,.55,-.04],[195,1,.04],[200,.8,.06],0,'riverrock','reeds','#bfe6fa'],
 'pack:pixel-dragon':['Ember Ridge',[20,.8,-.1],[350,.5,-.2],[18,1.6,0],[12,.7,-.18],-.1,'redcrystal','flame','#ffb04a'],
 'pack:arcade-golem':['Arcade Alley',[265,.6,-.1],[230,.4,-.16],[185,1.2,-.02],[250,.6,-.3],-.12,'cabinet','pixelblock','#7fe0d0'],
 'pack:ghost':['Haunted Hollow',[170,.25,-.16],[265,.3,-.18],[250,.5,-.14],[262,.45,-.3],-.12,'tombstone','deadtree','#d9d0ff'],
 'pack:wizard':['Starfall Tower',[255,.5,-.06],[275,.4,-.1],[200,1,0],[245,.6,-.24],-.08,'tower','crystal','#ffe08a'],
 'pack:giant':['Boulder Highlands',[90,.6,-.04],[30,.3,-.04],[205,.7,0],[205,.6,.04],0,'boulder','bigflower','#f2a7b8'],
 'organic37:chef':['Picnic Fields',[75,.9,.06],[14,.75,.04],[195,.8,.06],[45,.5,.16],.02,'carrot','fork','#ffd166'],
 'organic41:explorer':['Jungle Trail',[135,1,-.08],[35,.6,-.08],[175,.9,-.02],[185,.6,.02],-.02,'palm','tent','#c8f0a8'],
 'organic37:beekeeper':['Honey Meadow',[70,.95,.06],[42,.9,.06],[48,.9,.1],[50,.6,.16],.02,'beehive','sunflower','#ffd166'],
 'organic42:photographer':['Golden Hour',[55,.7,0],[20,.7,-.02],[28,.9,.06],[25,.8,.06],0,'tripod','signpost','#ffe9a8'],
 'organic41:archaeologist':['Dig Site',[45,.55,.06],[32,.6,.02],[185,.5,.04],[40,.45,.14],.02,'column','pot','#e9c98f'],
 'organic83:griffin':['Eagle Crags',[60,.5,.02],[35,.5,.04],[205,.8,.02],[210,.7,.06],0,'crag','nest','#ffffff'],
 'organic83:phoenix':['Sunfire Canyon',[38,1,.02],[10,.8,-.06],[30,1.4,.06],[20,.9,-.02],-.02,'flame','firetree','#ffb04a'],
 'organic83:sphinx':['Desert Riddle',[48,.7,.12],[38,.7,.08],[180,.7,.06],[42,.5,.18],.04,'pyramid','palm','#ffe9a8'],
 'organic82:cerberus':['Underworld Gate',[350,.5,-.2],[275,.3,-.24],[8,1.4,-.08],[330,.5,-.34],-.16,'brazier','tombstone','#ff7a2a'],
 'organic82:pegasus':['Cloud Kingdom',[48,.45,.26],[42,.35,.24],[198,.55,.14],[205,.55,.12],.06,'cloud','column','#ffffff'],
 'organic82:stegosaurus':['Fern Valley',[110,1,-.06],[25,.6,-.06],[180,.8,0],[150,.3,.08],0,'fern','cycad','#c8f0a8'],
 'organic82:triceratops':['Volcano Plains',[95,.7,-.04],[15,.6,-.1],[190,.6,0],[25,.5,.02],-.02,'volcano','fern','#ffb04a'],
 'organic82:woolly-mammoth':['Frozen Tundra',[190,.2,.3],[210,.2,.22],[205,.7,.06],[205,.4,.12],.05,'snowpine','iceberg','#ffffff'],
 'organic82:pterosaur':['Sky Cliffs',[150,.6,0],[28,.45,.06],[200,.9,.04],[195,.9,.06],0,'crag','cycad','#ffffff'],
 'organic82:smilodon':['Ice Age Steppe',[58,.45,.08],[30,.4,.06],[200,.5,.08],[205,.3,.14],.03,'bone','snowpine','#ffffff'],
 'organic85:moai':['Easter Shore',[100,.7,0],[30,.25,-.04],[188,1,.04],[198,.9,.06],0,'moaihead','palm','#bfe6fa'],
 'organic85:flamenco':['Seville Plaza',[20,.7,.08],[8,.8,0],[200,.6,.06],[30,.6,.14],.02,'fan','rosebush','#e0675a'],
 'organic85:tango':['Midnight Milonga',[340,.4,-.14],[10,.45,-.2],[230,.5,-.14],[250,.5,-.3],-.12,'streetlamp','rosebush','#ffd9a8'],
 'organic85:rio-carnival':['Carnival Parade',[150,1,.02],[315,.8,.06],[190,1.1,.04],[285,.5,.08],.02,'plume','drum','#ffd166'],
 'organic85:day-of-the-dead':['Marigold Night',[32,1,-.02],[300,.5,-.14],[280,.6,-.1],[265,.55,-.3],-.1,'skullcandle','marigold','#ffb04a']};
export const COMPANION_WORLDS=Object.fromEntries(Object.entries(CT).map(([id,[name,g,b,w,sk,n,pa,pb,fxc]])=>[id,{name,map:{g,b,w,s:sk,n},props:[pa,pb],fx:fxc}]));
/** The art set for a companion's own world (null for unknown ids). */
export function companionArt(base,cid){const W=COMPANION_WORLDS[cid];if(!W)return null;const out={};
 for(const k of ['run','swim','fly','climb','mid'])out[k]=recolorSvg(base[k],W.map,false);
 out.sky=recolorSvg(base.sky,W.map,true);out.map=W.map;const [a,b]=W.props.map(k=>PROP_LIB[k]);out.prop=(x,y,r)=>(r<.5?a:b)(x,y).replace(')"',') scale(1.35)"');out.dense=true;out.name=W.name;out.fx=W.fx;return out;}
