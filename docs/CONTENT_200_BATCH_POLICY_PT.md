# Alchemy 10k — cadência de 200 e teto definitivo de 10.000 elementos

## 1. Números oficiais

O objetivo definitivo é **10.000 IDs de elementos únicos**. A marca 35K é histórica. Nenhuma duplicação de IDs por família, receita alternativa ou variante visual aumenta o total.

| Entrega | Elementos | Receitas mínimas | Variação |
|---|---:|---:|---:|
| V81 já publicada | 5.812 | 14.149 | baseline |
| Próxima, exceção ÚNICA | **6.000** | **14.337** | **+188** (160 V81 +28 V82) |
| Mais **20 entregas obrigatórias +200** | **10.000** | **18.337** | **+4.000** |

Restam **4.188 elementos reais**, não 29.000. Acima de 10.000, novas expansões são recusadas até nova autorização explícita. 250 não é cadência adotada.

## 2. Gate de quantidade e proteção do passado

O gate automático `tools/check-content-batch-200.mjs` permite **exatamente +188 uma vez**, se o commit de base descender da V81 publicada `2aba8395f48082964bc2af2ff20a468c56dd464b` sem novos packs desde a âncora. Depois volta permanentemente a **+200** (6.200, 6.400, ..., 10.000). Mudanças técnicas com zero IDs são permitidas; não consomem uma expansão. O gate também conta os módulos atuais e **impede ultrapassar 10k**.

Nunca alterar IDs, receitas globais antigas, saves ou resultados A+B=C. Nunca publicar checkpoints 25/50, nem atalhar com SVGs reciclados, nomes duplicados ou combinações arbitrárias.

## 3. Famílias com propósitos específicos

Plano completo e auditado em `shared/family-targets-10k.json` e `docs/FAMILY_BALANCE_10K_PT.md`. **5.350 (53,5%)** dos 10k são de Video Games, Consoles & Hardware, e Arcade & Tabletop. O restante distribui-se por Anime & Manga, Cinema & TV, Music, Nature & Science, Fantasy & Objects e People & Culture. As metas por família são **orçamentos editoriais primários**, sem contar elementos multifamília mais do que uma vez.

Há nove coleções, mas só duas campanhas Families Only atualmente completas. As sete restantes mantêm-se bloqueadas até possuírem quatro starters temáticos reais e percursos de receitas com alcance **a 100% a partir apenas desses starters**. Um mesmo ID multifamília mantém nome, arte e receitas globalmente; a partilha entre famílias é um bónus, nunca um requisito para completar a campanha. Classic tem progresso independente; Merge exige duas recompensas reais.

## 4. Conteúdo de qualidade

Cada elemento exige: ID e nome normalizado exclusivos, resumo original em inglês, uma combinação A+B intuitiva e sem ordem com ingredientes alcançáveis, e um SVG de sujeito original, reconhecível a ~35px. A arte não deve ser um rearranjo genérico com hash diferente. A revisão considera variedade de temas, silhuetas, materiais, perspetiva e progressão. Não copiar marcas, personagens ou logótipos protegidos. Uma receita alternativa não é um elemento adicional.

As expansões devem privilegiar gaming mas também corrigir a fraqueza de Cinema & TV (19 elementos atuais) e Music (111). A categoria `food` pertence a People & Culture, não a Fantasy. A revisão editorial precede as validações automáticas.

## 5. Minutos GitHub Actions

Criar e revisar lotes internamente em branch WIP **sem workflow on:push**. Só após concluir todos os +188/+200 abrir uma PR, executar uma vez o QA completo, integrar se verde e publicar um único APK Android. Se o CI falhar, investigar e corrigir antes de repetir. Não fazer build para simples renomeação, quando esta pode ser integrada na próxima expansão completa.

O nome público será **Alchemy 10k**, mantendo `com.joaogdbg.alchemy35k` e as chaves históricas de storage para preservar instalações e save games. Nunca prometer Google Cloud, ads reais ou assinatura comercial sem prova.

## 6. Fecho de projeto

Após a entrega de 10.000, parar a produção de novos IDs. Continuar apenas correções, QA, desempenho, ferramentas sociais, traduções e receitas alternativas legítimas sem aumentar o total, salvo nova decisão explícita.
