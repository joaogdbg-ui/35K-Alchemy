import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
html=Path('/mnt/data/Gameverse_Infinite_V11_Offline.html').read_text(encoding='utf-8')
async def main():
  async with async_playwright() as p:
    browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for width,height in [(360,740),(390,844),(1280,820)]:
      page=await browser.new_page(viewport={'width':width,'height':height},has_touch=True,is_mobile=width<850)
      errors=[]
      page.on('pageerror',lambda error:errors.append(str(error)))
      await page.set_content(html,wait_until='load')
      await page.wait_for_timeout(150)
      print('SIZE',width,height,'errors',errors,'count',await page.locator('#discoveredCount').inner_text(),'chips',await page.locator('#inventoryVirtual .element-chip').count())
      assert not errors,errors
      assert await page.locator('#inventoryVirtual .element-chip').count()>0
      if width==390:
        await page.screenshot(path='/mnt/data/Gameverse_Infinite_V11_Preview.png')
        # Test drag via mouse; set pointer events on card SVG icon
        cards=page.locator('#inventoryVirtual .element-chip')
        await cards.first.locator('.chip-art').hover()
        box=await cards.first.locator('.chip-art').bounding_box();slot=await page.locator('#slot0').bounding_box()
        await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
        await page.mouse.down();await page.mouse.move(slot['x']+slot['width']/2,slot['y']+slot['height']/2,steps=12);await page.mouse.up()
        print('drag left',await page.locator('#slot0').inner_text())
        assert 'Water' in await page.locator('#slot0').inner_text()
        await page.locator('#lockLeft').click()
        second=page.locator('#inventoryVirtual .element-chip').nth(1).locator('.chip-art')
        bb=await second.bounding_box();br=await page.locator('#slot1').bounding_box()
        await page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);await page.mouse.down();await page.mouse.move(br['x']+br['width']/2,br['y']+br['height']/2,steps=12);await page.mouse.up();await page.wait_for_timeout(250)
        print('after combine',await page.locator('#discoveredCount').inner_text(),await page.locator('#slot0').inner_text(), 'modal',await page.locator('#modal').is_visible())
        assert 'Water' in await page.locator('#slot0').inner_text()
        assert '5' in await page.locator('#discoveredCount').inner_text()
      await page.close()
    await browser.close()
asyncio.run(main())
