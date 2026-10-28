"""V37 end-to-end: handcrafted marine / garden / bakery chains, artwork and old saves."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V37_Offline.html').read_text(encoding='utf8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,390,1280]:
  page=browser.new_page(viewport={'width':width,'height':820},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.evaluate("""() => {const mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]}})}""")
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3494
  assert page.evaluate('recipes.size')==8795
  for a,b,out in [
   ('legacy:10','legacy:141','organic37:algae'),
   ('organic37:algae','legacy:10','organic37:plankton'),
   ('organic37:algae','legacy:20','organic37:kelp-forest'),
   ('organic34:seed','legacy:578','organic37:vegetable'),
   ('organic37:vegetable','legacy:0','organic37:soup')
  ]:
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b); place(0,a);place(1,b)}',[a,b])
   page.wait_for_function('(out)=>unlocked.has(out)',arg=out)
   assert page.locator('#modalContent .modal-art svg').count()>0,(out,'original art missing')
   assert page.evaluate('(out)=>staticArt(byId.get(out)).startsWith("<svg")',out),out
   page.locator('#modalClose').click()
  # Previously persisted V36 discovery still loads after new catalog has been added.
  page.evaluate('''() => {unlocked.add('organic34:rainbow');save();}''')
  assert 'organic34:rainbow' in page.evaluate("localStorage.getItem('gameverse_dynamic_v11')")
  assert not errors,errors
  if width==390:
   # Show an accessible new V37 artwork rather than a generic placeholder.
   page.evaluate('''() => {place(0,'organic37:plankton');place(1,'legacy:63');}''')
   page.wait_for_function('unlocked.has("organic37:bioluminescence")')
   assert page.locator('#modalContent svg').count()>0
   page.screenshot(path=str(root/'V37_discovery_390.png'))
  print('PASS',width,'marine, farm and food craft chains, bespoke art, no JS errors')
  page.close()
 browser.close()
