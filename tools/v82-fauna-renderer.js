/* Species-specific vector anatomy construction for V82; sources are generated into individual assets/v82 SVG files. This is not a generic motif/hash icon factory: anatomy depends on researched taxa and species metadata. */
export const renderV82Fauna = function renderFauna(name,kind,v){
  const main=v.color||"#9EB6B1", line="#657D89", pale="#E7D9C5", light="#C5D3CC";
  const p=(d,fill="none",stroke=line,w=3)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
  const e=(x,y,rx,ry,fill,stroke=line,w=3)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
  const c=(x,y,r,fill,stroke="none",w=2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
  const n=x=>Math.round(x*10)/10;
  let s="";
  if(kind==="theropod"){
    const size=v.scale||1, skull=v.head||1, tail=v.tail||1, leg=v.legs||1;
    const bx=n(20*size),hy=n(12*size),snout=n(82+8*(skull-1)),toe=n(91-(leg-1)*3);
    s+=p(`M${n(29-9*(tail-1))} 61 Q14 49 5 ${n(36-12*(tail-1))} Q9 76 ${n(28-bx*.4)} 78Z`,main);
    s+=e(46,61,bx,hy,main);
    s+=p(`M56 57 62 39 Q70 29 ${n(snout-8)} 33 L${snout} 40 ${n(snout-2)} 52 63 52Z`,main);
    s+=p(`M${snout} 50l8 4-12 4-13-7`,light,line,2);
    s+=p(`M34 69 28 ${n(91+(leg-1)*2)}h13l-3-6 10-12M54 68 53 ${toe}h14l-6-6 3-13`,main,line,5);
    s+=p(`M58 56q6 3 8 12l9 7m-7-10 10 4`, "none",line, v.arms?2*v.arms:3);
    if(v.sail)s+=p("M25 53 30 21l8 18 8-29 7 26 10-21 1 36Z","#C3ABB0","#9C8490",3);
    if(v.crest==="double")s+=p(`M${snout-21} 31q1-16 7-20l6 20m0 0q3-17 10-21l1 23`,light,"#859EA1",4);
    if(v.crest==="brow")s+=p(`M${snout-16} 34l-1-9 8 8m3 0 4-8`,light,line,3);
    if(v.crest==="oval")s+=p(`M${snout-17} 35q-5-25 8-25 14 3 7 25Z`,"#C6AFB3","#8D94A4",3);
    if(v.crest==="spine")s+=p(`M${snout-22} 34l6-14 4 14`,light,line,3);
    if(v.horns)s+=Array.from({length:v.horns},(_,i)=>p(`M${snout-16+i*7} 34l${-3+i*4}-12 9 12`,pale,line,3)).join("");
    if(v.feather){s+=p("M17 56 8 51l12 1-6-13 14 8m7-2-4-12 10 10m6 2-2-13 9 9",light,"#819AA4",3);s+=p("m31 73-5 9m29-9 4 9",light,line,2);}
    if(v.beak)s+=p(`M${snout-6} 40l15 7-17 5Z`,pale,line,3);
    if(v.claws)s+=p(`M73 71q${v.claws*2} 4 ${v.claws*2+4} 12m-12-5 10 9`, "none","#B6A7A5",4);
    if(v.wings)s+=p(v.wings===4?"M36 52 6 25l22 4 23 23m1 14-20 17 2-15 21-20":"M36 54 9 30l28 10 15 18",light,"#8297B2",4);
    if(v.stripes){for(let i=0;i<v.stripes;i++)s+=p(`M${38+i*9} ${48+i%2}l-4 13`,"none","#D9C9AF",3);}
    s+=c(n(snout-8),40,2.5,"#374D59")+p("M9 91h82","none","#BFC0A8",3);
  }else if(kind==="sauropod"){
    const h=n(26-13*((v.neck||1)-1)), body=v.body||1,tl=v.tail||1;
    s+=p(`M28 67 Q12 61 ${n(5-3*(tl-1))} ${n(45-7*(tl-1))} Q5 84 31 79Z`,main);
    s+=e(43,62,n(22*body),14,main);
    s+=p(`M55 57 Q59 45 61 ${h+5} Q63 ${h} 72 ${h} L84 ${h+5} 81 ${h+15} 69 ${h+13} 67 64Z`,main);
    s+=p(`M28 69l-4 21h9l4-20m17-2 0 23h10l-4-23m3-3 7 25h9l-9-29`,main,line,5);
    if(v.spines){for(let i=0;i<7;i++)s+=p(`M${56+i*2} ${49-i*5}l-7-11 9 5`,pale,"#9D8790",2);}
    if(v.armor){for(let i=0;i<7;i++)s+=e(25+i*5,52+i%3,3.1,2.5,"#C8BC9B","#899986",1.5);}
    if(v.legs)s+=p(`M21 65l-1 ${n(18*v.legs)}`, "none",line,5);
    if(v.head)s+=p(`M70 ${h+4}l${n(10*v.head)} 3-7 6`,light,line,2);
    s+=c(75,h+6,2.5,"#3B5661")+p("M7 92h86","none","#C2C5B3",3);
  }else if(kind==="ceratopsian"){
    const size=v.scale||1,frill=v.frill||1, x=n(56-3*(frill-1)), fx=n(21*frill);
    s+=e(42,68,n(27*size),18,main);
    s+=p(`M${x} 48l${n(14-frill*9)} -${n(27*frill)} 30 17-7 23-25 3Z`,"#C2B9A4",line,4);
    s+=p(`M65 62 94 68 77 81 63 79Z`,main);
    s+=p("M24 74v17m26-17v17","none",line,7);
    if(v.boss)s+=e(81,47,11,7,"#C1C5AE",line,3);
    if(v.horns){for(let i=0;i<v.horns;i++)s+=p(`M${66+i*8} ${45+i*3}l${-4+i*3} -${15-(i%2)*3} 8 13`,pale,"#9C9992",3);}
    if(v.spikes){for(let i=0;i<v.spikes;i++){let xx=n(51+i*6);s+=p(`M${xx} ${n(30-4*Math.sin(i))}l-3-12 9 10`,pale,"#A09089",2);}}
    if(v.quills)s+=p("M23 53 15 31m12 21-7-26m16 25-4-28", "none","#88958B",4);
    s+=c(79,61,2.5,"#455A60")+p("M8 92h84","none","#C9C0AC",3);
  }else if(kind==="hadrosaur"){
    s+=p("M22 66 Q13 54 5 46l14 30 14 4Z",main);
    s+=e(43,66,n(21*(v.scale||1)),13,main);
    s+=p("M55 62 62 35q5-8 17-4l7 12-7 16-17 6Z",main);
    s+=p("M78 49 94 51 84 61 75 55Z",light,line,3);
    s+=p("M34 73l-7 18h10l5-15m12-3-2 18h11l-2-17",main,line,5);
    if(v.crest==="long")s+=p("M66 33Q46 3 25 12q25 1 42 28Z","#C7A8A3","#8A8A8A",3);
    if(v.crest==="helmet")s+=p("M61 32Q64 8 83 17l-7 21Z","#CAB6A5","#9B8E87",3);
    if(v.crest==="forked")s+=p("M64 34 61 10l10 10 9-8-4 24Z","#D4B9B9","#998B97",3);
    if(v.crest==="soft")s+=p("M65 35q6-17 13-7l-4 8",light,line,2);
    if(v.nest)s+=p("M7 90q15-12 28 0h32q14-12 26 0M21 86q7-10 15 0", "none","#BFAD91",4);
    if(v.thumb)s+=p("M61 63l7 6 0-13m-7 7-8 6", "none","#D4C2A6",3);
    s+=c(79,40,2.5,"#4F6269")+p("M8 93h84","none","#BAC3AB",3);
  }else if(kind==="armored"){
    s+=p("M13 74q7-27 37-28 30 1 36 28L74 85H24Z",main);
    s+=p("M24 78v14m21-13v13m23-13v13", "none",line,7);
    if(v.armor==="plates"){for(let i=0;i<5;i++){const x=20+i*12;s+=p(`M${x} 51l6-${n(14+(i%3)*6)} 8 ${n(14+(i%3)*6)}Z`,"#C5B8A7","#918F8B",3);}}
    else {for(let i=0;i<9;i++)s+=e(22+(i%5)*13,53+Math.floor(i/5)*12,5,4,"#C7BBA7","#8E9C88",2);}
    if(v.spikes){for(let i=0;i<v.spikes;i++)s+=p(`M${21+i*14} 56l-4-12 10 10`,light,line,3);}
    if(v.tail==="club")s+=p("M75 71 92 59 96 72 84 81Z","#A79F90",line,4);
    else if(v.tail==="spike")s+=p("M80 72 95 54m-9 23 13-6m-11 10 8 5", "none","#AC9C87",5);
    else s+=p("M78 74 94 68 90 81Z",main);
    s+=c(80,64,3,"#44595C")+p("M10 93h80","none","#C7C5B4",3);
  }else if(kind==="dome"){
    s+=e(42,68,28,15,main)+p("M60 58q1-39 19-36 17 5 11 38l-19 17Z",main);
    s+=p("M62 41q6-22 20-19m-52 51-3 18m27-18 2 18", "none","#D5C4B5",6);
    for(let i=0;i<4;i++)s+=p(`M${68+i*5} ${29+i*3}l-1-8 7 6`,pale,line,2);
    s+=c(83,53,3,"#495E69")+p("M8 92h84","none","#C6BDB2",3);
  }else if(kind==="pterosaur"){
    const span=v.span||1, beak=v.beak||1, dx=n(42*span);
    s+=p(`M50 49  ${n(50-dx)} 17  ${n(44-dx)} 38 24 49 50 62Z`,main);
    s+=p(`M50 49 ${n(50+dx)} 17 ${n(56+dx)} 38 76 49 50 62Z`,main);
    s+=p("M19 40 50 55 81 40m-21 9 13-15m-33 15-13-15", "none",light,3);
    s+=p(`M47 50q-7-19 6-26l${n(15*beak)}-5 ${n(-4*beak)} 10-15 7 9 22-11 6Z`,"#D1C0B3",line,3);
    if(v.crest==="back")s+=p("M47 30 20 7l35 14Z",pale,line,3);
    if(v.crest==="tall")s+=p("M45 30 48 2q21 8 11 30Z","#CCA7AA",line,3);
    if(v.tail==="diamond")s+=p("M49 61l-4 23 7 9 6-9-7-23",light,line,3);
    if(v.teeth)s+=p("m68 33 4 5 3-6 4 5", "none","#E7E3DA",2);
    s+=p("M46 68 39 88m17-20 9 20","none",line,4)+c(61,28,2.5,"#415969")+p("M7 92h86","none","#C5C3B4",3);
  }else if(kind==="marine"){
    const type=v.type||"mosasaur",jaw=v.jaw||1,neck=v.neck||1;
    if(type==="plesio"){
      const h=n(36-11*(neck-1));
      s+=e(42,65,24,14,main);
      s+=p(`M54 58Q64 41 68 ${h}l18-3 6 8-20 7-6 40Z`,main);
      s+=p("M29 74 13 90l27-13m20-3 20 15-6-24M19 60 5 48m70-5 15 6",main,line,4);
      s+=c(80,h+4,2.5,"#49636B");
    }else if(type==="ichthyo"){
      s+=p("M13 55q26-27 59-14l14-16 4 23-3 24-18-12q-29 20-56-5Z",main);
      s+=p("M43 42 53 22l10 21m-18 21-15 21 30-13" ,light,line,3)+c(73,43,n(5*(v.eye||1)),"#496371")+c(73,43,2,"#D8E7E8");
    }else if(type==="nothosaur"){
      s+=e(37,62,21,11,main)+p("M50 55 62 38 85 34 91 43 78 51 61 64Z",main);
      s+=p("M24 62 6 52m23 19-12 17m36-19 15 18m-5-30 10-19", "none",line,6)+c(82,41,2.5,"#526C6F");
    }else{
      s+=p(`M9 53q20-21 48-17l${n(20*jaw)} 5 12 11-${n(20*jaw)} 11q-31 18-60-10Z`,main);
      s+=p("M32 59 17 86l29-17m11-7 20 23-12-25" ,light,line,3);
      if(type==="pliosaur")s+=p(`M68 48l${n(18*jaw)} 1-16 10Z`,light,line,3);
      if(type==="mosasaur")s+=p("M20 41 14 26l16 17",light,line,3);
      s+=c(77,42,2.8,"#49646B");
    }
    s+=p("M7 83q15-9 29 0 17-10 29 0 14-9 28 0","none","#A6D0D5",5)+p("M9 93h83","none","#C7D9D8",3);
  }else if(kind==="mammal"){
    const type=v.type;const fur=!!v.fur;
    if(type==="mammoth"||type==="mastodon"){
      s+=e(45,59,n(28*(v.body||1)),23,main);
      s+=p("M52 37q23-17 34 8l-3 29q-1 13-12 11l-7-11 8-11-6-11Z",main);
      s+=p("M30 70v21m19-21v21m21-20v20", "none",line,8);
      s+=p("M76 49q24-9 16 14-4 11-15 9M64 49q-24-10-17 12 4 12 17 11", "none",pale,5);
      s+=c(82,43,3,"#4D5A68");if(fur)for(let i=0;i<6;i++)s+=p(`M${22+i*9} 40l-3-7 8 5`,light,line,2);
    }else if(type==="cat"||type==="wolf"||type==="bear"){
      s+=e(43,63,n(26*(v.body||1)),17,main);
      s+=p("M60 55q10-25 22-17l13 17-7 18-25-4Z",main);
      s+=p("M67 42 66 26l12 14m8 1 6-17 4 23",main,line,3);
      s+=p("M30 73v18m16-18v18m24-19v19m-50-26-12-17", "none",line,6);
      if(type==="cat")s+=p("M76 66l5 18 5-17m-1-9 9 7",pale,line,3);
      if(fur)for(let i=0;i<5;i++)s+=p(`M${22+i*10} 50l-4-7 8 5`,light,line,2);
      s+=c(84,48,3,"#4B6065");
    }else if(type==="rhino"){
      s+=e(45,64,n(29*(v.body||1)),20,main)+p("M59 47 82 42 93 64 80 76 58 70Z",main);
      s+=p("M72 46 84 19 88 47m-1 4 9-11-2 18",pale,line,4);
      s+=p("M28 79v13m21-12v12m24-13v13", "none",line,8)+c(83,55,3,"#566574");
      if(fur)for(let i=0;i<6;i++)s+=p(`M${19+i*10} 50l-3-5 7 5`,light,line,2);
    }else if(type==="sloth"){
      s+=e(53,60,21,31,main)+p("M43 40q-3-22 17-23 22 7 12 28l-13 13Z",main);
      s+=p("M38 54 16 65l1 19m3-3-9 9m8-9 4 12m45-42 20 12-2 20m1-4 7 11m-8-9-4 11", "none",line,6);
      s+=c(62,34,3,"#50636B")+p("M45 79v14m18-14v14","none",line,6);
    }else if(type==="elk"){
      s+=e(43,64,23,14,main)+p("M60 57 65 35 76 33 86 47 76 60Z",main);
      s+=p("M70 36 61 10m8 16-14-7m14 9 11-17m-5 22 18-17m-13 16 13-6" ,"none","#BCA88B",5);
      s+=p("M29 72v20m18-20v20m18-20v20m-47-33-12-10","none",line,5)+c(78,42,2.5,"#445965");
    }else if(type==="glyptodon"){
      s+=e(45,65,n(29*(v.body||1)),23,main)+p("M18 64q25-41 57 0", "none",line,4);
      for(let i=0;i<4;i++)for(let j=0;j<2;j++)s+=e(27+i*12,57+j*13,4,4,"#C8BBA4","#8D968E",1.8);
      s+=p("M30 83v10m29-10v10M73 73l20 8-7 8",main,line,5)+c(78,71,2,"#576A6C");
    }else if(type==="bird"){
      s+=e(43,60,19,21,main)+p("M51 56 62 22 79 15 89 31 80 44 62 47Z",main);
      s+=p("M83 28 98 40 80 40Z",pale,line,3)+p("M34 78 26 94m26-16 6 16", "none",line,7);
      s+=p("M22 57 7 35l24 9" ,main,line,3)+c(80,27,3,"#53626A");
    }
    s+=p("M9 94h83","none","#C0BBA9",3);
  }else if(kind==="ancient"){
    const type=v.type;
    if(type==="trilobite"){
      s+=e(49,54,24,34,main)+p("M49 20v68", "none",line,4);
      for(let i=0;i<7;i++){let y=29+i*8;s+=p(`M28 ${y}h42`, "none","#CFCCC0",3);}
      s+=p("M29 35 13 24m54 11 16-11M29 75 13 88m54-13 16 13","none",line,3);
    }else if(type==="ammonite"){
      s+=c(50,51,34,main,line,4)+p("M50 17Q83 25 79 54 76 83 45 80 20 75 24 49 30 26 53 30 70 35 64 57 58 68 46 62 39 55 47 47q10-6 13 5", "none","#E5D9C2",5);
      for(let i=0;i<9;i++){let angle=i*.62,xx=Math.round(50+30*Math.cos(angle)),yy=Math.round(51+30*Math.sin(angle));s+=p(`M${xx} ${yy}l-5 4`, "none","#A58D86",2);}
    }else if(type==="anomalocaris"){
      s+=p("M17 49q32-27 56 6l11 5-16 7-32-1Z",main);
      for(let i=0;i<7;i++){let x=22+i*8;s+=p(`M${x} ${47-i%2*2}l-4-13 13 5`,light,line,2.5);}
      s+=p("M71 52q9-25 20-11m-18 17q9 21 21 7","none",line,4)+c(76,44,3,"#50666F");
    }else if(type==="armoredfish"){
      s+=p("M11 54q22-27 52-17l20-14 10 26-12 24-22-5Q31 82 11 54Z",main);
      s+=p("M58 36 82 38 91 50 69 55 58 48Z","#A4BFC7",line,3)+p("M53 37 48 17 64 34M32 67 18 86",light,line,3)+c(75,43,3,"#48616D");
    }else if(type==="shark"){
      s+=p("M9 54q27-21 52-15l24-13 9 26-11 24-25-16Q32 79 9 54Z",main);
      s+=p("M41 44 49 18 62 42M35 62 27 83 54 67" ,light,line,3)+p("M70 57l15-2-14 10-15-8",pale,line,3)+c(75,43,3,"#496977");
    }else if(type==="dragonfly"){
      s+=p("M47 26 22 8Q4 8 13 29l28 17M53 26 78 8q18 0 9 21L59 46",light,line,3);
      s+=p("M47 49 13 51q-18 9-5 23 18 4 38-19m8-6 33 2q18 9 5 23-18 4-37-19", "#C4DBD5",line,3);
      s+=e(50,46,5,23,main)+p("M50 63 45 88l10-2Z",main,line,2)+c(46,22,3,"#536B72")+c(54,22,3,"#536B72");
    }else if(type==="cycad"){
      s+=p("M44 89 39 34 59 34 56 89Z","#B49B7E",line,3);
      for(let i=0;i<8;i++){let angle=(i/8)*Math.PI*2,x=Math.round(50+36*Math.cos(angle)),y=Math.round(33+24*Math.sin(angle));s+=p(`M50 35 Q${Math.round((50+x)/2)} ${Math.round(y-13)} ${x} ${y}`, "none","#7CA58B",7);}
      s+=c(50,32,8,"#A7BD93")+p("M9 92h82","none","#C5BAA6",3);
    }
    s+=p("M9 94h82","none","#C6C3B2",3);
  }else throw Error("Unknown anatomy "+kind+" "+name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g stroke-linejoin="round" stroke-linecap="round"><ellipse cx="50" cy="96" rx="36" ry="2" fill="#88979B" opacity=".13"/>${s}</g></svg>`;
};
