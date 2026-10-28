"""V48 tests of mode rewards/saves with EXPLICIT test-only stubs; no real ads."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'35K_Alchemy_V48_Offline.html').read_text()
storage_stub="""window.__mockStorage=window.__mockStorage||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return Object.hasOwn(window.__mockStorage,k)?window.__mockStorage[k]:null},setItem(k,v){window.__mockStorage[k]=String(v)},removeItem(k){delete window.__mockStorage[k]}}});"""
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':390,'height':820},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.evaluate(storage_stub)
 page.set_content(html,wait_until='domcontentloaded')
 assert page.locator('[data-mode-choice="classic"]').is_visible()
 page.locator('[data-mode-choice="classic"]').click()
 assert page.evaluate('currentMode')=='classic'
 page.evaluate('()=>{place(0,"legacy:0");place(1,"legacy:1")}')
 page.wait_for_timeout(300)
 assert page.evaluate('unlocked.has("legacy:4")')
 page.locator('#modalClose').click()
 # A simulated native callback here tests JUST the app contract. It is never bundled.
 page.evaluate("window.__testEarned=false;window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded: async()=>({earned:window.__testEarned})}}};")
 print('MODE CLICK',page.evaluate('currentMode'),flush=True);page.locator('#modeBtn').click(timeout=8000)
 print('ERRORS:',errors, 'onclick',page.evaluate('typeof document.getElementById("modeBtn").onclick'), flush=True);print('MODAL:',page.locator('#modalContent').inner_text()[:280], 'hidden?',page.locator('#modal').is_hidden(),flush=True);print('FAMILY CLICK',flush=True);page.locator('[data-mode-choice="family"][data-mode-family="nature"]').click(timeout=8000)
 assert page.evaluate('currentMode')=='classic'
 assert page.get_by_text('Mode unchanged',exact=True).is_visible()
 page.locator('#modalClose').click()
 page.evaluate('window.__testEarned=true')
 print('MODE CLICK',page.evaluate('currentMode'),flush=True);page.locator('#modeBtn').click(timeout=8000)
 print('ERRORS:',errors, 'onclick',page.evaluate('typeof document.getElementById("modeBtn").onclick'), flush=True);print('MODAL:',page.locator('#modalContent').inner_text()[:280], 'hidden?',page.locator('#modal').is_hidden(),flush=True);print('FAMILY CLICK',flush=True);page.locator('[data-mode-choice="family"][data-mode-family="nature"]').click(timeout=8000)
 assert page.evaluate('currentMode')=='family'
 assert page.evaluate('unlocked.size')==4,'Leaked classic progress'
 page.evaluate('()=>{place(0,"legacy:0");place(1,"legacy:1")}')
 page.wait_for_timeout(300)
 assert page.evaluate('unlocked.size')==5
 page.locator('#modalClose').click()
 print('MODE CLICK',page.evaluate('currentMode'),flush=True);page.locator('#modeBtn').click(timeout=8000);page.locator('[data-mode-choice="classic"]').click()
 assert page.evaluate('currentMode')=='classic'
 assert page.evaluate('unlocked.has("legacy:4")')
 assert page.evaluate('Object.keys(window.__mockStorage).includes("35k_family_profiles_v48")')
 snapshot=page.evaluate('window.__mockStorage')
 assert not errors,errors
 print('PASS: reward rejection + success; independent Family and Classic progression')
 fresh=browser.new_page(viewport={'width':390,'height':820})
 fresh_errors=[];fresh.on('pageerror',lambda e:fresh_errors.append(str(e)))
 fresh.evaluate(storage_stub)
 fresh.evaluate('(entries)=>Object.assign(window.__mockStorage,entries)',snapshot)
 fresh.set_content(html,wait_until='domcontentloaded')
 assert fresh.evaluate('currentMode')=='classic'
 assert fresh.evaluate('unlocked.has("legacy:4")')
 fresh.evaluate("window.Capacitor={getPlatform:()=> 'android',Plugins:{GameverseRewardedAds:{showRewarded: async()=>({earned:true})}}};")
 fresh.locator('#modeBtn').click();fresh.locator('[data-mode-choice="family"][data-mode-family="nature"]').click()
 assert fresh.evaluate('currentMode')=='family'
 assert fresh.evaluate('unlocked.size')==5
 assert not fresh_errors,fresh_errors
 print('PASS: both mode saves survive reinitialization')
 browser.close()
