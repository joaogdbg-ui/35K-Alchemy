#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
HTML=(root/'35K_Alchemy_V29_1_Offline.html').read_text()
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for width,height in [(360,780),(390,844),(1280,900)]:
    page=b.new_page(viewport={'width':width,'height':height},is_mobile=width<800,has_touch=width<800)
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.evaluate('''() => {let m={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=v,removeItem:k=>delete m[k]}})}''')
    page.set_content(HTML,wait_until='domcontentloaded')
    page.wait_for_timeout(120)
    assert page.locator('#playFamily').evaluate('(e)=>e.tagName')=='BUTTON'
    assert page.locator('#viewPlay select').count()==0,'Native select persists in Play'
    assert page.locator('#playFamilyLabel').inner_text()=='All families'
    page.locator('#playFamily').click()
    assert page.locator('#modal').is_visible()
    assert page.locator('.inventory-family-grid').is_visible()
    assert page.locator('[data-inventory-family]').count()==10
    assert page.locator('.inventory-family-grid .batch-family-picture img').count()>=9
    assert page.locator('#playFamily').get_attribute('aria-expanded')=='true'
    # Closing X must not alter selection.
    page.locator('#modalClose').click()
    assert page.locator('#modal').is_hidden()
    assert page.locator('#playFamilyLabel').inner_text()=='All families'
    assert page.locator('#playFamily').get_attribute('aria-expanded')=='false'
    page.locator('#playFamily').click()
    page.screenshot(path=str(root/f'35K_Alchemy_V29_1_Family_Filter_{width}.png'))
    page.locator('[data-inventory-family="nature"]').click()
    assert page.locator('#modal').is_hidden()
    assert page.locator('#playFamilyLabel').inner_text()=='Nature & Science'
    assert page.evaluate('playFamily')=='nature'
    assert page.locator('.element-chip').count()>=4
    # Filtering by an empty family should not be falsely populated.
    page.locator('#playFamily').click()
    page.locator('[data-inventory-family="anime"]').click()
    assert page.locator('#playFamilyLabel').inner_text()=='Anime & Manga'
    assert page.locator('.element-chip').count()==0
    page.locator('#playFamily').click()
    page.locator('[data-inventory-family="all"]').click()
    assert page.locator('#playFamilyLabel').inner_text()=='All families'
    assert page.locator('.element-chip').count()>=4
    # Touch a starter, lock it, ensure batch picker not altered.
    page.locator('.element-chip[data-id="legacy:1"]').click()
    page.locator('#lockLeft').click()
    page.locator('#batchOpen').click()
    assert page.locator('.batch-family-choice[data-batch-family]').count()==9
    page.locator('#modalClose').click()
    assert not errors, errors
    print(f'PASS width={width}: no native select, themed 10 cards, counts, filters, X, batch unchanged')
    page.close()
  b.close()
