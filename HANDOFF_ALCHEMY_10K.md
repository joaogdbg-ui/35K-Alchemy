# Alchemy 10K — V82 candidate handoff (29 October 2026)

## Branch, goal and release truth
- Development branch: `feature/alchemy-10k-mythology-prehistory`.
- V81 baseline on main: SHA `2aba8395f48082964bc2af2ff20a468c56dd464b`, **5,812 original elements and 14,149 recipes**.
- V82 authored candidate: **+200 permanent IDs and +200 new unordered global recipes**, giving **6,012 elements / 14,349 recipes** when passed and merged. This is the FIRST of 21 planned +200 expansions from V81; after V82 the goal of >=10,000 needs 20 more complete deliveries.
- V82 catalog mix: **93 mythology and 107 prehistory items**, all with exact source SVG files, entries in `client/src/organic-art-v82.js`, unique primary recipes and explicit familyCampaigns metadata.
- Manifest `shared/v82-approved.json`: `expansion_progress=200`, `remaining_to_goal=0`, `cycle_complete=true`, `status=QA_PENDING_UNMERGED`. **Not published, not merged, no V82 APK**.
- Rebranding: public `Alchemy 10K` display title, but original Android `appId=com.joaogdbg.alchemy35k` and legacy save keys intentionally retained.

## Content and quality details
- Greek, Roman, Norse and Egyptian mythologies: pantheons, public-domain deities and original interpretations of ancient creatures, places and artifacts.
- Dinosaur families: theropods, sauropods, armored, ceratopsians, hadrosaurs; also pterosaurs, marine reptiles, Paleozoic life and Ice Age mammals.
- 120 individually composed original illustrations; 80 species-parameterized anatomical SVGs (renderer: `tools/v82-fauna-renderer.js`), each with distinct vector source and morphological input.
- `Hades the God` is distinct from prior `legacy:941` Hades game. `Fossilized Dinosaur Egg` is distinct from `pack:dinosaur-egg`, a franchise prop. Internal new IDs remain immutable `organic82:hades` and `organic82:dinosaur-egg`.
- Every SVG is independently stored at `client/assets/v82/<id-suffix>.svg`; the [full 200-item thumbnail contact sheet](docs/V82_ART_REVIEW.md) renders 35px and 90px views for human/device art review.
- Primary recipes must be semantically sensible and globally unique. Confirm end-to-end before release: source-only static checks do not establish real gameplay quality.

## Four Family Only closures, checked directly from source
| Campaign | Reachable / total | Internal global-compatible recipes |
|---|---:|---:|
| Nature & Science | 476/476 | 1,781 |
| People & Culture | 211/211 | 266 |
| Mythology & Gods | 109/109 | 105 |
| Prehistory & Dinosaurs | 116/116 | 112 |

- All four use four starter IDs and are independently craftable according to source-derived recipe graph traversal. New mythology starts Human, History, Magic, Sky; new prehistory starts Animal, Stone, Life, History. Nature still has the historical defect that its starters coincide with Classic; address separately without silently changing progress.
- No new family-specific alternative A+B result. Earned multi-family IDs share one stable identity, Classic save/progress remains separate, free family starter IDs do not transfer as earned discoveries. Optional merge still requires 2 actual verified rewarded ads with saved 1/2 credit.

## Committed content and code
- `client/src/organic-pack-v82.js`, `client/src/organic-art-v82.js`, `client/assets/v82/*.svg`, `shared/v82-approved.json`.
- Authoring inputs: `tools/v82-greek-authoring.js`, `tools/v82-roman-authoring.js`, `tools/v82-norse-authoring.js`, `tools/v82-egypt-authoring.js`, `tools/v82-prehistory-foundations-authoring.js`, `tools/v82-fauna-dinosaurs.json`, `tools/v82-fauna-other.json`, `tools/v82-fauna-renderer.js`.
- App + offline integration: `client/src/app.js`, `tools/build-standalone.py`; active art scan includes V82.
- Gates: `tools/validate-v82.mjs`, `tools/audit-v82-art.py`, `client/test/v82-content.test.mjs`, historical V80/V81 regression updates, and `tools/check-content-batch-200.mjs` with specific original art modes `bespoke-subject` and `species-specific-anatomy`.
- Marketing/review: `docs/V82_ART_REVIEW.md`.

## Verified versus pending
**Done:** 200 committed candidate IDs and unique visual source files, four source-level isolated family traversals, no conflicting output found among inspected foundation/catalog subsets, preexisting name collisions resolved, old unchanged code kept in branch. Previous exact candidate name scans covered 46 historical catalog modules.

**Not done:** local complete repo checkout; full historical `node tools/validate-v82.mjs` execution; `npm test`; `python tools/audit-v82-art.py`; end-to-end HTML build; 35px physical Android light/dark visual review; CI; Android APK build and signing; full revenue/cloud/leaderboard integrations. Do not claim CI green or a released V82 APK.

## Combiner motion (V83 technical change, zero new elements)
- Three tile animations now run on fixed-position ghost tiles appended to `<body>`, never on the real slots: the slots are cleared the instant a pair resolves, so tapping the next ingredient is never delayed (`captureCraftScene` → `finishSlots` → `playCraftMotion` in `client/src/app.js`; CSS `.craft-ghost` in `client/src/styles.css`).
- No recipe: the right tile slides until it touches the left one, bounces back and fades out; no sound, toast or feedback line (unchanged rule).
- Already discovered: the right tile slides onto the left one, the result tile pops and floats up; the existing "Already discovered" feedback line is the only message.
- New discovery: the merged result tile floats up and morphs into the artwork of the discovery window while the window fades in; the window still closes only with X.
- V83.1: the discovery art is drawn at its final size over the window art and scaled up from the tile art, so it ends pixel-identical (no size snap, no blur).
- A new ingredient entering a slot dismisses only the ghost covering that slot; `prefers-reduced-motion` disables all of it. Durations total under 0.9 s for a new discovery and under 0.5 s otherwise.
- Checked locally in headless Chromium at 360×640, 390×820 and 1280×820 (light and dark, locked left, rapid consecutive pairs, no page errors) and with `npm test` (330/330, new `client/test/v83-combiner-motion.test.mjs`). Not yet checked on a physical Android device.

## V84 interface redesign (30 October 2026, owner request)
- `client/src/styles.css` rewritten as one system (tokens, warm paper + white cards, slate outlines matching the icons, one ochre accent); `client/index.html` restructured. All element IDs and functions kept.
- Play: one combiner card (two slots, corner lock, status line, Hint · ad / Batch row); search always visible; filter chips on the shelf (sort, family, All / To explore / Completed / Saved); Sort sheet keeps order + list size.
- Collection (tab label; `data-view="World"` unchanged): progress card, family grid, themed collections carousel, family detail with scrollable chips ("Missing" instead of "????").
- Dialogs are bottom sheets on phones, centred cards from 850 px. Settings order: Sound, Theme, Game mode, Progress (backup/restore/delete), Google Play Games, Help, Privacy & ads.
- Old V71–V76 layout nudges (`.craft-row{transform:translateY(9px)}`, workspace flex-basis clamps) are gone; their validators/tests now assert the `.craft-card` layout.
, owner request 30 October 2026)
- Owner chose the V83 art direction for the whole game, replaced in waves, earliest-seen first. Mechanism: `client/src/art-redraw.js` (`ART_REDRAW`, keyed by stable element ID) is checked first in `staticArt()`; names, recipes and saves are unchanged.
- Sources: `tools/art-redraw-manifest.json` ({id, name, file, wave}) + `client/assets/redraw/*.svg` → `python tools/redraw-assemble.py`. Gates: `tools/validate-art-redraw.mjs` (in the build), `tools/audit-art-redraw.py` (perceptual pairs), `client/test/art-redraw.test.mjs`. Style kit + illustrator brief: `docs/ART_REDRAW_KIT.md`.
- **Wave 1 (done): 1,080 icons** — every element of Classic generations 0–5 plus all older Mythology & Gods and Prehistory & Dinosaurs members. **Wave 2 (done): 941 icons** — Classic generations 6–7. Total redrawn: 2,021. Remaining ≈3,990 older icons, in Classic generation order (gen 8: ~483, gen 9: ~393, gen 10: ~767, gen 11: ~646, gen 12+: ~1,900). Reviewed false-alarm pairs for the perceptual audit live in `tools/art-redraw-reviewed-pairs.json`, ~27 icons per illustrator batch with contact-sheet review.
 (+200, 30 October 2026)
- 100 Mythology & Gods + 100 Prehistory & Dinosaurs → **6,212 elements**; families Mythology & Gods 209/209 and Prehistory & Dinosaurs 216/216, independently completable.
- Sources: `tools/v83-blueprint.json` (names, recipes, summaries, witty lines, art briefs), `tools/v83-alt-recipes.json` (36 alternative in-family recipes), `client/assets/v83/*.svg`. Generated by `python tools/v83-assemble.py` → `client/src/organic-pack-v83.js`, `client/src/organic-art-v83.js`, `shared/v83-approved.json`.
- Gates: `tools/validate-v83.mjs`, `tools/audit-v83-art.py` (also perceptual near-duplicates vs V82), `client/test/v83-content.test.mjs`, `tools/check-content-batch-200.mjs`. Review: `docs/V83_ART_REVIEW.md`. Long-term plan: `docs/V83_MYTH_PREHISTORY_LONG_TERM_PLAN.md`.
- New items may carry `wit`; `wittyDiscovery()` falls back to it.
 (V83 technical change, zero new elements, 30 October 2026)
- Google rewarded TEST ads packaged in the APK (`native/android/GameverseRewardedAdsPlugin.java`, `tools/configure-android-admob.py`); Settings → Privacy & ads.
- Settings → Progress: Export backup (Android share sheet via `native/android/AlchemyBackupPlugin.java`, browser download, or copyable code), Import backup (file or pasted code), Delete progress (Classic / all Families Only / everything, double confirmation, settings kept).
- Discovery popups show the witty line or, failing that, the element's summary (4,421 elements have one).
- Sort sheet is now Sort & filter: Show All / To explore / Completed ★ / Saved, View Normal / Compact (3 columns at 390 px).
- Timed hint: one free recipe hint every 10 minutes only when no ad can be shown (owner decision; rule 7 in `docs/WORKING_RULES_PT.md`).
- Discoveries header shows the player's collection (X / total · %) instead of the 10K development goal.

1. Run `npm test`, `node tools/validate-v82.mjs`, `python tools/audit-v82-art.py`, `node tools/audit-active-artwork.mjs`, and exact +200 Git diff gate against baseline.
2. Run `python tools/build-standalone.py` and verify output `Alchemy_10K_V82_WIP_Offline.html` plus legacy output for Android compatibility.
3. Inspect the 200 thumbnails at 35px in dark/light mode at 320/360/390px and audit distinct recognizable silhouettes.
4. One draft pull request and its one planned CI run after 200; repair failures without unnecessary repeated Actions minutes.
5. Test on an actual Android device, publish a single verified release APK only after QA, CI and merge.

Preserve 200-per-batch policy and do not start another content release on top of unpublished unstable V82.

## V85 — complete family campaigns, Countries & Landmarks, Shiny, Remove ads (owner request 30 October 2026)
- **Every family is an independent campaign** (12 families): own 4 starters (never Water/Fire/Earth/Air), every member craftable with in-family recipes only. `client/src/family-campaigns-v85.js` builds the campaigns at runtime from the global recipe map plus `client/src/family-data-v85.js` (2,849 authored recipes + per-family starters/addMembers), generated by `node tools/v85-assemble-families.mjs` from `tools/v85-family-proposals/*.json` (brief: `BRIEF.md` there). New pairs are global (also valid in Classic) and never overwrite an existing pair. Nature now starts Sun/Sky/Cloud/Stone. Test: `client/test/v85-families-shiny.test.mjs`.
- **Countries & Landmarks** (`world`, category `geography`): +200 elements (`tools/v85-blueprint.json` → `python tools/v85-assemble.py` → `organic-pack-v85.js`, `organic-art-v85.js`, `shared/v85-approved.json`, `client/assets/v85/`), starters Continent/Color/Monument/Food, 240 members. Facts were written from general knowledge; spot-check before release.
- **Family mode looks different**: green banner above the combiner (family art, name, progress, Merge button), green-tinted combiner and tab.
- **Merge both ways**: Families → Classic (existing V60 flow) and Classic → Families (`commitMergeToFamilies`), 2 rewarded ads each (1/2 credit saved), from the Play banner, the Collection button or Settings.
- **Mode-switch grace**: after a rewarded mode-switch ad, switching again within 5 minutes is free.
- **Shiny elements**: each successful combination (not Batch) has 1% chance (5% without ads) to make its result Shiny — twinkling overlay, Shiny filter chip, trivia card (`item.trivia`, else wit/summary). Saved in `alchemy10k_shiny_v1`, included in backups.
- **Remove ads** (Google Play Billing, `native/android/AlchemyBillingPlugin.java`, product id `no_ads`, owner price €1.50): no forced ads (mode switch, Batch, Merge free), 10-hint bank +1 every 15 min, optional ad for extra hints, 5% Shiny. **Owner must create the in-app product `no_ads` in Play Console**; until then the purchase button reports it is unavailable.

- **Art redraw wave 3 (V85, done): 3,991 icons** — every remaining older element. All 6,012 pre-V83 elements now use the 2026 art direction (`ART_REDRAW`), plus 200 V83 and 200 V85 originals. Six near-duplicates found by the audit were redrawn; 36 reviewed false alarms are in `tools/art-redraw-reviewed-pairs.json` (the audit now also honours them for V83 comparisons).

## V206 — Cenas no ecrã
- 12 cenas novas (47 efeitos no total), todas a partir do chip e com a própria arte do elemento como ator (`artOf(chip)` → `.lf-actor`, animado com `element.animate`): **fog** (nevoeiro no ecrã todo), **storm** (nuvens, chuva e 2 raios), **explosion** (bola de fogo, onda, chips empurrados `lv-blown`), **giant** (baleia/elefante/dinossauro crescem até ocupar o ecrã), **school** (peixes a saltar fora de água), **shipwreck** (navio navega, bate no iceberg e afunda), **moonshot** (foguetão até à lua, bandeira), **gunshot** (3 tiros que estalam o vidro), **abduct** (OVNI leva outro chip no raio), **lava** (escorre do vulcão), **visitor** (elemento que é companion sai do mosaico, vai ter com o companion do ecrã e reagem pela relação: amigos/rivais/neutros), e **slash** agora corta o ecrã (`lf-cut`).
- `bleedFor(chip)`: companion fora do ecrã → `visitor`; senão regra pelo nome; senão família. ctx novo: isCompanion, companionSprite, onScreen, relationTo.
- `react()` do motor mantém a pose (re-afirma de 120 em 120 ms até ao fim).
- Script: `/tmp/v160/lv6.py`.

