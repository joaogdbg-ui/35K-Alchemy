from pathlib import Path
from playwright.sync_api import sync_playwright
html=Path('/mnt/data/Gameverse_Infinite_V22_Offline.html').read_text()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in ((360,780),(390,844),(1280,900)):
  pg=browser.new_page(viewport={'width':width,'height':height},has_touch=width<800,is_mobile=width<800)
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  # Stub localStorage on about:blank, where the restricted browser disallows origin storage.
  pg.evaluate('''() => {const state={'gameverse_alchemy_v2':JSON.stringify({v:2,u:[0,1,2,3,164,398],r:[],recent:[],last:null})}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>state[k]??null,setItem:(k,v)=>{state[k]=String(v);},removeItem:k=>{delete state[k];},clear:()=>{for(const k of Object.keys(state))delete state[k];}}});}''')
  pg.set_content(html,wait_until='domcontentloaded')
  pg.wait_for_timeout(250)
  assert pg.locator('.tab').count()==2
  print('opened',width,'errors',errors)
  pg.locator('.element-chip[data-id="legacy:164"]').click()
  pg.locator('.element-chip[data-id="legacy:398"]').click()
  pg.wait_for_timeout(420)
  result=pg.locator('#latestName').inner_text()
  print('new game',width,result)
  assert result=='Mega Man 2',result
  assert not pg.locator('#modal').is_hidden()
  assert 'NEW DISCOVERY' in pg.locator('#modal').inner_text()
  pg.locator('#modalClose').click()
  pg.locator('.tab[data-view="World"]').click()
  pg.locator('.family-card[data-family="games"]').click()
  pg.locator('#discoverSearch').fill('Mega Man 2')
  pg.wait_for_timeout(150)
  rows=pg.locator('.discover-entry.found').all_inner_texts()
  print('discovery row',rows)
  assert any('Game + NES' in s or 'NES + Game' in s for s in rows),rows
  d=pg.evaluate('''() => JSON.parse(localStorage.getItem('gameverse_dynamic_v11')||'{}')''')
  assert 'gaming22:megaman2' in d.get('unlocked',[]),d
  assert not errors,errors
  pg.screenshot(path=f'/mnt/data/Gameverse_Infinite_V22_Discoveries_{width}.png')
  pg.close()
 browser.close()
print('All mobile/desktop smoke tests PASS')
