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
