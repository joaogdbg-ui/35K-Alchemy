# Alchemy 10k — +188 para arredondar a 6.000

**Estado confirmado:** V81 publicada em `main` com **5.812 elementos**, **14.149 receitas**. Âncora da publicação: `2aba8395f48082964bc2af2ff20a468c56dd464b`. APK dessa versão já publicado; **não há APK de 6.000 ainda**.

**Única entrega excecional autorizada:** **188 novos IDs**, receitas inéditas e 188 SVGs originais, distribuídos em **160 restantes do ciclo V81 +28 primeiros de V82** no mesmo PR. Resultado esperado: **6.000 elementos e pelo menos 14.337 receitas**. Não criar merges ou APK de 160+28 separadamente.

**Depois dos 6.000:** cada entrega sem exceções será de **200**, com os mesmos requisitos de qualidade, até **10.000 exatos após 20 entregas**. Uma proposta de 250 por lote não foi adotada: a cadência oficial continua 200.

**Branch WIP:** `wip/round-to-6000-188`. Este primeiro commit só ajusta regras e gate, **adiciona zero elementos**. Só abrir PR depois de existirem os 188 novos elementos reais, integrados, validados, com galeria SVG e teste de qualidade editorial. A PR corre Actions uma vez por candidato, e após CI verde apenas uma compilação Android. Evitar workflows automáticos em WIP.

**Invariantes:** global A+B=B+A=C; ID e pares antigos imutáveis; cada Family Only 100% concluível a partir de quatro starters; um ID e uma imagem por elemento multifamília; Classic isolado salvo Merge com duas recompensas reais. Não colocar V81/V82 novos em campanhas familiares sem validar o grafo independente. Continua pendente a correção temática dos starters de Nature & Science.

**Verificação:** `tools/check-content-batch-200.mjs` usa o estado de **packs na baseline** desde `2aba8395f48082964bc2af2ff20a468c56dd464b` para permitir +188 só antes da primeira atualização de conteúdo. Assim, commits de manutenção não consomem a exceção. Após +188, bloqueia qualquer quantidade diferente de +200. Os testes unitários verificam a regra e a aritmética.

**Risco/limite declarado:** ainda não existem os 188 ícones nem receitas novos; este documento não indica que o catálogo 6.000 está pronto ou foi publicado.

## Rebranding e equilíbrio de famílias

A partir de 29/10/2026 o jogo chama-se **Alchemy 10k** e a meta final é **10.000 elementos únicos**. Após os 188 novos até 6.000, haverá **20 lotes de 200**. Nove famílias têm metas primárias que somam exatamente 10.000 (`docs/FAMILY_BALANCE_10K_PT.md`, `shared/family-targets-10k.json`). Atualmente só Nature & Science e People & Culture possuem campanhas jogáveis completas. As outras sete exigem um grafo próprio 100% acessível dos quatro starters.

A marca foi alterada em HTML, Android e ícones sem modificar o appId Android nem os formatos de save. O APK corrente permanece anterior até termos um novo build aprovado. Não correr GitHub Actions a cada commit WIP.
