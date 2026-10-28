from pathlib import Path
import ast
R=Path(__file__).resolve().parents[1]
s=(R/'tools/generate-v52-art.py').read_text()
module=ast.parse(s)
motifs=next(n for n in module.body if isinstance(n,ast.Assign) and any(isinstance(x,ast.Name) and x.id=='MOTIFS' for x in n.targets))
MOTIFS=ast.literal_eval(motifs.value)
PAIR={
'Morning Mist':('fog','droplet'),'Pine Forest':('tree','branch'), 'Forest Stream':('wave','tree'),
'Mushroom Patch':('mushroom','grass'),'Coastal Cliff':('mountain','wave'), 'Tidepool Crab':('crab','pool'),
'Kelp Frond':('kelp','leaf'),'Marine Snow':('snow','fish'),'Riverbank':('roots','wave'),
'Moonlit Lake':('pool','halo'),'Rooftop Dew':('droplet','house'),'Frosted Fern':('leaf','ice'),
'Firefly Swarm':('lightning','grass'),'Butterfly Garden':('flower','branch'),'Pollen Cloud':('cloud','flower'),
'Desert Bloom':('flower','sun'),'Salt Crust':('ice','sun'),'Cave Drip':('droplet','mountain'),
'Reef Shelter':('coral','fish'),'Snowmelt':('snow','droplet'),'Lava Tube':('mountain','lightning'),
'Solar Storm':('halo','lightning'),'Meteor Fragment':('mountain','ice'),'Sand Ripple':('wind','wave'),
'Marsh Frog':('pool','grass'),'Canopy Nest':('tree','basket'),
'Village Market Day':('shop','basket'),'Community Choir':('people','book'),'Museum Tour':('statue','people'),
'Art Workshop':('pencil','pot'),'Gallery Opening':('frame','people'),'Public Library':('book','house'),
'Neighborhood Bakery':('house','bread'),'Family Cookbook':('book','food'),'Village Theater':('house','people'),
'Pottery Market':('pot','shop'),'Concert Hall':('house','cup'),'Food Festival':('food','shop'),
'Photo Archive':('camera','book'),'Artist Studio':('pencil','frame'),
'Herb Garden':('herbs','flowerpot'),'Community Orchard':('tree','people'),'Garden Sketchbook':('book','flower'),
'Tea Garden':('herbs','cup'),'Seedling Workshop':('flowerpot','people'),'Nature Exhibition':('frame','leaf'),
'Orchard Picnic':('blanket','apple'),'Botanical Postcard':('paper','flower'),
}
import json,hashlib
items=json.loads((R/'shared/v53-editorial-plan.json').read_text())['items']
assert len(PAIR)==len(items)==48 and len(set(PAIR.values()))==48
out=R/'client/assets/v53';out.mkdir(exist_ok=True,parents=True)
art={};manifest=[]
for it in items:
 name=it['name'];primary,secondary=PAIR[name]
 assert primary in MOTIFS and secondary in MOTIFS
 # Original layered scene, illustration is distinct for every element; inline SVG, no external resources.
 body=f'<g transform="translate(12 12) scale(.76)">{MOTIFS[primary]}</g><g transform="translate(57 1) scale(.37)">{MOTIFS[secondary]}</g>'
 svg=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">'
 '<ellipse cx="49" cy="94" rx="29" ry="3.5" fill="#594F4A" opacity=".14"/>'
 '<path d="M11 14v6m-3-3h6M85 80v6m-3-3h6" stroke="#D7B07F" stroke-width="2" stroke-linecap="round"/>'
 +body+'</svg>')
 path=out/(it['id'].split(':',1)[1]+'.svg');path.write_text(svg)
 art[name.lower()]=svg
 manifest.append({'id':it['id'],'name':name,'path':str(path.relative_to(R)),'sha256':hashlib.sha256(svg.encode()).hexdigest(),'motifs':[primary,secondary]})
(R/'client/src/organic-art-v53.js').write_text('/* 48 individually composed static illustrated SVGs, rendered fully offline. */\nexport const ORGANIC_ART_V53 = '+json.dumps(art,separators=(',',':'))+';\n')
(R/'shared/v53-art-manifest.json').write_text(json.dumps({'version':53,'icons':manifest},indent=2)+'\n')
print('Generated 48 original inline SVG illustrations and SHA256 manifest')