## V205 — Movimento que não pára, efeitos mais frequentes e mais variados
- O movimento pertence ao **id do elemento** (`active` Map), não ao nó: um MutationObserver em `#inventoryVirtual` chama `carry()` quando a lista é redesenhada (deslizar, tocar, combinar) e repinta o movimento a meio do ciclo (`--lv-delay` negativo; partes com atraso negativo). O chip de origem de um efeito também é remarcado.
- Mais frequente: novo movimento a cada 0,32–0,8 s, até 12 em simultâneo.
- Efeitos de ecrã: 1.º aos 12–20 s, depois a cada 24–48 s; só chips **totalmente visíveis** na lista. 13 tipos novos (37 no total): paws, feathers, zoom, slash, crack, grow, leaves, splat, yum, letters, rewind, pixels (+ sparks/sunrise/confetti já existentes como recurso).
- **Recurso por família** (`FAMILY_BLEED`, `bleedOf(nome, família)`): se o nome não tiver regra, a família dá um efeito coerente (games→pixels, anime→slash, nature→leaves, fantasy→sparks, people→letters, mythology→sunrise, prehistoric→crack, world→confetti) — há sempre candidato no ecrã; 80% das vezes prefere quem tem regra pelo nome.

## V204 — Movimento com critério, virar de papel, 25 efeitos de ecrã
- **Regras por substantivo principal**: um termo só casa se for o nome inteiro ou as últimas palavras ("Wild Fire" arde, "Fire Truck" não). `X()` = só nome exato (spin: "Ferris Wheel" não roda). Listas limpas de casos em que a imagem inteira ficava mal (recipientes, estruturas com base).
- **Movimento por partes** (`PARTS`, 37 elementos): só a parte certa mexe — pás do aerogerador/moinho, engrenagem, caranguejo-eremita a entrar na concha, chamas das velas/bolo/fogueira, asas (morcego, borboleta, abelha), cauda/olhos/patas do gato, cauda/língua/orelhas do cão, pêndulos e ponteiros, areia da ampulheta, jato da baleia, língua da cobra… Formato `[índices, movimento, origem, vars, atraso]`; índice = ordem em `svg.querySelectorAll('*')`; `n` é a guarda (se a arte tiver outro nº de formas cai para a regra geral ou para o virar). `redraw:1` = arte vinda de ART_REDRAW (ver com `/tmp/v160/dumpart.py <nomes>`; as outras com `/tmp/v160/art.mjs`). Formas com atributo `transform` são embrulhadas num `<g>` durante a animação.
- **Sem movimento próprio** → vira sobre si como folha de papel (`lv-flip`, rotateY 360°).
- Movimentos mais frequentes (0,65–1,5 s) e até 8 em simultâneo; continuam durante os efeitos de ecrã.
- **Efeitos de ecrã** (`BLEED_RULES`, 25 tipos): burn, smoke, flood, frost, snow, gust, quake, bolt, hearts, bubbles, night, zzz, sunrise, music, bloom, confetti, sparks, gold, ink, web, pull, ghost, rainbow, sand, stink. Um de cada vez (1.º aos 25–45 s, depois 55–110 s), nunca o mesmo seguido. Origem clara: chip `is-source` (contorno dourado a pulsar) + dois anéis, e tudo nasce nas coordenadas do chip (`--x/--y`; `lf-wash` abre em círculo a partir dele).
- **Companions** reagem (`REACT`) e ficam na pose até ao fim (`reactUntil` pausa os dois loops): dormem com a noite, dançam com a música, tapam-se com o fantasma, festejam com ouro/confetti, amuam com a tinta, tombam com o buraco negro, recusam o mau cheiro…
- Hooks: `window.__living.playId/bleedId`, `window.__idOf(nomeMinúsculas)`. Scripts: `/tmp/v160/lv2.py` (efeitos), `lv3.py` (zoom de partes).
- Por fazer: mais elementos em `PARTS` (basta despejar a arte e escolher índices), interação dos efeitos dentro das casas, revisão geral dos sons.

## V203 — Elementos vivos
- Módulo novo `client/src/living-v203.js` (tuplo no build: createLiving, liveKind, bleedOf). `liveKind(nome)` dá o movimento próprio por regras de palavra inteira (`LIVE_RULES`): flame, smoke, water, melt, beat, erupt, glow, zap, flap, swim, critter, spin, wind, quake, bounce, shell; sem regra = `turn` (inclinação suave). O movimento é da própria arte (transform + filtros SVG de deslocamento `#lvFlame/#lvSmoke/#lvWater/#lvMelt` em `#livingDefs`), um ciclo e volta ao repouso. Só o vulcão lança 2 gotas de lava.
- Agenda: de 2,4 a 5,2 s escolhe um chip visível (75% dos casos um com movimento próprio), máx. 2 ao mesmo tempo, só na aba Alchemy sem folha aberta; respeita prefers-reduced-motion.
- **Efeitos no ecrã** (`BLEED`, 1.º aos 45–80 s, depois cada 95–190 s, um de cada vez, nunca o mesmo duas vezes seguidas): burn (anel de brasa que queima como papel), smoke (fumo a subir), flood (onda), frost (geada das margens), gust (rajada que inclina os chips), quake, flash. `companions.react(anim,expr,ms)` faz os companions livres reagir (`REACT`).
- Sons sintetizados no próprio módulo (`sound(kind)`), no máx. um a cada 7 s nos movimentos (45% das vezes) e sempre nos efeitos de ecrã.
- Hooks de teste: `window.__living.playId(id,kind)`, `.bleedId(id,type)`. Script `/tmp/v160/lv.py`.
- Limite conhecido: o movimento é da arte inteira (as artes não têm partes separadas), por isso garras/olhos/asas individuais só com arte redesenhada por elemento — por fazer para os elementos mais vistos. Revisão geral dos sons do jogo também por fazer.

## V202 — Market em aba própria, menus antigos e modo escuro
- **Aba Market** (4.ª aba, sempre visível; `#viewMarket`): `openMarket(onClose,mkTab)` pinta na aba (`marketHost()`); chamado de fora salta para a aba. Categoria nova **Coins** (primeira e por omissão): `coinsPanelHtml()`/`wireCoinsPanel()` = cartão Remove ads → moedas grátis (prenda diária, anúncio) → packs → formas de ganhar. O chip de moedas do topo abre a aba em Coins. `openCoinShop` (folha) continua a existir só para "Get more coins" dentro de uma confirmação. Mosaico Market saiu do hub de Games (Play ocupa a largura toda).
- **Menus antigos com a skin**: escolher mobília/convidar (`.home-pick`), confirmação de compra (`.cf-art`, `.cf-sum`), "If X eats it" (`.meal-preview`), arte do elemento (`.modal-art.is-info`), cartão do companion (`.cc-art`, `.cs-panel`, `.cc-actions`, `.cc-status`). Variáveis `--sk-card/--sk-line/--sk-drop/--sk-well` (têm valores para escuro).
- **Modo escuro**: `tools/gen-dark-skin.py` procura regras com fundo claro fixo e gera o bloco `DARK-SKIN` no fim de styles.css (dentro desses componentes as variáveis de tinta ficam escuras). **Correr o script sempre que se acrescentar CSS com fundos claros** (o bloco tem de ficar no fim; há teste).
- A seguir (pedido do dono): elementos com movimento próprio (gelo a derreter, chama, vapor, vulcão, coração, asas, garras…), rotação suave ocasional, efeitos que saem do elemento para o ecrã (fogo que queima, fumo que sobe) e alteram os companions, sem acontecer tudo ao mesmo tempo; depois revisão geral dos sons.

## V201 — Uso da mobília com lógica
- `useStyle(name,id)` (puro, exportado): `side` | `front` | `on`. Peças de ver/aquecer/remexer/brincar (aquário, lareira, fogueira, guarda-roupa, despensa, estante, telescópio, casa de bonecas, mesas, relógios, candeeiros…) usam-se **ao lado**, virado para a peça (`useSpot(f,L,blocked)` escolhe lado livre; sem lado livre fica à frente, abaixo da peça). Poses novas `warm`, `watch`, `rummage` (+ `duo-cheer` para brincar) e texto próprio ("Watching the Aquarium").
- Descanso: camas largas = deitado (reposicionado); peças estreitas (cama de pet, berço, beliche, rede, cadeira) = enroscado a dormir (`rest-curl`, "z"); banheira/termas/chuveiro = dentro de água (`use-soak`).
- Tigelas/comedouro e saco de boxe ficam como antes. Aparelhos (passadeira, trampolim, piscina…) também.
- Harness: `/tmp/v160/fur.py <companion> <peças…>` renderiza cada peça em uso (máx ~9 de cada vez, uma execução de cada vez).

## V200 — Companions que "representam" (poses, expressões, virar)
- **Virar** já não é uma folha de papel: pequeno salto, a troca de lado acontece no ar, aterra com squash (`cp-turn-l/r` no `svg` dentro de `.companion-art`).
- **Expressões** `data-expr` (angry, happy, sad, wow, dizzy, sleepy, love, smug): mexem olhos/boca/cabeça com as propriedades `scale/rotate/translate` (compõem com qualquer animação) + símbolo (💢 💧 ❗ 💕). Helper `expr(el,k,ms)` no motor e nas casas.
- **Poses novas para os 40 rigs**: carry, push, wave, peek, stomp, taunt, sulk, scared, celebrate, sniff, getup. `poseRig(art)` (exportado, corre ao montar cada sprite) mede a direção real de cada braço/asa e grava `--up/--fwd/--in/--down/--out`; marca `data-rig` biped/winged/quad (quadrúpedes usam pata/cauda/cabeça). Braços que já seguram algo ao alto não rodam para cima da cara.
- **Onde aparecem**: co-op carrega os elementos por cima da cabeça antes de atirar e festeja com pirueta; luta começa com birra (stomp), vencedor faz troça; rivais troça/birra, amigos acenam; KO = olhos a rodar, levantar-se = getup + festejo; de vez em quando o companion acena, espreita o ecrã ou fareja. Casas: recusa = amuo, rivais birra/troça, némesis trocam socos e pontapés, amigos festejam, festa = olhos felizes.
- Rotação/inclinação ao nível de `.companion-art` continua a precisar de `var(--dir)`; dentro das partes não.
- Por fazer: poses específicas por companion (objetos próprios), novas poses nas corridas/karaté/microjogos.

## V199 — Química entre companions (Duo e casas)

- `relationOf(a,b,sameFamily)` (companion-engine, puro e simétrico): `friends` / `neutral` / `rivals` / `nemesis`, com pares fixos (`REL_BEST`, `REL_NEMESIS`: p.ex. Frog+Otter amigos; Hero×Werewolf, Pegasus×Cerberus, Phoenix×Penguin inimigos) e o resto por hash (mesma família é mais amigável). `REL_INFO` tem ícone, nome e nota.
- **Duo no ecrã**: os jogos saem de `DUO_BY_REL`. Amigos jogam `coop`: cada um atira um elemento para um slot e a app combina (`ctx.coopFind` escolhe um par que o jogador já pode fazer e dá resultado novo; `ctx.coopCraft` usa `selectForHint`) — descoberta real, máx. 6/dia, 8 min de intervalo, só no Alchemy/Classic com slots vazios. Inimigos fazem `brawl`: o que perde fica KO (`setKo`, classe `is-ko`, balão TAP!), −10 de humor, e só volta quando se toca nele (`reviveIfKo`). Enquanto há KO não há jogos Duo.
- **Casas**: ao encontrarem-se, amigos festejam (humor de ambos), rivais discutem, inimigos lutam e um fica KO até levar um toque (`knockOut`/`revive` no `wanderZone`). A ficha do residente lista a relação com cada colega de casa.
- **UI**: barra "Your team" mostra a relação do par; o seletor do parceiro mostra a relação de cada candidato.
- **Minijogos/microjogos**: o fundo do palco usa o céu e a faixa do mundo do companion ativo (`ctx.worldArt`).
- Gancho de teste: `window.__companions` quando existe `window.__m`; `requestDuo(kind)`, `koState()`.
- `APP_VERSION` 1.0.99.

## V198 — Skin nos menus da lista de elementos

- Só CSS (bloco "V198"): chips Sort/Families/Stat/Looks, folha Sort (opções com ícone, selecionada escura com visto verde, segmentos Show e List size, títulos em pílula), filtro de famílias, filtro de stats, filtro de looks e caixa de pesquisa no estilo do jogo.
- `APP_VERSION` 1.0.98.

## V197 — Correção do saldo no banco de moedas

- O número do saldo no cabeçalho de "Get coins" herdava o tamanho pequeno; corrigido. A linha "Discover elements" menciona os objetivos de 25 e os combos.
- `APP_VERSION` 1.0.97.

## V196 — Equipa no topo do Home, banco de moedas, shiny especial, toques durante a descoberta

- **Home → Companions**: barra "Your team" no topo (`.team`, companion-engine `renderTab`): companion no ecrã + lugar Duo (parceiro, "Add a partner" ou 🔒 com preço e progresso; tocar abre a folha DUO SLOT com compra/anúncios). O cartão "Second slot" do fundo saiu. Título "Collection · n/40" antes da grelha.
- **Get coins**: cabeçalho de banco dourado com o saldo, formas grátis em cartões, packs com botão de preço verde (`.cp-bank-head`, `.cp-ways`, `.cp-pack`).
- **Shiny**: `shinyPerks` (selo SHINY, para que serve: crescimento a dobrar ao dar de comer; companion shiny = +1 grau em todos os stats; contagem), `shinyDress` (raios a rodar, chuva de estrelas, contorno dourado, vibração) e `shinyFanfare` (arpejo). Usado na descoberta shiny e em `showShinyFound`.
- **Bug**: `insertDirect` ignora toques na prateleira enquanto há uma folha aberta (a descoberta fica invisível durante a animação de fusão e os toques trocavam o que aparecia).
- `APP_VERSION` 1.0.96.

## V195 — Mundos com vida, profundidade e acabamento

- **Acabamento estático** (`worldSky`): brilho no horizonte, orla iluminada em cada plano (mesma forma levantada 2,6 px em tom mais claro), neblina entre planos, sombra na base. `worldMid`: fila de trás de adereços pequenos, sombras sob os adereços grandes, 22 pormenores no chão (tufos, pedras, flores na cor do mundo).
- **Vida** (`worldLife(cid)` → HTML animado só com transform/opacity, classes `wl-*`): nuvens a passar, bandos de pássaros, morcegos, balões de ar quente, voadores (dragão, pterossauro, águia, fantasma, ovni), estrelas a piscar, estrelas cadentes, fumo dos vulcões/chaminés, holofotes, fogo de artifício, e bichos junto à pista (pirilampos, abelhas, borboletas). Os atores ancorados ao cenário repetem-se por mosaico (`.g-life-tiles`) e seguem o paralaxe do céu.
- **Tempo por mundo** (`fx-*` em `.g-themefx`): neve, folhas, pétalas, confetti, brasas, pirilampos, notas musicais, bolhas, pó, faíscas.
- **Subsolo** (`worldUnder`): raízes, gemas na cor do mundo, fósseis e adereços meio enterrados sobre as camadas de terra (`.g-under`, acompanha a câmara).
- `prefers-reduced-motion` esconde as camadas de vida.
- `APP_VERSION` 1.0.95.

