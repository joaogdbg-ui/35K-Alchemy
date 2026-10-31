/**
 * V94 Stadium prizes (Chao Garden model): winning the Champion level of a race course gives a
 * TOY for the companion house (like the garden toys won in Chao Races); winning a karate level
 * gives the companion a BELT it wears from then on (automatic, like a rank). Prizes are not
 * catalog elements: they live in the games save and are drawn here. No imports.
 */
const S='#657D89';
const trophyBase=(w,h,inner)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><g stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
// Icons (100×100) and room sprites (1×1 tile object: 100×160, symmetric → one view for all sides).
const icon={
 pond:`<ellipse cx="50" cy="92" rx="30" ry="3" fill="#88979B" opacity=".15"/><path d="M22 86h56v-8H22z" fill="#7FB3C9" stroke="${S}" stroke-width="3"/><path d="M28 78q22-14 44 0v-8q-22-10-44 0z" fill="#BFE3E8" stroke="${S}" stroke-width="2.5"/><path d="M50 30q-14 8-12 22 2 10 12 12 10-2 12-12 2-14-12-22z" fill="#5AAED2" stroke="${S}" stroke-width="3"/><circle cx="46" cy="46" r="3" fill="#fff"/><path d="M50 30v-6M42 36l-5-4M58 36l5-4" stroke="#BFE3E8" stroke-width="3"/>`,
 cliffs:`<ellipse cx="50" cy="92" rx="30" ry="3" fill="#88979B" opacity=".15"/><path d="M50 88V46" stroke="#A98463" stroke-width="4"/><path d="M50 14 78 42 50 62 22 42z" fill="#E8826B" stroke="${S}" stroke-width="3"/><path d="M50 14v48M22 42h56" stroke="${S}" stroke-width="2"/><path d="M50 62q-8 10 0 18t0 10" fill="none" stroke="#F1C26B" stroke-width="3"/>`,
 meadow:`<ellipse cx="50" cy="92" rx="30" ry="3" fill="#88979B" opacity=".15"/><path d="M30 88V16" stroke="#A98463" stroke-width="5"/><path d="M33 18h40l-10 12 10 12H33z" fill="#6FAE62" stroke="${S}" stroke-width="3"/><path d="M44 30l5 5 9-10" fill="none" stroke="#F4EFE6" stroke-width="3.5"/><path d="M20 90q10-6 20 0" fill="none" stroke="#8DBF8A" stroke-width="3"/>`,
 boulder:`<ellipse cx="50" cy="92" rx="32" ry="3" fill="#88979B" opacity=".15"/><path d="M20 88h60v-10H20z" fill="#C9C1B4" stroke="${S}" stroke-width="3"/><path d="M30 78q-4-30 10-44 8-10 20-6 14 8 12 28-2 14 2 22z" fill="#A9A49A" stroke="${S}" stroke-width="3.5"/><path d="M40 60q8-6 16-2M36 46q8-8 18-4" fill="none" stroke="#7D7A74" stroke-width="2.5"/><path d="M62 36l3 7 7.5.8-5.6 5 1.7 7.4-6.6-4" fill="#F1C26B" stroke="${S}" stroke-width="2"/>`,
 trail:`<ellipse cx="50" cy="92" rx="30" ry="3" fill="#88979B" opacity=".15"/><path d="M50 10v10" stroke="${S}" stroke-width="4"/><path d="M30 20h40l-4 60H34z" fill="#F7E7C0" stroke="${S}" stroke-width="3.5"/><path d="M30 20h40M34 80h32v8H34z" fill="#8C6A4E" stroke="${S}" stroke-width="3"/><path d="M50 42q-8 10 0 20t0 6" fill="#E0675A"/><path d="M50 36q-10 14 0 30 10-16 0-30z" fill="#F1C26B" stroke="#D08A4C" stroke-width="2"/>`,
 grand:`<ellipse cx="50" cy="92" rx="30" ry="3" fill="#88979B" opacity=".15"/><path d="M32 88h36v-8H32z" fill="#8C6A4E" stroke="${S}" stroke-width="3"/><path d="M44 80h12l2-12H42z" fill="#E0A82E" stroke="${S}" stroke-width="3"/><path d="M26 18h48l-4 26q-4 18-20 20-16-2-20-20z" fill="#F1C26B" stroke="${S}" stroke-width="3.5"/><path d="M26 24q-14 2-10 16 4 10 14 8M74 24q14 2 10 16-4 10-14 8" fill="none" stroke="${S}" stroke-width="3.5"/><path d="M50 30l3 7 7.5.8-5.6 5 1.7 7.4-6.6-4-6.6 4 1.7-7.4-5.6-5 7.5-.8z" fill="#fff" stroke="#D08A4C" stroke-width="2"/>`
};
const room=k=>trophyBase(100,160,`<ellipse cx="50" cy="146" rx="30" ry="6" fill="#5a4a3a" opacity=".16"/><g transform="translate(5 44) scale(.9)">${icon[k]}</g>`);
export const RACE_PRIZES={
 pond:{id:'prize:pond-fountain',name:'Pond Fountain',summary:'A little fish fountain won at Pebble Pond.',kind:'furniture',effect:'mood',size:[1,1]},
 cliffs:{id:'prize:cliff-kite',name:'Cliff Kite',summary:'A red kite that never comes down, won at Breezy Cliffs.',kind:'furniture',effect:'mood',size:[1,1]},
 meadow:{id:'prize:meadow-flag',name:'Meadow Flag',summary:'The finish flag of Meadow Dash.',kind:'furniture',effect:'decor',size:[1,1]},
 boulder:{id:'prize:boulder-stone',name:'Boulder Stone',summary:'A piece of the Boulder Wall with a golden star.',kind:'furniture',effect:'decor',size:[1,1]},
 trail:{id:'prize:trail-lantern',name:'Trail Lantern',summary:'The lantern that lights the Long Trail.',kind:'furniture',effect:'mood',size:[1,1]},
 grand:{id:'prize:grand-cup',name:'Grand Cup',summary:'The golden cup of the Grand Circuit champion.',kind:'furniture',effect:'mood',size:[1,1]}
};
for(const [k,p] of Object.entries(RACE_PRIZES)){p.art=trophyBase(100,100,icon[k]);p.room={layer:'object',front:room(k),back:room(k),side:room(k)};p.prize=true;}
export const PRIZE_BY_ID=Object.fromEntries(Object.values(RACE_PRIZES).map(p=>[p.id,p]));
/** Karate belts by level index; the companion wears the best one it won. */
export const BELTS=[{id:'white',name:'White Belt',color:'#F4EFE6'},{id:'blue',name:'Blue Belt',color:'#5AAED2'},{id:'purple',name:'Purple Belt',color:'#9B7FC4'},{id:'brown',name:'Brown Belt',color:'#8C6A4E'},{id:'black',name:'Black Belt',color:'#2F3B44'}];
export const beltSvg=(b,size=22)=>`<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true"><path d="M4 16h32v8H4z" fill="${b.color}" stroke="${S}" stroke-width="2.5"/><path d="M20 24l-6 10M20 24l6 10" stroke="${b.color}" stroke-width="5" stroke-linecap="round"/><path d="M20 24l-6 10M20 24l6 10" fill="none" stroke="${S}" stroke-width="1.5"/><circle cx="20" cy="20" r="4" fill="${b.color}" stroke="${S}" stroke-width="2"/></svg>`;
/**
 * Draw a belt on a rigged companion SVG that is already in the DOM (needs getBBox):
 * a band across the lower body with a knot, in the belt colour.
 */
export function wearBelt(svgEl,beltId){
 if(!svgEl||svgEl.querySelector('[data-acc="belt"]'))return;const b=BELTS.find(x=>x.id===beltId);if(!b)return;
 const body=svgEl.querySelector('[data-part="body"]');if(!body)return;let bb;try{bb=body.getBBox();}catch{return;}if(!bb.width)return;
 const y=bb.y+bb.height*0.62,h=Math.max(3,bb.height*0.1),x=bb.x+bb.width*0.08,w=bb.width*0.84;
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('data-acc','belt');
 g.innerHTML=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" fill="${b.color}" stroke="${S}" stroke-width="1.6"/><circle cx="${x+w*0.5}" cy="${y+h/2}" r="${h*0.55}" fill="${b.color}" stroke="${S}" stroke-width="1.4"/><path d="M${x+w*0.5} ${y+h}l-${h*0.6} ${h*1.3}M${x+w*0.5} ${y+h}l${h*0.6} ${h*1.3}" stroke="${b.color}" stroke-width="${h*0.6}" stroke-linecap="round"/>`;
 (body.parentNode||svgEl).insertBefore(g,body.nextSibling);
}
