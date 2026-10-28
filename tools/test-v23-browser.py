from pathlib import Path
from playwright.sync_api import sync_playwright
HTML=Path('/mnt/data/Gameverse_Infinite_V23_Offline.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in ((360,780),(390,844),(1280,900)):
  pg=browser.new_page(viewport={'width':width,'height':height},has_touch=width<800,is_mobile=width<800)
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.evaluate('''() => {const store={'gameverse_alchemy_v2':JSON.stringify({v:2,u:[0,1,2,3,1514,409],r:[],recent:[],last:null})}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},clear:()=>{for(const k of Object.keys(store))delete store[k]}}});}''')
  pg.set_content(HTML,wait_until='domcontentloaded')
  pg.wait_for_timeout(270)
  assert pg.locator('.tab').count()==2
  pg.locator('.element-chip[data-id="legacy:1514"]').click()
  pg.locator('.element-chip[data-id="legacy:409"]').click()
  pg.wait_for_timeout(560)
  result=pg.locator('#latestName').inner_text()
  assert result=='Mario Tennis Aces',(width,result)
  assert 'NEW DISCOVERY' in pg.locator('#modal').inner_text()
  x=pg.evaluate('''() => JSON.parse(localStorage.getItem('gameverse_dynamic_v11')||'{}')''')
  assert 'gaming23:mariotennisaces' in x.get('unlocked',[]),(width,x.get('unlocked',[])[:10])
  pg.screenshot(path=f'/mnt/data/Gameverse_Infinite_V23_Discovery_{width}.png')
  pg.locator('#modalClose').click()
  pg.locator('.tab[data-view="World"]').click()
  pg.locator('.family-card[data-family="games"]').click()
  pg.locator('#discoverSearch').fill('Mario Tennis Aces')
  pg.wait_for_timeout(160)
  found=pg.locator('.discover-entry.found').all_inner_texts()
  assert any('Mario Tennis' in txt and 'Nintendo Switch' in txt for txt in found),(width,found)
  # Static icon direct-data is present for the new release and loaded.
  asset=pg.locator('.discover-entry.found img.gameverse-art').first
  assert asset.count()>0
  ok=asset.evaluate('(img)=>img.complete && img.naturalWidth>0')
  assert ok,(width,'icon failed')
  assert not errors,(width,errors)
  pg.screenshot(path=f'/mnt/data/Gameverse_Infinite_V23_Discoveries_{width}.png')
  print('PASS',width,result,'art_loaded',ok,'rows',found[:1],'stored_progress',True)
  pg.close()
 browser.close()
