// V203: living elements. Now and then one element on screen moves by itself (the flame flickers, ice melts and
// re-forms, a heart beats, wings flap, a shell hides) and, rarely, its effect spills onto the screen (fire scorches
// like paper, smoke drifts up, frost creeps in) and the companions react. Never everything at once.
// A term matches a name only when it IS the name or its head noun (last words): "Wild Fire" burns, "Fire Truck" does not.
const X=s=>{const terms=new Set(s.split('|'));return {test:n=>terms.has(n)};};   // exact names only (a Ferris Wheel is not a wheel)
const W=s=>{const terms=s.split('|');const hit=n=>terms.some(t=>n===t||n.endsWith(' '+t));return {test:n=>hit(n)||(n.endsWith('s')&&hit(n.slice(0,-1)))};};
export const LIVE_RULES=[
 ['shell',W('hermit crab|turtle|tortoise|snail|clam|oyster|armadillo|hedgehog|pangolin|nautilus|mussel|scallop')],
 ['erupt',W('volcano|geyser|eruption|supervolcano|lava fountain|champagne|soda')],
 ['melt',W('ice cube|ice|icicle|snowman|glacier|iceberg|ice cream|butter|popsicle|snowball|wax|chocolate|cheese fondue|sorbet|slush')],
 ['beat',W('life|heart|love|pulse|blood|heartbeat|soul|romance|valentine')],
 ['flame',W('fire|flame|campfire|bonfire|wildfire|torch|blaze|inferno|fireball|ember|burning bush|pyre|hellfire|dragon breath')],
 ['smoke',W('smoke|steam|vapor|vapour|mist|fog|haze|smog|incense|fume|exhaust|cloud|breath|ash cloud|ghost|spirit|phantom|wraith|specter|spectre')],
 ['glow',W('cake|birthday cake|candle|lamp|lantern|light bulb|bulb|star|sun|light|firefly|glow|aurora|gem|diamond|crystal|gold|treasure|neon|halo|chandelier|lighthouse|moon|supernova|comet|sparkler|menorah|jack-o-lantern|christmas tree')],
 ['zap',W('electricity|lightning|energy|spark|battery|plasma|laser|thunderbolt|tesla coil|static|power|voltage|circuit|taser|thunder')],
 ['flap',W('angel|bird|butterfly|bat|dragon|fairy|bee|eagle|owl|pegasus|phoenix|moth|duck|goose|swan|parrot|crow|raven|hawk|falcon|dove|pigeon|sparrow|seagull|wasp|dragonfly|griffin|pterosaur|pterodactyl|cherub|harpy|wyvern|hummingbird|pelican|vulture|chicken|rooster|turkey|penguin|fly|mosquito|ladybug|wings?')],
 ['swim',W('fish|shark|whale|dolphin|eel|squid|octopus|jellyfish|seal|otter|tadpole|goldfish|salmon|tuna|stingray|manta ray|seahorse|koi|piranha|swordfish|orca|narwhal|mermaid|kraken|anglerfish|pufferfish|clownfish|axolotl|shrimp|lobster|crab')],
 ['critter',W('cat|dog|fox|wolf|bear|lion|tiger|mouse|rat|rabbit|bunny|frog|toad|spider|lizard|monkey|horse|cow|pig|sheep|goat|deer|squirrel|raccoon|panda|koala|kangaroo|elephant|giraffe|zebra|hippo|rhino|camel|llama|alpaca|hamster|ferret|badger|beaver|mole|skunk|gorilla|chimpanzee|sloth|scorpion|ant|beetle|caterpillar|worm|snake|crocodile|alligator|dinosaur|t-rex|raptor|kitten|puppy|cub|lamb|pony|donkey|moose|bison|boar|leopard|cheetah|jaguar|puma|lynx|hyena|meerkat|gecko|iguana|chameleon|salamander|newt|unicorn|werewolf|yeti|goblin|troll|imp|gremlin|monster|creature|animal|pet|beast')],
 ['spin',X('wheel|cog|hurricane|cyclone|vortex|whirlpool|galaxy|coin|spinner|vinyl|record|yo-yo|frisbee|boomerang|saw blade|black hole|portal|pinwheel|roulette|donut|bagel|tire|tyre|ring|shuriken|snowflake|cookie|pizza|steering wheel')],
 ['water',W('water|sea|ocean|wave|river|lake|pond|puddle|tide|pool|stream|waterfall|flood|tsunami|drop|droplet|dew|swamp|bay|lagoon|creek|rapids|liquid|puddle')],
 ['hover',W('hot air balloon|ufo|drone|satellite|kite|cloud nine|blimp|zeppelin|space station|parachute|paper plane|feather|magic carpet|hoverboard|levitation')],
 ['wind',W('wind|air|breeze|gust|gale|leaf|leaves|grass|flag|tree|plant|flower|wheat|feather|kite|reed|bamboo|palm tree|willow|sail|sailboat|curtain|scarf|banner|windsock|dandelion|tumbleweed|seaweed|kelp|vine|fern|sapling|sprout|bush|corn|rice|lavender|tulip|rose|sunflower|daisy')],
 ['quake',W('earthquake|explosion|bomb|dynamite|drum|bell|alarm|alarm clock|avalanche|landslide|jackhammer|grenade|tnt|gong|sonic boom|chainsaw|drill|phone|telephone|maraca|rattle')],
 ['bounce',W('ball|balloon|bubble|jelly|slime|spring|trampoline|pudding|marshmallow|gum|bubblegum|rubber|basketball|football|soccer ball|tennis ball|beach ball|blob|jello|mochi|pogo stick|popcorn')],
];

