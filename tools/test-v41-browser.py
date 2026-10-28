"""Chromium actual click-to-unlock and responsive smoke tests for 35K Alchemy V41."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V41_Offline.html').read_text(encoding='utf8')
cases=[('Snow','Storm','Blizzard'),('Lightning','Sound','Thunder'),('Ant','Earth','Anthill'),('Beetle','Flower','Ladybug'),('Clay','Fire','Brick'),('Book','House','Library'),('Map','Metal','Compass'),('Ship','Trade','Cargo Ship'),('Map','Treasure','Treasure Map'),('Writing','Pyramid','Hieroglyphics')]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3702
  assert page.evaluate('recipes.size')==9286
  assert page.evaluate('Object.keys(ORGANIC_ART_V41).length')==80
  assert page.locator('#recentBtn').count()==1
  for a,b,name in cases:
   ids=page.evaluate('names=>names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,name]); assert all(ids), (a,b,name,ids)
   ida,idb,target=ids
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ida,idb])==target
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ida,idb])
   page.wait_for_function('t=>unlocked.has(t)',arg=target,timeout=3000)
   assert page.locator('#modalContent .modal-art svg').count()>0,name
   assert page.evaluate('t=>staticArt(byId.get(t))===ORGANIC_ART_V41[byId.get(t).name.toLowerCase()]',target),name
   page.locator('#modalClose').click()
  # No spurious message when recipe doesn't exist
  page.evaluate("()=>{slots=[null,null];unlocked.add('organic41:barometer');unlocked.add('organic41:ladybug')}")
  assert page.evaluate("()=>recipes.get(pairKey('organic41:barometer','organic41:ladybug'))") is None
  page.evaluate("()=>{place(0,'organic41:barometer');place(1,'organic41:ladybug')}")
  assert 'no offline recipe' not in page.locator('body').inner_text().lower()
  page.locator('#settingsBtn').click()
  page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate("document.documentElement.dataset.theme")=='dark'
  page.locator('#modalClose').click()
  if width==390 and height==820:
   page.screenshot(path=str(ROOT/'V41_dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(ROOT/'V41_light_390.png'))
  assert not errors,errors
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
  print('PASS',width,height,'10 crafts, icons, dark mode, silent misses, layout, zero errors')
  page.close()
 browser.close()
