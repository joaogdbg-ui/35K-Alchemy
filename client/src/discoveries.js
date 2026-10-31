// V20: stable offline discovery families. Every catalog category maps to exactly one family.
export const FAMILIES = Object.freeze([
 // V86 (owner request): Video Games + Consoles & Hardware + Arcade & Tabletop are one family,
 // and Anime & Manga + Music + Cinema & TV are one family. IDs 'games' and 'anime' are kept so
 // saves, campaigns and art keys stay valid; the old ids are migrated in app.js.
 {id:'games',name:'Games & Consoles',icon:'game_case',category:'Gaming',description:'Video games, consoles, arcades and tabletop',categories:['game','genre','gamecraft','console','portable','computer','technology','brand','accessory','arcade','board'],order:0},
 {id:'anime',name:'Anime, Music & Cinema',icon:'anime_hero',category:'Culture',description:'Anime, manga, music, films and series',categories:['anime','manga','character','power','music','film','series'],order:1},
 {id:'nature',name:'Nature & Science',icon:'dragon',category:'World',description:'Natural elements, life and discovery',categories:['nature','material','life','science'],order:6},
 {id:'fantasy',name:'Fantasy & Objects',icon:'crystal',category:'World',description:'Imaginary worlds and inventions',categories:['fantasy','object','concept'],order:7},
 {id:'people',name:'People & Culture',icon:'manga',category:'World',description:'Personalities and world history',categories:['politician','culture'],order:8},
 {id:'mythology',name:'Mythology & Gods',icon:'crystal',category:'World',description:'Gods, legends and ancient pantheons',categories:['mythology'],order:9},
 {id:'prehistoric',name:'Prehistory & Dinosaurs',icon:'dragon',category:'World',description:'Fossils, ancient life and dinosaurs',categories:['prehistoric'],order:10},
 {id:'world',name:'Countries & Landmarks',icon:'crystal',category:'World',description:'Countries, flags, monuments, rivers and traditions',categories:['geography'],order:11},
 // V89: companion houses, furniture and home materials (own campaign: House, Wood, Tool, Thread).
 {id:'home',name:'Home & Living',icon:'crystal',category:'World',description:'Companion houses, furniture and home crafts',categories:['home'],order:12},
]);
// V86: ids of families merged into the ones above (used to migrate saves and old data).
export const MERGED_FAMILY_IDS = Object.freeze({consoles:'games',arcades:'games',music:'anime',cinema:'anime'});
export const canonicalFamilyId=(id)=>MERGED_FAMILY_IDS[id]||id;
const CATEGORY_FAMILY = new Map(FAMILIES.flatMap(f=>f.categories.map(c=>[c,f.id])));
export const familyFor=(item)=>['Moon','Planet','Space','Star','Bread'].includes(item?.name)?'nature':CATEGORY_FAMILY.get(item.category)||'fantasy';
// V50: explicit overlapping memberships. An element still exists just once in the catalog.
const SECONDARY_FAMILY_IDS = new Map([["organic53:herb-garden","nature"],["organic53:community-orchard","nature"],["organic53:garden-sketchbook","nature"],["organic53:tea-garden","nature"],["organic53:seedling-workshop","nature"],["organic53:nature-exhibition","nature"],["organic53:orchard-picnic","nature"],["organic53:botanical-postcard","nature"],["organic52:seedling-pot","nature"],["organic52:botanical-sketch","nature"],["organic52:terrarium-display","nature"],["organic52:orchard-basket","nature"],["organic52:floral-wreath","nature"],["organic52:botanical-walk","nature"],["organic52:nature-journal","nature"],["organic52:herbal-infusion","nature"],["organic37:harvest","nature"],["organic37:beekeeper","nature"],["organic38:bonsai","nature"],["organic38:terrarium","nature"],["organic37:tea","nature"],["organic38:milk","nature"],["organic38:cream","nature"],["organic38:cheese","nature"],["organic38:butter","nature"],["organic37:jam","nature"],["organic37:salad","nature"],["organic38:lemonade","nature"],["organic45:aquarium","nature"],["organic38:ice-cream","nature"],["organic47:herb-butter","nature"]]);
// Explicit overlapping thematic membership: do not change the original primary
// families or create a second copy of any catalog item.
const EXTRA_THEMATIC_MEMBERSHIP = new Map([
 ['legacy:28',['mythology']],['legacy:64',['mythology','prehistoric']],
 ['legacy:125',['mythology']],['legacy:65',['mythology']],
 ['legacy:48',['mythology']],['legacy:118',['mythology']],
 ['legacy:185',['mythology']],['legacy:586',['mythology']],
 ['legacy:47',['mythology']],['pack:transformation',['mythology']],
 ['pack:god',['mythology']],['pack:psychic',['mythology']],
 ['pack:shapeshifter',['mythology']],['pack:legend',['mythology']],
 ['pack:leader',['mythology']],['organic41:ancient-city',['mythology']],
 ['legacy:26',['prehistoric']],['legacy:14',['prehistoric']],
 ['legacy:21',['prehistoric']],['legacy:41',['prehistoric']],
 ['legacy:575',['prehistoric']],['legacy:580',['prehistoric']],
 ['organic41:monument',['prehistoric']],['organic42:limestone',['prehistoric']]
]);
// V85: extra members each complete family campaign needs (FAMILY_DATA_V85.families[id].addMembers).
const EXTRA_MEMBERSHIP_V85 = new Map();
export function registerFamilyMembership(families){
 EXTRA_MEMBERSHIP_V85.clear();
 for(const [rawFamily,d] of Object.entries(families||{}))for(const id of d?.addMembers||[]){const family=canonicalFamilyId(rawFamily);
  if(!EXTRA_MEMBERSHIP_V85.has(id))EXTRA_MEMBERSHIP_V85.set(id,[]);if(!EXTRA_MEMBERSHIP_V85.get(id).includes(family))EXTRA_MEMBERSHIP_V85.get(id).push(family);
 }
}
export const familiesFor=(item)=>{
 const primary=familyFor(item), secondary=SECONDARY_FAMILY_IDS.get(item?.id);
 const declared=Array.isArray(item?.familyCampaigns)?item.familyCampaigns.map(canonicalFamilyId).filter(id=>FAMILIES.some(f=>f.id===id)):[];
 return [...new Set([primary,...(secondary?[secondary]:[]),...(EXTRA_THEMATIC_MEMBERSHIP.get(item?.id)||[]),...(EXTRA_MEMBERSHIP_V85.get(item?.id)||[]),...declared])];
};
export function groupFamilies(items,unlocked){
 const groups=Object.fromEntries(FAMILIES.map(f=>[f.id,{...f,ids:[],found:0,total:0}]));
 for(const item of items){for(const family of familiesFor(item)){const g=groups[family];g.ids.push(item.id);g.total++;if(unlocked.has(item.id))g.found++;}}
 for(const g of Object.values(groups))g.ids.sort((a,b)=>a.localeCompare(b));
 return groups;
}
// A cached reverse index makes family hints O(elements-in-family), not O(all-elements * all-recipes).
// Rebuild when new pairs are appended to the catalog.
const REVERSE_CACHE=new WeakMap();
function recipeReverseIndex(recipes){
 const cached=REVERSE_CACHE.get(recipes);if(cached&&cached.size===recipes.size)return cached.index;
 const index=new Map();for(const [pair,result] of recipes){const ids=pair.split('|');if(ids.length!==2)continue;
  if(!index.has(result))index.set(result,[]);index.get(result).push({a:ids[0],b:ids[1]});
 }
 REVERSE_CACHE.set(recipes,{size:recipes.size,index});return index;
}
export function recipesForTarget(targetId,recipes,unlocked){
 return (recipeReverseIndex(recipes).get(targetId)||[]).map(({a,b})=>({a,b,ready:Number(unlocked.has(a))+Number(unlocked.has(b))}))
 .sort((a,b)=>b.ready-a.ready||a.a.localeCompare(b.a)||a.b.localeCompare(b.b));
}
export function candidatesForFamily(group,unlocked,recipes,clues){
 const choices=[];
 for(const id of group.ids){if(unlocked.has(id))continue;
  const options=recipesForTarget(id,recipes,unlocked);if(options.length)choices.push({id,...options[0],revealed:clues[id]||null});
 }
 choices.sort((a,b)=>b.ready-a.ready||Number(!!a.revealed)-Number(!!b.revealed)||a.id.localeCompare(b.id));
 return choices;
}