## V194 — Mundos desenhados (não só paleta)

- games-theme-v151.js: cada um dos 40 mundos tem agora cenário próprio composto à mão em `SC` (céu em gradiente, astro, 2–3 planos de horizonte, extras, cor do chão, vedação, noite): geradores `SIL` (hills, mountains, skyline, pines, round, bergs, mesas, pyramids, volcano, castle, pagoda, temple, palms, bamboo, spires, tents, arches, graves, moai, towers, blocks, spire, stage, flowers, reedbed, saur, lamps), `BODY` (sun, bigsun, moon, crescent, planet), `EXT` (stars, aurora, birds, clouds, bunting, lanterns, mist, embers, snow, rays) e `FENCE` (wood, stone, iron, rope, ice, bamboo, neon, hedge, none).
- `worldSky(cid)` → SVG 400×300 do céu/horizonte; `worldMid(cid,props)` → SVG 400×160 da faixa junto à pista (chão, vedação própria e 5 adereços grandes). `companionArt` usa-os (`scene:true`, `night`); as texturas da pista continuam recoloridas.
- games-v93: `data-scene`/`data-night` no palco; nuvens CSS genéricas escondidas nos mundos desenhados.
- `APP_VERSION` 1.0.94.

## V193 — Corridas: ecrã de resultado corrigido, saída com aviso, mundo próprio por companion, Settings com skin

- **Bug corrigido**: `finishRace`/`finishKarate` usavam `PK` (só definido em `startRace`/`startKarate`) → ReferenceError: o ecrã de resultado nunca aparecia e as moedas da prova não eram pagas. Agora `PK` é lido dentro de cada função.
- **Sair com aviso**: o ✕ em corridas, karaté, minijogos e microjogos abre "Leave the game?" (`askQuit` em games-v93.js; equivalente no `stage` do arcade). A corrida fica em pausa enquanto o aviso está aberto; karaté e minijogos não pausam.
- **Mundos por companion** (games-theme-v151.js): `COMPANION_WORLDS` (40 entradas: nome, mapa de cores g/b/w/s/n, 2 adereços, cor das partículas), `PROP_LIB` (~60 adereços SVG) e `companionArt(base,cid)`. Nas corridas normais o percurso e os obstáculos são os mesmos, mas texturas, céu, adereços (mais densos, ×1.35) e partículas são os do companion que corre; o nome do mundo aparece por baixo do título. As theme races mantêm o tema próprio.
- **Settings** com a skin do jogo (secções, interruptores, segmentos, cartão Remove ads, títulos em pílula).
- build-standalone: tuplo games-theme exporta `companionArt` e `COMPANION_WORLDS`.
- `APP_VERSION` 1.0.93.

## V192 — "Game skin" em todo o jogo + cartões Today

- Bloco CSS "V192: game skin" no fim de styles.css: a linguagem do Market (contornos de 2 px, sombra inferior 3D, gradientes quentes, botões que afundam ao toque) aplicada à barra de topo, mesa de combinação, botões Packs/Hint, faixa de objetivo, cartões de elementos, barra de separadores (ativo escuro e elevado), botões e etiquetas dos modais, Home (separadores, casas, lugares, cartões) e Stadium (cartaz com bandeirinhas e relva, quatro cartões grandes coloridos, hub Play colorido).
- Stadium: secção **Today** (`todayHtml`/`wireToday` em app.js, injetada por `ctx.todayHtml` em games-v93.js): oferta diária (reclamável ali), próximo minijogo (elementos em falta) e próxima recompensa de descoberta + melhor combo. O chip de moedas duplicado do Stadium foi escondido.
- build-standalone: tuplo do arcade exporta também `arcadeProgress` e `ARCADE_STEP`.
- `APP_VERSION` 1.0.92.

## V191 — Market com cara de loja

- `openMarket`: banca com toldo às riscas (`.mk-stall`), o companion ativo como lojista com balão de fala (a nota de cada separador passou para o balão `SAY`), separadores com ícone, cartões com pedestal colorido por separador, preço em botão verde (cinzento se faltam moedas), selo ✓ nos comprados.
- **Oferta do dia**: 1 artigo (comida, roupa, brinquedo ou mobília ainda não comprados) a −25% (`MARKET_DEAL_OFF`), escolhido pelo dia (`dailyKey`); cartão em destaque no topo e selo no cartão do separador. `priceOf` aplica o desconto na compra.
- `APP_VERSION` 1.0.91.

## V190 — Minijogos por desbloquear e economia aparada

- **Desbloqueio de minijogos** (`arcadeProgress(st,count,ids,rnd,{house})`): o 1.º minijogo (aleatório) chega com a **primeira casa** (`houseGiven`, fica para sempre); +1 aleatório a cada 250 elementos; ou compra de 1 aleatório por `ARCADE_BUY_COINS=3000` (`st.bought`, não mexe na meta dos 250). Bloqueados aparecem como 🔒 ??? com a explicação; tocar num ??? abre a compra. Passe de 24 h por anúncio mantém-se.
- Migração única (`st.v<190`): saves antigos (testers com tudo aberto) são repostos pelo modelo novo (base 0); recordes e passes ficam.
- **Economia da V189 aparada**: objetivo a cada 25 elementos (+5; +15 por 100 em vez de +20); combo paga só ×5 → +2 e cada ×10 → +5 (antes 3/5/10).
- `APP_VERSION` 1.0.90.

## V189 — Ciclo de descoberta (objetivos curtos, combos, celebração)

- **Faixa de objetivo** no ecrã principal (`#goalStrip`, criada por `syncGoalStrip()` a seguir ao `.craft-card`, só no Classic): "N to go · Reward at X elements · +moedas" com barra; toca → folha REWARDS. Objetivo a cada `GOAL_STEP=20` elementos (+`GOAL_COINS=5`); aos múltiplos de 100 mantém-se o prémio antigo de +50.
- **Combo** por tempo: descobertas novas com menos de 45 s entre si (`COMBO_WINDOW_MS`); não quebra com repetidos. Prémios `comboReward`: ×3 → +3, ×5 → +5, cada ×10 → +10. Chip 🔥 com barra a esvaziar; melhor combo guardado em `alchemy7k_combo_v189`. Batch não conta.
- **Celebração**: popup de descoberta mostra combo, objetivo atingido e progresso (`loopHtml`), confetti (`confettiIn`) em combos ≥3/objetivos, e o som sobe de tom com o combo (`soundForResult`).
- Economia: +25 moedas por 100 elementos nos objetivos, mais os combos (máx. típico ~+18 por 10 seguidas).
- `APP_VERSION` 1.0.89.

## V188 — Vida dos companions, UI da casa e microjogos

- **Personalidades** (`personalityOf(cid)` em home-engine-v90.js, puro e determinístico por id): mobília favorita (`fav`, pesa ×3 e uso +35%, "Loves the X ♥"), mobília de que não gosta (`shy`, pesa ×0.35; 60% das vezes recusa com 🙅 "Not a fan of the X"), ritmo (`lazy`/`steady`/`hyper` → verbos próprios `STYLE_VERB`, passada e duração; hyper salta na cama em vez de dormir), gesto próprio (`HOME_QUIRKS`: spin, hop, wiggle, nod, stretch, shiver, bow, sway; classes `q-*`) e **voz** (`companionVoice`: tom, onda e melodia por companion; festas, favorito, recusa; máx. 1 voz/0,9 s; respeita o som desligado via `ctx.audio`).
- **Casa**: barra "quem vive aqui" por baixo do título (`.home-crew`): um lugar por vaga da casa, vagas livres com "+ Invite", botão "Furniture" (abre o seletor no primeiro espaço livre). Ficha do residente mostra a personalidade. A linha "Invite a companion" do fundo saiu. O companion flutuante deixa de aparecer no separador Home (`body[data-tab]`).
- **Batch all**: 4 → 3 anúncios (`BATCH_ALL_ADS`).
- **Microjogos**: faixa de objetivo sempre visível (palavra + instrução `how`), cenário próprio por microjogo (`scene` → `.sc-*`), medalhas 🥉5/🥈10/🥇15 (`MICRO_MEDALS`, cada uma devolve 1 vida), elogios variados, "TOO SLOW!" no tempo esgotado, rastilho vermelho nos últimos 30%, peças maiores.
- `APP_VERSION` 1.0.88.

## V187 — Afinação para lançamento

- Removida a oferta de 100 000 moedas de teste (`TESTER_GIFT`); quem já as recebeu mantém o saldo.
- `ARCADE_TESTER_ALL=false`: os minijogos voltam a desbloquear por progresso (os já desbloqueados no save ficam).
- Casa garantida: `ensureStarterHouse()` — ao chegar a 200 elementos descobertos no Classic sem nenhuma casa (`HOME_OBJECTS[id].kind==='house'`), a Companion Tent (`organic89:companion-tent`) é oferecida com aviso. Corre após cada descoberta, achados dos companions e no arranque.
- `APP_VERSION` 1.0.87.

## V186 — Lote 2 de elementos: Mar profundo e espaço (+165) → 7 000

- Pack `client/src/organic-pack-v186.js` (`ORGANIC_V186`, ids `organic186:*`), arte `client/src/organic-art-v186.js`, SVG fonte em `client/assets/v186/`, manifesto `shared/v186-approved.json` com `owner_exception:true` (dono aprovou ~165 para fechar nos 7 000).
- 83 elementos de mar profundo (categoria `nature`) e 82 de espaço (categoria `science`); todos na família Nature & Science, com receitas feitas só com ingredientes dessa família.
- Catálogo: 6 835 → **7 000**. Meta de conteúdo atingida; a seguir: afinação e preparação do lançamento.
- Testes: `client/test/v186-sea-space.test.mjs`; totais actualizados em v85/v87.
- `APP_VERSION` 1.0.86.

## V185 — Moedas visíveis no ecrã principal

- Barra de topo: chip `#topCoins` (🪙 + saldo, `data-coins`) ao lado das definições, em todos os separadores; tocar abre "Get coins".
- `syncCoinLabels()` anima o chip e mostra "+N"/"−N" quando o saldo muda (descobertas, prémios, compras).
- `APP_VERSION` 1.0.85.

## V184 — Lote 1 de elementos: Cozinha e comidas do mundo (+200)

- Novo pack `client/src/organic-pack-v184.js` (`ORGANIC_V184`, ids `organic184:*`, categoria `food`) e arte `client/src/organic-art-v184.js` (200 SVG originais).
- Conteúdo: ingredientes em falta (Meat, Corn, Chili Pepper, Coconut, Banana…), utensílios (Cooking Pot, Oven, Wok, Grill…), preparações e bebidas (Sauce, Stew, Juice, Wine, Beer…), pratos do mundo (Taco, Ramen, Biryani, Bacalhau, Pastel de Nata, Francesinha, Caldo Verde…), queijos, cafés e sobremesas.
- Cada elemento tem 1 receita nova; nenhum par A+B existente foi alterado.
- Catálogo: 6 635 → **6 835** (meta 7 000). Falta ~165 (lote 2: Mar profundo e espaço).
- Gate CONTENT-200: manifesto `shared/v184-approved.json` + SVG fonte em `client/assets/v184/` (gerados por script; a arte runtime tem de ser byte-idêntica).
- Testes: `client/test/v184-food-batch.test.mjs`; totais actualizados em v85/v87.
- `APP_VERSION` 1.0.84.

## V183 — Renamed to Alchemy 7K
- Owner (12/11): target is now ~7,000 elements and the game is "Alchemy 7K" (title, brand, appName, About, backup file name, CATALOG_GOAL=7000). Storage keys, appId, repo and APK names unchanged.
- Catalogue: 6,635 → about 365 more elements needed (two batches: 200 + ~165).

## V182 — Small UI clean-up + pool pathing
- Market sheet: header reduced to MARKET + coin bar (the Fair play note lives only in the Get coins sheet). Stadium tile "Games" renamed "Play" (the tab is already called Games); its sheet is "Choose a game".
- Home: residents no longer walk across pools (swim pieces block the path unless they are the piece being used).
- Next: element batches towards ~8,000 (6,635 today), 200 per release with hand-drawn SVG art as in V82+.

## V181 — Renamed to Alchemy 8K + ultra races
- Owner: the game is now "Alchemy 8K" (target ~8,000 elements). Changed: page title, brand word, Capacitor appName, About line, backup file name, CATALOG_GOAL=8000. NOT changed on purpose: storage keys (alchemy10k_*), appId, repo name, APK file name, the WIP html file name, workflow names.
- Ultra races (games-v93.js ULTRA_COURSES): Celestial Ascent, Abyssal Descent, Titan Trial. Listed under "✦ Ultra races" only when the matching ultra look is unlocked (ctx.ultraOwned). +6 sections at every level (12 → 20), every rival 95–99. Champion gold → ctx.grantSupreme() unlocks the Supreme look (3 free essences).
- Pending: UI redundancy review, residents walking over an occupied pool, +~1,365 elements to ~8,000, release prep (remove 100k tester coins and ARCADE_TESTER_ALL).

## V180 — Ambient furniture
- ambientOf(id,name) → fire / glow / water / sway / screen / tick / breeze; pieceHtml adds `a-<kind>`; CSS overlays animate the piece even when nobody uses it (lamps and fires glow stronger in the evening/night).
- Still pending (owner said go ahead, in this order): UI redundancy review, ultra races + Supreme look, +~1,365 elements to reach ~8,000, release prep. Open question to owner: rename "Alchemy 10K" → "Alchemy 8K"?

## V179 — Coin packs back
- Owner correction: "+ Coins" may stay real money. Real-money purchases = Remove ads + coin packs (ids coins_100…coins_15000, amounts 600/1,300/3,500/8,000/17,000/45,000/100,000, first purchase ×2). No pack-exclusive items: the four special colours stay coin-priced. The "Get coins" sheet shows Free (daily gift, ad +20 ×5/day, ways to earn) then Coin packs.