// V204: where the art is made of known shapes, only the right part moves (blades, wings, tail, eyes, flame, pendulum...).
// [shape indexes, motion, origin 'x y' in the 100×100 art ('c' = the shape's own centre), css vars, delay fraction]
export const PARTS={
 'wind turbine':{n:12,redraw:1,p:[[[6,7,9],'spin','50 34']]},
 'windmill':{n:24,redraw:1,p:[[[7,11,15,19],'spin','50 36']]},
 'gear':{n:12,redraw:1,p:[[[2,3,4,5,6,7,8,9,10],'spin','50 48']]},
 'hermit crab':{n:18,redraw:1,p:[[[3,4,8,9,10,11,12,13,14,15,16,17],'tuck','34 60',{'--px':'24px','--py':'-12px'}],[[5,6,7],'wiggle','55 66']]},
 'cake':{n:9,redraw:1,p:[[[8],'flick','50 30']]},
 'candle':{n:11,p:[[[9,10],'flick','50 35'],[[2],'pulse','50 24']]},
 'campfire':{n:18,redraw:1,p:[[[5,6],'flick','50 76'],[[16,17],'rise','50 18']]},
 'butterfly':{n:7,p:[[[1,2,5,6],'flapc','50 55']],whole:'hover'},
 'bat':{n:18,p:[[[2,3,4],'flapc','50 50'],[[13,14],'look','c']],whole:'hover'},
 'bee':{n:8,p:[[[3],'buzz','46 42'],[[4],'buzz','55 42']],whole:'hover'},
 'metronome':{n:10,redraw:1,p:[[[6,7],'tilt','50 76',{'--pa':'-37deg'}]]},
 'seesaw':{n:12,p:[[[5,6,7,8,9,10,11],'tilt','50 56',{'--pa':'37deg'}]]},
 'compass':{n:5,p:[[[2,3],'swing','50 50',{'--pa':'38deg'}]]},
 'weather vane':{n:9,p:[[[4,5],'twist','50 31']]},
 'tornado':{n:3,p:[[[2],'twist','50 60'],[[1],'bob','50 25']]},
 'crab':{n:7,p:[[[2],'pinch','50 57'],[[5,6],'look','c']]},
 'octopus':{n:5,p:[[[2],'pinch','50 55'],[[3,4],'blink','c']]},
 'jellyfish':{n:4,p:[[[1,2],'pulse','50 57'],[[3],'squish','50 58']],whole:'hover'},
 'lighthouse':{n:7,p:[[[5],'blinko','50 28']]},
 'satellite':{n:7,p:[[[6],'blinko','c']],whole:'hover'},
 'volcano':{n:11,redraw:1,p:[[[7,8,9],'rise','50 20'],[[4],'pulse','50 36'],[[5,6],'squish','50 38']],whole:'erupt'},
 'hourglass':{n:13,p:[[[3],'drain','50 48'],[[5],'fill','50 81']]},
 'owl':{n:10,p:[[[5,6,7,8],'look','c'],[[3,4],'blink','c',null,0.5]]},
 'bird':{n:5,p:[[[2],'tilt','70 56',{'--pa':'14deg'}],[[3],'blink','c']],whole:'critter'},
 'frog':{n:8,p:[[[4,5],'blink','c'],[[1],'puff','50 84']]},
 'balloon':{n:5,p:[[[1,2,3],'bob','50 66'],[[4],'wiggle','50 73']]},
 'sailboat':{n:6,p:[[[1,2,3,4],'swing','48 84',{'--pa':'6deg'}],[[5],'slide','50 88']]},
 'flower':{n:14,redraw:1,p:[[[5,6,7,8,9,10,11,12,13],'pulse','50 36'],[[3,4],'wiggle','50 76']]},
 'flag':{n:9,p:[[[5,6,7,8],'wave','23 38']]},
 'cat':{n:20,p:[[[2,3,4],'wag','66 86'],[[13,14,15,16],'blink','c'],[[8],'tap','c'],[[9],'tap','c',null,0.5]]},
 'dog':{n:24,p:[[[2,3],'wag','66 80'],[[15,16],'pant','50 47'],[[12],'wiggle','37 24'],[[13],'wiggle','63 24'],[[19,20,21,22],'blink','c']]},
 'whale':{n:17,p:[[[3,4,5,6,7],'spout','34 36'],[[12,13],'blink','c'],[[2],'slide','50 84']]},
 'grandfather clock':{n:16,p:[[[5,6],'swing','50 41',{'--pa':'13deg'}],[[11],'spin','50 21']]},
 'cuckoo clock':{n:20,p:[[[17,18],'pop','50 28',{'--px':'9px','--py':'-1px'}],[[7,8],'swing','50 68',{'--pa':'13deg'}],[[14],'spin','50 51']]},
 'rocking horse':{n:19,p:[[[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],'swing','50 88',{'--pa':'8deg'}]]},
 'snake':{n:12,p:[[[6],'tongue','84 18.5'],[[7,8,9,10,11],'bob','62 22'],[[9,10],'blink','c',null,0.5]]},
 'hot air balloon':{n:8,p:[[[7],'blinko','c']],whole:'hover'},
};
export const PART_ITER={spin:1,swing:3,tilt:2,flapc:7,flick:6,tuck:1,pop:1,wiggle:6,pinch:6,look:1,blink:1,blinko:4,rise:3,pulse:3,puff:2,drain:1,fill:1,twist:2,bob:3,slide:2,wave:3,wag:7,tap:5,pant:8,spout:1,squish:3,buzz:16,tongue:4};
/** Pure: the whole-picture motion an element name gets from the rules ('' = none). */
export function ruleKind(name=''){const n=String(name).toLowerCase();for(const [k,re] of LIVE_RULES)if(re.test(n))return k;return '';}
/** Pure: which built-in motion an element name gets ('' = only the paper turn). */
export function liveKind(name=''){const n=String(name).toLowerCase();return PARTS[n]?'parts':ruleKind(n);}
// V204: effects that spill onto the screen — many elements have one, always starting visibly AT the element
export const BLEED_RULES=[
 ['shipwreck',W('ship|boat|titanic|cruise ship|iceberg|ocean liner|ferry|steamship|sailboat|yacht|galleon|pirate ship|steamboat|lifeboat')],
 ['moonshot',W('rocket|spaceship|astronaut|space shuttle|moon landing|spacecraft|space rocket|lunar module|cosmonaut')],
 ['school',W('fish|salmon|dolphin|sardine|tuna|trout|carp|goldfish|flying fish|herring|koi|piranha|school of fish|shoal|mackerel|cod|bass')],
 ['giant',W('whale|blue whale|elephant|dinosaur|giant|kaiju|mammoth|woolly mammoth|t-rex|brontosaurus|titan|colossus|godzilla|giraffe|hippo|rhino|sperm whale|orca|triceratops|stegosaurus|ogre|cyclops|golem')],
 ['gunshot',W('gun|pistol|rifle|revolver|cannon|sniper|bullet|shotgun|musket|blaster|cowboy|sheriff|hunter|soldier|slingshot|crossbow')],
 ['explosion',W('explosion|bomb|dynamite|tnt|grenade|nuke|firecracker|mine|atomic bomb|nuclear bomb|blast|meteor|asteroid|supernova bomb|land mine|gunpowder')],
 ['storm',W('cloud|thunderstorm|storm|thunder|storm cloud|rain cloud|tempest|monsoon|hurricane|typhoon|cumulonimbus')],
 ['fog',W('fog|mist|haze|smog|vapor|vapour|humidity|sauna|steam room')],
 ['abduct',W('ufo|alien|flying saucer|martian|extraterrestrial|mothership')],
 ['lava',W('volcano|lava|magma|eruption|lava lamp|molten rock')],
 ['bonus',W('coin block|question block|bonus|power-up|powerup|1-up|extra life|high score|combo|pickup|loot')],
 ['levelup',W('level up|experience|xp|upgrade|trophy|medal|victory|champion|winner|achievement|gold medal|award|prize|rank up|promotion|graduation|diploma')],
 ['boss',W('boss|final boss|villain|game over|defeat|nemesis|overlord|dark lord|supervillain|mini boss|raid boss|tyrant')],
 ['tetris',W('tetris|block|puzzle|lego|building blocks|jigsaw|rubik cube|tile|domino|brick breaker|cube')],
 ['chomp',W('pac-man|pacman|maze|pellet|dot|arcade cabinet|arcade machine|labyrinth|snake game|chomper')],
 ['laser',W('laser|laser beam|space invaders|starfighter|turret|ray gun|death ray|laser tag|photon|phaser|lightsaber duel')],
 ['dice',W('dice|die|luck|board game|card|poker|lottery|playing card|gamble|chance|bingo|roulette wheel|deck of cards|tarot')],
 ['portal',W('portal|teleport|teleporter|warp|wormhole|gate|stargate|dimension|multiverse|doorway|rift')],
 ['speedlines',W('dash|sprint|anime|manga|shonen|power dash|sonic boom|flash step|rush|charge|tackle|punch|kick|martial arts|karate|kung fu|boxer|fighter')],
 ['aura',W('aura|ki|chakra|rage|fury|super saiyan|spirit bomb|energy ball|power|transformation|awakening|limit break|berserk|ultra instinct|bankai')],
 ['kawaii',W('kawaii|idol|mascot|plush|teddy bear|doll|cute|chibi|magical girl|plushie|stuffed animal|sticker|charm|cosplay')],
 ['lockon',W('mecha|gundam|transformer|cyborg|android|drone strike|radar|target|crosshair|scanner|sonar|satellite dish|terminator|battle robot')],
 ['shuriken',W('shuriken|kunai|throwing star|ninja star|dart|darts|boomerang|chakram|throwing knife')],
 ['tears',W('sadness|cry|tear|tears|sorrow|drama|tragedy|heartbreak|goodbye|loneliness|grief|onion ring|weeping willow|melancholy|blues')],
 ['butterflies',W('butterfly|moth|caterpillar|cocoon|chrysalis|monarch butterfly')],
 ['bees',W('bee|hive|beehive|honeycomb|wasp|hornet|bumblebee|swarm|mosquito|fly|gnat|locust')],
 ['flock',W('flock|migration|goose|seagull|swallow|crane|stork|pelican|flamingo|geese|sparrow|pigeon')],
 ['aurora',W('aurora|northern lights|aurora borealis|polar lights|southern lights|nebula|cosmos|galaxy|milky way')],
 ['sunset',W('sunset|dusk|evening|horizon|twilight|golden hour|afterglow')],
 ['mushrooms',W('mushroom|fungus|spore|toadstool|truffle|mold|mould|mycelium|shiitake|fairy ring')],
 ['stampede',W('horse|bison|buffalo|cow|herd|zebra|wildebeest|sheep|goat|deer|antelope|pig|stampede|cattle|reindeer|llama|alpaca|ostrich|bull|ox|yak|camel|donkey|pony')],
 ['tsunami',W('tsunami|tidal wave|surf|surfer|big wave|surfboard|breaker|swell')],
 ['twister',W('tornado|cyclone|twister|whirlwind|dust devil|waterspout|sandstorm devil')],
 ['dig',W('mole|worm|earthworm|ant|shovel|tunnel|burrow|gopher|badger|groundhog|digger|excavator|anthill|termite|prairie dog')],
 ['fireflies',W('firefly|glowworm|lightning bug|will-o-wisp|wisp|glow stick|fairy lights|bioluminescence')],
 ['dragonfire',W('dragon|wyvern|drake|hydra|fire dragon|dragon breath|wyrm|chimera')],
 ['spellcircle',W('spell|rune|ritual|summon|sorcery|enchantment|pentagram|witch|warlock|mage|necromancer|incantation|sorcerer|druid|shaman|grimoire|spellbook|hex')],
 ['potion',W('potion|elixir|cauldron|alchemy|brew|poison|antidote|philosopher stone|tonic|venom|toxin|acid')],
 ['crystal',W('crystal|gem|ruby|emerald|sapphire|amethyst|quartz|jewel|opal|topaz|geode crystal|prism shard|obsidian|pearl')],
 ['curse',W('curse|skull|death|reaper|doom|bones|plague|black magic|voodoo|omen|banshee|lich|undead|mummy|tomb|coffin|crypt')],
 ['shield',W('shield|barrier|armor|armour|helmet|fortress|castle|guard|force field|bunker|paladin|defender|bulwark|rampart|moat')],
 ['applause',W('actor|actress|stage|theater|theatre|show|performance|celebrity|comedian|magician|clap|audience|applause|spotlight|talent show|movie star|dancer|ballet|circus act')],
 ['camera',W('camera|photo|photographer|selfie|paparazzi|picture|photograph|snapshot|polaroid|film|movie|cinema|director|video')],
 ['moneyrain',W('money|cash|dollar|salary|millionaire|billionaire|paycheck|wallet|banknote|stock market|investor|tax refund|rich|wealth|fortune')],
 ['heal',W('doctor|nurse|medicine|hospital|pill|bandage|health|healing|heal|vaccine|first aid|medic|pharmacy|herbal tea|remedy|cure|vitamin|surgeon|therapy')],
 ['police',W('police|siren|ambulance|fire truck|emergency|detective|thief|robber|burglar|alarm system|police car|firefighter|rescue|prison|jail')],
 ['construction',W('builder|construction|crane|bulldozer|worker|engineer|tool|wrench|saw|drill|scaffold|blueprint|architect|cement|road work|plumber|carpenter|mechanic|toolbox')],
 ['royal',W('king|queen|crown|royal|prince|princess|emperor|empress|throne|palace|kingdom|monarch|pharaoh|sultan|duke|coronation|royalty|scepter')],
 ['goal',W('football|soccer|goal|basketball|tennis|baseball|athlete|stadium|olympics|volleyball|rugby|hockey|golf|cricket|sport|world cup|striker|goalkeeper|referee|ping pong')],
 ['lightbeam',W('god|goddess|heaven|halo|divine|holy|temple|olympus|saint|blessing|miracle|prayer|paradise|deity|cathedral|church|shrine|nirvana|enlightenment|buddha')],
 ['underworld',W('hell|underworld|hades|demon|devil|cerberus|tartarus|abyss|imp|succubus|infernal|brimstone|oni|lucifer|satan|hellhound')],
 ['stone',W('medusa|gorgon|basilisk|petrify|stone gaze|cockatrice|gargoyle|golem stone|fossilize|statue garden')],
 ['pandora',W('pandora|mystery box|loot box|gift box|chest|treasure chest|surprise|gacha|blind box|easter egg|pinata box|magic hat|top hat')],
 ['eye',W('eye|cyclops|eyeball|vision|spy|watcher|all-seeing eye|illuminati|third eye|beholder|surveillance|big brother|stalker|peeping tom|telescope|binoculars')],
 ['shadow',W('pterosaur|pterodactyl|raptor|velociraptor|eagle|hawk|falcon|vulture|condor|roc|thunderbird|airship|blimp|zeppelin|bomber|stealth bomber')],
 ['cavepaint',W('cave|cave painting|caveman|tribe|stone age|neanderthal|hunter-gatherer|cavewoman|petroglyph|flint|bonfire dance|totem|primitive tool|club')],
 ['meteors',W('meteor shower|extinction|asteroid belt|shooting stars|comet tail|bolide|impact|armageddon|apocalypse|doomsday')],
 ['amber',W('amber|tar pit|resin|sap|fossil amber|mosquito in amber|beeswax|caramel|molasses|glue')],
 ['lanterns',W('lantern|lantern festival|paper lantern|lunar new year|chinese new year|diwali|sky lantern|candlelight|vigil|festival of lights')],
 ['route',W('travel|tourist|map|globe|passport|journey|vacation|suitcase|voyage|expedition|explorer|road trip|adventure|backpacker|world tour|navigation|gps|airline|airport')],
 ['bunting',W('flag|country|nation|embassy|fair|fete|village fair|street party|independence day|national day|bunting|garland|banner|pennant')],
 ['skyline',W('city|skyline|tower|skyscraper|metropolis|new york|paris|tokyo|london|downtown|capital|megacity|building|apartment|office|town|village|neighborhood')],
 ['train',W('train|locomotive|subway|tram|railway|steam train|bullet train|metro|freight train|monorail|railroad|express')],
 ['balloons',W('balloon|party balloon|balloon animal|helium|water balloon|bubble tea')],
 ['mirage',W('mirage|oasis|heat|heatwave|drought|desert sun|sahara|scorching|hot day|sauna heat|fever')],
 ['web',W('spider|web|cobweb|spiderweb|tarantula')],
 ['paws',W('cat|dog|wolf|fox|bear|lion|tiger|rabbit|bunny|puppy|kitten|panda|raccoon|squirrel|mouse|rat|hamster|leopard|cheetah|werewolf|cub|pet|paw')],
 ['feathers',W('bird|chicken|duck|eagle|angel|parrot|goose|swan|pigeon|dove|crow|raven|rooster|turkey|peacock|pegasus|griffin|pillow fight|feather|hen|penguin')],
 ['zoom',W('car|train|plane|airplane|jet|race car|motorcycle|bicycle|bike|horse|skateboard|speed|bullet|arrow|missile|cheetah run|bus|truck|taxi|scooter|sled|spaceship|ufo ride|roller coaster|ambulance|fire truck|racer|runner|sprinter')],
 ['slash',W('sword|blade|knife|katana|ninja|samurai|hero|knight|warrior|axe|dagger|scissors|claw|saber|lightsaber|pirate sword|gladiator|viking|assassin|duel|spear|scythe')],
 ['crack',W('rock|stone|glass|mirror|hammer|boulder|brick|wall|mountain|pickaxe|window|vase|plate|egg|nut|fossil|statue|concrete|geode|cliff|quarry|marble|pebble')],
 ['grow',W('seed|plant|vine|grass|sprout|tree|sapling|ivy|bamboo|beanstalk|moss|fern|jungle|forest|root|weed|earth|soil|farm|field|bush|cactus|herb')],
 ['leaves',W('leaf|leaves|autumn|fall|wood|log|oak|maple|park|compost heap|rake|salad|lettuce|tea leaf|branch')],
 ['splat',W('mud|slime|pie|tomato|jam|honey|chocolate|ketchup|goo|syrup|jelly|pudding|paintball|custard|mayonnaise|mustard|clay|swamp|quicksand|dough|batter|cream')],
 ['yum',W('apple|bread|pizza|cheese|burger|fruit|cookie|candy|meat|soup|sandwich|donut|ice cream|pasta|rice|sushi|taco|cupcake|steak|fish and chips|banana|strawberry|pancake|waffle|popcorn|noodle|hot dog|salad bowl|food|meal|feast|picnic|bacon|sausage|chicken leg|lollipop|muffin|bagel|pretzel|croissant')],
 ['letters',W('book|paper|letter|word|library|story|newspaper|alphabet|pen|pencil|school|homework|poem|novel|dictionary|scroll|diary|comic|magazine|typewriter|author|writer|teacher|student|language|email|message|quiz')],
 ['rewind',W('clock|time|watch|calendar|history|future|past|time machine|stopwatch|alarm clock|grandfather clock|cuckoo clock|year|century|age')],
 ['pixels',W('pixel|8-bit|16-bit|32-bit|64-bit|128-bit|video game|arcade|console|computer|robot|code|glitch|internet|hacker|virus|ai|laptop|game|gamer|joystick|controller|cartridge|server|program|app|website|cpu|chip|circuit board')],
 ['pull',W('gravity|black hole|magnet|vortex|whirlpool|vacuum|vacuum cleaner|tractor beam')],
 ['ghost',W('ghost|spirit|phantom|halloween|haunted house|poltergeist|wraith|specter|spectre|graveyard|zombie|skeleton|soul|grim reaper')],
 ['rainbow',W('rainbow|prism|unicorn|aurora')],
 ['ink',W('ink|squid|octopus|oil|tar|paint|kraken|oil spill|petroleum')],
 ['gold',W('gold|treasure|coin|money|jackpot|bank|pirate|leprechaun|diamond|vault|casino|slot machine|treasure chest')],
 ['sparks',W('firework|fireworks|spark|sparkler|comet|shooting star|supernova|star|magic|wizard|wand|fairy|spell|wish')],
 ['confetti',W('party|birthday|celebration|cake|festival|carnival|new year|parade|pinata|circus|clown|gift|present|birthday cake')],
 ['music',W('music|song|melody|piano|guitar|flute|sound|violin|radio|orchestra|band|singer|trumpet|harp|jukebox|concert|drum|music box|opera|choir|metronome|bell')],
 ['hearts',W('love|heart|life|romance|kiss|valentine|cupid|wedding|hug|friendship')],
 ['zzz',W('sleep|dream|pillow|bed|lullaby|nap|hypnosis|sloth|sandman')],
 ['stink',W('garbage|trash|skunk|rotten egg|sewer|onion|garlic|fart|stink|manure|compost|dung|sock|durian|landfill')],
 ['bubbles',W('bubble|soap|shampoo|foam|soda|champagne|bath|bubblegum|detergent|washing machine|jacuzzi|beer')],
 ['bloom',W('flower|garden|spring|blossom|pollen|rose|tulip|cherry blossom|meadow|bouquet|sakura|daisy|sunflower|lotus|butterfly|bee')],
 ['snow',W('snow|blizzard|winter|snowflake|snowman|snowstorm|avalanche')],
 ['frost',W('ice|ice cube|frost|glacier|iceberg|freezer|icicle|permafrost|ice age')],
 ['burn',W('fire|flame|wildfire|bonfire|blaze|inferno|fireball|lava|magma|dragon|torch|hellfire|phoenix|candle')],
 ['smoke',W('smoke|steam|campfire|exhaust|incense|chimney|cigar|factory|ash')],
 ['bolt',W('lightning|thunder|electricity|energy|thunderstorm|storm|tesla coil|plasma|zeus|thor')],
 ['quake',W('earthquake|landslide|stampede|avalanche|tremor|jackhammer|drum roll')],
 ['gust',W('wind|air|breeze|gale|hurricane|tornado|typhoon|cyclone|fan|wind turbine|windmill')],
 ['flood',W('water|sea|ocean|wave|tsunami|flood|river|rain|waterfall|tide|lake')],
 ['night',W('moon|night|darkness|shadow|eclipse|midnight|dusk|bat|vampire|owl')],
 ['sunrise',W('sun|day|sunlight|sunshine|dawn|sunrise|summer|light|daylight|lighthouse')],
 ['sand',W('sand|desert|sandstorm|dust|dune|dust storm|beach|hourglass')],
];
// no rule for the name? the element's family still gives it something that fits
export const FAMILY_BLEED={games:'pixels',anime:'slash',nature:'leaves',fantasy:'sparks',people:'letters',mythology:'sunrise',prehistoric:'crack',world:'confetti'};
/** Pure: the screen effect an element can spill ('' = none; pass the family to get the family fallback). */
export function bleedOf(name='',family=''){const n=String(name).toLowerCase();for(const [k,re] of BLEED_RULES)if(re.test(n))return k;return FAMILY_BLEED[family]||'';}
// how the companions take it: [pose, expression]
export const REACT={burn:['scared','wow'],smoke:['sniff','dizzy'],flood:['hopwalk','happy'],frost:['scared','sad'],snow:['scared','sad'],gust:['push','angry'],quake:['scared','wow'],bolt:['scared','wow'],
 hearts:['wave','love'],bubbles:['jump','happy'],night:['sleep','sleepy'],zzz:['sleep','sleepy'],sunrise:['stretch','happy'],music:['duo-cheer','happy'],bloom:['sniff','happy'],confetti:['celebrate','happy'],sparks:['celebrate','wow'],
 gold:['celebrate','wow'],ink:['sulk','sad'],bonus:['jump','happy'],levelup:['celebrate','happy'],boss:['scared','wow'],tetris:['point','wow'],chomp:['scared','wow'],laser:['duo-cover','wow'],dice:['point','wow'],portal:['peek','wow'],speedlines:['push','angry'],aura:['stomp','angry'],kawaii:['wave','love'],lockon:['scared','wow'],shuriken:['duo-guard','angry'],tears:['sulk','sad'],butterflies:['jump','happy'],bees:['scared','wow'],flock:['wave','wow'],aurora:['peek','wow'],sunset:['stretch','happy'],mushrooms:['sniff','wow'],stampede:['scared','wow'],tsunami:['scared','wow'],twister:['tumble','dizzy'],dig:['sniff','wow'],fireflies:['peek','happy'],dragonfire:['duo-cover','wow'],spellcircle:['peek','wow'],potion:['shake','dizzy'],crystal:['peek','wow'],curse:['scared','sad'],shield:['duo-guard','smug'],applause:['celebrate','happy'],camera:['wave','smug'],moneyrain:['celebrate','wow'],heal:['celebrate','love'],police:['scared','wow'],construction:['point','wow'],royal:['duo-bow','happy'],goal:['celebrate','happy'],lightbeam:['peek','wow'],underworld:['scared','wow'],stone:['sulk','sleepy'],pandora:['peek','wow'],eye:['duo-cover','wow'],shadow:['duo-cover','wow'],cavepaint:['point','happy'],meteors:['scared','wow'],amber:['sulk','sleepy'],lanterns:['peek','happy'],route:['wave','happy'],bunting:['celebrate','happy'],skyline:['peek','wow'],train:['jump','wow'],balloons:['jump','happy'],mirage:['shake','dizzy'],fog:['peek','wow'],storm:['scared','wow'],explosion:['tumble','dizzy'],giant:['scared','wow'],school:['jump','happy'],shipwreck:['scared','sad'],moonshot:['wave','wow'],gunshot:['duo-cover','wow'],abduct:['scared','wow'],lava:['scared','wow'],visitor:['wave','happy'],paws:['stalk','wow'],feathers:['jump','happy'],zoom:['jump','wow'],slash:['duo-guard','angry'],crack:['scared','wow'],grow:['sniff','happy'],leaves:['sniff','happy'],splat:['sulk','sad'],yum:['eat','happy'],letters:['point','wow'],rewind:['shake','dizzy'],pixels:['shake','wow'],web:['scared','wow'],pull:['tumble','dizzy'],ghost:['duo-cover','wow'],rainbow:['wave','wow'],sand:['shake','dizzy'],stink:['refuse','sad']};
