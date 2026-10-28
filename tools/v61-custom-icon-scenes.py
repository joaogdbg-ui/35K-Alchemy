#!/usr/bin/env python3
"""Sixteen individually art-directed V61 SVGs. No extracted/copied game art."""
from pathlib import Path
from xml.etree import ElementTree
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'client/assets/v61-art-directed';DEST.mkdir(parents=True,exist_ok=True)
# All scenes share a canvas and a restrained palette, but NOT a generic central motif/overlay layout.
SCENES={
 'tombolo': '''<path d="M8 61Q24 48 41 56Q55 59 63 53Q82 42 94 54L94 84H8Z" fill="#9EDCE7"/>
<path d="M5 70Q19 60 31 61Q36 62 42 69L49 73L58 66Q77 53 94 64L94 87H5Z" fill="#5AAAC6"/>
<path d="M4 63Q13 34 28 36Q43 36 43 57Q52 65 59 58Q65 39 79 39Q95 41 97 65Q79 59 65 66L57 73Q48 79 39 70Q26 58 4 63" fill="#EFD99B" stroke="#C9AA6B" stroke-width="2"/>
<path d="M12 49Q20 39 29 44M69 48Q80 42 89 49" stroke="#72B082" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M11 76q8-5 16 0m44 3q10-5 19 0" stroke="#DBF8FB" stroke-width="3" fill="none" stroke-linecap="round"/>''',
 'lagoon-barrier': '''<path d="M7 51Q20 17 47 24Q77 18 94 50Q88 82 57 83Q22 91 7 51Z" fill="#E9DAAD" stroke="#BB9F73" stroke-width="2.3"/>
<path d="M18 52Q25 34 44 36Q68 29 84 49Q77 71 57 71Q30 77 18 52Z" fill="#75BFD0" stroke="#378C9E" stroke-width="2"/>
<path d="M9 44Q18 32 36 27M70 25Q83 31 90 43" stroke="#8EBD8C" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M25 50q8-5 14 0m8 12q9-5 18 0" stroke="#D2F3F3" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M24 25v-7m-4 3h8" stroke="#D7A468" stroke-width="2" stroke-linecap="round"/>''',
 'salt-pan': '''<circle cx="78" cy="17" r="9" fill="#F8C66D"/><path d="M17 30L72 25L89 72L30 80Z" fill="#D1AF8B" stroke="#8D806D" stroke-width="3" stroke-linejoin="round"/>
<path d="M20 33L45 31L49 52L25 55Z" fill="#9CDBDE"/><path d="M49 31L70 29L78 49L52 51Z" fill="#B2E2E2"/>
<path d="M26 59L50 56L54 75L32 77Z" fill="#ECF8F5"/><path d="M54 55L79 52L86 70L57 74Z" fill="#FAF8E7"/>
<path d="m36 67 3-6 3 6-3 6zm28-5 3-7 4 7-3 8zm8 3 3-5 3 5-3 5" fill="#FFFFFF" stroke="#C5CFC8" stroke-width="1"/>''',
 'seamount': '''<path d="M5 20Q27 15 49 20T95 18V86H5Z" fill="#A0DBE3"/><path d="M6 48q15-5 30 0t30 0 29 0" stroke="#D5F4F5" stroke-width="3" fill="none"/>
<path d="M14 85L48 31Q52 26 57 33L88 85Z" fill="#819A91" stroke="#526D68" stroke-width="3" stroke-linejoin="round"/>
<path d="M33 62L50 36L62 58" fill="#AFC1AD"/><path d="M21 82L42 60L48 81Z" fill="#6B837B"/>
<path d="M14 33l11-5-3 5 3 3zM74 41l11-5-3 5 3 3z" fill="#F1B96D"/><circle cx="13" cy="62" r="3" fill="#F0E7CC"/><circle cx="17" cy="53" r="2" fill="#F0E7CC"/>''',
 'hydrothermal-chimney': '''<path d="M5 86Q50 80 95 87L95 96H5Z" fill="#8C9D9C"/><path d="M37 85L35 49L45 44L48 28L62 30L65 52L72 85Z" fill="#625E5C" stroke="#45484B" stroke-width="3" stroke-linejoin="round"/>
<path d="M48 29L61 31L61 37L47 35Z" fill="#B9A79A"/><path d="M48 42l7 4 8-4M42 59l8 5 11-4" stroke="#E68F66" stroke-width="3" fill="none"/>
<path d="M52 25Q35 14 45 8Q51 5 54 11Q59 16 65 8Q75 9 70 20" stroke="#CADDE0" stroke-width="6" stroke-linecap="round" fill="none"/>
<circle cx="76" cy="46" r="4" fill="none" stroke="#CDECF0" stroke-width="2"/><circle cx="21" cy="61" r="3" fill="none" stroke="#CDECF0" stroke-width="2"/>''',
 'harbor-fog-horn': '''<path d="M13 82q15-8 31 0t31 0 19 0" stroke="#68B4C9" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M36 75L35 65L49 62L53 75Z" fill="#C75B54"/><path d="M36 67l17-3" stroke="#F5D9C9" stroke-width="3"/>
<path d="M44 56V41L72 26V64L44 50Z" fill="#E4AD68" stroke="#A76F50" stroke-width="3" stroke-linejoin="round"/>
<rect x="33" y="39" width="14" height="12" rx="4" fill="#D9C1A0" stroke="#9C8676" stroke-width="2"/>
<path d="M20 18q12-7 24 0M9 29q17-7 31 0M65 15q12-4 23 1M68 76q12-4 24 1" stroke="#BED4D8" stroke-width="5" fill="none" stroke-linecap="round"/>''',
 'obsidian-shard': '''<path d="M52 9L68 41L63 64L77 78L43 92L21 65L37 40Z" fill="#333D50" stroke="#263244" stroke-width="3" stroke-linejoin="round"/>
<path d="M52 11L56 53L44 87L25 65L38 41Z" fill="#677A90"/><path d="M56 53L68 41L63 64L76 78L44 89Z" fill="#202938"/>
<path d="M52 16L40 42L47 60L44 80" fill="none" stroke="#B7D4D9" stroke-width="3" stroke-linecap="round"/>
<path d="M65 24v9m-4-4h8" stroke="#E6C2AB" stroke-width="2.5" stroke-linecap="round"/>''',
 'mineral-vein': '''<path d="M13 30L40 13L75 21L93 50L79 82L32 91L8 70Z" fill="#A7A6A0" stroke="#777E80" stroke-width="3" stroke-linejoin="round"/>
<path d="M17 64L38 47L49 53L67 35L88 42" stroke="#467D80" stroke-width="11" fill="none" stroke-linecap="round"/>
<path d="M17 64L38 47L49 53L67 35L88 42" stroke="#9EE4C8" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M32 28L52 35M56 72L73 78" stroke="#CED2C9" stroke-width="4" stroke-linecap="round"/>''',
 'garnet': '''<path d="M34 17H66L87 42L79 71L50 89L21 71L13 42Z" fill="#B74E6C" stroke="#733D59" stroke-width="3" stroke-linejoin="round"/>
<path d="M34 17L50 37L66 17M13 42L50 37L87 42M21 71L50 37L79 71M50 89V37" stroke="#F0A3A8" stroke-width="2" fill="none"/>
<path d="M34 17L13 42L50 37Z" fill="#E68092" opacity=".85"/><path d="M87 42L79 71L50 37Z" fill="#7C3959"/>
<path d="M34 17h20l-8 14" stroke="#FFE3C8" stroke-width="3" fill="none" stroke-linecap="round"/>''',
 'quartz-sand': '''<path d="M9 81Q26 66 44 72Q58 57 78 72L94 84Q50 94 9 81Z" fill="#E5CA91" stroke="#B99B71" stroke-width="2"/>
<path d="M27 72L35 40L47 31L55 57L46 74Z" fill="#D7F3ED" stroke="#74B9C7" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M56 75L61 49L71 38L82 59L79 75Z" fill="#EDF9F4" stroke="#90BFCC" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M47 31L44 54L35 41M71 38L69 62L61 49" fill="none" stroke="#FAFFFF" stroke-width="3"/>
<circle cx="19" cy="77" r="2" fill="#AD956D"/><circle cx="85" cy="81" r="2.5" fill="#AD956D"/>''',
 'tomato-herb-pasta': '''<path d="M16 50H84Q80 78 69 83H31Q20 76 16 50Z" fill="#F4E6D7" stroke="#B38E77" stroke-width="3"/>
<path d="M18 49Q15 37 28 36T49 38T71 34T82 48" stroke="#EDBB73" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M23 45q11-9 21 0t21 0 15-3M25 52q9-7 18 0t18 0 16-2" stroke="#E3A45D" stroke-width="4" fill="none" stroke-linecap="round"/>
<circle cx="41" cy="43" r="8" fill="#E47F67" stroke="#CB6551" stroke-width="1.5"/><circle cx="65" cy="49" r="6" fill="#E47F67"/>
<path d="M49 34q-4-12 4-13M54 41q5-12 13-10" stroke="#5E9F73" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M32 85h36" stroke="#AE977F" stroke-width="2"/>''',
 'wireless-doorbell': '''<path d="M22 17H57V88H22Z" fill="#E2C7A6" stroke="#A67B64" stroke-width="3"/><path d="M25 21h29v63H25Z" fill="#F0DDC2"/>
<rect x="46" y="39" width="37" height="29" rx="8" fill="#8EA9C4" stroke="#5C7896" stroke-width="3"/>
<circle cx="64" cy="54" r="8" fill="#E6F1E7" stroke="#6B8FA8" stroke-width="2"/><circle cx="64" cy="54" r="3" fill="#E1A769"/>
<path d="M72 24q7 3 10 10m-3-18q13 7 15 20" fill="none" stroke="#80B8BE" stroke-width="3" stroke-linecap="round"/>
<circle cx="33" cy="54" r="2.5" fill="#B88968"/>''',
 'forest-night-moth': '''<circle cx="50" cy="49" r="41" fill="#374D78"/><circle cx="68" cy="27" r="10" fill="#F4DFB4"/>
<path d="M50 55Q18 20 14 50Q12 69 44 71Q30 92 50 82Q70 92 56 71Q88 69 86 50Q82 20 50 55Z" fill="#C5A2C9" stroke="#876B9A" stroke-width="3"/>
<path d="M50 51L50 78M50 52Q44 42 38 36M50 52Q56 42 62 36" fill="none" stroke="#6C547D" stroke-width="3" stroke-linecap="round"/>
<circle cx="29" cy="55" r="6" fill="#EAC5AA"/><circle cx="71" cy="55" r="6" fill="#EAC5AA"/>
<circle cx="22" cy="20" r="2" fill="#EAD8BA"/><circle cx="78" cy="73" r="2" fill="#EAD8BA"/>''',
 'meteor-impact-basin': '''<ellipse cx="48" cy="67" rx="44" ry="20" fill="#B2A8A4" stroke="#8C8E8D" stroke-width="3"/>
<ellipse cx="48" cy="66" rx="28" ry="11" fill="#766F70"/><ellipse cx="48" cy="65" rx="18" ry="7" fill="#9C8F8A"/>
<path d="M69 14L81 34L66 46L52 34Z" fill="#EAB17A" stroke="#AA745F" stroke-width="2"/><path d="M53 32L17 18" stroke="#E4A85C" stroke-width="5" stroke-linecap="round"/>
<path d="M30 21l-10-3m13 6-16 2" stroke="#E9C47D" stroke-width="3" stroke-linecap="round"/>
<circle cx="15" cy="57" r="3" fill="#C5C1B8"/><circle cx="85" cy="61" r="3" fill="#C5C1B8"/>''',
 'village-music-school': '''<path d="M15 46L50 20L85 46V87H15Z" fill="#F2DAB4" stroke="#AC8270" stroke-width="3"/><path d="M9 48L50 15L91 48" fill="none" stroke="#B96D62" stroke-width="8" stroke-linejoin="round"/>
<path d="M38 87V57H62V87" fill="#A2B6BE" stroke="#6E8B9D" stroke-width="3"/>
<path d="M39 66h22M39 73h22M45 59v28M51 59v28M57 59v28" stroke="#E9F0EA" stroke-width="2"/>
<circle cx="26" cy="60" r="6" fill="#87BEA7"/><path d="M68 40v14q-5-2-7 3q2 6 7 1V45l8-2v10q-5-2-7 3q2 5 7 0V37Z" fill="#906A9C"/>''',
 'coral-spawning': '''<path d="M48 85L44 64L31 50L34 44L49 55L51 29L57 26L58 53L70 37L76 42L61 62L62 85Z" fill="#E98C86" stroke="#C76D71" stroke-width="3" stroke-linejoin="round"/>
<path d="M35 76L25 66L18 69M62 70L74 59L83 62" stroke="#E4A09A" stroke-width="7" stroke-linecap="round" fill="none"/>
<circle cx="28" cy="25" r="5" fill="#F4D9A6"/><circle cx="39" cy="18" r="3.5" fill="#F4D9A6"/><circle cx="64" cy="17" r="4" fill="#F4D9A6"/><circle cx="75" cy="31" r="5" fill="#F4D9A6"/><circle cx="18" cy="43" r="3" fill="#F4D9A6"/>
<path d="M7 87Q50 80 93 87" fill="none" stroke="#73B7C2" stroke-width="5" stroke-linecap="round"/>'''
}
for name,content in SCENES.items():
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">'+content+'</svg>'
 ElementTree.fromstring(svg)
 (DEST/(name+'.svg')).write_text(svg,encoding='utf-8')
print(f'Wrote {len(SCENES)} independently drawn SVGs to {DEST}')