## V178 — Coins-only shop + living home (first pass)
- Owner decision (12/11): the ONLY real-money purchase is Remove ads (`no_ads`). COIN_PACKS is now empty (old tokens ignored); first-buy bonus and pack-exclusive colours removed — Gold/Aurora/Shadow/Rainbow colours now cost 3,000–6,000 coins. Play products coins_* are NOT needed any more.
- "Earn coins" sheet replaces the coin shop: daily gift (claimDaily, the duplicate daily button in the Market was removed; the coin bar button shows "🎁 Daily gift" when available), optional rewarded ad +20 coins up to 5 a day (kind 'coins', wallet.adDay/adN), and the list of ways to earn.
- Home (home-engine-v90.js): taller shaded wall, floor depth shading, furniture drop shadows, sun patch, time-of-day tint (morning/day/evening/night), resident ground shadows; thought bubble showing what a resident is going to do, "+Run/+HP/+Food" labels when furniture pays off, tap a resident to pet it (mood, 20 s cooldown), residents visit and chat with housemates; "Who lives here" rows with live activity text replace the round avatars; invite row explains the growth bonus.
- Catalogue today: 6,635 elements. New target agreed: ~8,000 (not 10,000). Pending: ultra races + Supreme look, furniture art pass, remaining UI redundancy review, +~1,365 elements, release prep.

## V177 — Ultra-rare looks/colours, themed race prizes, make-room 500 / 3 ads
- ULTRA (market-v136): Celestial / Abyssal / Titan looks and Starlight / Obsidian / Ember colours drop from Championship wins (5% Rookie → 15% Champion, champUltraChance, rollUltra); Pearl / Neon colours have a 0.01% chance after any minigame/microgame (MINI_UNIQUE_CHANCE); Supreme look reserved for the ultra races (next). Engine: new tints (starlight, obsidian, ember, pearl, neon, radiant) and essence-only LOOK_THEMES. An unlock (wallet.ultra) puts free essences (hidden MARKET food ess-*) on the food tray: 3 for looks, 6 for colours; more essences cost 1,000 in Market › Looks › Ultra rare.
- Prizes sheet lists the 5 themed race prizes (their accessories); Prizes tile counts 11.
- Trophy/accessory/ultra wins call ctx.onPrize → companions.refreshViews() so counts update without leaving the screen.
- Full belly: make room costs 500 coins or 3 rewarded ads (counter per companion).
- Tests: hidden essences exempt from the "every Market item is an element" rule.

## V176 — All look and colour changes are bought in the Market
- Owner decision: every colour and trait change needs a Market unlock; size changes stay free; looks companions already have are kept; themed races need the look bought first (hint in the event sheet).
- Engine: setLookGate({tint,theme}); lookAfterMeal/lookEffects take gate=true only for the player's own feeding and meal preview (rivals, catalogue filter stay ungated). lookEffects returns lockedTint and traits with buy:true; themeInfo(key) for the Market.
- Market: new Looks tab (LOOK_ITEMS, 24 looks, 1,500–4,000: Dragon/Phoenix/Royal/Angel 4,000 …) and Colours tab with 9 natural colours (TINT_ITEMS, 600–1,200) above the special colours. Wallet persists looks[] and tints[]. A look unlock also opens its own colour.
- Meal preview shows "🔒 … tint · Market › Colours" and "🔒 … · Market › Looks".

## V175 — Colours live in Alchemy elements; Market a bit pricier
- Owner design: a bought colour is no longer applied directly. Each colour (DYES, with tint key + keyword match) belongs to Alchemy elements that had no look effect (no theme, no family tint): assignDyes(names, hasNaturalLook) picks keyword matches (Berry → jams, Cocoa → chocolate/coffee/wood…) and fills each colour to ≥ 12 elements by a stable hash.
- Engine: new tint keys in LOOK_COLORS/TINT_NAME (mint, sky, berry, sunset, snow, cocoa, aurora, onyx, rainbow); setMarketLook(fn) hook used by lookAfterMeal (tint only if unlocked) and lookEffects (returns market:{name,locked,rgb}). Meal preview shows "🔒 Berry tint · unlock in Market › Colours" while locked.
- Market › Colours: swatches with element counts; tap shows the element list and Unlock (or the coin pack for the 4 exclusives). V174 direct recolouring removed (applyDyes now clears the old style).
- Market prices ×1.5 (MARKET list); colours now 600–2,000.
- Same hook can later sell look unlocks (e.g. a Dragon look on more elements).

## V174 — Packs worth it: bigger packs, first-buy ×2, exclusive colours, Colours tab
- COIN_PACKS (ids unchanged): €1 600 · €2 1,300 · €5 3,500 · €10 8,000 (+Gold colour) · €20 17,000 (+Aurora) · €50 45,000 (+Shadow) · €100 100,000 (+Rainbow). €1 ≈ 3 days of free play.
- First coin pack ever bought gives ×2 (wallet.firstBuy, FIRST_BUY_MULT); coin shop shows the banner and crossed-out amounts.
- New coin sink: Market › Colours (DYES): Mint 300, Sky 400, Berry 500, Sunset 600, Snow 800, Cocoa 1,000 — bought once, usable on every companion; 4 pack-exclusive colours (Aurora/Rainbow animated). Applied globally via a <style id="dyeStyle"> on [data-companion] .companion-art svg (applyDyes).
- Wallet now persists streak (fixes V173 daily streak not surviving restarts), firstBuy, dyes, dyeOn. FAIR_PLAY_NOTE updated (only 4 cosmetic colours are pack-only).
- Owner to-do: if Play Console product descriptions mention coin amounts, update them (600/1,300/3,500/8,000/17,000/45,000/100,000).

## V173 — Coin economy rebalance (owner approved)
- Discovery 10 → 2 coins per new element + 50 every 100 elements (DISCOVERY_MILESTONE*). Whole game ≈ 25k instead of ≈ 100k.
- Companion finds 10 → 3 (ad still ×5).
- Daily gift 50 growing to 100 on day 7 of a streak (dailyCoins, wallet.streak, nextStreak/yesterdayKey); missing a day restarts at 50.
- Races/Karate: replaying a level already won with gold pays 25% (coinsFor repeat).
- Minigames + microgames: still ≤40 per game, but max 150 coins per day in total (st.coinDay, ARCADE_DAILY_CAP).
- Existing wallets untouched. Target: an active free player earns ~150–250 coins/day; €1 pack ≈ 1 day.

## V172 — DROP! basket fix
- Owner: items fell beside the basket but still counted. Now only the middle 60% (the opening) counts; a good drop lands inside the basket (basket drawn over the element), a miss falls beside it onto the grass and tips over.
- Pending: coin economy review proposed to the owner (discovery coins, finds, daily, races, daily cap for minigames) — waiting for approval.

## V171 — Coin prizes in tens; Pinball targets; rope height
- Owner: minigames paid too many coins (up to 300) and undermine buying coins. Now arcadeCoins(score)=round(sqrt(score)/4), capped at ARCADE_COIN_CAP=40 (1000 pts → 8, 10000 → 25). Milestone after all 16 minigames: ARCADE_STEP_COINS 500 → 50 per 250 elements.
- Pinball element targets are solid (ball bounces off), worth a flat 100 × multiplier, and respawn after 4 s away from the ball (no more endless farming).
- JUMP!: the rope's low point now reaches the companion's feet instead of its face.

## V170 — Pinball anti-stuck + microgame fixes
- Pinball: ball could ping-pong between the slingshots forever. Sling kick now 260 with a 0.3 s cooldown; anti-stuck nudge when the ball has not come down to the flippers for 7 s or is nearly still for 1.5 s ("NUDGE!").
- scratchLayer counts only pixels that were covered at the start (POLISH! used to finish on one tap because the area outside the egg counted as clean).
- JUMP! redrawn: thick rope that passes behind then in front of the companion, a cue ring under the feet that turns green when to jump, "x / 3" counter, smack sound; win at 3 jumps.
- CUT!: the element detaches and really falls with the swing's momentum (half strength); win only if it lands in the cauldron's mouth; cauldron position varies.
- CHOP!: logs on chopping blocks split into two halves + chips + "THWACK!". SPARK! removed (art not good enough).
- A coach companion (your active companion in a cream bubble) sits in the corner of every microgame and cheers / shakes on ✓ / ✗. Dev hook window.__microForce picks a microgame for tests.
- Reference for a future physics rewrite if needed: Ten Minute Physics pinball, planck.js (Box2D) rather than matter.js (flipper tunnelling).

## V169 — Microgames (WarioWare-style) + Games hub reshuffle
- Games hub tiles: Minigames · Microgames · Races (now includes the themed races, with their sub-header) · Karate.
- Microgames live in arcade-v158.js (MICRO_PACKS, MICRO, microRun, openMicro, microIntro): a command word, a 3-5 s game with a bomb-fuse bar, ✓/✗, 4 lives, faster every 5 wins (microTime). Each pack has its own 24 h ad pass (kind 'micro_pack'), best score in st.best[packId].
- Packs: TAP! (POP!, WAKE UP!, JUMP! skipping rope, DROP! claw→basket, STOP! dial, FIND!), RUB! (SCRATCH! card, POLISH! egg, WIPE! window, TICKLE!, SPARK! fire sticks), CUT! (CUT! pendulum rope→cauldron, SLICE! tossed elements but not the rock, CHOP! logs, TRIM! hedge, SPLIT! boulder). Helpers: slashTrail, segHitsCircle, segsCross, scratchLayer (canvas destination-out), rubMeter.
- Planned packs: DRAG!, MIX!.

## V168 — Pinball: weak launch could leave the ball stuck
- Owner: a weak launch fell back into the plunger lane and the ball could never be launched again (launched flag stayed true). Now the minimum launch speed is computed from the table height (always clears the dome; holding adds extra), and a ball resting back in the lane is re-armed.

## V167 — Pinball table in the game's art style
- Table is now a garden: race grass tile as the playfield, race sky inside the dome, sandy path loop, bushes/flowers, wooden fence rails with slate outlines, wooden slings with cream kicker faces, plank plunger lane, mushroom bumpers (red caps, cream dots), wooden drop-target posts, cream element bubbles with a moving dashed ring, cream/slate lamps, HUD pills and cream message banners. Element targets now spawn in the centre, away from the slings.

## V166 — Five V165 games removed; Pinball rebuilt
- Owner: of the V165 batch only Pinball was worth keeping. Removed Expedition, Challenge Cups, Cooking, Treasure Dig, Element Bingo (code, scenes, CSS). 11 minigames now; ARCADE_TOTAL stays 16 (5 slots for new ideas).
- Pinball table: plunger lane (hold to charge, release), dome top with one-way gate, 3 rollover lanes (all lit = multiplier up to x5), 3 pop bumpers, slingshots with kick, left drop-target bank (BANK CLEAR bonus grows), 2 element targets, 8 s ball save, ball trail, lamps, flashes and big messages. Static art (alchemy circle, rails, slings) pre-drawn once; 240 Hz physics. Slings placed so inlanes never trap the ball.

## V165 — The last six minigames (16/16)
- Expedition (Run: faster walking; fog-of-war 6x7 map, BFS path walking, compass to the chest, mud traps, new map per chest), Challenge Cups (Juggling: more time; Tap Frenzy / Stop the needle / Spot the odd one / Count, gold-silver-bronze cup), Pinball (Power: stronger flippers; canvas, 240 Hz physics, companion is the ball, bumpers + element targets, 3 balls), Cooking (Magic: more time; ordered ingredients ticket, KITCHEN scene), Treasure Dig (Stamina: more digs; hot/warm/cold distance numbers), Element Bingo (Singing: slower caller; 4x4 card, fair deck with decoys, lines = BINGO).
- All 16 exist, so after all are unlocked every 250 elements pays 500 coins (test updated). ARCADE_TESTER_ALL still true.

## V164 — Per-minigame 24 h ad pass (30-min hub gate removed)
- Owner disliked the 30-min hub gate. Now each minigame has its own pass: st.passes[id]; one rewarded ad (kind 'arcade_game') opens THAT minigame for 24 h (ARCADE_PASS_MS). Hub tiles show "▶ Ad · 24h" or "⏳ time left"; intro button becomes "▶ Watch ad · 24h"; "Play again" re-checks the pass. arcadePassLeft(st,id,now), fmtPass(ms). Progression unlock (every 250 elements) unchanged.

## V163 — Minigame ad pass + 4 new minigames (10/16)
- Opening the minigames hub needs one rewarded ad (kind 'arcade_pass'); then 30 min free entry (st.passUntil, ARCADE_PASS_MS, arcadePassLeft). arcadeProgress now keeps passUntil. ctx.showAd in app.js returns true when no native ad bridge (browser/dev).
- New games (arcade-v158.js): Deep Dive (canvas; Swim stat; air bar, urchins, depth-scaled treasure), Rock Climb (canvas; Power climbs faster, Stamina shortens stun; 3 lanes, warned falling rocks, gems), Drum Beat (DOM; Drums widen timing, Singing boosts combo; generated chart with rising tempo), Copy the Painting (Drawing: longer look + peeks; 3x3→5x5 rounds).
- canvasKit(o) helper shared by canvas games; STAGE_ART scene for Drum Beat.
- Remaining planned: Expedition, Challenge Cups, Pinball, Cooking, Treasure dig, Bingo.

## V162 — Sky Glide performance
- Owner: stutter on first tap and bad frame rate. Causes: big SVG backgrounds repainted every frame (background-position parallax + CSS var on the stage each frame), the whole app (roaming companions, CSS animations) still rendering underneath, forced layouts (offsetWidth) on every score change.
- Sky Glide now draws on one <canvas>: sky/mid/grass/rock and pickup art are rasterised once before "Tap to start" (no first-tap stutter); per frame only drawImage/fillRect. Canvas DPR capped at 1.5. Score text updated ~8×/s. Flap squash via WAAPI.
- All minigames: ctx.pauseWorld/resumeWorld — companions.stop() and body.ar-playing hides the app (display:none) while a minigame is open; restored on finish/quit.
- o.set(v,bump) no longer forces layout; bump only on add().

## V161 — Games tile hub + tighter Sky Glide
- games-v93.js: the Games sheet is now a tile hub (Minigames · Races · Karate · Themed races). Races/Themed open filtered lists (listSheet, rowsHtml(filter)); Karate opens its event sheet; Back returns to the right list (lastList). Stadium tile subtitle: "Minigames, races & karate".
- Sky Glide rewritten Flappy-style: fixed 120 Hz physics with render interpolation, a tap sets the upward speed (no stacking), constant gravity + capped fall speed, nose follows speed, round 17px hitbox vs pillar rects, ground at the grass line, ResizeObserver instead of per-frame layout reads, +10 per pillar passed.

