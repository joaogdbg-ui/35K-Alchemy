/**
 * V95 Stadium sound effects — synthesised with Web Audio (no audio files, works offline).
 * Uses the game's shared AudioContext through ctx.audio() so the Settings sound toggle applies.
 * Every effect is short, soft and in the game's friendly register. No imports.
 */
export function createStadiumSfx(getAudio){
 const ac=()=>{try{const a=getAudio?.();return a&&a.state!=='closed'?a:null;}catch{return null;}};
 const env=(a,g,t0,peak,dur,curve='exp')=>{g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+0.01);if(curve==='exp')g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);else g.gain.linearRampToValueAtTime(0.0001,t0+dur);};
 function tone(hz,{type='sine',dur=0.12,peak=0.08,at=0,slide=null}={}){const a=ac();if(!a)return;const t0=a.currentTime+at;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(hz,t0);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t0+dur);env(a,g,t0,peak,dur);o.connect(g);g.connect(a.destination);o.start(t0);o.stop(t0+dur+0.02);}
 let noiseBuf=null;
 function noise({dur=0.15,peak=0.08,at=0,hp=800,lp=4000,slide=null}={}){const a=ac();if(!a)return;if(!noiseBuf){noiseBuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
  const t0=a.currentTime+at;const s=a.createBufferSource();s.buffer=noiseBuf;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime((hp+lp)/2,t0);if(slide)f.frequency.exponentialRampToValueAtTime(slide,t0+dur);f.Q.value=0.8;const g=a.createGain();env(a,g,t0,peak,dur);s.connect(f);f.connect(g);g.connect(a.destination);s.start(t0);s.stop(t0+dur+0.02);}
 const S={
  tick(){tone(660,{type:'square',dur:0.08,peak:0.05});},
  go(){tone(880,{type:'square',dur:0.18,peak:0.07});tone(1320,{type:'square',dur:0.28,peak:0.07,at:0.06});},
  cheer(){noise({dur:0.26,peak:0.1,hp:900,lp:5000,slide:3200});tone(523,{type:'triangle',dur:0.1,peak:0.08});tone(784,{type:'triangle',dur:0.12,peak:0.08,at:0.07});tone(1047,{type:'triangle',dur:0.16,peak:0.07,at:0.14});},
  tired(){tone(220,{type:'triangle',dur:0.16,peak:0.05,slide:160});},
  splash(){noise({dur:0.25,peak:0.06,hp:300,lp:1800,slide:600});},
  flap(){noise({dur:0.12,peak:0.04,hp:600,lp:2400});},
  clack(){tone(300,{type:'square',dur:0.05,peak:0.04});noise({dur:0.05,peak:0.04,hp:2000,lp:6000});},
  step(){noise({dur:0.05,peak:0.025,hp:200,lp:900});},
  section(){tone(740,{dur:0.1,peak:0.05});tone(988,{dur:0.14,peak:0.05,at:0.08});},
  pass(){tone(880,{type:'triangle',dur:0.09,peak:0.06});tone(1175,{type:'triangle',dur:0.12,peak:0.06,at:0.07});},
  passed(){tone(392,{type:'triangle',dur:0.12,peak:0.05});tone(330,{type:'triangle',dur:0.16,peak:0.05,at:0.08});},
  rest(){tone(330,{type:'sine',dur:0.3,peak:0.04,slide:220});},
  finish(){[[523,0],[659,0.1],[784,0.2],[1047,0.32]].forEach(([h,t])=>tone(h,{dur:0.22,peak:0.07,at:t}));noise({dur:0.6,peak:0.05,hp:1500,lp:6000,at:0.3});},
  lose(){[[392,0],[349,0.14],[311,0.28]].forEach(([h,t])=>tone(h,{type:'triangle',dur:0.26,peak:0.06,at:t}));},
  medal(){tone(1568,{dur:0.3,peak:0.06});tone(2093,{dur:0.5,peak:0.05,at:0.08});},
  prize(){[[659,0],[784,0.08],[988,0.16],[1319,0.26],[1568,0.4]].forEach(([h,t])=>tone(h,{dur:0.3,peak:0.06,at:t}));},
  unlock(){tone(1047,{dur:0.12,peak:0.05});tone(1319,{dur:0.18,peak:0.05,at:0.1});},
  gong(){tone(196,{type:'sine',dur:1.2,peak:0.09});tone(392,{type:'sine',dur:0.9,peak:0.04,at:0.01});noise({dur:0.2,peak:0.05,hp:600,lp:2000});},
  fight(){tone(660,{type:'square',dur:0.12,peak:0.06});tone(990,{type:'square',dur:0.2,peak:0.06,at:0.09});},
  hit(){noise({dur:0.09,peak:0.09,hp:400,lp:2500,slide:300});tone(180,{type:'triangle',dur:0.08,peak:0.06,slide:90});},
  bigHit(){noise({dur:0.16,peak:0.12,hp:200,lp:2000,slide:150});tone(120,{type:'triangle',dur:0.18,peak:0.1,slide:60});},
  block(){tone(520,{type:'square',dur:0.06,peak:0.05});noise({dur:0.08,peak:0.05,hp:2500,lp:7000});},
  miss(){noise({dur:0.18,peak:0.05,hp:1000,lp:4000,slide:500});},
  charge(){tone(440,{type:'sawtooth',dur:0.25,peak:0.04,slide:880});},
  ko(){noise({dur:0.3,peak:0.12,hp:150,lp:1500,slide:100});tone(98,{type:'triangle',dur:0.5,peak:0.1,slide:49});setTimeout(()=>S.gong(),250);},
  breath(){noise({dur:0.35,peak:0.03,hp:300,lp:1200});},
  tap(){tone(880,{dur:0.05,peak:0.03});},
  // V105: companion sounds (soft, short) — on-screen pet and in races
  boop(){tone(740,{type:'sine',dur:0.07,peak:0.05,slide:1100});},
  purr(){tone(140,{type:'triangle',dur:0.18,peak:0.035,slide:120});noise({dur:0.15,peak:0.015,hp:150,lp:600});},
  happy(){tone(988,{dur:0.08,peak:0.045});tone(1319,{dur:0.12,peak:0.045,at:0.07});},
  grab(){noise({dur:0.06,peak:0.04,hp:1500,lp:5000});tone(600,{dur:0.05,peak:0.03,slide:900});},
  nom(){noise({dur:0.06,peak:0.05,hp:400,lp:1600});tone(220+Math.random()*60,{type:'triangle',dur:0.06,peak:0.04,slide:160});},
  refuse(){tone(330,{type:'triangle',dur:0.09,peak:0.045,slide:260});tone(262,{type:'triangle',dur:0.12,peak:0.045,at:0.09,slide:200});},
  knock(){noise({dur:0.05,peak:0.07,hp:900,lp:3000});tone(1200,{type:'sine',dur:0.04,peak:0.03});},
  hop(){tone(420,{dur:0.1,peak:0.04,slide:800});},
  land(){noise({dur:0.06,peak:0.04,hp:150,lp:700});},
  levelup(){[[784,0],[988,0.08],[1175,0.16],[1568,0.26]].forEach(([h,t])=>tone(h,{type:'triangle',dur:0.16,peak:0.05,at:t}));},
  paddle(){noise({dur:0.1,peak:0.03,hp:400,lp:1600,slide:900});},
  grip(){tone(260,{type:'square',dur:0.03,peak:0.02});noise({dur:0.04,peak:0.025,hp:1500,lp:4000});},
  wind(){noise({dur:0.4,peak:0.025,hp:500,lp:2500,slide:1200});},
  // V125: duo play between two on-screen companions
  whoosh(){noise({dur:0.22,peak:0.045,hp:700,lp:3000,slide:2400});},
  bounce(){tone(300,{type:'sine',dur:0.09,peak:0.06,slide:520});noise({dur:0.04,peak:0.03,hp:300,lp:1200});},
  kick(){noise({dur:0.05,peak:0.07,hp:250,lp:1400});tone(160,{type:'triangle',dur:0.07,peak:0.06,slide:240});},
  giggle(){[0,0.09,0.18].forEach((t,i)=>tone(880+i*90,{type:'triangle',dur:0.07,peak:0.04,at:t,slide:1050+i*90}));},
  count(){tone(560,{type:'sine',dur:0.07,peak:0.035});},
  found(){tone(660,{dur:0.08,peak:0.05});tone(990,{dur:0.1,peak:0.05,at:0.08});tone(1320,{dur:0.16,peak:0.05,at:0.16});},
  peek(){tone(1200,{type:'sine',dur:0.06,peak:0.03,slide:1600});},
  swish(){noise({dur:0.12,peak:0.04,hp:1200,lp:5000,slide:3000});},
  // V136: school tune
  tune(){[[523,0],[659,.25],[784,.5],[659,.75],[880,1.0],[784,1.3]].forEach(([h,t])=>tone(h,{type:'triangle',dur:0.22,peak:0.045,at:t}));}
 };
 return S;
}