export const LIVE_MS={flame:3200,smoke:3600,water:3200,melt:4200,beat:2400,erupt:3000,glow:3000,zap:1800,flap:2600,swim:2800,critter:2600,spin:2600,wind:3200,quake:1500,bounce:2200,shell:3800,hover:3000,parts:3400,turn:2000};
export const SOUND_AS={bonus:'gold',levelup:'sunrise',boss:'quake',tetris:'pixels',chomp:'pixels',laser:'zap',dice:'letters',portal:'pull',speedlines:'zoom',aura:'burn',kawaii:'bloom',lockon:'pixels',shuriken:'slash',tears:'melt',butterflies:'flap',bees:'flap',flock:'flap',aurora:'rainbow',sunset:'night',mushrooms:'bounce',stampede:'paws',tsunami:'flood',twister:'gust',dig:'paws',fireflies:'glow',dragonfire:'burn',spellcircle:'ghost',potion:'bubbles',crystal:'frost',curse:'ghost',shield:'glow',applause:'confetti',camera:'slash',moneyrain:'gold',heal:'sunrise',police:'abduct',construction:'crack',royal:'music',goal:'bounce',lightbeam:'sunrise',underworld:'lava',stone:'crack',pandora:'sparks',eye:'ghost',shadow:'giant',cavepaint:'paws',meteors:'explosion',amber:'splat',lanterns:'night',route:'zoom',bunting:'confetti',skyline:'night',train:'zoom',balloons:'bubbles',mirage:'sand'};
export const BLEED_MS={chomp:5200,stampede:5000,tsunami:4600,twister:5200,dragonfire:5200,shadow:4200,route:5400,train:4800,eye:5200,goal:5200,butterflies:5600,bees:5600,flock:5000,portal:4600,quake:2000,bolt:2000,pull:2600,slash:2200,pixels:2400,rewind:2600,zoom:2600,fog:6200,storm:5800,explosion:3400,giant:5400,school:5400,shipwreck:6400,moonshot:5600,visitor:6000,gunshot:4400,abduct:5600,lava:4800};
const DEFS=`<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="lvFlame" x="-25%" y="-35%" width="150%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".03 .11" numOctaves="2" seed="3"><animate attributeName="baseFrequency" dur="1.1s" values=".03 .11;.05 .17;.02 .09;.03 .11" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="lvSmoke" x="-30%" y="-40%" width="160%" height="170%"><feTurbulence type="fractalNoise" baseFrequency=".02 .035" numOctaves="2" seed="8"><animate attributeName="baseFrequency" dur="3.4s" values=".02 .035;.035 .02;.02 .035" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="G" yChannelSelector="R"/></filter>
<filter id="lvWater" x="-25%" y="-15%" width="150%" height="130%"><feTurbulence type="turbulence" baseFrequency=".012 .09" numOctaves="1" seed="5"><animate attributeName="baseFrequency" dur="2.2s" values=".012 .09;.012 .14;.012 .09" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="B"/></filter>
<filter id="lvMelt" x="-25%" y="-15%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".09 .012" numOctaves="1" seed="2"/><feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" dur="4.2s" values="0;16;16;0" keyTimes="0;.4;.62;1" repeatCount="indefinite"/></feDisplacementMap></filter>
</defs></svg>`;
export function createLiving(ctx){
 const doc=document;let timer=0,bleedTimer=0,lastSound=0,started=false,lastBleed='';
 const MAX_LIVE=12;const active=new Map();let source=null;   // id -> {kind,ms,t0,undo}
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const reduced=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches;}catch{return false;}};
 function ensure(){if(doc.getElementById('livingDefs'))return;const d=doc.createElement('div');d.id='livingDefs';d.innerHTML=DEFS;doc.body.append(d);const fx=doc.createElement('div');fx.id='livingFx';fx.setAttribute('aria-hidden','true');doc.body.append(fx);}
 const visible=()=>{const out=[];const vp=doc.getElementById('inventoryVirtual')?.parentElement?.getBoundingClientRect();const top=Math.max(60,vp?vp.top:90),bot=Math.min(innerHeight-60,vp?vp.bottom:innerHeight-70);for(const c of doc.querySelectorAll('#viewPlay .element-chip')){const r=c.getBoundingClientRect();if(r.width&&r.top>=top-2&&r.bottom<=bot+2)out.push(c);}return out;};
 const nameOf=c=>ctx.nameOf(c.dataset.id)||'';
 // ---------- sound: small synthesised cues ----------
 function noise(ac,dur){const n=Math.floor(ac.sampleRate*dur),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const s=ac.createBufferSource();s.buffer=b;return s;}
 function sound(kind,loud=1){const now=Date.now();if(now-lastSound<(loud>1?600:6000))return;const ac=ctx.audio?.();if(!ac||ac.state==='closed')return;lastSound=now;kind=SOUND_AS[kind]||kind;
  try{const t=ac.currentTime+0.02,out=ac.createGain();out.gain.value=0.05*loud;out.connect(ac.destination);
   const tone=(f0,f1,d,type='sine',v=1,at=0)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+at);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+at+d);g.gain.setValueAtTime(0.0001,t+at);g.gain.exponentialRampToValueAtTime(v,t+at+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+at+d);o.connect(g);g.connect(out);o.start(t+at);o.stop(t+at+d+0.05);};
   const hiss=(d,type,f0,f1,q=1,v=1,at=0)=>{const s=noise(ac,d),f=ac.createBiquadFilter(),g=ac.createGain();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t+at);f.frequency.exponentialRampToValueAtTime(f1,t+at+d);g.gain.setValueAtTime(0.0001,t+at);g.gain.exponentialRampToValueAtTime(v,t+at+d*0.25);g.gain.exponentialRampToValueAtTime(0.0001,t+at+d);s.connect(f);f.connect(g);g.connect(out);s.start(t+at);s.stop(t+at+d+0.05);};
   const crackle=(d,v=1)=>{for(let i=0;i<Math.round(d*14);i++)hiss(0.03,'highpass',2500+Math.random()*3000,1800,1,v*(0.4+Math.random()*0.8),Math.random()*d);};
   const notes=(fs,step=0.16,type='sine',v=0.4,d=0.3)=>fs.forEach((f,i)=>tone(f,f*1.005,d,type,v,i*step));
   if(kind==='flame'){hiss(1.4,'lowpass',500,260,0.7,0.9);crackle(1.3,0.7);}
   else if(kind==='burn'){hiss(2.6,'lowpass',700,220,0.7,1.2);crackle(2.5,1);}
   else if(kind==='smoke'){hiss(1.6,'bandpass',900,2600,0.8,0.5);}
   else if(kind==='water'||kind==='flood'){hiss(kind==='flood'?2.4:1.3,'lowpass',400,1400,0.6,0.8);for(let i=0;i<5;i++)tone(500+Math.random()*500,900+Math.random()*600,0.09,'sine',0.35,Math.random()*1.2);}
   else if(kind==='melt'){for(let i=0;i<4;i++)tone(1500-i*120,700-i*60,0.12,'sine',0.5,0.4+i*0.55);}
   else if(kind==='frost'||kind==='snow'){for(let i=0;i<7;i++)tone(2200+Math.random()*1800,2600+Math.random()*1500,0.22,'triangle',0.3,i*0.16);hiss(1.6,'highpass',5000,7000,1,0.25);}
   else if(kind==='beat'){for(const a of [0,0.26,0.95,1.21])tone(95,48,0.16,'sine',1.6,a);}
   else if(kind==='hearts'){notes([660,880,990,1320],0.2,'sine',0.4,0.5);for(const a of [0,0.26])tone(95,48,0.16,'sine',1.2,a);}
   else if(kind==='erupt'||kind==='quake'){tone(70,34,1.2,'sawtooth',0.9);hiss(1.2,'lowpass',240,90,0.8,1.6);}
   else if(kind==='glow'||kind==='sunrise'){notes(kind==='sunrise'?[523,659,784,1047,1319]:[1320,1760,2640],0.15,'sine',0.3,0.6);}
   else if(kind==='zap'||kind==='bolt'){for(let i=0;i<4;i++)tone(1800+Math.random()*2400,200,0.07,'square',0.35,i*0.09);if(kind==='bolt'){tone(90,30,1.4,'sawtooth',0.8,0.3);hiss(1.5,'lowpass',300,80,0.7,1.5,0.3);}}
   else if(kind==='flap'||kind==='hover'){for(let i=0;i<5;i++)hiss(0.11,'bandpass',700,300,1.2,0.8,i*0.2);}
   else if(kind==='swim'||kind==='bubbles'){for(let i=0;i<(kind==='bubbles'?9:3);i++)tone(420+Math.random()*500,900+Math.random()*700,0.1,'sine',0.4,i*(kind==='bubbles'?0.17:0.3));}
   else if(kind==='wind'||kind==='gust'||kind==='sand'){hiss(kind==='wind'?1.6:2.4,'bandpass',300,kind==='sand'?2400:1300,2.2,kind==='wind'?0.7:1.5);}
   else if(kind==='spin'||kind==='pull'){tone(kind==='pull'?700:240,kind==='pull'?60:520,kind==='pull'?1.4:0.9,'triangle',0.4);}
   else if(kind==='bounce'){for(const [a,v] of [[0,0.9],[0.42,0.6],[0.72,0.35]])tone(300,120,0.12,'sine',v,a);}
   else if(kind==='shell'){tone(520,260,0.1,'triangle',0.5);tone(300,560,0.12,'triangle',0.5,2.2);}
   else if(kind==='critter'||kind==='parts'){tone(880,1250,0.08,'triangle',0.35);tone(990,1400,0.08,'triangle',0.3,0.16);}
   else if(kind==='music'){notes([523,659,784,659,880,784,1047],0.17,'triangle',0.45,0.28);}
   else if(kind==='bloom'||kind==='rainbow'){notes(kind==='rainbow'?[523,587,659,698,784,880,988,1047]:[784,988,1175,1568],0.13,'sine',0.3,0.45);}
   else if(kind==='confetti'||kind==='sparks'){for(let i=0;i<6;i++)hiss(0.06,'highpass',1800,900,1,1,i*0.11+Math.random()*0.05);crackle(1.2,0.5);if(kind==='sparks')tone(300,1800,0.4,'sine',0.3);}
   else if(kind==='gold'){for(let i=0;i<8;i++)tone(2400+Math.random()*900,2300,0.09,'triangle',0.45,i*0.11);}
   else if(kind==='ink'){tone(160,60,0.5,'sine',1);hiss(0.5,'lowpass',500,120,1,0.9);}
   else if(kind==='web'){for(let i=0;i<5;i++)tone(900+i*220,880+i*220,0.18,'triangle',0.3,i*0.1);}
   else if(kind==='ghost'){const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.frequency.setValueAtTime(420,t);o.frequency.linearRampToValueAtTime(620,t+1);o.frequency.linearRampToValueAtTime(380,t+2.2);l.frequency.value=6;lg.gain.value=18;l.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.8,t+0.4);g.gain.exponentialRampToValueAtTime(0.0001,t+2.3);o.connect(g);g.connect(out);o.start(t);l.start(t);o.stop(t+2.4);l.stop(t+2.4);}
   else if(kind==='night'||kind==='zzz'){notes([784,659,587,523,392],0.32,'sine',0.35,0.7);}
   else if(kind==='leaves'||kind==='feathers'||kind==='grow'){hiss(1.6,'bandpass',1800,3200,1.5,0.5);if(kind==='grow')notes([392,494,587,784],0.2,'sine',0.3,0.5);}
   else if(kind==='paws'){for(let i=0;i<8;i++)tone(180,90,0.06,'sine',0.9,i*0.2);}
   else if(kind==='zoom'){hiss(1.1,'bandpass',400,3000,3,1.4);tone(200,900,0.9,'sawtooth',0.25);}
   else if(kind==='slash'){hiss(0.22,'highpass',3000,6000,1,1.4,0.2);hiss(0.22,'highpass',3000,6000,1,1.4,0.5);tone(2200,1800,0.3,'triangle',0.3,0.55);}
   else if(kind==='crack'){for(let i=0;i<7;i++)hiss(0.05,'highpass',1500+Math.random()*2000,900,1,1.4,i*0.09+Math.random()*0.04);tone(120,50,0.5,'sawtooth',0.6);}
   else if(kind==='splat'){tone(160,60,0.5,'sine',1);hiss(0.5,'lowpass',500,120,1,0.9);}
   else if(kind==='yum'){for(let i=0;i<5;i++)hiss(0.07,'bandpass',900,500,2,1,i*0.22);notes([784,988],0.2,'sine',0.3,0.3);}
   else if(kind==='letters'){for(let i=0;i<9;i++)tone(700+Math.random()*900,650+Math.random()*800,0.05,'square',0.2,i*0.12);}
   else if(kind==='rewind'){tone(900,160,1.2,'sawtooth',0.3);for(let i=0;i<10;i++)tone(1400-i*90,1300-i*90,0.04,'square',0.2,i*0.1);}
   else if(kind==='pixels'){notes([523,659,784,1047,784,1047],0.09,'square',0.25,0.1);for(let i=0;i<5;i++)hiss(0.05,'bandpass',3000,800,4,0.8,0.5+i*0.07);}
   else if(kind==='fog'){hiss(3.2,'lowpass',300,700,0.5,0.7);}
   else if(kind==='storm'){hiss(4.5,'highpass',2500,4000,0.5,0.45);for(const a of [1.5,3.0]){tone(90,30,1.3,'sawtooth',0.8,a);hiss(1.3,'lowpass',300,80,0.7,1.5,a);}}
   else if(kind==='explosion'){tone(140,28,0.9,'sine',2.2);hiss(1.1,'lowpass',1200,90,0.6,2.2);crackle(1.4,0.6);}
   else if(kind==='giant'){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(240,t);o.frequency.exponentialRampToValueAtTime(110,t+1.4);o.frequency.exponentialRampToValueAtTime(180,t+2.4);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.9,t+0.5);g.gain.exponentialRampToValueAtTime(0.0001,t+2.6);o.connect(g);g.connect(out);o.start(t);o.stop(t+2.7);tone(60,30,0.6,'sine',1.8,1.3);}
   else if(kind==='school'){for(let i=0;i<7;i++){hiss(0.18,'bandpass',900,2600,1.2,0.9,0.9+i*0.42);tone(500+Math.random()*300,1100,0.08,'sine',0.3,0.9+i*0.42);}}
   else if(kind==='shipwreck'){tone(175,172,0.7,'sawtooth',0.5,0.3);tone(175,172,0.5,'sawtooth',0.5,1.2);hiss(0.7,'lowpass',1400,120,0.7,2,3.1);tone(300,90,1.4,'triangle',0.5,3.4);for(let i=0;i<6;i++)tone(400+Math.random()*400,800,0.08,'sine',0.3,4.2+i*0.2);}
   else if(kind==='moonshot'){hiss(3,'bandpass',200,2400,1,1.3);tone(80,260,3,'sawtooth',0.25);notes([784,988,1175,1568],0.14,'sine',0.4,0.5);}
   else if(kind==='visitor'){notes([880,1175,988,1320],0.13,'triangle',0.4,0.2);}
   else if(kind==='gunshot'){hiss(0.16,'highpass',900,300,0.7,2.6);tone(190,50,0.18,'square',1.2);for(let i=0;i<5;i++)tone(2600+Math.random()*2400,2200,0.06,'triangle',0.35,0.12+i*0.05);}
   else if(kind==='abduct'){const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.type='sine';o.frequency.setValueAtTime(500,t);o.frequency.linearRampToValueAtTime(900,t+2);o.frequency.linearRampToValueAtTime(600,t+4);l.frequency.value=9;lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5,t+0.4);g.gain.exponentialRampToValueAtTime(0.0001,t+4.2);o.connect(g);g.connect(out);o.start(t);l.start(t);o.stop(t+4.3);l.stop(t+4.3);}
   else if(kind==='lava'){hiss(3,'lowpass',260,500,0.8,1.2);for(let i=0;i<9;i++)tone(120+Math.random()*90,260,0.12,'sine',0.7,Math.random()*3);}
   else if(kind==='stink'){tone(110,70,0.35,'sawtooth',0.7);hiss(0.4,'bandpass',300,180,3,0.9,0.05);}
  }catch{}}
 // ---------- one element comes alive ----------
 function applyParts(art,spec,ms,gone=0){const svg=art.querySelector('svg');if(!svg)return null;const all=[...svg.querySelectorAll('*')];if(all.length!==spec.n)return null;const done=[],wraps=[];
  for(const [idx,anim,origin,vars,delay] of spec.p){const it=PART_ITER[anim]||1;for(const i of idx){let g=all[i];if(!g)continue;if(g.hasAttribute('transform')){const w=doc.createElementNS('http://www.w3.org/2000/svg','g');g.replaceWith(w);w.append(g);wraps.push(w);g=w;}if(origin==='c'){g.style.transformBox='fill-box';g.style.transformOrigin='50% 50%';}else{const [x,y]=origin.split(' ');g.style.transformBox='view-box';g.style.transformOrigin=`${x}px ${y}px`;}
    if(vars)for(const k in vars)g.style.setProperty(k,vars[k]);g.style.animation=`lvp-${anim} ${Math.round(ms/it)}ms ease-in-out ${(delay?Math.round(ms/it*delay):0)-gone}ms ${it} both`;done.push(g);}}
  return ()=>{for(const g of done){g.style.animation='';g.style.transformBox='';g.style.transformOrigin='';}for(const w of wraps){try{w.replaceWith(...w.childNodes);}catch{}}};}
 // paint (or re-paint after the list re-rendered) the motion of one element, `gone` ms into its loop
 function paint(chip,st,gone=0){const art=chip.querySelector('.chip-art');if(!art)return;let kind=st.kind;st.undo=null;
  if(kind==='parts'){const spec=PARTS[nameOf(chip).toLowerCase()];st.undo=spec?applyParts(art,spec,st.ms,gone):null;if(!st.undo){kind=st.kind=ruleKind(nameOf(chip))||'';if(!kind)return;}else kind=spec.whole||'parts';}
  chip.dataset.live=kind;chip.classList.add('is-live');art.style.setProperty('--lv-ms',st.ms+'ms');art.style.setProperty('--lv-delay',(-gone)+'ms');if(source===chip.dataset.id)chip.classList.add('is-source');}
 function play(chip,kind,ms,quiet){const id=chip.dataset.id;if(active.has(id))return false;const st={kind,ms,t0:Date.now(),undo:null};active.set(id,st);paint(chip,st,0);if(!st.kind){active.delete(id);return false;}
  if(!quiet&&Math.random()<0.3)sound(st.kind);
  setTimeout(()=>{active.delete(id);const c=find(id);if(c){c.classList.remove('is-live');delete c.dataset.live;}try{st.undo?.();}catch{}},ms+60);return true;}
 // scrolling or tapping re-renders the list: carry every running motion over to the new nodes, mid-loop
 function carry(){for(const [id,st] of active){const c=find(id);if(c&&!c.classList.contains('is-live')){const gone=Date.now()-st.t0;if(gone<st.ms-80)paint(c,st,gone);}}if(source){const c=find(source);if(c)c.classList.add('is-source');}}
 function watch(){const root=doc.getElementById('inventoryVirtual');if(!root||!window.MutationObserver)return;let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;try{carry();}catch{}});}).observe(root,{childList:true,subtree:false});}
 function tick(){clearTimeout(timer);timer=setTimeout(tick,rnd(320,800));if(!ctx.canRun?.()||reduced()||active.size>=MAX_LIVE)return;
  // only elements with a motion of their own move; the rest stay still
  const pool=visible().filter(c=>!active.has(c.dataset.id)&&liveKind(nameOf(c)));if(!pool.length)return;const chip=pool[Math.floor(Math.random()*pool.length)];const kind=liveKind(nameOf(chip));play(chip,kind,LIVE_MS[kind]||2400);}
 // ---------- one effect at a time spills onto the screen, clearly from its element ----------
 const artOf=chip=>chip.querySelector('.chip-art')?.innerHTML||'';
