"""V38 full offline browser smoke test and visual captures (no Android-device claims)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V38_Offline.html').read_text(encoding='utf8')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(360,640),(390,820),(1280,820)]:
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<500,has_touch=width<500)
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.evaluate("""() => {const mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]}})}""")
  page.set_content(html,wait_until='domcontentloaded')
  assert page.evaluate('ITEMS.length')==3572,('items',width)
  assert page.evaluate('recipes.size')==8998,('recipes',width)
  assert page.evaluate('ORGANIC_V38.items.length')==78
  assert page.evaluate('ORGANIC_V38.recipes.length')==203
  for a,b,out in [
   ('legacy:38','legacy:8','organic38:volcano'),
   ('organic38:volcano','legacy:39','organic38:geyser'),
   ('organic38:wave','organic38:current','organic38:whirlpool'),
   ('organic37:flour','organic38:egg','organic38:pasta'),
   ('organic38:cocoa','organic38:sugar','organic38:chocolate'),
   ('organic38:milk','legacy:35','organic38:ice-cream'),
  ]:
   # Confirm recipe maps before crafting so tests never accidentally pass on a different result.
   actual=page.evaluate('([a,b])=>recipes.get(pairKey(a,b))',[a,b]);assert actual==out,(width,a,b,out,actual)
   page.evaluate('([a,b])=>{unlocked.add(a);unlocked.add(b); place(0,a);place(1,b)}',[a,b]);page.wait_for_function('out=>unlocked.has(out)',arg=out)
   assert page.locator('#modalContent .modal-art svg').count()>0,(out,'missing bespoke icon')
   assert page.evaluate('out=>staticArt(byId.get(out)).startsWith("<svg")',out),out
   page.locator('#modalClose').click()
  # Known older item should survive an export-style save and still be selectable.
  page.evaluate('''() => {unlocked.add('organic34:rainbow');save();}''')
  assert 'organic34:rainbow' in page.evaluate("localStorage.getItem('gameverse_dynamic_v11')")
  assert not errors,errors
  if width==390:
   page.evaluate('''() => {document.documentElement.dataset.theme='dark'}''')
   page.screenshot(path=str(root/'V38_dark_390.png'))
   page.evaluate('''() => {document.documentElement.dataset.theme='light'}''')
   page.screenshot(path=str(root/'V38_light_390.png'))
  print('PASS',width,height,'new recipes, original art, persistence, no JS errors')
  page.close()
 browser.close()
