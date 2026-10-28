"""V36 responsive layout and rewarded-batch spacing test in offline Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'35K_Alchemy_V39_Offline.html').read_text(encoding='utf-8')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width,height in [(360,640),(390,820),(390,930),(1280,820)]:
        page=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<850,has_touch=width<850)
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded')
        assert page.evaluate('ITEMS.length')==3558
        assert page.evaluate('recipes.size')==8998
        page.evaluate("place(0,'legacy:0')")
        page.locator('#lockLeft').click()
        assert page.locator('#batchOpen').is_visible()
        geom=page.evaluate('''() => {
          const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,width:r.width,left:r.left,right:r.right}};
          return {workspace:box('.workspace'),content:box('.workspace-content'),row:box('.craft-row'),feedback:box('#combineFeedback'),batch:box('#batchOpen'),shelf:box('.shelf'),toolbar:box('.shelf-controls'),scroll:box('#inventoryScroll'),tile:box('.element-chip'),slot:box('#slot0'),
           overflow:document.documentElement.scrollWidth>innerWidth,viewport:innerHeight,
           slotRadius:getComputedStyle(document.querySelector('#slot0')).borderRadius,
           tileRadius:getComputedStyle(document.querySelector('.element-chip')).borderRadius};
        }''')
        assert geom['row']['bottom']+5 <= geom['feedback']['top'],geom
        assert geom['feedback']['bottom']+5 <= geom['batch']['top'],geom
        assert geom['batch']['bottom']+5 <= geom['workspace']['bottom'],geom
        assert geom['row']['top']>=geom['workspace']['top']+7,geom
        assert (geom['workspace']['bottom']<=geom['toolbar']['top']+1 if width<850 else geom['workspace']['right']<=geom['shelf']['left']+1),geom
        assert geom['slot']['height']==geom['tile']['height'],geom
        assert geom['slotRadius']==geom['tileRadius'],geom
        assert not geom['overflow'],geom
        assert geom['scroll']['height'] > (170 if height>=820 else 95),geom
        if width==390 and height==820:
            page.screenshot(path=str(root/'V39_layout_light_390.png'))
            page.evaluate("document.documentElement.setAttribute('data-theme','dark')")
            page.wait_for_timeout(250)
            page.screenshot(path=str(root/'V39_layout_dark_390.png'))
        assert not errors,errors
        print('PASS',width,'x',height,'workspace',round(geom['workspace']['height']),'px;', 'row→hint',round(geom['feedback']['top']-geom['row']['bottom']),'px;', 'hint→batch',round(geom['batch']['top']-geom['feedback']['bottom']),'px;', 'bottom',round(geom['workspace']['bottom']-geom['batch']['bottom']),'px')
        page.close()
    browser.close()
