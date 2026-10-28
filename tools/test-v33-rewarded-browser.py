from playwright.sync_api import sync_playwright
from pathlib import Path
import json
HTML = (Path(__file__).resolve().parents[1] / '35K_Alchemy_V33_Offline.html').read_text()
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,390,1280]:
  ctx=browser.new_context(viewport={'width':width,'height':800},device_scale_factor=1,is_mobile=(width<500),has_touch=(width<500))
  page=ctx.new_page()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}''')
  page.set_content(HTML,wait_until='domcontentloaded')
  page.wait_for_selector('#compassBtn',timeout=20000)
  count=page.locator('#discoveredCount').inner_text()
  page.locator('#compassBtn').click()
  page.wait_for_selector('#modal:not([hidden])',timeout=10000)
  msg=page.locator('#modalContent').inner_text()
  assert 'Ads are not available' in msg, msg[:450]
  assert 'credit' not in msg.lower()
  hinted=page.evaluate("localStorage.getItem('gameverse_discovery_hints_v20')")
  assert not hinted or not json.loads(hinted).get('clues'),hinted
  screenshot=str(Path(__file__).resolve().parents[1] / f'35K_Alchemy_V33_Hint_{width}.png')
  if width==390:page.screenshot(path=screenshot)
  assert not errors, errors
  results.append({'width':width,'offline_hint_accurate':True,'saved_without_ad':False,'collection_count':count,'page_errors':len(errors)})
  ctx.close()
 # browser mock for automated test ONLY, no bridge or SDK in distributed HTML
 for earned in [False,True]:
  ctx=browser.new_context(viewport={'width':390,'height':850},is_mobile=True,has_touch=True)
  
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate('''() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}''')
  page.evaluate(f'''window.Capacitor={{getPlatform:()=>"android",Plugins:{{GameverseRewardedAds:{{showRewarded:async()=>({{earned:{str(earned).lower()}}})}}}}}};''')
  page.set_content(HTML,wait_until='domcontentloaded')
  page.locator('#compassBtn').click()
  page.wait_for_timeout(350)
  hints=page.evaluate("localStorage.getItem('gameverse_discovery_hints_v20')")
  clues=(json.loads(hints).get('clues',{}) if hints else {})
  if earned:
   assert len(clues)==1,(hints, page.locator('body').inner_text()[-1000:])
   assert set(clues.values())=={'recipe'}
   assert 'RECIPE REVEALED' in page.locator('#modalContent').inner_text()
   assert json.loads(hints)['v']==20
  else:
   assert len(clues)==0,hints
   assert 'Ad not completed' in page.locator('#toast').inner_text()
  assert not errors,errors
  results.append({'earned':earned,'clues':len(clues),'page_errors':len(errors)})
  ctx.close()
 browser.close()
print(json.dumps(results,indent=2))
