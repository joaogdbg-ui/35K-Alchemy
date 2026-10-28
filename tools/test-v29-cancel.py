from pathlib import Path
from playwright.sync_api import sync_playwright
text=Path('/mnt/data/35K_Alchemy_V29_Offline.html').read_text('utf8')
with sync_playwright() as a:
 b=a.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 p=b.new_page(viewport={'width':390,'height':844})
 errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
 p.evaluate('''() => {let m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}});window.__store=m;}''')
 p.set_content(text,wait_until='domcontentloaded');p.wait_for_timeout(120)
 x=p.evaluate('''() => {
 slots[0]='legacy:1';leftLocked=true;updateSlotUI();
 for(let i=0;i<10000;i++){let id='stress:'+i;byId.set(id,{id,name:'Test item '+i,category:'nature'});unlocked.add(id);}
 let candidate='stress-result:0';byId.set(candidate,{id:candidate,name:'New Test Result',category:'fantasy'});
 recipes.set(pairKey('legacy:1','stress:0'),candidate);
 const usedBefore=batchTrialUsed;
 const start=beginBatch('nature','trial');
 const scanning=batchState?.phase==='scanning';
 closeModal();
 return {start,scanning,usedBefore,usedAfter:batchTrialUsed,unlockedResult:unlocked.has(candidate),state:batchState};
 }''')
 assert x['start'] and x['scanning']
 assert not x['usedBefore'] and not x['usedAfter'] and not x['unlockedResult'] and x['state'] is None,x
 p.wait_for_timeout(100)
 assert p.locator('#modal').is_hidden()
 assert not errs,errs
 print('PASS cancelled 10k scan without partial discovery or consuming trial')
 b.close()
