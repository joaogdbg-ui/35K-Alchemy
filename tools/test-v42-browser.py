"""V42 live Chromium: unlock 13 recipes, resolve custom SVGs, test dark theme and 4 screen sizes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
html=(R/'35K_Alchemy_V42_Offline.html').read_text(encoding='utf-8')
cases=[('Cave','Water','Stalactite'),('Stalactite','Earth','Stalagmite'),('Stone','Crystal','Geode'),('Lava','Glass','Obsidian'),('Marsh','Sea','Salt Marsh'),('Forest','Sea','Mangrove'),('Frog','Pond','Tadpole'),('Pastry','Butter','Croissant'),('Flour','Milk','Pancake'),('Pancake','Tool','Waffle'),('Camera','Glass','Lens'),('Crystal','Light','Prism'),('Camera','Light','Photograph')]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda error: errors.append(str(error)))
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3766,page.evaluate('ITEMS.length')
  assert page.evaluate('recipes.size')==9414
  assert page.evaluate('Object.keys(ORGANIC_ART_V42).length')==64
  for a,b,name in cases:
   ida,idb,out=page.evaluate('names => names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,name]); assert ida and idb and out,(a,b,name)
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ida,idb])==out,name
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ida,idb])
   page.wait_for_function('id=>unlocked.has(id)',arg=out,timeout=3500)
   assert page.locator('#modalContent .modal-art svg').count()>0,name
   assert page.evaluate('id=>staticArt(byId.get(id))===ORGANIC_ART_V42[byId.get(id).name.toLowerCase()]',out),name
   page.locator('#modalClose').click()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
  page.locator('#settingsBtn').click()
  page.locator('[data-theme-choice="dark"]').click()
  assert page.evaluate('document.documentElement.dataset.theme')=='dark'
  page.locator('#modalClose').click()
  if width==390 and height==820:
   page.screenshot(path=str(R/'V42_dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(R/'V42_light_390.png'))
  # Browser-only variant must not pretend to issue rewarded hints.
  assert page.locator('#compassBtn').count()==1
  assert not errors,errors
  print('PASS',width,height,'13 actual crafts, art parity, theme, responsive fit, no page errors')
  page.close()
 browser.close()
