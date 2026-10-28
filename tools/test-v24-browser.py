from pathlib import Path
from playwright.sync_api import sync_playwright
HTML=Path('/mnt/data/35K_Alchemy_V24_Offline.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in ((360,780),(390,844),(1280,900)):
  page=browser.new_page(viewport={'width':width,'height':height},has_touch=width<800,is_mobile=width<800)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {const store={'gameverse_alchemy_v2':JSON.stringify({v:2,u:[0,1,2,3,977,347],r:[],recent:[],last:null})}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},clear:()=>{for(const k of Object.keys(store))delete store[k]}}});}''')
  page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(250)
  assert page.title()=='35K Alchemy — V24 Offline'
  assert '35K' in page.locator('.brand').inner_text()
  assert page.locator('.tab').count()==2
  page.locator('.element-chip[data-id="legacy:977"]').click()
  page.locator('.element-chip[data-id="legacy:347"]').click()
  page.wait_for_timeout(650)
  assert page.locator('#latestName').inner_text()=='Silent Hill 3',page.locator('#latestName').inner_text()
  assert 'NEW DISCOVERY' in page.locator('#modal').inner_text()
  d=page.evaluate('''() => JSON.parse(localStorage.getItem('gameverse_dynamic_v11')||'{}')''')
  assert 'gaming24:silenthill3' in d['unlocked']
  page.screenshot(path=f'/mnt/data/35K_Alchemy_V24_Discovery_{width}.png')
  page.locator('#modalClose').click()
  page.locator('.tab[data-view="World"]').click()
  page.wait_for_timeout(150)
  text=page.locator('#catalogTargetProgress').inner_text()
  assert '35,000 planned' in text,text
  assert '3,154' in text,text
  assert page.locator('.family-card').count()==9
  page.locator('.family-card[data-family="games"]').click()
  page.locator('#discoverSearch').fill('Silent Hill 3')
  page.wait_for_timeout(250)
  assert any('Silent Hill 2' in x and 'Sequel' in x for x in page.locator('.discover-entry.found').all_inner_texts())
  assert not errors,errors
  page.screenshot(path=f'/mnt/data/35K_Alchemy_V24_Discoveries_{width}.png')
  print('PASS',width,'35000 target honest','Silent Hill 3 recipe persisted','js errors',len(errors))
  page.close()
 browser.close()
