# Alchemy 10k — audit de famílias e orçamento editorial exato

**Decisão de produto (29/10/2026):** o objetivo final mudou de 35.000 para **10.000 elementos únicos**, sem remover os 5.812 atuais. O jogo passa a chamar-se **Alchemy 10k**. Já existem nove famílias na coleção; **apenas Nature & Science e People & Culture são campanhas Families Only jogáveis**, as outras sete ainda não são progressões independentes.

## Distribuição por família (editorial, elemento primário único)

| Família | Base atual* | Meta a 10k | Adicionar |
|---|---:|---:|---:|
| Video Games | 1,309 | 2,500 | 1191 |
| Consoles & Hardware | 959 | 1,600 | 641 |
| Arcade & Tabletop | 462 | 1,250 | 788 |
| Anime & Manga | 584 | 850 | 266 |
| Cinema & TV | 19 | 250 | 231 |
| Music | 111 | 300 | 189 |
| Nature & Science | 943 | 1,250 | 307 |
| Fantasy & Objects | 638 | 1,000 | 362 |
| People & Culture | 787 | 1,000 | 213 |
| **Total de IDs únicos** | **5,812** | **10,000** | **4,188** |

\*Base contada por categoria editorial nos packs publicados V81, **antes de atribuições secundárias**. A interface contém alguns desvios históricos por nome (Moon/Planet/Space/Star/Bread) e partilhas multifamília. Estes orçamentos **não** são totais de memberships na interface: um ID que pertença a duas famílias continua a contar **uma vez** para o objetivo global. A origem dos números está em `shared/family-targets-10k.json`.

**Gaming prioritário:** Video Games + Consoles & Hardware + Arcade & Tabletop = **5.350 / 10.000 (53,5%)**. Anime e outros temas ganham ligações relevantes sem duplicar os mesmos elementos. Os objetivos são limites editoriais a desenvolver com receitas lógicas e SVGs únicos; **não são elementos já existentes**.

## Prioridade criativa por família

- **Video Games (2500):** Game titles, gamecraft, genres; distinct subgenres, eras and original parody names.   
- **Consoles & Hardware (1600):** Hardware generations, controllers, parts, computers, repair and software.   
- **Arcade & Tabletop (1250):** Arcade, pinball, board games, tabletop tools, competitive play.   
- **Anime & Manga (850):** Animation, comics, original character archetypes and powers.   
- **Cinema & TV (250):** Cinema, filmmaking and TV genres; carefully selected rather than mass franchise clones.   
- **Music (300):** Instruments, rhythm, audio production, music formats and styles.   
- **Nature & Science (1250):** Ecosystems, weather, chemistry, astronomy, ecology and scientific instruments.   
- **Fantasy & Objects (1000):** Mythology, fantasy worlds, artifacts and inventions with meaningful game links.   
- **People & Culture (1000):** History, places, professions, food, arts and society.   

## Problemas descobertos na auditoria

1. **Cinema & TV: apenas 19 elementos atuais.** Aumentar de forma seletiva até 250, priorizando objetos, técnicas, géneros e pontes a jogos, não catálogos de centenas de títulos copiados.
2. **Music: apenas 111 elementos atuais.** Chegar a 300 por instrumentos, história, estilos e tecnologia musical; não criar só variações de álbuns.
3. **Categoria `food` (22 elementos):** não estava classificada em nenhuma família, por isso caía indevidamente em Fantasy & Objects. Corrigida para **People & Culture** sem alterar IDs, nomes ou receitas.
4. **Character:** é uma categoria grande ligada sobretudo a Anime & Manga; auditar continuamente se referências a jogos e ficção devem também ter pertença secundária. Nunca duplicar o ID para o colocar noutra família.
5. **Campanhas jogáveis: somente duas de nove.** As sete restantes aparecem bloqueadas e não devem ser marcadas como disponíveis antes de terem quatro starters válidos e fecho isolado do grafo a 100%.
6. **Nature & Science:** apesar de atingir 476/476 de forma isolada, os quatro starters ainda são Water/Fire/Earth/Air, exatamente os de Classic. Requer reforma cuidada do grafo, não apenas troca de nomes.
7. **Multifamília:** já existem 31 IDs partilhados entre as duas campanhas atuais. A partilha pode ajudar a progressão, mas **não pode ser necessária** para concluir nenhuma campanha.

## Estratégia de progressão das nove campanhas

Cada campanha terá **quatro starters temáticos próprios**, pertencentes ao catálogo global e à família correspondente, que permitam desbloquear **100%** dos seus `items` a partir de receitas A+B=C globais. As quatro palavras sugeridas em `family-targets-10k.json` são apenas ideias editoriais **não desbloqueadas nem aprovadas como starters de jogo**; só ativar famílias após verificar os IDs reais e a progressão sem Classic, sem outras famílias, sem publicidade ou Merge.

Multifamília: o mesmo ID/nome/SVG/receitas pode pertencer a várias famílias e uma descoberta comunica-se às campanhas elegíveis. Não somar duplicados na meta 10.000 e não importar progresso para Classic exceto pelo Merge de duas recompensas reais.

## Cadência até aos 10k

- Publicado: **5.812 elementos, 14.149 receitas**.
- Próxima entrega: **+188** (160 V81 +28 V82), chegando a **6.000**.
- Depois: **20 entregas de +200**, totalizando **10.000 exatos**. Recusar lançamentos +250 e qualquer contagem acima de 10.000 até nova decisão explícita.
- Trabalhar em WIP sem GitHub Actions por push. Uma PR completa por entrega e uma compilação Android após CI verde.
- Nunca sacrificar progressão, originalidade dos SVGs ou intuitividade das receitas para cumprir o orçamento. Se uma categoria estiver saturada, rever a distribuição formalmente antes de criar elementos de enchimento.

O APK atual ainda utiliza a marca 35K e o catálogo 5.812. O rebrand e as regras novas só ficam publicados após um merge e uma compilação Android confirmados.
