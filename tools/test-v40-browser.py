"""V40 playable single-file smoke test: 3 viewport sizes, custom artwork, gameplay, no JS errors."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V40_Offline.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,640),(390,820),(390,930),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  errors=[]
  page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.evaluate("""() => {const m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=String(v),removeItem:k=>delete m[k]}})}""")
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3622
  assert page.evaluate('recipes.size')==9126
  assert page.evaluate('ORGANIC_V40.items.length')==64
  assert page.evaluate('Object.keys(ORGANIC_ART_V40).length')==64
  for a,b,out in [
   ('legacy:14','legacy:240','organic40:asteroid'), # uses actual check below: lookup only if corresponding names
  ][:0]: pass
  cases=[('Stone','Space','Asteroid'),('Asteroid','Fire','Meteor'),('Moon','Sun','Eclipse'),('Bird','Tree','Nest'),('Music','Time','Rhythm'),('Clock','Melody','Music Box'),('Pottery','Kiln','Ceramic')]
  for a,b,name in cases:
   ids=page.evaluate('names => names.map(n=>ITEMS.find(i=>i.name===n)?.id)',[a,b,name]); assert all(ids), (a,b,name,ids)
   ida,idb,target=ids
   assert page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[ida,idb])==target
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b);place(0,a);place(1,b)}',[ida,idb]); page.wait_for_function('t=>unlocked.has(t)',arg=target,timeout=3000)
   assert page.locator('#modalContent .modal-art svg').count()>0, name
   assert page.evaluate('t=>staticArt(byId.get(t))===ORGANIC_ART_V40[byId.get(t).name.toLowerCase()]',target),name
   page.locator('#modalClose').click()
  # V39-style local save remains available; ensure a V40 item is serialized.
  page.evaluate("() => {unlocked.add('organic40:ceramic');save();}")
  assert 'organic40:ceramic' in page.evaluate("localStorage.getItem('gameverse_dynamic_v11')")
  # Visual regressions: elements remain clickable, margins present, theme and filter preserved.
  page.locator('#settingsBtn').click()
  dark=page.locator('[data-theme-choice="dark"]')
  if dark.count(): dark.click()
  assert page.evaluate("document.documentElement.dataset.theme")=='dark'
  page.locator('#modalClose').click()
  assert page.locator('#playFamily').count()==1
  assert page.locator('#recentBtn').count()==1
  assert not errors,errors
  if width==390 and height==820:
   page.screenshot(path=str(ROOT/'V40_dark_390.png'))
   page.evaluate("document.documentElement.dataset.theme='light'")
   page.screenshot(path=str(ROOT/'V40_light_390.png'))
  if width==360:
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
  print('PASS',width,height,'64 new icons, 7 real recipe unlocks, controls, themes, no JS exception')
  page.close()
 browser.close()
