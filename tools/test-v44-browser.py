"""V44 Chromium integration: actual recipes, icons, silent no-hit, themes and mobile dimensions."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V44_Offline.html').read_text(encoding='utf8')
cases=[('Air','Toy','Balloon'),('Fire','Stone','Campfire'),('Sand','Castle','Sandcastle'),
 ('Wind','Glass','Wind Chime'),('Wood','River','Driftwood'),('Rain','Thermometer','Rain Gauge'),
 ('Storm','Copper','Lightning Rod'),('Water','Charcoal','Water Filter'),('Bird','Music','Birdsong'),
 ('Balloon','Heat','Hot Air Balloon'),('Clay','Sun','Terracotta'),('Smoke','Language','Smoke Signal'),
 ('Wind','Compass','Weather Vane'),('Fire','Wood','Coal')]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3791
  assert page.evaluate('recipes.size')==11111
  assert page.evaluate('Object.keys(ORGANIC_ART_V44).length')==13
  for a,b,result in cases:
   ia,ib,ic=page.evaluate('names=>names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,result]);assert ia and ib and ic,(a,b,result)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ia,ib])==ic,(a,b,result)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(b,a))',[ia,ib])==ic,(b,a,result)
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ia,ib])
   page.wait_for_function('id=>unlocked.has(id)',arg=ic,timeout=5000)
   if ic.startswith('organic44:'):
    assert page.evaluate('id=>staticArt(byId.get(id))===ORGANIC_ART_V44[byId.get(id).name.toLowerCase()]',ic)
   if page.locator('#modal').is_visible():page.locator('#modalClose').click()
  ia,ib=page.evaluate("['Smoke','Sequel'].map(n=>ITEMS.find(i=>i.name===n).id)")
  assert not page.evaluate('([a,b])=>recipes.has(pairKey(a,b))',[ia,ib])
  page.evaluate('([a,b])=>{place(0,a);place(1,b)}',[ia,ib]);page.wait_for_timeout(100)
  assert page.locator('#toast').is_hidden()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  page.locator('#settingsBtn').click();page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='dark';page.locator('#modalClose').click()
  if width==390 and height==820:
   page.screenshot(path=str(ROOT/'V44_dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(ROOT/'V44_light_390.png'))
  assert not errors,errors
  print('PASS',width,height,':',len(cases),'actual crafts, all custom art, no overwrite, silent missing, dark/light, no JS errors')
  page.close()
 browser.close()
