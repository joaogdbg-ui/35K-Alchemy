from pathlib import Path
from playwright.sync_api import sync_playwright
html=Path('/mnt/data/35K_Alchemy_V29_2_Offline.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.evaluate('''() => {let m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}})}''')
 page.set_content(html,wait_until='domcontentloaded')
 page.evaluate("() => {unlocked.add('legacy:118');unlocked.add('legacy:22');playVirtual.refresh()}")
 page.locator('.element-chip[data-id="legacy:118"]').click()
 page.locator('.element-chip[data-id="legacy:22"]').click()
 page.wait_for_function("() => document.querySelector('#modalContent')?.textContent?.includes('Sword')",timeout=10000)
 assert page.locator('#modalContent').inner_text().find('Sword')>=0
 assert page.evaluate("unlocked.has('legacy:545')")
 assert not errors,errors
 print('PASS English discovery: Hero + Metal → Sword (legacy:545), no errors')
 page.close()
 # Check old-format progress retained by unchanged legacy IDs.
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 page.evaluate('''() => {let m={'gameverse_alchemy_v2':JSON.stringify({v:2,u:[0,1,2,3,545],r:[],recent:[545],last:545})};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}})}''')
 page.set_content(html,wait_until='domcontentloaded')
 assert page.evaluate("unlocked.has('legacy:545')")
 assert page.evaluate("byId.get('legacy:545').name")=='Sword'
 print('PASS legacy save: preexisting legacy:545 unlocked and shows English name Sword')
 b.close()
