from pathlib import Path
from playwright.sync_api import sync_playwright
import time
HTML=(Path(__file__).resolve().parents[1]/'35K_Alchemy_V29_Offline.html').read_text('utf8')
with sync_playwright() as ap:
 browser=ap.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(360,780),(390,844),(1280,900)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<800,has_touch=w<800)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {const m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k],clear:()=>{}}});window.__store=m;}''')
  page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(250)
  assert page.title()=='35K Alchemy — V29 Offline'
  page.locator('.element-chip[data-id="legacy:1"]').click()
  page.locator('#lockLeft').click()
  page.locator('#batchOpen').click()
  assert page.locator('.batch-family-choice').count()==9
  assert page.locator('.batch-family-picture img').count()>=8
  assert page.locator('#batchFamily').count()==0
  page.locator('.batch-family-choice[data-batch-family="nature"]').click()
  assert page.locator('.batch-family-choice[data-batch-family="nature"]').get_attribute('aria-pressed')=='true'
  page.screenshot(path=str(Path(__file__).resolve().parents[1]/f'35K_Alchemy_V29_Batch_Picker_{w}.png'))
  page.locator('#batchDemo').click()
  page.locator('#modal').wait_for(state='visible')
  # Progress or result, depending on device speed.
  page.wait_for_function("() => document.querySelector('.modal-tag')?.textContent.includes('NEW DISCOVERY')",timeout=10000)
  assert 'NEW DISCOVERY' in page.locator('.modal-tag').inner_text()
  assert page.locator('#modal').get_attribute('data-dismiss')=='x-only'
  first=page.locator('#modal h2').inner_text()
  page.locator('#modal').click(position={'x':3,'y':4})
  assert page.locator('#modal h2').inner_text()==first
  page.locator('#batchViewAll').click()
  count=page.locator('.batch-discovery-row').count()
  assert count>=2,count
  page.locator('#batchBackOne').click()
  assert page.locator('#modal h2').inner_text()==first
  for i in range(count):
   page.locator('#modalClose').click()
  assert 'BATCH COMPLETE' in page.locator('.modal-tag').inner_text()
  page.locator('#modalClose').click()
  assert page.locator('#modal').is_hidden()
  assert not errors, errors
  print('PASS',w,'family cards, batch review',count,'results, no JS errors')
  page.close()
 # 10k unlocked ingredients: no artificial per-element timers.
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.evaluate('''() => {const m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k],clear:()=>{}}});window.__store=m;}''')
 page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(130)
 inject=page.evaluate('''() => {
  const first=unlocked.size;
  for(let i=0;i<10000;i++){let id='bench:'+i;byId.set(id,{id,name:'Unique test ingredient '+i,category:'nature'});unlocked.add(id);}
  for(let i=0;i<110;i++){let id='bench-result:'+i;byId.set(id,{id,name:'Test reward '+i,category:'fantasy'});recipes.set(pairKey('legacy:1','bench:'+i),id);}
  return {first,now:unlocked.size};
 }''')
 page.locator('.element-chip[data-id="legacy:1"]').click();page.locator('#lockLeft').click();page.locator('#batchOpen').click()
 page.locator('.batch-family-choice[data-batch-family="nature"]').click()
 count=page.locator('#batchEstimate').inner_text(); assert '10,0' in count,count
 start=time.monotonic();page.locator('#batchDemo').click()
 page.wait_for_function("() => document.querySelector('.modal-tag')?.textContent.includes('NEW DISCOVERY')",timeout=15000)
 elapsed=time.monotonic()-start
 # Discoveries with 100+ results: render only a short visible window.
 page.locator('#batchViewAll').click()
 assert page.locator('.batch-discovery-list.is-virtual').is_visible()
 n=page.locator('.batch-discovery-row').count();assert 10<=n<=24,n
 assert page.locator('.batch-list-spacer').evaluate('(el)=>el.getBoundingClientRect().height')>=110*70
 page.locator('.batch-discovery-list').evaluate('(e)=>e.scrollTop=5000');page.wait_for_timeout(130)
 assert page.locator('.batch-discovery-row').count()<=24
 assert not errors,errors
 page.screenshot(path=str(Path(__file__).resolve().parents[1]/'35K_Alchemy_V29_Batch_10000.png'))
 print('BENCH PASS:',inject,'duration',round(elapsed,3),'s for ~10000 ingredients; virtual results',n,'JS errors',len(errors))
 browser.close()
