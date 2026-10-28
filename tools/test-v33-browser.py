from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V33_Offline.html').read_text(encoding='utf8')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (360,390,1280):
        page=b.new_page(viewport={'width':width,'height':820},is_mobile=width<500,has_touch=width<500)
        errors=[]
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.evaluate('''() => {const s={}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k]}})}''')
        page.set_content(html,wait_until='domcontentloaded')
        assert page.locator('#compassBtn').is_visible()
        assert page.evaluate("typeof freeHintBalance")=='undefined'
        assert page.evaluate('ITEMS.length')==3428
        assert page.evaluate('recipes.size')==8603
        page.locator('#compassBtn').click()
        assert page.locator('#modal').is_visible()
        assert page.locator('#modalContent h2').inner_text()=='Ads are unavailable here'
        assert page.evaluate('Object.values(hintState.clues).filter(x=>x===\"recipe\").length')==0
        page.locator('#modalClose').click()
        assert page.locator('#modal').is_hidden()
        page.locator('[data-view="World"]').click()
        page.locator('[data-family="nature"]').first.click()
        assert page.locator('#familyHint').is_visible()
        page.locator('#familyHint').click()
        assert page.locator('#modalContent h2').inner_text()=='Ads are unavailable here'
        page.locator('#modalClose').click()
        page.locator('[data-view="Play"]').click()
        page.evaluate('''() => {window.Capacitor={getPlatform:()=>"android",Plugins:{GameverseRewardedAds:{showRewarded:async()=>({earned:false})}}};}''')
        page.locator('#compassBtn').click()
        page.wait_for_timeout(80)
        assert page.evaluate('Object.values(hintState.clues).filter(x=>x===\"recipe\").length')==0
        assert page.locator('#modalContent h2').inner_text()=='No reward received'
        page.locator('#modalClose').click()
        page.evaluate('''() => {window.Capacitor.Plugins.GameverseRewardedAds.showRewarded=async()=>({earned:true});}''')
        page.locator('#compassBtn').click()
        page.wait_for_timeout(70)
        assert page.locator('#modalContent .compass-recipe').is_visible()
        assert page.evaluate('Object.values(hintState.clues).filter(x=>x===\"recipe\").length')==1
        if width==390:page.screenshot(path=str(root/'35K_Alchemy_V33_Recipe_390.png'))
        page.locator('#modal').click(position={'x':4,'y':4},force=True)
        assert page.locator('#modal').is_visible() == True if page.locator('#modal').get_attribute('data-dismiss')=='x-only' else True
        page.locator('#modalClose').click()
        assert not errors,errors
        print('PASS',width,'offline no fake ad; native mock denial/success; recipe; 3428/8603')
        page.close()
    b.close()
