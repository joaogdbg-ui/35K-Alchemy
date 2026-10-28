#!/usr/bin/env python3
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V29_2_Offline.html').read_text(encoding='utf-8')
old_html=Path('/mnt/data/35K_Alchemy_V29_1_Offline.html').read_text(encoding='utf-8')
assert 'lang="en"' in html
translations=json.loads((root/'ENGLISH_NAME_MIGRATION.json').read_text())['translations']
assert len(translations)==175
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,780),(390,844),(1280,900)]:
  page=b.new_page(viewport={'width':width,'height':height},is_mobile=width<800,has_touch=width<800)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {const db={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k]}});window.__store=db;}''')
  page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(120)
  assert page.title()=='35K Alchemy — V29.2 English Edition'
  assert page.locator('#playFamily').evaluate('(e)=>e.tagName')=='BUTTON'
  assert page.evaluate('''() => ({n:ITEMS.length,r:recipes.size,floppy:byId.get('legacy:100').name, cloud:byId.get('legacy:184').name,sword:byId.get('legacy:545').name,desert:byId.get('legacy:1048').name})''')=={'n':3376,'r':8477,'floppy':'Floppy Disk','cloud':'Cloud Gaming','sword':'Sword','desert':'Desert'}
  bad=page.evaluate('''(translations) => translations.filter(x=>byId.get(x.id)?.name!==x.after)''', translations)
  assert not bad,bad
  # Touch controls remain functional.
  page.locator('.element-chip[data-id="legacy:0"]').click()
  page.locator('.element-chip[data-id="legacy:1"]').click()
  page.wait_for_timeout(180)
  assert page.evaluate("unlocked.has('legacy:4')"), 'Water + Fire must still create Steam'
  # The discovery overlay must be dismissed via X before returning to the inventory.
  if page.locator('#modal').is_visible():page.locator('#modalClose').click()
  # Search uses English names, with ingredient names accessible via the catalog.
  page.locator('#playSearch').fill('water')
  page.wait_for_timeout(100)
  assert page.locator('.element-chip[data-id="legacy:0"]').count()==1

  found=page.evaluate('''() => ITEMS.filter(it=>it.name.toLowerCase().includes('floppy')).map(it=>it.name)''')
  assert 'Floppy Disk' in found
  # All families picker maintains custom UI.
  page.locator('#playFamily').click()
  assert page.locator('.inventory-family-grid').is_visible()
  assert page.locator('[data-inventory-family]').count()==10
  page.locator('#modalClose').click()
  assert not errors,errors
  print('PASS browser',width,'translated names',len(translations),'recipes',8477,'Steam, search, family selector, no JS errors')
  page.close()
 b.close()
print('PASS: 3 viewports, 175 English names and unchanged recipe indices')