## V160 — Minigames redrawn in the game's own art style
- Owner: V159 still looked bland vs the races. Now the arcade reuses STADIUM_ART_V95 (passed as ctx.art): sky/mid/run tiles for Memory, Falling Finds and Sky Glide; swim tile for the pond; climb tile for the glide pillars (grass caps like race walls); the dojo scene for Fire·Water·Earth.
- New props drawn in the same style (slate #657D89 outlines, soft palette): card backs, cauldron, alchemist lab wall, basket, bucket, bobber, rock, fish set, boot, chest.
- HUD/banners reuse the race classes (g-stage-top, g-quit, g-banner is-count/is-go, g-cheer, g-cloud); duel uses the real Fire/Water/Earth element art instead of emoji.
- Memory now 3x4 bigger cards on a picnic blanket. ARCADE_TESTER_ALL still true (remove before release).

## V159 — Minigames: graphics and animation pass (+ tester unlock-all)
- arcade-v158.js: each minigame now has its own scene (card table, sunset arena, alchemist lab with cauldron, meadow with drifting clouds and hills, pond with waves/fish shadows/dock, parallax sky).
- Shared FX: 3-2-1-GO countdown, floating +score pops, particle bursts (star/gold/fire/water/earth/smoke/magic), screen shake, combo badge, end banner, animated result (stars + counting score).
- Companion is a real rigged sprite (data-pivot origins) using engine anims: idle breathing, walk (catch), fly (glide), duo-throw (duel/fish/memory shuffle), duo-cheer, shake.
- Memory: 3D flip cards dealt in, FLIP shuffle animation. Duel: foe card flies in with timer ring, your element flies and clashes. Recipe: ingredients fly into a bubbling cauldron, fuse timer. Catch: basket, tumbling items, golden 50-pt items. Fish: cast arc, bobber nibble/bite ripples, catch flies to bucket. Glide: cloud pillars, sparkle trail, tilt.
- TEMPORARY: `ARCADE_TESTER_ALL=true` in arcade-v158.js unlocks all minigames for testing. Set to false before release.

## V158 — Minigames (Arcade): one new every 250 elements (2 November 2026)
- `client/src/arcade-v158.js` (`createArcade`, pure `arcadeProgress`). Save `alchemy10k_arcade_v158` {base, unlocked, paid, best}. On first run `base` = current Classic count and one random minigame unlocks; then one per `ARCADE_STEP=250` new elements (random order). Planned total `ARCADE_TOTAL=16`; steps beyond the implemented games are banked until more games ship; once all 16 are unlocked each further 250 pays `ARCADE_STEP_COINS=500`.
- Implemented (6): Element Memory (Drawing: longer peek, fewer shuffles) · Fire·Water·Earth (Juggling: more time) · Recipe Rush (Magic: more time, wrong answers fade at lv2/4) · Falling Finds (Run speed, Dancing catch width; trains Run) · Pond Fishing (Drums + Swim widen the timing window; trains Swim) · Sky Glide (Fly: lift/gravity/gap; trains Fly). Score → coins (score/20, max 300), best score saved.
- Entry: Stadium → Games → "🎮 Minigames" button at the top of the Races & Karate sheet. Planned next 10: Rock-paper element shooter variants, Expedition, Challenge Cups, Pinball, Diving, Climbing, Rhythm stage (Singing/Drums), Painting (Drawing), Cooking, Treasure dig, Bingo.

## V157 — more coin sources; School half price (2 November 2026)
- `DISCOVERY_COINS=10`: every new element from `completeCombination` (any crafting path, not Market purchases) gives 🪙10 with a "+10 🪙" pop under the element counter (`coinPop`).
- Companion finds while away: 🪙10 each for the ones kept; the rewarded ad keeps all finds and pays ×5 (`COMPANION_FIND_COINS`, `FIND_AD_MULT`).
- School: `LESSON_DISCOUNT=0.5` in `lessonPrice` (all 6 tracks to Master for one companion: 8,125 coins instead of 16,250).

## V156 — 20 more visitor scenes + duo scenes (2 November 2026)
- Singles: hat (tries it on), sunglasses (cool pose), banana/peel (slips), fish (catch; Swim), crab (pinch), snail/turtle (slow race), butterfly/bird (chase; Fly), ladder (climb; Stamina), rope (tightrope; Stamina), fan/wind (spun), lamp/bulb (idea), robot (copycat), dragon/monster/lion (roar back; Power), hammer/tools (builds a tiny house), puzzle (solve; Drawing helps), seed/plant (it grows), phone (chat), arrow/target (archery; Power), dice (roll), pumpkin/candy (trick or treat).
- Duo (`DUO_SCENES`, when the buddy is on screen, 60% of eligible visits): ride together, vampire scares the buddy and the main defends, pass the ball, dance together, party, selfie, snowball fight, ghost hug, bubbles, team tag. Duo-only toys (`DUO_ONLY`, never shown solo): seesaw, pillow fight, chess/cards, picnic, swing/hammock.

## V155 — 20 more visiting-element scenes (2 November 2026)
- New `VISITORS` + scenes: campfire/torch/lava (warms up) · snow/ice (belly slide, shiver; Stamina) · dog/cat/rabbit (tag; Run) · book/map (reads) · cake/party/gift (confetti dance) · rain/storm (cloud rains, hides; lightning) · camera (poses, flash) · UFO/alien (beam lift) · magnet (pulled) · firework/rocket/bomb (burst) · treasure/coin/gem (digs, sparkle) · bubble/soap (pops bubbles) · mirror (admires) · trampoline/spring (bounces; Fly) · sword/knight/pirate (duel; Power) · paint/brush (paints; Drawing level) · telescope/moon (stargazing) · flower/pepper (sniff, maybe sneeze) · clock/alarm/bell (startled) · wand/potion (magic; Magic level). 30 scenes in total; none match the four starters (test).

## V154 — visiting elements; Duo mode for 🪙5,500; Market→Alchemy check (2 November 2026)
- Test `v154-market-recipes`: every Market item is an element reachable by crafting from the four starters (all pass). Buying grants the element (V139).
- Visiting elements (`visitorScene` in companion-engine-v86.js, ~7% every ≥45 s when the companion is on a top rail in Alchemy): a visible element chip whose name matches `VISITORS` comes out and plays: vampire/bat chases and bites · mask goes on the face then thrown · spider web traps (Power = faster escape) · vehicles: companion drives (Run ≥35 smooth, else wobbly) · pool/lake: swims (Swim ≥35 graceful) · balloon/kite/broom: floats (Fly → height) · instruments: dances (Dancing School level → more twirls) · ghost: boo scare · bee/wasp: chase · ball: kick. Vehicles and balloons become a `.companion-fx` child while moving.
- Duo mode (second slot) costs **🪙5,500 companion coins** through `confirmBuy` (`SLOT2_COINS`); the free path (2,000 elements + 20 ads) stays; old Play purchases still count.

## V153 — make room costs 🪙150 and goes through the confirm sheet (2 November 2026)

## V152 — full belly after 20 elements; depth fix when walking north (2 November 2026)
- Hidden per-companion counter (`p.eaten`, `p.fullUntil` in companion-engine-v86.js; `FULL_AFTER=20`, `FULL_MS=1h`). Element meals (drag or self-feed) count; refused elements and Market food don't. When full, dropping an element opens the "FULL BELLY" sheet (`openFullSheet` in app.js): wait (minutes left), ▶ rewarded ad `make_room`, or 🪙100 → `companions.makeRoom(id)` (another 20).
- Home: a resident walking north keeps its current (front) z-index until the leg ends, so it no longer slips under the sprite it is walking past (`walkPath` in home-engine-v90.js).

## V151 — Home tiles; School perks in games; themed race maps (2 November 2026)
- Home: Companions / Houses are two big hub tiles (`.st-shop-btn.home-tab`, active one highlighted) with live subtitles (found count + who is on screen; houses owned + residents via `homes.homeInfo`).
- School perks (`SKILL_PERKS`/`perkOf` in games-v93.js, shown on each School class, n = levels learned): Singing −6%/lv cheer cost · Drums +6%/lv cheer boost · Drawing +5%/lv puzzle wits · Dancing +2%/lv Karate dodge · Juggling −6%/lv power-strike zeal · Magic +5%/lv game coins. Skill animations already scale with level (more notes, twirls, beats, balls, items).
- Theme races have their own map (`games-theme-v151.js`): stadium textures recoloured per theme by colour family (greens/browns/water/sky), themed props instead of bushes (clouds & marble columns, flames on basalt, pines & crystals, mushrooms & glow-flowers, coral & seaweed) and floating particles (`.g-themefx`).

## V150 — coins doubled for the same euros (1 November 2026)
- Owner: the €100 pack could not buy the most expensive house (16,000). Packs now give 200 / 420 / 1,100 / 2,400 / 5,200 / 14,000 / 30,000 coins for €1 / 2 / 5 / 10 / 20 / 50 / 100. **Play product ids keep their old names** (`coins_100` … `coins_15000`); only the credited amount changed (`COIN_PACKS[].coins`, credited by `creditCoinTokens`).

## V149 — more coin packs + "Nothing is pay-only" note (1 November 2026)
- Coin packs (market-v136.js `COIN_PACKS`, AlchemyBillingPlugin `COIN_PACKS`): `coins_100` €1 · **`coins_210` €2 (+5%)** · `coins_550` €5 (+10%) · `coins_1200` €10 (+20%, Popular) · `coins_2600` €20 (+30%) · **`coins_7000` €50 (+40%)** · **`coins_15000` €100 (+50%, Best value)**. **Owner must create the three new consumable products in Play Console.** Plugin now queries all ids in a loop.
- `FAIR_PLAY_NOTE` shown as a green box at the top of the Market and the coin shop: everything buyable can also be found in Alchemy or earned by playing.

## V148 — Stadium tile order: Games, School, Prizes, Market (1 November 2026)

## V147 — one companion sheet (1 November 2026)
- `openCard` (companion-engine-v86.js) is the same for every discovered companion: avatar, nickname (tap the name ✎ to rename), Total Lv + look, tags (On screen / house), stat panel, three actions **Add to Home** (`homePicker`: owned houses with room, Move in / Move out) · **Add to Screen** (`screenPicker`: choose which on-screen companion to swap — main slot via `choose()`, second slot via `requestActivation` then `setBuddy`; first choice free, otherwise one rewarded ad) · **Wardrobe**. On-screen companions get a subtle Mood/Belly strip (and Duo ×) at the bottom; the button becomes "Remove from screen".
- Home API for it: `homes.homeChoices/moveIn/moveOut` passed via ctx. The separate on-screen sheet from V145 is no longer used (grid always opens `openCard`).

## V146 — add-ons dropped; Home back to the simple layout; hats sit on the head (1 November 2026)
- Owner: "Desistimos dos addons". No second floor, no attachable garden/pool, no Add-ons UI, no Market add-on tiles. Garden and pool are part of the two top houses (`builtin:['garden','pool']` on Companion Castle and Castle with Garden and Pool) and drawn as the yard. The V139 elements House Garden / Outdoor Pool / Second Floor stay as normal Alchemy elements only. Old saves: `houses[].ext` is deleted at load.
- Home tabs order: Companions (left), Houses (right). Houses tab = house chip row, room, bonus chips, Residents row with "+" (V143 layout). Hub buttons and their sheets removed; furniture is placed by tapping the room.
- Tap-to-place list: pieces placed in another house are no longer disabled — picking one moves it here.
- Wear: look extras (halo, horns…) are hidden while measuring the head, so hats no longer float above them.

## V145 — Home tabs (Houses / Companions); one continuous staircase (1 November 2026)
- Home has two tabs (`homeTab` in companion-engine-v86.js `renderTab`): **Houses** (the house view + hub) and **Companions** (grid by family, legend, help, Duo second-slot block). The old "On screen" section is gone: on-screen companions (active and buddy) have a green border + "On screen" label in the grid and open the mood/Wear/Send-home card in a sheet (`data-onscreen`).
- Stairs: a single `.home-stairs` element (`placeStairs` in home-engine-v90.js, measured after render) runs from row 2 of the ground floor, through the wall band and the floor slab, up to the bottom two rows upstairs, with a handrail and an "▲ Up" tag. The old separate stair/stairwell sprites only block tiles now (ground 0,0–0,1; upstairs bottom-left).

## V144 — stairs that make sense; Home hub (1 November 2026)
- Second floor: the staircase now stands on the **ground floor** (back-left corner, `STAIR_GROUND`, blocks those tiles via `zh(hid,h)` in every `fits` call; furniture already there is put away when the floor is added). Upstairs shows a **stairwell** (`zone:stairwell`: railing round an opening with steps going down) instead of stairs going further up.
- Home now mirrors the Games tab: room on top, then four tiles (Houses, Residents, Furniture, Add-ons) opening sheets (`housesSheet`, `residentsSheet`, `furnitureSheet`, `addonsSheet`). The house chip row, Residents row and Add-ons row were removed from the main view. Furniture sheet: tap to move a placed piece, place an unplaced one at the first free spot (then drag), or bring one from another house.

## V143 — add-ons built from the game's own room sprites; residents live in them (1 November 2026)
- Owner: V142 garden/second floor art did not match the game. Now every add-on is a real zone made of room sprites (`ROOM_SPRITES_V90`) plus three new sprite-style pieces drawn in the same palette (`ZONE_SPRITES` in home-engine-v90.js: `zone:pool` 3×2 floor piece, `zone:lounger`, `zone:stairs`).
  - **Upstairs** (`upstairsPlan`): a second `.home-room.is-upstairs` with the house's own wall/floor theme, stairs, two `organic89:bed`, curtain (and picture frame on wide houses); a floor slab separates it from the ground floor.
  - **Yard** (`yardPlan`): grass or patio floor; garden = flower box, garden bench, fence, bird bath, lantern, rope swing; pool = `zone:pool` + lounger. Layout adapts to the house width.
- Residents really move between zones (`splitResidents`): the house's own capacity stays downstairs, the next two sleep upstairs (beds → `sleep`), and about a third of the ground residents (min 1; a lone resident alternates every 90 s) visit the yard and swim in the pool / use the swing. Each zone runs its own `wanderZone` loop (refactor of `startWander`; zone pieces use `data-zpiece`, train:false so bonuses still come only from placed furniture).

## V142 — add-ons drawn as real places (1 November 2026)
- Owner: garden was a tiny strip inside, pool a line, second floor unclear. Now in Home (`home-engine-v90.js`, `upstairsHtml`/`yardHtml`, CSS `.home-plot/.home-up/.home-yard`):
  - **Second floor** = an upstairs bedroom drawn above the room (stairs, window, 2 beds). Residents beyond the house's own capacity sleep there (zz) and no longer walk downstairs.
  - **Garden** = an outdoor yard below the door: grass, stone path, tree, flower bed, bush, butterfly, fence.
  - **Outdoor pool** = a real pool with moving water, ladder and float; on a paved patio with a parasol lounger if there is no garden.
  - Each zone has a label with its effect ("🌳 Garden · Fun +20%", "🏊 Pool · Swim +25%", "🏠 Upstairs · 2 beds").
- The ground floor keeps the house's own size (`layoutOf` = base capacity); no more grass row inside the room.

## V141 — Games tab hub: Market, School, Games, Prizes (1 November 2026)
- Stadium shows the companion card and four equal tiles (2×2): Market, School, Games, Prizes. The race/Karate list moved to a "Games" sheet (`gamesSheet` in games-v93.js); an event opened from it has a Back button to the list.
- **TESTER GIFT (temporary, owner request):** 100,000 coins once (`alchemy10k_tester_coins_v141`, app.js after `saveWallet`). Market total is ~66k + School. **Remove before the Play Store release.**

## V140 — houses vs add-ons made explicit, with compatibility (1 November 2026)
- Add-on compatibility (`EXT_INFO[k].fits`, house capacities): Garden → Tent to Castle; Outdoor Pool → Cottage to Castle; Second Floor → Cabin and bigger (incl. Castle with Garden and Pool). The Castle with Garden and Pool has Garden and Pool **built in** (`builtin:['garden','pool']` in HOME_OBJECTS).
- `homes.addonInfo(id)` returns label, effect line, fitting houses and a short range text ("Cottage to Castle"); used by Market tiles, the buy confirm and the element sheet.
- Market Houses tab: two sections ("Houses" / "House add-ons"), tiles tagged HOUSE / ADD-ON, add-ons show "Fits …".
- Home: "Add-ons" row under Residents (same style as Residents). Built-in add-ons shown green "Built in"; add-ons that don't fit are greyed with "Fits …"; others "Tap to add" / "✓ Added · tap to remove" / "In X · tap to move here". Old saves with an add-on on a house it doesn't fit are cleaned at load.

## V139 — Market items are elements; Castle with Garden and Pool; house complements (1 November 2026)
- Owner exception to the 200 rule (AGENTS.md): +23 elements `organic139:*` (manifest `shared/v139-approved.json`, `owner_exception:true`; gate accepts it). Catalog 6,612 → 6,635.
- Every Market purchase is now also an element (`MARKET_ELEMENT` in market-v136.js; `it.element` on every item): hats, glasses, scarf, bandana, bow tie, cape, the six stat fruits, hand mirror, rebirth egg, plus existing Cookie, Soap, Bow, Headphones, Bouncing Ball, Spinning Top, Drum. Buying grants the element (toast "New element"); items bought before V139 are granted once at boot (2.5 s after load).
- All new elements have in-family recipes (Alchemy can also find them for free).
- Houses: `organic139:grand-castle` "Castle with Garden and Pool" (capacity 10, 9×9 floor, growth ×2.3, Market 🪙16,000).
- House complements (`kind:'extension'`): House Garden (🪙2,400: +1 grass floor row, all growth ×1.05, Fun +20%), Outdoor Pool (🪙3,000: Swim +25%, pool strip), Second Floor (🪙4,200: +2 residents). Attach one per house from the chip row above the room in Home; tapping on another house moves it. Removing a second floor moves the newest extra residents out. Stored in `homes.houses[hid].ext`.
- Tests: `client/test/v139-market-elements.test.mjs` (also checks app.js parses — node tests never import it). 404 passing.

## V138 — market polish: confirm, copies, daily coins, timed school levels, higher prices (1 November 2026)
- Every Market/School purchase opens a CONFIRM sheet (price, balance, after; "Get more coins" when short). `modalBack` hook: X on confirm / coin shop returns to the sheet it came from.
- Accessories are counted (`wallet.acc` = {id:copies}, old arrays migrated). One copy dresses one companion; Wardrobe shows free/used copies and offers to buy another copy. Price per copy `accPrice(base,owned)` = base×1.6^owned.
- Daily coins: +100 once per calendar day in the Market (`wallet.daily`).
- School: 5 levels per lesson (Novice→Master), price `lessonPrice` ×[1,2.5,5,9,15], duration 5 min/30 min/2 h/6 h/12 h, one class per companion (`wallet.classes`), live timer, "▶ Ad −30 min" (`kind:'school_skip'`), auto-graduates (`settleClasses`, every minute and on open). Skill level makes tricks fancier and more frequent (`skillLevel`).
- Prices raised (food 45–180, accessories 160–650, toys 400–500, furniture 350–800, houses 900–11 000). Furniture/house images fixed (`homeStaticArt`, `.mk-art svg` sized). "+ Coins" button without the "from €1" line.

## V137 — bigger coin packs, food dragged from the screen (1 November 2026)
- Coin packs `coins_100` €1, `coins_550` €5 (+10%), `coins_1200` €10 (+20%, Popular), `coins_2600` €20 (+30%, Best value) — **owner must create all four as consumable products**. Plugin `purchaseCoins({pack})`, reports `coinPacks` prices and `coinTokens` as "pack|token"; JS credits each token once with that pack's coins. Coin shop sheet from the Market/School "+ Coins" button.
- Market food no longer feeds instantly: it goes to `wallet.bag` and shows as tokens on top of the craft card (`#foodTray`, card gets `.has-tray`); drag a token onto a companion (main or second) to feed it; a tap shows what it does.

## V136 — companion coins, Black Market, School, accessories, theme races, race personality (1 November 2026)
- New module `market-v136.js` (ACCESSORIES with SVG drawers per slot head/face/neck, WEARABLE_ELEMENTS, MARKET catalogue, COIN_PACK, coinsFor, LESSONS). Wallet in app (`alchemy10k_wallet_v136`: coins, owned accessories, toys, active toy, credited Play tokens).
- Coins from races (by place/level, ×1.5 theme races, ×2 first gold) and Karate. Stadium header shows 🪙; Market + School buttons.
- Market tabs: Food (stat fruits +60 XP, cookie, soap/mirror/rebirth looks — given to the on-screen companion via `companions.marketFeed`), Wear (accessories), Toys (ball/top/drum, one shown on the craft-card corner, played with ~7% of loops after 30 s cooldown), Furniture and Houses (granted as elements).
- **Coins for money:** consumable Play product **`coins_100` (owner must create, EUR 1.00 → 100 coins)**. `AlchemyBilling.purchaseCoins`; getStatus/purchase results report `coinTokens` (and consume them); JS credits each token once.
- Accessories: drawn by the engine (`applyWearSvg`, `pets[id].wear`), Wardrobe sheet (Home → Wear, card → Wardrobe) with Remove per slot; wearable elements show "Wear on <companion>" in the element sheet. Prizes: Expert+ gold on regular courses (COURSE_ACC), Karate Expert+ win (medal), Champion gold on theme races.
- School: 6 lessons per companion (coins) → `pets[id].skills`; skills performed on the main screen (~8% of loops, 25 s cooldown) with `sk-*` rig states and props (notes, easel doodle, drum, juggling elements, magic hat).
- Theme races (THEME_COURSES heaven/inferno/dragonpeak/glade/deepsea) open only when `companions.themeCompletion(cid,theme)` ≥ 85%; tinted stages; ROUTES per theme.
- Race personality: on run segments a sad/hungry racer may sit, trip (and cry if sad) or get distracted (butterfly); CHEER snaps the player's companion back; rivals recover on their own.

## V135 — element list updates live after feeding (1 November 2026)
- `ctx.onMeal` (called in eatSequence right after `tasted` is recorded) → `rerenderCollections()`, so "Not fed yet", colour/trait filters and the tab counts update immediately.

## V134 — Looks filter in the Stat-filter tile style (1 November 2026)
- "How should it look?" sheet: mystery banner (? · Not fed yet · count), then 3-column `.stat-tile` grids for Colour (big swatch), Traits (real trait outline/colour via new export `traitIconSvg(label)`) and Size & reset. Same filtering logic as V124.

## V133 — Stat filter (1 November 2026)
- New "▲ Stat" tool chip (`#statChip`) next to Looks. Sheet with 6 stat tiles (icon, current level of the on-screen companion, element count) and a "Main stat only / Main + bonus" toggle; filters by the element family's FAMILY_FEEDS pair (`companions.feedStatsOf`). Families feed: games run/stamina, anime power/fly, nature swim/stamina, fantasy fly/power, people stamina/hp, mythology power/fly, prehistoric power/hp, world run/swim, home stamina/hp (default).

## V132 — element list scrolls again (1 November 2026)
- V127 dropped the `</div>` closing `#shelfToolbar`, so `#inventoryScroll` was nested in the toolbar and grew to full height (no scrolling, stale virtual rows). Closed it; test v132-shelf-scroll guards the nesting.

## V131 — second slot and tasted elements survive relaunch; slot back to €1 (1 November 2026)
- Companion `normalize()` on load dropped `buddy` and `tasted`, so the second companion left its slot and fed elements showed ??? again after an update/restart. Both are now kept.
- `SLOT2_TEST_FREE=false`: Duo INSTANT uses the Play `companion_slot` price again (owner's test unlock stays saved locally).

## V130 — feed and pet the second companion (1 November 2026)
- `swapInPlace()` swaps main/buddy roles without moving them (art, rails, layers and positions are exchanged). Dropping an element closer to the buddy (`hitTest`) or stroking it (own pointer handlers with pointer capture) swaps first, then runs the normal feed/petting flow. Tapping the buddy swaps in place and opens its card.

## V129 — rival companions in minigames have looks (1 November 2026)
- `rivalLook(seed,level)` (companion-engine) simulates a few themed meals (more meals, radiant depth and a second mixed theme at higher levels). games-v93 `opponentsFor(n,exclude,level)` stores one per rival (`rivalLooks`, `rivalLookOf`), marks rival elements `data-rival="1"`; app `wearAll` applies it via `companions.applyRivalLook` (filter key `<id>-rival`) unless the rival is one of the player's own companions with a real look.
- Roster reviewed (all 40 have body + head + legs rigs); owner confirmed all designs are fine, no sprite changes.

## V128 — saved look shown on launch (1 November 2026)
- Bug: on app start `setArt` called `ctx.wear(sprite.parentElement||sprite)` before the sprite was attached to a layer (wearAll only searches descendants) and while hidden (getBBox = 0), so the companion showed its plain look until the next meal. Fix: `rewear()` re-applies looks/belts on both layers one frame after `start()`/`startBuddy()`.

## V127 — game-like filters & settings, centred description, TEMP free duo unlock (1 November 2026)
- Alchemy filters: segmented view tabs with live counts (All / To find / Done ★ / Saved / ✦ Shiny) in `.view-seg`, then tool chips `.tool-chip` (⇅ sort, family with its artwork as icon, ◉ Looks) that light up when non-default. Counts computed in `syncInventoryButton()` (called from rerenderCollections). validate-v55 accepts `tool-chip sort-button`.
- Settings: AD-FREE banner (same `.bx-noads` as the combiner; OWNED when bought), "SAVE FILE" tiles (export/import/delete), "MORE" list with icon badges and a SOON tag. Same ids as before.
- `.discovery-wit` centred (justify-self/width fit-content).
- **TEMPORARY:** `SLOT2_TEST_FREE=true` in app.js makes the Duo "INSTANT" button unlock the second slot for "€0.00 · TEST" without Play, so the owner can test on the phone. Set to false (or remove) before the store release.

## V126 — game-like combiner & duo panels, Batch all, Remove ads €2 (1 November 2026)
- Family combiner sheet redesigned: locked element token × selected family art, family grid, two action cards ("<family> · N combos · ▶ 1 AD" and "All families · ▶ 4 ADS" with progress pips), and an AD-FREE banner (`billingPrice`, opens Remove ads). Free trial button removed (`batchTrialUsed` dormant).
- Batch all: `beginBatch('all',…)` scans every collected element; 4 rewarded ads (`kind:'batch_all'`, credit per locked element in `alchemy10k_batch_all_v126`), free with no-ads.
- Remove ads default label €2.00 — **owner must change the `no_ads` price in Play Console to EUR 2.00** (the app shows Play's formatted price when available).
- Home "Duo mode" locked card is now a game panel: main sprite + locked "?" slot, 3 perk tiles, INSTANT (price) and FREE PATH tiles (element progress bar to 2,000, then 20 ad pips).

## V125 — second companion slot + duo play, starter packs on the Alchemy screen (1 November 2026)
- Starter packs: "✦ Packs" button next to Hint in the craft card; sheet opens with a "why" box (companions/houses/furniture sooner) then the pack list. Removed from Settings (only Remove ads stays) and from the family filter.
- Second on-screen slot (`state.buddy`): unlocked by Play product **`companion_slot` (owner must create it in Play Console, EUR 1.00)** via `AlchemyBilling.purchaseCompanionSlot` (plugin now queries both products and reports `companionSlot`, `slotPrice`, `slotAvailable`; purchase results re-query all owned purchases so buying one never hides the other), or free at 2,000 Classic elements + 20 earned rewarded ads (`kind:'companion_slot'`, key `alchemy10k_slot2_v125`). Home → On screen shows a locked card / choose / change / send home. Tapping the buddy on screen swaps main and buddy (feeding stays on the main one).
- Buddy actor (`#companionBuddy`) walks/jumps the same rails, follows the main one, sleeps with it. Duo games from the main loop (~20% per tick after 18 s cooldown, or `requestDuo(kind)`): spar, throwing (random owned element), tag (across rails), hide-and-seek (behind cards), ball game (kicks/headers, last ball escapes). New rig states `duo-*` in styles.css (whole-body motion via individual translate/rotate with `--dir`, limbs via parts), `.duo-flyer` projectiles, `fx-impact`/`fx-spark`, new sfx whoosh/bounce/kick/giggle/count/found/peek/swish. Feeding/petting aborts a duo game.
- Duo bonus: all companion growth ×1.25 while two are on screen; idle finds count the duo as explorers (+0.9 rate, +3 cap) even without house residents.

## V124 — Classic only, family starter packs, Looks filter (1 November 2026)
- Owner decision: one game mode. Boot no longer shows the mode picker; `migrateFamiliesIntoClassic()` copies every Family Only discovery into Classic once (free, key `alchemy10k_classic_only_v124`). Mode button + family/classic banner hidden; Settings "Game mode" and "Merge" rows replaced by "Family starter packs". Family-mode code (activateMode, merge hub, modePicker) left dormant.
- Family starter packs (`starterPacks`/`buyStarterPack`): unlock a family's 4 campaign starters into Classic; 2 rewarded ads (`kind:'starter_pack'`, step credit kept in `alchemy10k_starter_pack_v124`), free with no-ads, explanatory modal in the HTML build (no simulated ads). Opened from Settings and from the family filter sheet. Verified family recipes are a subset of classic (0 extra/0 conflicts) and all 6612 items are classic-reachable.
- Looks chip in Alchemy filters: ??? Not fed yet, known colours (with swatch), known unlocked traits, bigger/smaller, resets — only from elements the player fed (`companions.tasted`, `companions.looksOf`).

## V123 — Collection tab removed (1 November 2026)
- Owner decision: the Collection tab only added complexity (Alchemy already has search, sort, family filter, Saved/Shiny/To explore, Merge, Hint with "try combination", element sheets). Nav button removed from index.html; `switchTab('World')` now falls back to Play. The hidden #viewWorld markup/renderDiscoveries code is left dormant (old tests reference it) — safe to delete later.

## V122 — looks in the after-meal window (1 November 2026)
- After a player-given meal the stat window gets a LOOKS block (`lookDiff(before,after,tintKey)`): Colour (swatch + tint name of the eaten element, k% before → after), Size, and each spot (Head/Back/Tail/Around) with trait % before → after, shrinking traits listed as "(morphing)"; resets as ↺ lines; "No change" otherwise. Window re-clamped and held 4.2s.

## V121 — hand-picked looks, hidden effects, silent powers (1 November 2026)
- Powers are purely visual: no "New power" note, no label/preview text (`powersOf` still drives `usePower`).
- Meal preview shows `???` for Grows/Looks until that element has been fed by the player once (`state.tasted[id]`; old saves count any `pet.fed` entry). `mealPreview().known`.
- `LOOK_OVERRIDES` + `LOOK_OVERRIDE_PREFIX` (themeFor): hand-picked fixes for regex false matches (Halo/Fire Emblem/KOF/Prince of Persia/Dragon Ball series, Phoenix Wright, Demon Slayer, Star Fox stays fox, etc.), re-themes (Ice Halo→ice, Rhythm Heaven→music, Hinokami Kagura→phoenix, Ice Cream→sweet…), and hand-picked names never trigger reset/wash/mirror (Dragon Egg Cradle, Black Sabbath, FFVII Rebirth, Meteor Shower…). Review list was made from all 6612 elements' theme matches.

## V120 — looks only from player feeding + signature powers (1 November 2026)
- `eatSequence(...,{self:true})` (companion eats on its own) no longer calls `lookAfterMeal`: self-meals grow stats/belly/mood only. Easy elements (tier 1, depth<4) still only tint/size.
- `LOOK_POWERS`/`powersOf(look)`: a power unlocks when enough RADIANT traits (tier 3, depth≥9) are ≥75% grown — Fire breath (2 of dragon horns/wings/tail), Fairy dust (butterfly wings), Phoenix blaze (fire wings), Frost breath (flake), Shadow smoke (2 demon traits), Holy light (halo + feather wings), Water spout (fish tail). Idle loop uses one ~10% of ticks (`usePower`, `.fx-power` CSS particles, sfx). Meal notes "New power: X!", look label "⚡ X", meal preview shows "⚡ X · power when fully grown" for tier-3 themed elements.
- Main screen companion only (houses don't show powers yet). Test: V120 in v116-looks.test.mjs.

## V119b — organic shape morphing (1 November 2026)
- Replaced the V119 opacity crossfade: every wing/tail/horn/topper/aura trait is now an outline resampled to the same number of points (`morphBlend`, `smoothPath` in companion-engine-v86.js). A slot's mix is drawn as ONE shape whose points are the weighted average of its traits' outlines, so edges bend gradually (bat-wing fingers round into butterfly lobes). Colour blends the same way. Halo/antenna/notes keep their own drawing.
- Test: V119b in v116-looks.test.mjs. Render check: /tmp/v86/t38.py (Demon×4 → Fairy×3).

## V119 — traits grow gradually and morph (1 November 2026)
- Owner: looks should appear gradually and blend, not swap. Each spot holds `look.mix[slot] = {traitId: weight}` (sum ≤ 1). A meal adds 0.25 (0.4 for radiant/rare) to its trait and shrinks the others proportionally when the spot is full; drawing shows every trait in the mix, sized by how grown the spot is (35%→100%) and faded by its share, so bat wings blend into butterfly wings over a few meals. Notes: "Bat wings growing (25%)", "Bat wings morphing into butterfly wings (40%)", "… fully grown!". Labels: "Bat wings / butterfly wings mix", "Devil horns 50%".
- Old saves (single trait per spot) load as fully grown traits (`normLook`).

## V118 — element sheet previews what a meal does (1 November 2026)
- Long-press sheet adds "If <companion> eats it": taste (loves / won't eat), XP per stat right now (or cooldown minutes), tint with colour swatch, size change, traits with their spot (head/back/tail/around) — greyed "needs a harder element" for easy versions, ✦ for radiant — and resets; footer with rarity stars, recipe depth and growth multiplier. `companions.mealPreview(id)`, pure `lookEffects(name,family,category,depth)`.
- Mix-and-match is by design: one trait per spot from any theme (fairy wings + devil horns is allowed); the sheet says so.

## V117 — themed looks + rarer elements are more extravagant (1 November 2026)
- `LOOK_THEMES` (word-boundary keywords, first match wins) give whole coherent sets: Demon (shadowy tint, devil horns, bat wings, devil tail), Vampire/Bat, Angel (bright tint, halo, feathered wings), Phoenix (warm, flame, fire wings, embers), Dragon (horns, dragon wings, spiked tail), Fairy (butterfly wings, sparkles), Ocean (fin, fish tail, bubbles), Fox (fox tail), Robot, Bird, Ice, Fire, Flower, Plant, Space, Royal, Love, Music, Magic, Bubbles, Metal, Gold, Sweet, Water. New slot: tail. New tints: dark, light.
- Extravagance by recipe depth (`lookTier`): ≤3 only tint/size; 4–8 traits; 9+ RADIANT traits (×1.4, glow, flapping wings, swaying tail) and stronger tint (cap 0.62). Card shows ✦ on radiant traits.
- Phoenix is now a theme; resets are egg/rebirth/reset (soap/mirror unchanged). Accessories may overflow the sprite (svg overflow visible).

## V116 — what companions eat changes how they look (1 November 2026)
- Owner idea from SA2 Chao (animals change body parts; newer parts replace old ones). `lookAfterMeal(look,name,family,category)` (pure, companion-engine): tint toward a colour (warm/cool/leafy/metallic/mystic/golden/rosy, by name keywords or family; +0.06 per meal, cap 0.45), size ±2% per meal (food/big grow, air/feather/tiny shrink; ±15% cap), one trait per slot — head (leaf, flower, flame, snowflake, antenna, star, crown, horns), back (wings, fin), aura (sparkles, bubbles, hearts, music notes).
- Resets: soap/bath/shower/wash wash most of the tint off; mirror undoes size and head trait; phoenix/egg/rebirth/reset restores the natural look. Refused food changes nothing.
- Rendering (`applyLookSvg`, via `companions.applyLook` in `wearAll`): luminance-preserving feColorMatrix filter per companion (#lookDefs), CSS `scale`, small SVG accessories attached to the head/body parts so they move with the rig. Shown everywhere companions are drawn; card line "✨ Warm tint · Little flame · Wings · Size +2%"; the feeding window lists look changes.

## V115 — harder elements feed more (1 November 2026)
- `feedDepthMult(depth)` = min(1.8, 0.6 + 0.12×recipe depth): starters ×0.6, depth 5 ×1.2, depth 10+ ×1.8 (×2 more for shiny). Applied in `feedPlan`; companions get `ctx.depthOf` (routeDepth). Measured: Air +34 vs a depth-11 element +101 total stat XP.

## V114 — "while you were away" when returning to Home (1 November 2026)
- Leaving the Home tab stamps `homeAwaySince`; coming back after ≥2 min runs `homeAwaySummary`: every house resident uses each training/food/fun piece min(30, 1.5×minutes) times through `companions.homeEffect` (same daily cap as the live room), and a sheet lists per resident the XP gained per stat (level-ups highlighted, "Lv 3→4"), plus mood/belly.
- Separate from the V91 idle finds (app closed).

## V113 — residents walk around furniture (1 November 2026)
- `findPath` (pure BFS, 8 directions, no corner cutting): standing (object-layer) pieces block their tiles, rugs/mats stay walkable, the piece being used is enterable. Walking is a chain of per-tile CSS transitions; wander targets are free tiles; residents start on free tiles. Unreachable targets are skipped.
- Running wheel: the resident stands on the drum floor (lift −0.36 tile).

## V112 — house objects move while used (1 November 2026)
- Residents stand in the centre of the piece they use (fractional tiles; lifted into the wheel/onto the bike/seesaw; in front of desks/bags).
- `motionOf(id,name,effect)`: wheel / treadmill / bike get moving-part overlays drawn in the sprite viewBox (spinning wheel, running belt, turning bike wheels, front/back views); trampoline squashes in time with the bounce, punching bag swings, seesaw/rocking horse rock with the rider, swings swing the rider, hurdles/jump rope hop, pools ripple, music pieces float notes, stoves/fires/tubs steam, globes spin.
- Fix: the starter Frog (not an unlocked element) could not live in houses — homes now use `companionOwned`.

## V111 — feeding always shows a window (1 November 2026)
- Owner bug: sometimes no window after feeding. Cases with no growth showed nothing: same element within the 30-minute cooldown, refused element, maxed stats. `showNoteWindow` now explains each (e.g. "Already ate Air recently · No growth for 23 min — try another element · Belly +10 · Mood +12").
- Also fixed: the stat window's 400 ms hide timer was not tracked, so a window opened right after another faded could be hidden (`statHideTimer`).
- Note: race/karate prizes (trophies) are house furniture only; they are not catalog elements and cannot be combined.

## V110 — picker previews, Change confirms (1 November 2026)
- Owner: the V109 medal tallies on the picker tiles were not the right idea (removed). Now, with the picker open, tapping a companion only previews it: the entrant card, header medal counts, course medal dots and Prizes row show that companion. It becomes the entrant only when **Change** is tapped (highlighted while a different companion is previewed); the current entrant's tile has a dashed border. Tapping a Play button while previewing confirms that companion and starts.

## V109 — medals visible per companion in the picker (1 November 2026)
- The Stadium companion picker ("Change") shows on every tile that companion's gold/silver/bronze counts, trophies (🏆n) and belt badge, sorted by medals (gold first); tiles with medals get a golden border. No switching needed to compare.

## V108 — medals and trophies per companion (1 November 2026)
- Games progress is stored per companion (`state.pets[cid] = {races, karate}`); level unlocks, medal dots, header medal counts and the Championship unlock follow the selected entrant. Old shared progress migrated once to the companion that was competing (else the Frog); other companions start at Rookie. Belts were already per companion.
- Prizes: each companion wins its own trophy per course — `prize:<course>:<cid>`, "Frog's Pond Fountain" — the course trophy with the winner's figure (`personalPrize`, built on demand). Registered as house furniture for every companion × course (ROOM_SPRITES lazy getters). Prize sheet shows the current companion's six trophies and a count for the others.

## V107 — urgent: slow taps opened the element sheet instead of combining (31 October 2026)
- Owner report: combining showed an element already owned instead of the discovery. Cause: V104 long press (480 ms) fired on slow taps of the second element, opening its sheet and skipping the combination. Recipes were re-audited (Classic + 9 families, 120 random new combinations per mode and 37 real touch taps): every result window matched the recipe.
- Fix: long press needs 700 ms, a ring fills on the chip from 200 ms, and the sheet is titled "ABOUT THIS ELEMENT". Taps up to ~650 ms always combine.

## V106 — karate that reads as a fight (31 October 2026)
- Fighters (140px) stand on the middle of the mat (bottom 27%, 9% from each side) in a bobbing stance with a floor shadow.
- Each attack is a Web Animations sequence: wind-up (step back, crouch) → dash to the opponent → impact at 330 ms → back. Outcome at impact: dodge (jump up and back + ghost), braced block (small push + block ring), hit (knockback, bigger and airborne on heavy hits, white flash) or KO (thrown back and over, stays down until the next round).

## V105 — recipe audit, starter Frog, companion sounds (31 October 2026)
- Recipe audit: Classic (19,829 recipes) and all 9 family maps use order-free keys (`[a,b].sort()`), and every family recipe agrees with Classic — no A+B ≠ B+A anywhere. The "House + Wood → Companion Hut" path was a stale discovery-ledger record from before V91; `discoveredRecipes` now shows a recorded pair only if it still makes the element.
- Starter companion: `STARTER_COMPANION='organic38:frog'` is owned by every player (`companionOwned`) and is on screen in new games; the free first choice is kept.
- Sounds (shared `SFX` synth, Settings toggle applies): companion tap/boop, petting purr, happy chirp, grab, nom per bite, refuse, knocks, hop, level-up; races: footsteps/paddles/grips/wind for your racer, louder CHEER with a short vibration (double buzz when too tired).

## V104 — gate walking, long-press element sheet (31 October 2026)
- Alchemy gates: phases think → go (walk to the chosen stone) → pick (hop) → right: carry on from that stone / wrong: walk back and think again. Display x is smoothed (`r.dpx`, 120 px/s inside gates, 300 px/s catch-up elsewhere); racers face left when walking back.
- Alchemy tab: long press (480 ms, no movement) on an element opens `elementInfo` (description, companion/house callouts, families, Use / Recipes). Tap and drag unchanged.
- Discovery callout for furniture now shows its bonus and stars.

## V103 — furniture quality and bonus breakdown (31 October 2026)
- A piece's bonus depends on its recipe depth (`ctx.depthOf` = routeDepth): ★ ≤5 +10%, ★★ ≤7 +15%, ★★★ ≤9 +20%, ★★★★ ≤11 +25%, ★★★★★ 12+ +30%; race prizes ★★★★★; decor 0. Per-bonus cap raised to +75%. `growthMultiplier(...,bonusOf)`.
- The furniture picker and piece sheet show each piece's bonus and stars.
- Chips under the room are buttons: `bonusSheet` explains the house growth (ladder of houses), the alchemy multiplier, each piece's contribution and the final multiplier.

## V102 — ravines instead of a black void; grounded background (31 October 2026)
- Chasms are ravines cut into the earth: shaded rock back wall (`rcShade` over `rcRock`), the far cliff face and the grass/water floor. No dark void.
- Background: the stage has continuous meadow (#A9CF8E) below the horizon behind the hills (mid layer at full opacity, sky ends above it), so no sky ever shows under the track.

## V101 — glides can fall short (31 October 2026)
- `glideReach(fly)` = 0.35 + 0.75×Fly/99 (Fly 87+ always crosses). A racer short of the far side, or out of stamina mid-air ("NO STAMINA!"), drops to the chasm floor, crosses it (grass = Run, water = Swim) and climbs the far cliff with Power. CHEER mid-air adds +0.08 reach.
- Chasms now have a floor (`z.floor` water/grass, `z.floorY`) drawn in the course SVG; the far cliff riser goes down to it.
- Weak fliers sink along `glideY` on the way to the drop point.

## V100 — track with depth, gates across the path (31 October 2026)
- Owner feedback: vertical start/finish lines, track too thin (racers piled up), walls/pools looked pasted on, background floating.
- Oblique view (`RC.SK=0.32`, `BAND=100`): the path has depth and the 5 lanes run side by side (`laneD`); walls are the riser face of the next step (racers climb its face at their lane depth); pools are sunk into the path; the chasm shows the far cliff's face.
- Start/finish are lines painted across the path; the back post and banner are in the course SVG, the front post in `courseFrontSvg` (overlay above racers).
- The earth runs to the bottom of the screen (SVG 1000px tall, darker with depth); hills sit on the horizon; the foreground fence layer is hidden in races. Rival tags show only the place number.
- APP_VERSION 1.0.0.

## V99 — one continuous race track, own route per course (31 October 2026)
- Owner: take the Chao Race STRUCTURE (sections that flow into each other, climb and carry on above, glides, THINK), adapted to our game, keeping the approved V95 2D art. No copied props.
- `buildCourse(plan)` → zones (run / swim / wall / glide / puzzle) in race units + world px; `groundAt`, `posAt` shared by renderer and racers. Heights 0..3 steps (`RC.LVL=50`). Walls climb one step and the race continues on top; glides land a step lower; the finish straight stays flat (Boulder Wall ends on the summit).
- `courseSvg(C,art)` draws the whole track as ONE SVG with the V95 tiles as patterns (run = grass path, climb = every cliff face and wall, swim = pools, fly = chasm with the broken bridge) and the original start/finish gates — no seams between sections.
- `ROUTES` per course: Pond = chained pools, Cliffs = climb up/glide down, Meadow = long runs, Boulder = staircase of walls, Trail = mix, Championship (renamed from Grand Circuit) = everything + alchemy gates. Level n plays the first 6/8/10/12/14 sections.
- ALCHEMY GATES (THINK): a sign shows two elements, four answer stones on the floor; the companion thinks and steps on one (wrong stones flash red, it retries). Wits = 0.25 + 0.45×average stat level + 0.3×(alchemy growth − 1), so classic discoveries make companions smarter.
- HUD: section map under the stamina bar.

## V98 — climbs are steps: the race continues on top (31 October 2026)
- Owner feedback (drawing): the climb should be a step — run, climb the wall, keep running on the higher ground.
- `elevate(segs)` (pure, exported) gives each section `elev0/elev`: a climb raises the ground one level (max 2, `STEP_H=56px`), the race continues up there; the next water section (dive + splash) or the final section brings it back to 0.
- Elevated sections render raised with a `.g-cliff` rock face beneath; `.g-step` rock strips mark every level change.
- On the first 30% of a climb section the racer is pinned to the rock face (Power-driven speed, `on-wall`); afterwards it runs on top at Run speed. Drops are a short hop down.
- Test: V97 planFor test now also checks `elevate`.

## V97 — climbing walls and different levels (31 October 2026)

- **Climb sections are a standing rock wall** (like Chao Race walls): racers run up to it, climb straight up ~170 px (Power decides the speed, a little Stamina), then jump down the far side. Wall drawn with the climb art, a grassy top and side shading.
- **Each level is its own course** (`planFor(course, level)`): Rookie 6 sections → Junior 8 → Pro 10 → Expert 12 → Champion 14, more section types and longer sections at higher levels (total length more than doubles). Time of day changes per level (morning, noon, afternoon, sunset, night with stars). The event sheet shows the next level's section count and layout strip.

## V96 — simple Stadium hub, Classic-discoveries growth bonus (31 October 2026)

- **Alchemy bonus**: companions grow faster with the player's Classic progress — +10% per 400 elements found in Classic, up to ×2 at 4,000 (`alchemyGrowth()`, multiplied into `growthFor`; future gains only, like houses). Shown on the Stadium entrant card and in the companion stats card.
- **Stadium hub simplified**: entrant card (sprite, name, Lv, mood, belt, growth line; tap → stats card), then one list: each race / the Karate Dojo as a row with five medal dots and a single button that starts the next level (or "Replay"); tapping a row opens a sheet with the description, terrain strip, prize and all levels; a Prizes row opens the toys/belts sheet. No tabs, no grades grid, no per-course level grids.

## V95 — Stadium scenery, sound, feedback; Alchemy tab (31 October 2026)

- **Scenery** (`client/assets/v95-stadium/`, `tools/v95-assemble-stadium-art.py` → `stadium-art-v95.js`): seamless terrain tiles (meadow, pond with lily pads, ravine with broken bridge, rock wall with holds), sky with sun/hills/trees, hedge-and-fence mid layer (also used as a faster foreground), start and finish gates with bunting/crowd/trophy; karate dojo (shoji, pillars, lanterns, blossoms, spectators, taiko) and tatami ring with rope. Three-layer parallax.
- **Sound** (`stadium-sfx-v95.js`, Web Audio synth, honours the Settings sound toggle): countdown ticks/GO, cheer, tired, splash, flap, section chime, pass/passed, rest, finish fanfare, lose, medal, prize, gong, FIGHT, hit, big hit, block, miss, charge, K.O., breath.
- **Feedback**: damage numbers, POW!/WHAM! bursts and hit-stop on big hits, KO zoom, confetti on a KO win, WINNER!/place banners at the finish, bigger actors (64 px) with glow ring under the player's companion, big splash when entering water.
- Bottom tab "Play" is now labelled **Alchemy** (view id unchanged).

## V94 — Stadium redesign, prizes and belts (31 October 2026)

- Games tab rebuilt as the **Stadium** (Chao Stadium model): entrant card (big sprite, name, total Lv, six stat grades E–S with levels, belt), Change picker with levels, then Races / Karate / Prizes tabs. `client/src/games-v93.js` (V94 content), `client/src/prizes-v94.js`.
- **Races**: countdown 3-2-1-GO, parallax sky/hills, richer sections (waves, bridge posts, climbing holds), name tags with live place, dust/splash/wind/pebble FX, speed lines on cheer, section banners (RUN/SWIM/FLY/CLIMB), overtaking pops, sweat when exhausted, confetti on a win, podium + medal drop in results. Terrain strip and prize preview on each course card.
- **Karate**: best of three rounds, ROUND/FIGHT!/K.O. banners, portraits + HP + zeal bars, lunge, hit sparks, screen shake on big hits, dodge afterimage (Fly), block ring (Swim as defence), breath when out of zeal, KO fall with stars.
- **Prizes (Chao Garden model)**: Champion gold on a course gives a **toy for the house** (Pond Fountain, Cliff Kite, Meadow Flag, Boulder Stone, Trail Lantern, Grand Cup — placeable furniture with their own room sprites); winning a karate level ties a **belt** (white → black) the winner wears everywhere (drawn on the body of the rigged sprite: screen, Home, houses, Stadium). Prizes tab lists toys and belts.
- Cheer button with pop/dim/“no” feedback; cheering spends Stamina.

## V93 — Games tab: Chao-style races and sparring (31 October 2026)

- 4th tab **Games** (hidden until the player has a house and a companion; `!` badge first time). `client/src/games-v93.js`, state `alchemy10k_games_v1`.
- **Races** (Chao Race dynamics): sections use Run (ground), Swim (water), Fly (gaps), Power (rock walls); Stamina drains and a tired racer rests. Courses: Pebble Pond (Swim), Breezy Cliffs (Fly), Meadow Dash (Run), Boulder Wall (Power), Long Trail (Stamina, longer), Grand Circuit (all; opens after winning Rookie on the other five). Levels Rookie → Champion, each opened by winning the previous; rivals' stats scale per level.
- **Sparring Ring** (Chao Karate-like): HP = health, Power = damage, Run = dodge, Stamina = punches; Rookie → Champion.
- The companion plays on its own; tapping cheers (race sprint / power strike) and spends Stamina — over-cheering tires it out. Medals gold/silver/bronze; every race/bout trains the stats it used (growth multipliers apply).
- Companion tiles in Home now show "Lv N".

## V92 — simpler Home tab, growth multipliers (31 October 2026)

- **Houses give growth multipliers, never stats**: residents grow ×1.1 (Tent) … ×2 (Castle) faster from meals, gifts, discoveries and training; each training/food/fun/book piece adds +15% for its kind (max +60%). `growthMultiplier`, `homes.growthFor`; applied in the companion engine to future gains only — moving a companion never removes anything.
- Tap a house chip → info sheet (summary, tier, room, ×growth, furniture bonuses, Go to this house). Undiscovered houses show tier/room/growth without the recipe.
- Tap a resident → its stats (mood, belly, six stat rows) + Move out. Tap any companion in the roster → stats card (choose, rename).
- Home tab simplified: house card, compact "On screen" row (Stats / Send home), companions as a 5-per-family avatar grid (green dot = on screen, ochre = lives in a house), help collapsed.
- Room sprite fixes: punching bag side matches its A-frame, clearer radio, TVs, picket gate and drum kit side views.

## V91 — house tiers, drag & drop, idle discoveries (31 October 2026)

- **House tiers**: upgrade chain Tent (House + Thread) → Hut (Tent + Wood) → Cabin → Cottage → Villa → Castle; measured generations 6 → 7 → 8 → 11 → 12 → 13. `recipe-polish-v91.js` (House + Wood now gives Floorboards). Chips show tier dots.
- **Drag & drop**: press and hold a piece (~0.3 s) or tap Move, then drag over the grid; green = fits, red = blocked, invalid drop snaps back.
- **Idle discoveries** (`alchemy10k_idle_v1`): after ≥30 min away, residents find elements that are craftable right now (rate grows with residents, their levels and discovery furniture; max 8 h, cap 2 + residents + discovery/2, ≤15). 1 kept free (2 when 5+), the rest with one rewarded ad (`idle_finds`); all with Remove ads. Residents also train on their house's furniture while away (daily cap).

## V90 — Home screen: companion houses (31 October 2026)

- The third tab is now **Home**: house selector (6 houses), a cosy 3/4 room per house (floor grid by capacity: 4×3 … 8×8, themed walls/floors), residents (up to capacity) and the companion roster below.
- **Room sprites** for all 143 furniture pieces (`client/assets/v90-room/`, `tools/v90-assemble-room.py` → `room-sprites-v90.js`): footprint-sized, front/back/side so pieces rotate in 4 directions; layers floor (rugs, mats, pools — furniture may stand on them), object (depth-sorted) and wall (frames, clocks, curtains on the back wall).
- Tap floor/wall → pick discovered furniture; tap a piece → Rotate / Move / Put away (rugs also "Put furniture on it"). One instance per element across houses.
- Residents walk to pieces and **use** them (run in place, swim half-submerged with ripples, bounce on the trampoline, sleep lying down, eat, punch, climb). Effects are real via `companions.homeEffect`: training +2 bar points per use (max 200/day per companion), food +8 belly, mood pieces +2 mood.
- State: `alchemy10k_homes_v1` (backup + reset). Next phase: idle discoveries while away.

## V89 — +200 Home & Living batch (31 October 2026)

- **+200 elements** (6,412 → 6,612), `tools/v89-blueprint.json` → `tools/v89-assemble.py` → `organic-pack-v89.js`, `organic-art-v89.js`, `shared/v89-approved.json`, 200 SVGs in `client/assets/v89/`.
- **New family Home & Living** (`home`, category `home`): starters House, Wood, Tool, Thread; existing members (Workbench, Yarn, Loom, Wooden Plank…) in `tools/v89-home-family.json` → `family-data-v89.js`, merged with V85 data by `mergeFamilyData`. 172 members, 100% craftable in-family.
- **Companion houses**: Tent 1, Hut 2, Cabin 3, Cottage 4, Villa 6, Castle 8 (deeper recipes for bigger ones). **Furniture** with effects (run/swim/power/fly/stamina/hp training, mood, food, discovery, decor) and tile sizes in `home-objects-v89.js` (also 34 existing elements such as Television, Piano, Telescope). Discovery sheet shows a "Companion house!" / "Furniture" note. The Home screen (map, placement) is the next phase.
- 45 missing classics from the V87 review: Diamond, Bat, Lion, Bear, Camel, Cow, Cat, Dog, Wolf, Snowman, Beach, Jungle, Earthquake, Light Bulb, Candle, Mermaid, Unicorn, Fairy, Yeti…

## V88 — Collection cleanup, family art, launcher (31 October 2026)

- Themed collections removed from the Collection tab (obsolete; data kept for old saves).
- Seven family icons redrawn in the 2026 art direction (`client/src/family-art-v88.js`); Countries keeps the Globe art.
- Launcher icon: alchemy flask holding a little garden with an original sprout-eared companion creature, a hatched egg and a care heart, on an ochre background (adaptive `#E3A15F`) — Alchemy + garden + virtual pet in one image.
- Idea under discussion with the owner: Companion Houses (house elements of several sizes, furniture elements as multipliers, idle discoveries while offline). Not implemented.

## V87 — recipe polish, companion ads/badge, Chao Garden pass, new launcher (31 October 2026)

- **Recipe polish** (`client/src/recipe-polish-v87.js`, list in `docs/RECIPE_POLISH_V87.md`): new logical recipes on free pairs (Ink + Paper = Book, God + Sea = Poseidon, Bird + Fire = Phoenix…) and forced recipes remapped (Book + Ink → Writing, Water + Campfire → Steam…). Zero new elements. Applied in `buildCompleteFamilyCampaigns(..., polish)` after the V85 recipes; validated: Classic 6,412/6,412 and every family unchanged at 100%. Owner exception to the "results immutable" rule recorded in `docs/WORKING_RULES_PT.md`. Ideas that need new elements (Letter, Beach, Wool, Farmer, Pharaoh…) are kept for the next +200 batch.
- **Companions**: first choice free, later switches = rewarded ad (`companion_switch`) + 5 free minutes; NEW COMPANION discovery sheet + Companions tab `!` badge; stroking/petting, emotion orb, belly/hunger, renaming. Details in `docs/COMPANIONS_V86.md` (V87).
- **Launcher icon** redrawn in the game palette (paper background, slate flask, ochre brew); adaptive background `#F3E6D3`.

## V86 — merged families, public-name review, Classic banner, Companions (31 October 2026)
- **Families merged (owner request)**: Video Games + Consoles & Hardware + Arcade & Tabletop → `games` "Games & Consoles"; Anime & Manga + Music + Cinema & TV → `anime` "Anime, Music & Cinema". 8 families remain. `MERGED_FAMILY_IDS`/`canonicalFamilyId` in `discoveries.js`; old Family Only saves are folded into the absorbing family at load (app.js). Merged campaigns stay complete via 16 bridge recipes (`tools/v85-family-proposals/*-v86-bridge.json`); `tools/v85-assemble-families.mjs` applies the merge.
- **Public names**: 1,400 explicit reviewed labels in `tools/public-labels-v86.json` → `client/src/public-labels-v86.js`, applied by `buildPublicNameIndex(items, overrides)` ahead of the regex rules. Real titles, franchises, characters, consoles, brands, bands/musicians and franchise-only moves/items now show invented names; generic words and public-domain composers stay. Still only a display layer: IDs, recipes, saves and art keys unchanged. Not a legal clearance; element summaries/wit text still go through the old `publicText` regexes only.
- **Mode banner** now also shows in Classic (ochre) with progress and the ⇄ Merge button.
- **Companions**: see `docs/COMPANIONS_V86.md`. New third tab. 40 rigged sprites.