// V207: scenes described with the shared building blocks (P): rise, fall, burst, wash, banner, stamp, actor, swarm, herd, chips, quake, later
 const SCENES={
 bonus:(P)=>{P.rise('lf-glyph is-gold',12,['+1','+5','★','+1'],60);P.burst('lf-coin',10);},
 levelup:(P)=>{P.banner('LEVEL UP!','is-gold');P.burst('lf-spark',26,null,['#FFD166','#FFF3C4','#6FB26A']);P.rise('lf-glyph is-gold',8,['▲','★'],80);},
 boss:(P)=>{P.wash('is-danger');P.banner('WARNING','is-danger');P.quake(400,900);},
 tetris:(P)=>{const cols=['#E8566E','#5AAED2','#FFD166','#6FB26A','#B39DDB','#E8843C'],n=Math.floor(P.W/30);for(let r=0;r<3;r++)for(let i=0;i<n;i++){const b=P.el('lf-block',`left:${i*30+(P.W-n*30)/2}px;--to:${P.H-70-r*30}px;background:${cols[(i+r*2)%cols.length]};animation-delay:${0.3+r*0.5+P.rnd(0,0.45)}s`);P.fx.append(b);}P.later(2700,()=>P.fx.append(P.el('lf-flash is-soft')));},
 chomp:(P)=>{const row=P.y,dir=P.x<P.W/2?1:-1;for(let i=1;i<10;i++)P.fx.append(P.el('lf-dot',`left:${P.x+dir*i*36}px;top:${row}px;animation:lf-dotin .3s ease-out ${i*0.04}s 1 both,lf-dotout .01s linear ${Math.round(400+(i*36)/(P.W+80)*3800)}ms 1 forwards`));const c=P.el('lf-chomp',`left:${P.x}px;top:${row}px;--zs:${dir}`);P.fx.append(c);c.animate([{transform:`translateX(0) scaleX(${dir})`},{transform:`translateX(${dir*(P.W+80)}px) scaleX(${dir})`}],{duration:3800,delay:400,fill:'both'});P.actor('',[{transform:`translateX(${-dir*80}px)`,opacity:0,offset:0},{opacity:1,offset:0.2},{transform:`translateX(${dir*(P.W)}px)`,opacity:1,offset:1}],{cls:'is-ghostie',css:`left:${P.x}px;top:${row}px;`,delay:1500,dur:3200});},
 laser:(P)=>{for(let i=0;i<5;i++)P.fx.append(P.el('lf-laser',P.at()+`--r0:${P.rnd(-170,170)}deg;--r1:${P.rnd(-170,170)}deg;animation-delay:${0.2+i*0.45}s;background:${['#E8566E','#5AAED2','#6FB26A'][i%3]}`));P.fx.append(P.el('lf-flash is-soft'));},
 dice:(P)=>P.burst('lf-glyph is-card',18,['⚀','⚃','⚅','♠','♥','♦','♣','⚁']),
 portal:(P)=>{const tx=P.W-P.x+P.rnd(-30,30),ty=Math.min(P.H-160,P.y+P.rnd(160,320));P.fx.append(P.el('lf-portal',P.at()));P.fx.append(P.el('lf-portal is-out',`left:${tx}px;top:${ty}px`));P.actor(P.art(),[{transform:'scale(1) rotate(0)',opacity:1,offset:0},{transform:'scale(.1) rotate(360deg)',opacity:0,offset:0.22},{transform:`translate(${tx-P.x}px,${ty-P.y}px) scale(.1) rotate(360deg)`,opacity:0,offset:0.3},{transform:`translate(${tx-P.x}px,${ty-P.y}px) scale(1.8) rotate(720deg)`,opacity:1,offset:0.5},{transform:`translate(${tx-P.x}px,${ty-P.y}px) scale(1.8) rotate(720deg)`,opacity:1,offset:0.7},{transform:`translate(${tx-P.x}px,${ty-P.y}px) scale(.1) rotate(1080deg)`,opacity:0,offset:0.85},{transform:'scale(1) rotate(1080deg)',opacity:1,offset:1}]);},
 speedlines:(P)=>{P.fx.append(P.el('lf-speed',P.at()));P.quake(300,500);P.chips('lv-gusted',1300,1.2);},
 aura:(P)=>{P.fx.append(P.el('lf-aura',P.at()));P.rise('lf-streakup',16,null,70);P.quake(500,1400);},
 kawaii:(P)=>{P.burst('lf-glyph is-pastel',24,['✿','♥','★','✦','❀']);P.wash('is-pink');},
 lockon:(P)=>{visible().filter(c=>c!==P.chip).sort(()=>Math.random()-0.5).slice(0,4).forEach((c,i)=>{const b=c.getBoundingClientRect();P.fx.append(P.el('lf-reticle',`left:${b.left+b.width/2}px;top:${b.top+b.height/2}px;width:${b.width+14}px;height:${b.height+14}px;animation-delay:${0.3+i*0.5}s`));});P.wash('is-scan');},
 shuriken:(P)=>{for(let i=0;i<6;i++){const a=P.rnd(0,6.28),d=Math.max(P.W,P.H);P.actor('<b>✦</b>',[{transform:'translate(0,0) rotate(0) scale(.6)',offset:0},{transform:`translate(${Math.cos(a)*d*0.45}px,${Math.sin(a)*d*0.45}px) rotate(900deg) scale(1.6)`,offset:0.35},{transform:`translate(${Math.cos(a)*d*0.45}px,${Math.sin(a)*d*0.45}px) rotate(900deg) scale(1.6)`,opacity:1,offset:0.85},{transform:`translate(${Math.cos(a)*d*0.45}px,${Math.sin(a)*d*0.45}px) rotate(900deg) scale(1.6)`,opacity:0,offset:1}],{cls:'is-star',delay:200+i*160,dur:2600,ease:'cubic-bezier(.1,.7,.2,1)'});}},
 tears:(P)=>{P.wash('is-blue');P.fall('lf-tear',26);},
 butterflies:(P)=>P.swarm(9,P.art()),
 bees:(P)=>P.swarm(12,P.art()),
 flock:(P)=>{const dir=P.x<P.W/2?1:-1;for(let i=0;i<7;i++){const row=Math.ceil(i/2),side=i%2?1:-1,oy=120+row*26*side*(i?1:0)+60,ox=-row*34;P.actor(P.art(),[{transform:`translate(${dir>0?-80+ox:P.W+80-ox}px,${oy}px) scale(1.2) scaleX(${dir})`,offset:0},{transform:`translate(${P.W/2+ox*dir}px,${oy-30}px) scale(1.2) scaleX(${dir})`,offset:0.5},{transform:`translate(${dir>0?P.W+120+ox:-120-ox}px,${oy+10}px) scale(1.2) scaleX(${dir})`,offset:1}],{cls:'is-small is-flap',css:'left:0;top:0;',delay:500,dur:3600});}P.actor(P.art(),[{transform:'translate(0,0) scale(1)',opacity:1,offset:0},{transform:`translate(${(P.x<P.W/2?-1:1)*40}px,${190-P.y}px) scale(1.2)`,opacity:0,offset:1}],{dur:700});},
 aurora:(P)=>{P.wash('is-night');for(let i=0;i<3;i++)P.fx.append(P.el('lf-aurora',`top:${60+i*70}px;animation-delay:${0.5+i*0.3}s;--h:${[150,190,280][i]}`));},
 sunset:(P)=>{P.wash('is-sunset');P.fx.append(P.el('lf-sun',`left:${P.W/2}px`));},
 mushrooms:(P)=>{for(let i=0;i<9;i++)P.fx.append(P.el('lf-mush',`left:${P.rnd(4,92)}%;--sz:${P.rnd(0.7,1.5)};animation-delay:${0.3+i*0.22}s`));P.rise('lf-spore',14,null,120);},
 stampede:(P)=>{P.herd(7,P.art(),P.x<P.W/2?1:-1);P.quake(500,2600);for(let i=0;i<8;i++)P.fx.append(P.el('lf-puff is-dust',`left:${P.rnd(0,P.W)}px;top:${P.H-110}px;--dx:${P.rnd(-40,40)}px;--s:${P.rnd(1.6,2.6)};animation-delay:${0.6+i*0.3}s`));},
 tsunami:(P)=>{P.fx.append(P.el('lf-tsunami'));P.chips('lv-blown',1700,2.4);visible().forEach(c=>{c.style.setProperty('--gx','46px');c.style.setProperty('--gy','-6px');});P.quake(900,900);},
 twister:(P)=>{const dir=P.x<P.W/2?1:-1,fr=[];for(let k=0;k<=8;k++)fr.push({transform:`translate(${dir*k*(P.W/8)}px,${Math.sin(k*1.3)*60+60}px) scale(${2.6+Math.sin(k)*0.4}) rotate(${Math.sin(k*2)*10}deg)`,offset:k/8});P.actor(P.art(),fr,{cls:'is-twist',dur:P.ms-700,delay:300});P.chips('lv-rewind',1500,3.2);},
 dig:(P)=>{const dir=P.x<P.W/2?1:-1;for(let i=0;i<9;i++)P.fx.append(P.el('lf-mound',`left:${P.x+dir*(20+i*34)}px;top:${P.y+16+Math.sin(i*1.1)*26}px;animation-delay:${0.3+i*0.28}s`));},
 fireflies:(P)=>{P.wash('is-dim');P.swarm(14,'<b></b>','is-glow');},
 dragonfire:(P)=>{const dir=P.x<P.W/2?1:-1,yy=150-P.y;P.actor(P.art(),[{transform:'translate(0,0) scale(1)',offset:0},{transform:`translate(${(dir>0?40:P.W-40)-P.x}px,${yy}px) scale(2.6) scaleX(${dir})`,offset:0.2},{transform:`translate(${(dir>0?P.W-60:60)-P.x}px,${yy+10}px) scale(2.6) scaleX(${dir})`,offset:0.75},{transform:`translate(${(dir>0?P.W+90:-90)-P.x}px,${yy-60}px) scale(2.2) scaleX(${dir})`,offset:1}]);P.later(P.ms*0.2,()=>{P.fx.append(P.el('lf-firebreath',`--zs:${dir};top:190px`));for(let i=0;i<8;i++)P.fx.append(P.el('lf-ember',`left:${P.rnd(20,P.W-20)}px;top:${P.rnd(230,P.H-200)}px;animation-delay:${P.rnd(0.2,2)}s`));});},
 spellcircle:(P)=>{P.fx.append(P.el('lf-rune',P.at()));P.fx.append(P.el('lf-rune is-inner',P.at()));P.rise('lf-glyph is-rune',10,['ᚠ','ᚱ','ᛟ','ᛉ','✶'],90);P.wash('is-arcane');},
 potion:(P)=>{P.wash('is-potion');P.rise('lf-bubble is-green',18,null,110);P.chips('lv-wobble',1600,2);},
 crystal:(P)=>{for(let i=0;i<14;i++){const a=i*(6.283/14)+P.rnd(-0.15,0.15);P.fx.append(P.el('lf-shard',P.at()+`--a:${a*57.3+90}deg;--len:${P.rnd(60,150)}px;animation-delay:${0.25+i*0.07}s;background:linear-gradient(${['#B39DDB,#EDE7F6','#80DEEA,#E0F7FA','#F8BBD0,#FCE4EC'][i%3]})`));}P.burst('lf-spark',12,null,['#fff','#E1BEE7','#B2EBF2']);},
 curse:(P)=>{P.wash('is-curse');P.rise('lf-glyph is-skull',11,['☠','✝','☠'],90);},
 shield:(P)=>{P.fx.append(P.el('lf-dome',P.at()));for(let i=0;i<2;i++)P.fx.append(P.el('lf-ring is-blue',`animation-delay:${0.4+i*0.5}s`));},
 applause:(P)=>{P.wash('is-dim');P.fx.append(P.el('lf-spot',P.at()));P.rise('lf-glyph is-gold',14,['👏','★','👏'],110);},
 camera:(P)=>{for(const d of [300,800,1500])P.later(d,()=>P.fx.append(P.el('lf-flash is-snap')));P.stamp('lf-polaroid',5);},
 moneyrain:(P)=>P.fall('lf-note',26,['$','$','€']),
 heal:(P)=>{P.wash('is-heal');P.rise('lf-glyph is-heal',14,['✚','♥','✚'],100);},
 police:(P)=>{P.fx.append(P.el('lf-siren'));P.chips('lv-gusted',1300,1);},
 construction:(P)=>{for(const [r,t] of [[-12,28],[9,62]])P.fx.append(P.el('lf-tape',`top:${t}%;--r:${r}deg`,'CAUTION  ·  CAUTION  ·  CAUTION  ·  CAUTION  ·  CAUTION'));for(let i=0;i<6;i++)P.fx.append(P.el('lf-puff is-dust',P.at(P.rnd(-30,30),10)+`--dx:${P.rnd(-60,60)}px;--s:${P.rnd(1.6,2.8)};animation-delay:${0.3+i*0.2}s`));P.quake(600,700);},
 royal:(P)=>{P.fx.append(P.el('lf-carpet',`left:${P.x}px;top:${P.y+20}px;height:${P.H-P.y}px`));P.rise('lf-glyph is-gold',10,['♛','♚','✦'],70);},
 goal:(P)=>{const fr=[{transform:'translate(0,0) scale(1)',offset:0}];let px=P.x,py=P.y,vx=P.rnd(140,220)*(P.x<P.W/2?1:-1),vy=-180;for(let k=1;k<=9;k++){px+=vx;py+=vy;if(px<24||px>P.W-24){vx=-vx;px=Math.max(24,Math.min(P.W-24,px));}if(py<110||py>P.H-110){vy=-vy;py=Math.max(110,Math.min(P.H-110,py));}fr.push({transform:`translate(${px-P.x}px,${py-P.y}px) scale(1.5) rotate(${k*200}deg)`,offset:k/10});}fr.push({transform:'translate(0,0) scale(1) rotate(2160deg)',offset:1});P.actor(P.art(),fr);P.later(P.ms*0.55,()=>{P.banner('GOAL!','is-gold');P.burst('lf-confetti',20,null,['#E8843C','#6FB26A','#FFD166','#5AAED2']);});},
 lightbeam:(P)=>{P.wash('is-sun');P.fx.append(P.el('lf-godray',`left:${P.x}px;height:${P.y+10}px`));P.burst('lf-petal is-feather',10,null,['#FFFFFF','#FFF8E1']);},
 underworld:(P)=>{P.wash('is-hell');P.fx.append(P.el('lf-hellfire'));P.rise('lf-glyph is-skull',6,['☠'],120);P.quake(300,1200);},
 stone:(P)=>P.chips('lv-stone',2600,4),
 pandora:(P)=>P.burst('lf-glyph is-mix',26,['☠','★','♥','♪','?','✦','❄','☂']),
 eye:(P)=>{P.wash('is-dim');P.fx.append(P.el('lf-eye'));},
 shadow:(P)=>{const dir=P.x<P.W/2?1:-1;P.actor(P.art(),[{transform:`translate(${dir>0?-200:P.W+200}px,${P.H*0.2}px) scale(9) scaleX(${dir})`,offset:0},{transform:`translate(${P.W/2}px,${P.H*0.45}px) scale(11) scaleX(${dir})`,offset:0.5},{transform:`translate(${dir>0?P.W+260:-260}px,${P.H*0.65}px) scale(9) scaleX(${dir})`,offset:1}],{cls:'is-shadow',css:'left:0;top:0;',delay:500,dur:2800});P.wash('is-dim');},
 cavepaint:(P)=>{P.wash('is-sepia');P.stamp('lf-glyph is-ochre',12,['✋','𐀪','☀','➶','✋','🦌']);},
 meteors:(P)=>{for(let i=0;i<7;i++){const tx=P.rnd(40,P.W-40),ty=P.rnd(200,P.H-160);P.fx.append(P.el('lf-meteor',`left:${tx}px;top:${ty}px;animation-delay:${0.3+i*0.42}s`));P.later(300+i*420+520,()=>{P.fx.append(P.el('lf-boom is-small',`left:${tx}px;top:${ty}px`));});}P.quake(900,2600);},
 amber:(P)=>{P.wash('is-amber');P.chips('lv-amber',2600,3);},
 lanterns:(P)=>{P.wash('is-night');P.rise('lf-lantern',14,null,130);},
 route:(P)=>{const pts=[[P.x,P.y]];for(let k=1;k<=4;k++)pts.push([P.rnd(40,P.W-40),P.rnd(130,P.H-150)]);const d='M'+pts.map(q=>q.map(v=>v.toFixed(0)).join(' ')).join(' L');const b=P.el('lf-lines is-route');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none"><path d="${d}" pathLength="1"/></svg>`;P.fx.append(b);pts.slice(1).forEach((q,i)=>P.fx.append(P.el('lf-pin',`left:${q[0]}px;top:${q[1]}px;animation-delay:${0.9+i*0.8}s`)));P.actor(P.art(),pts.map((q,i)=>({transform:`translate(${q[0]-P.x}px,${q[1]-P.y}px) scale(${i?1.5:1})`,offset:i/(pts.length)})).concat([{transform:'translate(0,0) scale(1)',offset:1}]),{ease:'ease-in-out'});},
 bunting:(P)=>{for(let r=0;r<2;r++){const g=P.el('lf-bunting',`top:${70+r*90}px;animation-delay:${0.3+r*0.35}s`);g.innerHTML=Array.from({length:11},(_,i)=>`<i style="background:${['#E8566E','#FFD166','#6FB26A','#5AAED2','#B39DDB'][(i+r)%5]};--d:${Math.sin(i/10*3.14)*34}px"></i>`).join('');P.fx.append(g);}P.fall('lf-confetti',14,null,['#E8843C','#6FB26A','#FFD166','#5AAED2']);},
 skyline:(P)=>{P.wash('is-night');const g=P.el('lf-skyline');let h='';for(let i=0;i<9;i++){const bh=P.rnd(90,260);h+=`<i style="height:${bh}px;animation-delay:${0.4+i*0.14}s;--w:${Math.floor(P.rnd(2,5))}"></i>`;}g.innerHTML=h;P.fx.append(g);},
 train:(P)=>{const dir=P.x<P.W/2?1:-1,yy=P.H-190;P.fx.append(P.el('lf-rails',`top:${yy+26}px`));for(let i=0;i<4;i++)P.actor(P.art(),[{transform:`translate(${dir>0?-70-i*58:P.W+70+i*58}px,${yy}px) scale(${i?1.25:1.6}) scaleX(${dir})`,offset:0},{transform:`translate(${dir>0?P.W+260-i*58:-260+i*58}px,${yy}px) scale(${i?1.25:1.6}) scaleX(${dir})`,offset:1}],{css:'left:0;top:0;',delay:600,dur:3000,cls:i?'is-wagon':''});for(let i=0;i<7;i++)P.fx.append(P.el('lf-puff',`left:${dir>0?i*(P.W/7):P.W-i*(P.W/7)}px;top:${yy-20}px;--dx:${-dir*30}px;--s:2;animation-delay:${0.9+i*0.34}s`));P.quake(700,2400);},
 balloons:(P)=>P.rise('lf-balloon',14,null,130),
 mirage:(P)=>{P.wash('is-heat');doc.body.classList.add('lv-mirage');setTimeout(()=>doc.body.classList.remove('lv-mirage'),3600);},
};

 const el=(cls,css,txt)=>{const d=doc.createElement('i');d.className=cls;if(css)d.style.cssText=css;if(txt)d.textContent=txt;return d;};
 function bleed(chip,type){ensure();const fx=doc.getElementById('livingFx');if(!fx||fx.childElementCount||!REACT[type])return false;const r=chip.getBoundingClientRect(),x=r.left+24,y=r.top+r.height/2;const ms=BLEED_MS[type]||4400;
  fx.style.setProperty('--x',x+'px');fx.style.setProperty('--y',y+'px');
  const kind=liveKind(nameOf(chip));source=chip.dataset.id;if(!kind||!play(chip,kind,Math.max(ms,LIVE_MS[kind]||0),true))chip.classList.add('is-source');lastSound=0;sound(type,2);lastBleed=type;
  // the source is unmistakable: the chip lifts and two rings leave it
  for(let i=0;i<2;i++)fx.append(el('lf-ring',`animation-delay:${i*0.28}s`));
  const at=(dx=0,dy=0)=>`left:${x+dx}px;top:${y+dy}px;`;
  const rise=(cls,n,txts,spread=40)=>{for(let i=0;i<n;i++)fx.append(el('lf-rise '+cls,at(rnd(-12,12),-8)+`--dx:${rnd(-spread,spread)}px;--s:${rnd(0.8,1.5)};--r:${rnd(-30,30)}deg;animation-delay:${0.25+i*(2.6/n)}s`,txts?txts[i%txts.length]:''));};
  const burst=(cls,n,txts,cols)=>{for(let i=0;i<n;i++){const a=rnd(-Math.PI,0.25),d=rnd(70,230);fx.append(el('lf-burst '+cls,at()+`--bx:${Math.cos(a)*d}px;--by:${Math.sin(a)*d}px;--fall:${rnd(160,420)}px;--r:${rnd(-360,360)}deg;animation-delay:${0.2+rnd(0,0.9)}s;${cols?'background:'+cols[i%cols.length]:''}`,txts?txts[i%txts.length]:''));}};
  const wash=cls=>fx.append(el('lf-wash '+cls));
  if(type==='burn'){fx.append(el('lf-burn',at()));for(let i=0;i<7;i++)fx.append(el('lf-ember',at(rnd(-70,70),rnd(-30,40))+`animation-delay:${rnd(0.3,1.8)}s`));}
  else if(type==='smoke'){for(let i=0;i<10;i++)fx.append(el('lf-puff',at(rnd(-14,14),-10)+`--dx:${rnd(-70,70)}px;--s:${rnd(2.2,4.4)};animation-delay:${0.2+i*0.22}s`));}
  else if(type==='flood'){wash('is-water');rise('lf-bubble',8);}
  else if(type==='frost'){wash('is-frost');burst('lf-glyph is-ice',10,['❄','✦','❄']);}
  else if(type==='snow'){burst('lf-glyph is-ice',22,['❄','•','❄','·']);wash('is-snow');}
  else if(type==='gust'){for(let i=0;i<8;i++)fx.append(el('lf-streak',at(0,rnd(-60,60))+`animation-delay:${0.2+i*0.14}s;width:${rnd(70,170)}px`));visible().forEach(c=>{const b=c.getBoundingClientRect();setTimeout(()=>{c.classList.add('lv-gusted');setTimeout(()=>c.classList.remove('lv-gusted'),1300);},300+Math.max(0,Math.hypot(b.left-x,b.top-y))*2.2);});}
  else if(type==='quake'){for(let i=0;i<3;i++)fx.append(el('lf-ring is-shock',`animation-delay:${0.15+i*0.22}s`));setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),1300);},250);}
  else if(type==='bolt'){const pts=[];let px=x,py=y;while(py>0){pts.push(px+','+py);px+=rnd(-34,34);py-=rnd(30,70);}pts.push(px+',-10');const b=el('lf-bolt');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><polyline points="${pts.join(' ')}" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#9AD8FF" stroke-width="3" stroke-linejoin="round"/></svg>`;fx.append(b);fx.append(el('lf-flash'));}
  else if(type==='hearts')rise('lf-glyph is-heart',14,['❤','♥','❤'],70);
  else if(type==='bubbles')rise('lf-bubble',16,null,90);
  else if(type==='night'){wash('is-night');burst('lf-glyph is-star',12,['✦','✧','★']);}
  else if(type==='zzz'){wash('is-dim');rise('lf-glyph is-zzz',9,['z','Z','z'],50);}
  else if(type==='sunrise'){wash('is-sun');fx.append(el('lf-rays',at()));}
  else if(type==='music')rise('lf-glyph is-note',13,['♪','♫','♩','♬'],80);
  else if(type==='bloom')burst('lf-petal',22,null,['#F7A4BB','#F9C5D1','#FFD96A','#F28FAD']);
  else if(type==='confetti')burst('lf-confetti',30,null,['#E8843C','#6FB26A','#FFD166','#5AAED2','#D9584A','#B39DDB']);
  else if(type==='sparks'){burst('lf-spark',26,null,['#FFD166','#FFF3C4','#FFB347','#9AD8FF']);}
  else if(type==='gold')burst('lf-coin',18);
  else if(type==='ink'){fx.append(el('lf-ink',at()));for(let i=0;i<5;i++)fx.append(el('lf-drip',at(rnd(-60,60),rnd(10,50))+`animation-delay:${0.7+i*0.2}s;height:${rnd(40,110)}px`));}
  else if(type==='web'){const W=innerWidth,H=innerHeight;const ends=[[0,0],[W/2,0],[W,0],[W,H/2],[W,H],[W/2,H],[0,H],[0,H/2]];const b=el('lf-web');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" stroke="rgba(245,245,250,.9)" stroke-width="1.6">${ends.map(([ex,ey])=>`<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}"/>`).join('')}${[50,110,180,260].map(q=>`<polygon points="${ends.map(([ex,ey])=>{const d=Math.hypot(ex-x,ey-y)||1;return (x+(ex-x)/d*q)+','+(y+(ey-y)/d*q);}).join(' ')}"/>`).join('')}</svg>`;fx.append(b);}
  else if(type==='pull'){fx.append(el('lf-hole',at()));visible().forEach(c=>{if(c===chip)return;const b=c.getBoundingClientRect();c.style.setProperty('--gx',(x-b.left-b.width/2)*0.28+'px');c.style.setProperty('--gy',(y-b.top-b.height/2)*0.28+'px');c.classList.add('lv-pulled');setTimeout(()=>c.classList.remove('lv-pulled'),2300);});}
  else if(type==='ghost'){fx.append(el('lf-ghost',at()+`--gx:${(x<innerWidth/2?1:-1)*rnd(120,220)}px`));wash('is-dim');}
  else if(type==='rainbow')fx.append(el('lf-rainbow',at()));
  else if(type==='sand'){wash('is-sand');for(let i=0;i<8;i++)fx.append(el('lf-streak is-sand',at(0,rnd(-80,80))+`animation-delay:${0.2+i*0.14}s;width:${rnd(60,150)}px`));}
  else if(type==='stink')rise('lf-glyph is-stink',10,['〰','~','〰'],60);
  else if(type==='leaves')burst('lf-petal is-leaf',24,null,['#7DA046','#A9C26A','#D9A441','#C9703A']);
  else if(type==='feathers')burst('lf-petal is-feather',16,null,['#FFFFFF','#EEF2F5','#DDE5EA']);
  else if(type==='yum'){burst('lf-crumb',16,null,['#E3B36A','#C98B4A','#F4E4C6']);rise('lf-glyph is-heart',5,['♥'],40);}
  else if(type==='letters')rise('lf-glyph is-note',14,['A','b','?','!','Z','e','&','x'],90);
  else if(type==='splat'){const col={mud:'#6B4A32',slime:'#7DA046',goo:'#7DA046',tomato:'#C8402F',ketchup:'#C8402F',jam:'#A8325A',honey:'#E0A21C',syrup:'#B5701F',mustard:'#E0B81C',custard:'#F0D36A',cream:'#F4EBD8',chocolate:'#5A3A26',pudding:'#8A5A3A'}[nameOf(chip).toLowerCase().split(' ').pop()]||'#6B4A32';fx.append(el('lf-ink',at()+`--ink:${col}`));for(let i=0;i<5;i++)fx.append(el('lf-drip',at(rnd(-60,60),rnd(10,50))+`animation-delay:${0.7+i*0.2}s;height:${rnd(40,110)}px;background:${col}`));}
  else if(type==='paws'){const ang=rnd(-0.5,0.5)+(x<innerWidth/2?0:Math.PI),sx=Math.cos(ang),sy=Math.sin(ang)*0.6+0.5;for(let i=0;i<12;i++){const d=26+i*30,side=i%2?10:-10;fx.append(el('lf-paw',`left:${x+sx*d-sy*side}px;top:${y+sy*d+sx*side}px;--r:${ang*57.3+90}deg;animation-delay:${0.2+i*0.2}s`,'🐾'));}}
  else if(type==='pixels'){wash('is-glitch');burst('lf-pixel',26,null,['#E8566E','#6FB26A','#5AAED2','#FFD166']);setTimeout(()=>{doc.body.classList.add('lv-glitch');setTimeout(()=>doc.body.classList.remove('lv-glitch'),900);},300);}
  else if(type==='slash'){for(const [r,d] of [[-32,0.25],[38,0.55]])fx.append(el('lf-slash',at()+`--r:${r}deg;animation-delay:${d}s`));fx.append(el('lf-cut',at()+`--r:-32deg`));fx.append(el('lf-flash is-soft'));}
  else if(type==='crack'||type==='grow'){const W=innerWidth,H=innerHeight,n=type==='crack'?6:5;let paths='';for(let i=0;i<n;i++){const a0=i*(Math.PI*2/n)+rnd(-0.3,0.3);let px=x,py=y,d=`M${px} ${py}`;const steps=type==='crack'?7:5;for(let k=0;k<steps;k++){const a=a0+rnd(-0.5,0.5),len=type==='crack'?rnd(24,52):rnd(50,90);const nx=px+Math.cos(a)*len,ny=py+Math.sin(a)*len;d+=type==='crack'?`L${nx.toFixed(0)} ${ny.toFixed(0)}`:`Q${(px+Math.cos(a+0.9)*len*0.7).toFixed(0)} ${(py+Math.sin(a+0.9)*len*0.7).toFixed(0)} ${nx.toFixed(0)} ${ny.toFixed(0)}`;px=nx;py=ny;if(type==='grow'&&k%2)fx.append(el('lf-leafpop',`left:${px}px;top:${py}px;animation-delay:${0.5+k*0.35}s`));}paths+=`<path d="${d}" pathLength="1"/>`;}
   const b=el('lf-lines is-'+type);b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;fx.append(b);if(type==='crack'){fx.append(el('lf-ring is-shock'));setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),700);},200);}}
  else if(type==='zoom'){const dir=x<innerWidth/2?1:-1;const f=el('lf-zoom',at()+`--zx:${dir*(innerWidth+120)}px;--zs:${dir}`);f.innerHTML=chip.querySelector('.chip-art')?.innerHTML||'';fx.append(f);for(let i=0;i<6;i++)fx.append(el('lf-streak',at(0,rnd(-26,26))+`animation-delay:${0.25+i*0.08}s;width:${rnd(80,160)}px;${dir<0?'transform-origin:100% 50%;scale:-1 1;':''}`));}
  else if(type==='fog'){for(let i=0;i<7;i++)fx.append(el('lf-fog',at()+`--fx:${rnd(-0.5,0.5)*innerWidth+innerWidth/2-x}px;--fy:${(i/6)*innerHeight*0.9+40-y}px;--fs:${rnd(5,8)};--drift:${rnd(-90,90)}px;animation-delay:${i*0.18}s`));}
  else if(type==='storm'){wash('is-dim');for(let i=0;i<7;i++)fx.append(el('lf-cloud',at()+`--fx:${(i/6)*innerWidth-x}px;--fy:${rnd(30,110)-y}px;--fs:${rnd(3.4,5)};animation-delay:${i*0.1}s`));
   for(let i=0;i<34;i++)fx.append(el('lf-rain',`left:${rnd(0,100)}%;animation-delay:${1.2+rnd(0,2.6)}s`));
   for(const d of [1500,3000])setTimeout(()=>{if(!fx.childElementCount)return;const pts=[];let px=rnd(60,innerWidth-60),py=110;while(py<innerHeight*0.75){pts.push(px+','+py);px+=rnd(-40,40);py+=rnd(40,80);}const b=el('lf-bolt');b.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><polyline points="${pts.join(' ')}" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#9AD8FF" stroke-width="3" stroke-linejoin="round"/></svg>`;fx.append(b);fx.append(el('lf-flash'));try{navigator.vibrate?.(20);}catch{}},d);}
  else if(type==='explosion'){fx.append(el('lf-boom',at()));fx.append(el('lf-flash is-soft'));for(let i=0;i<2;i++)fx.append(el('lf-ring is-shock',`animation-delay:${0.1+i*0.2}s`));burst('lf-spark',22,null,['#FFD166','#E8632C','#4A3B33','#FFB347']);for(let i=0;i<7;i++)fx.append(el('lf-puff',at(rnd(-30,30),rnd(-20,20))+`--dx:${rnd(-90,90)}px;--s:${rnd(2.4,4)};animation-delay:${0.5+i*0.12}s`));
   setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),1300);},120);visible().forEach(c=>{if(c===chip)return;const b=c.getBoundingClientRect(),dx=b.left+b.width/2-x,dy=b.top+b.height/2-y,d=Math.hypot(dx,dy)||1,f=Math.max(8,70-d*0.18);c.style.setProperty('--gx',dx/d*f+'px');c.style.setProperty('--gy',dy/d*f+'px');c.classList.add('lv-blown');setTimeout(()=>c.classList.remove('lv-blown'),1700);});}
  else if(type==='giant'){const S=Math.min(innerWidth,innerHeight*0.7)*0.86/40;const g=el('lf-actor');g.innerHTML=artOf(chip);g.style.cssText=at();fx.append(g);if(/whale|orca/.test(nameOf(chip).toLowerCase()))wash('is-water');
   g.animate([{transform:'translate(0,0) scale(1)',offset:0},{transform:`translate(${innerWidth/2-x}px,${innerHeight*0.48-y}px) scale(${S})`,offset:0.3,easing:'ease-in-out'},{transform:`translate(${innerWidth/2-x+14}px,${innerHeight*0.45-y}px) scale(${S*1.04}) rotate(-3deg)`,offset:0.5},{transform:`translate(${innerWidth/2-x-14}px,${innerHeight*0.5-y}px) scale(${S}) rotate(3deg)`,offset:0.7},{transform:'translate(0,0) scale(1)',offset:1}],{duration:ms-200,easing:'cubic-bezier(.3,0,.3,1)',fill:'both'});
   setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),1300);try{navigator.vibrate?.([40,60,40]);}catch{}},(ms-200)*0.3);}
  else if(type==='school'||type==='shipwreck'){const sea=el('lf-sea');fx.append(sea);const wl=innerHeight*0.74;
   if(type==='school'){for(let i=0;i<9;i++){const f=el('lf-actor is-small');f.innerHTML=artOf(chip);const x0=i===0?x:rnd(20,innerWidth-80),dir=Math.random()<0.5?1:-1,span=rnd(90,170)*dir,h=rnd(120,260);f.style.cssText=`left:${x0}px;top:${i===0?y:wl+30}px;`;fx.append(f);const base=i===0?wl+30-y:0;
     f.animate([{transform:`translate(0,${base}px) rotate(${-50*dir}deg) scaleX(${dir})`,opacity:i===0?1:0,offset:0},{opacity:1,offset:0.08},{transform:`translate(${span/2}px,${base-h}px) rotate(0deg) scaleX(${dir})`,offset:0.5,easing:'ease-in'},{transform:`translate(${span}px,${base}px) rotate(${55*dir}deg) scaleX(${dir})`,opacity:1,offset:0.94},{transform:`translate(${span}px,${base+40}px) rotate(${60*dir}deg) scaleX(${dir})`,opacity:0,offset:1}],{duration:1500,delay:i===0?300:700+i*400,easing:'ease-out',fill:'both'});
     setTimeout(()=>{if(fx.childElementCount)fx.append(el('lf-splash',`left:${x0+span}px;top:${wl}px`));},(i===0?300:700+i*400)+1400);}}
   else{const berg=el('lf-berg',`left:${innerWidth*0.66}px;top:${wl-92}px`);fx.append(berg);const sh=el('lf-actor is-ship');sh.innerHTML=artOf(chip);sh.style.cssText=at();fx.append(sh);const y1=wl-34-y,xa=24-x,xb=innerWidth*0.66-30-x;
    sh.animate([{transform:'translate(0,0) scale(1)',offset:0},{transform:`translate(${xa}px,${y1}px) scale(1.7)`,offset:0.16},{transform:`translate(${(xa+xb)/2}px,${y1-5}px) scale(1.7) rotate(-3deg)`,offset:0.33},{transform:`translate(${xb}px,${y1}px) scale(1.7) rotate(2deg)`,offset:0.5},{transform:`translate(${xb-10}px,${y1+4}px) scale(1.7) rotate(-14deg)`,offset:0.56},{transform:`translate(${xb-16}px,${y1+30}px) scale(1.7) rotate(-38deg)`,offset:0.72},{transform:`translate(${xb-20}px,${y1+130}px) scale(1.7) rotate(-70deg)`,opacity:1,offset:0.92},{transform:`translate(${xb-20}px,${y1+150}px) scale(1.7) rotate(-75deg)`,opacity:0,offset:1}],{duration:ms-300,easing:'linear',fill:'both'});
    setTimeout(()=>{if(!fx.childElementCount)return;fx.append(el('lf-ring is-shock',`left:${xb+x+20}px;top:${y1+y}px`));doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),700);try{navigator.vibrate?.(40);}catch{}},(ms-300)*0.5);
    for(let i=0;i<8;i++)fx.append(el('lf-rise lf-bubble',`left:${xb+x-16+rnd(-18,18)}px;top:${wl+30}px;--dx:${rnd(-20,20)}px;--s:1;animation-delay:${(ms-300)*0.66/1000+i*0.16}s;animation-duration:1.6s`));}}
  else if(type==='moonshot'){wash('is-night');burst('lf-glyph is-star',10,['✦','✧','★']);const mx=x<innerWidth/2?innerWidth-86:86,my=130;fx.append(el('lf-moon',`left:${mx}px;top:${my}px`));const r=el('lf-actor');r.innerHTML=artOf(chip);r.style.cssText=at();fx.append(r);const dx=mx-x,dy=my-y,ang=Math.atan2(dy,dx)*57.3+90;
   r.animate([{transform:'translate(0,0) scale(1) rotate(0deg)',offset:0},{transform:`translate(0,-14px) scale(1.5) rotate(0deg)`,offset:0.14},{transform:`translate(${dx*0.25}px,${dy*0.5}px) scale(1.6) rotate(${ang*0.6}deg)`,offset:0.45,easing:'ease-in'},{transform:`translate(${dx*0.8}px,${dy*0.92}px) scale(1.1) rotate(${ang}deg)`,offset:0.72},{transform:`translate(${dx}px,${dy-22}px) scale(.7) rotate(0deg)`,offset:0.82},{transform:`translate(${dx}px,${dy-22}px) scale(.7) rotate(0deg)`,offset:1}],{duration:ms-300,fill:'both'});
   const tr=setInterval(()=>{if(!r.isConnected)return clearInterval(tr);const b=r.getBoundingClientRect();fx.append(el('lf-ember is-trail',`left:${b.left+b.width/2}px;top:${b.top+b.height/2}px`));},70);setTimeout(()=>clearInterval(tr),(ms-300)*0.8);
   setTimeout(()=>{if(!fx.childElementCount)return;fx.append(el('lf-flagpole',`left:${mx+14}px;top:${my-40}px`));for(let i=0;i<10;i++){const a=rnd(0,6.28),d=rnd(30,80);fx.append(el('lf-burst lf-spark',`left:${mx}px;top:${my}px;--bx:${Math.cos(a)*d}px;--by:${Math.sin(a)*d}px;--fall:30px;--r:0deg;background:#FFF3C4;animation-delay:0s`));}},(ms-300)*0.84);}
  else if(type==='gunshot'){fx.append(el('lf-muzzle',at()));[250,950,1650].forEach((d,i)=>setTimeout(()=>{if(!fx.childElementCount)return;const hx=rnd(50,innerWidth-50),hy=rnd(140,innerHeight-160);let ln='';for(let k=0;k<9;k++){const a=k*0.7+rnd(-0.2,0.2);let px=hx,py=hy,d2=`M${px} ${py}`;for(let q=0;q<3;q++){const len=rnd(18,46);px+=Math.cos(a+rnd(-0.4,0.4))*len;py+=Math.sin(a+rnd(-0.4,0.4))*len;d2+=`L${px.toFixed(0)} ${py.toFixed(0)}`;}ln+=`<path d="${d2}"/>`;}
    const h=el('lf-glass');h.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="2" stroke-linecap="round"><g stroke="rgba(40,50,60,.55)" stroke-width="4">${ln}</g>${ln}<circle cx="${hx}" cy="${hy}" r="7" fill="#1E242B" stroke="#fff"/><circle cx="${hx}" cy="${hy}" r="15" stroke="rgba(255,255,255,.7)"/></svg>`;fx.append(h);fx.append(el('lf-muzzle is-again',at()));lastSound=0;if(i)sound('gunshot',2);doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),260);try{navigator.vibrate?.(30);}catch{}},d));}
  else if(type==='abduct'){const others=visible().filter(c=>c!==chip);const tg=others[Math.floor(Math.random()*others.length)]||chip;const b=tg.getBoundingClientRect(),tx=b.left+24,ty=b.top+b.height/2;const u=el('lf-ufo',at());fx.append(u);const hy=Math.max(70,ty-170);
   u.animate([{transform:'translate(0,0) scale(.2)',offset:0},{transform:`translate(${(tx-x)*0.3}px,${hy-y-40}px) scale(1)`,offset:0.18},{transform:`translate(${tx-x}px,${hy-y}px) scale(1)`,offset:0.32},{transform:`translate(${tx-x}px,${hy-y+6}px) scale(1)`,offset:0.5},{transform:`translate(${tx-x}px,${hy-y}px) scale(1)`,offset:0.72},{transform:`translate(${tx-x+innerWidth}px,${-300}px) scale(.5)`,offset:1}],{duration:ms-300,easing:'ease-in-out',fill:'both'});
   setTimeout(()=>{if(!fx.childElementCount)return;fx.append(el('lf-beam',`left:${tx}px;top:${hy+16}px;height:${ty-hy}px`));const c=find(tg.dataset.id);if(c){c.classList.add('lv-abduct');setTimeout(()=>c.classList.remove('lv-abduct'),2300);}},(ms-300)*0.32);}
  else if(type==='lava'){fx.append(el('lf-wash is-lava'));for(let i=0;i<7;i++)fx.append(el('lf-lavaflow',at(rnd(-34,34),4)+`height:${rnd(innerHeight*0.3,innerHeight*0.8)}px;width:${rnd(10,22)}px;animation-delay:${0.2+i*0.18}s`));for(let i=0;i<8;i++)fx.append(el('lf-ember',at(rnd(-50,50),rnd(-20,30))+`animation-delay:${rnd(0.3,2.4)}s`));setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),900);},200);}
  else if(type==='visitor'){const tgt=doc.querySelector('#companionSprite');const tb=tgt&&!tgt.hidden?tgt.getBoundingClientRect():null;const v=el('lf-actor is-visitor');v.innerHTML=ctx.companionSprite?.(chip.dataset.id)||artOf(chip);v.style.cssText=at();fx.append(v);
   const tx=(tb?tb.left+tb.width/2+(tb.left>innerWidth/2?-50:50):innerWidth/2)-x,ty=(tb?tb.top+tb.height/2:120)-y,face=tx<0?-1:1;const rel=ctx.relationTo?.(chip.dataset.id)||'neutral';
   const hop=(k,px,py)=>({transform:`translate(${px}px,${py-(k%2?16:0)}px) scale(1.5) scaleX(${k<6?face:-face})`,offset:k/12});const fr=[{transform:'translate(0,0) scale(.7)',offset:0}];for(let k=1;k<=4;k++)fr.push(hop(k,tx*k/4,ty*k/4));for(let k=5;k<=8;k++)fr.push({transform:`translate(${tx}px,${ty-(k%2?10:0)}px) scale(1.5) scaleX(${face})`,offset:k/12});for(let k=9;k<=11;k++)fr.push(hop(k,tx*(12-k)/4,ty*(12-k)/4));fr.push({transform:'translate(0,0) scale(.7)',offset:1});
   v.animate(fr,{duration:ms-300,easing:'linear',fill:'both'});
   setTimeout(()=>{if(!fx.childElementCount||!tb)return;const mx=tb.left+tb.width/2,my=tb.top;const g=rel==='friends'?['❤','♥']:rel==='rivals'||rel==='nemesis'?['💢','!']:['♪','!'];for(let i=0;i<5;i++)fx.append(el('lf-rise lf-glyph '+(rel==='friends'?'is-heart':'is-note'),`left:${mx+rnd(-20,20)}px;top:${my}px;--dx:${rnd(-30,30)}px;--s:1;animation-delay:${i*0.15}s;animation-duration:1.6s`,g[i%g.length]));
    try{const [a,e]=rel==='friends'?['celebrate','love']:rel==='rivals'||rel==='nemesis'?['stomp','angry']:['wave','happy'];ctx.react?.(a,e,1700);}catch{}},(ms-300)*0.36);}
  else if(type==='rewind'){wash('is-sepia');visible().forEach((c,i)=>{setTimeout(()=>{c.classList.add('lv-rewind');setTimeout(()=>c.classList.remove('lv-rewind'),1500);},300+i*25);});}
  else if(SCENES[type]){const W=innerWidth,H=innerHeight;
   const P={x,y,W,H,ms,chip,fx,el,at,rise,burst,wash,rnd,art:()=>artOf(chip),
    fall:(cls,n,txts,cols,dur=2.6)=>{for(let i=0;i<n;i++)fx.append(el('lf-fall '+cls,`left:${rnd(2,96)}%;--r:${rnd(-200,200)}deg;--sw:${rnd(-40,40)}px;animation-duration:${rnd(dur*0.8,dur*1.2)}s;animation-delay:${0.3+rnd(0,1.8)}s;${cols?'background:'+cols[i%cols.length]:''}`,txts?txts[i%txts.length]:''));},
    banner:(txt,cls='')=>fx.append(el('lf-banner '+cls,'',txt)),
    stamp:(cls,n,txts,box)=>{for(let i=0;i<n;i++)fx.append(el('lf-stamp '+cls,`left:${rnd(box?box[0]:20,box?box[2]:W-40)}px;top:${rnd(box?box[1]:120,box?box[3]:H-140)}px;--r:${rnd(-25,25)}deg;animation-delay:${0.3+i*(2.4/n)}s`,txts?txts[i%txts.length]:''));},
    actor:(html,frames,opt={})=>{const a=el('lf-actor '+(opt.cls||''));a.innerHTML=html;a.style.cssText=opt.css||at();fx.append(a);a.animate(frames,{duration:opt.dur||ms-300,delay:opt.delay||0,easing:opt.ease||'linear',fill:'both'});return a;},
    swarm:(n,html,cls='is-small')=>{for(let i=0;i<n;i++){const fr=[{transform:'translate(0,0) scale(.5)',offset:0}];for(let k=1;k<=5;k++)fr.push({transform:`translate(${rnd(20,W-20)-x}px,${rnd(90,H-120)-y}px) scale(${rnd(0.8,1.3)}) rotate(${rnd(-25,25)}deg)`,offset:k/6.5});fr.push({transform:'translate(0,0) scale(.5)',offset:1});P.actor(html,fr,{cls,delay:i*90,ease:'ease-in-out'});}},
    herd:(n,html,dir=1)=>{for(let i=0;i<n;i++){const y0=H-rnd(120,230),fr=[];for(let k=0;k<=10;k++)fr.push({transform:`translate(${dir>0?-60+k*(W+120)/10:W+60-k*(W+120)/10}px,${y0-(k%2?14:0)}px) scale(${1.5+i%3*0.2}) scaleX(${dir})`,offset:k/10});P.actor(html,fr,{css:'left:0;top:0;',delay:300+i*230,dur:2600});}},
    chips:(cls,dur,gap=3)=>visible().forEach(c=>{const b=c.getBoundingClientRect();setTimeout(()=>{c.classList.add(cls);setTimeout(()=>c.classList.remove(cls),dur);},250+Math.hypot(b.left-x,b.top-y)*gap);}),
    quake:(d=200,len=1000)=>setTimeout(()=>{doc.body.classList.add('lv-quake');setTimeout(()=>doc.body.classList.remove('lv-quake'),len);},d),
    later:(d,f)=>setTimeout(()=>{if(fx.childElementCount)try{f();}catch{}},d)};
   SCENES[type](P);}
  if(type!=='visitor')try{const [a,e]=REACT[type];setTimeout(()=>ctx.react?.(a,e,Math.min(ms-500,3200)),500);}catch{}
  try{if(type==='quake')navigator.vibrate?.([30,40,30,40,60]);else if(type==='bolt')navigator.vibrate?.(25);}catch{}
  setTimeout(()=>{fx.replaceChildren();const c=find(source);if(c)c.classList.remove('is-source');chip.classList.remove('is-source');source=null;},ms+300);return true;}
 // a companion's own element walks out of its tile to meet whoever is on screen
 const bleedFor=c=>ctx.isCompanion?.(c.dataset.id)&&!ctx.onScreen?.(c.dataset.id)&&doc.querySelector('#companionSprite:not([hidden])')?'visitor':bleedOf(nameOf(c),ctx.familyOf?.(c.dataset.id)||'');
 function bleedTick(){clearTimeout(bleedTimer);bleedTimer=setTimeout(bleedTick,rnd(24000,48000));if(!ctx.canRun?.()||reduced())return;
  // only elements that are fully on screen right now; a name rule beats the family fallback
  const c=visible().filter(c=>bleedFor(c));if(!c.length)return;const named=c.filter(x=>bleedOf(nameOf(x))||bleedFor(x)==='visitor');const base=named.length&&Math.random()<0.8?named:c;const fresh=base.filter(x=>bleedFor(x)!==lastBleed);const pool=fresh.length?fresh:base;const chip=pool[Math.floor(Math.random()*pool.length)];bleed(chip,bleedFor(chip));}
 const find=id=>[...doc.querySelectorAll('#viewPlay .element-chip')].find(x=>x.dataset.id===id);
 return {start(){if(started)return;started=true;ensure();watch();timer=setTimeout(tick,2000);bleedTimer=setTimeout(bleedTick,rnd(12000,20000));},activeCount:()=>active.size,
  /** test hooks */ playId(id,kind){ensure();const c=find(id);const k=kind||liveKind(ctx.nameOf(id));return c&&k?play(c,k,LIVE_MS[k]||2400):false;},
  bleedId(id,type){ensure();const c=find(id);return c?bleed(c,type||bleedFor(c)):false;},sound};
}
