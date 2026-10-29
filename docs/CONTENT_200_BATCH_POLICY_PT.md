# 35K Alchemy — política permanente de lotes de 200 (uma exceção de +188 até 6.000)

**Regra vigente desde 29/10/2026.** Única exceção aprovada: a expansão **imediatamente posterior à V81** acrescenta exatamente **188 elementos** para arredondar de **5.812 para 6.000**. A partir desse momento, **todos os lançamentos de conteúdo são obrigatoriamente +200**, sem novas exceções, até 35.000. Esta norma substitui números históricos em documentos anteriores, nunca altera os dados já publicados.

## 1. Contagem verificável e como terminamos exatamente em 35K

| Marco | Elementos | Acréscimo |
|---|---:|---:|
| V81 publicada, commit `2aba8395f48082964bc2af2ff20a468c56dd464b` | 5.812 | base efetiva |
| **Próxima publicação excepcional** | **6.000** | **+188** |
| Primeira publicação após arredondamento | 6.200 | +200 |
| Última publicação, após **145 lotes de 200** desde 6.000 | **35.000** | +29.000 |

A V81 possui 40 elementos no seu ciclo editorial de 200. A próxima **única** entrega compreende **160 elementos V81 para concluir esse ciclo +28 novos V82**, somando +188 face ao catálogo publicado. Isto não autoriza duas publicações separadas. V82 ficará com 28/200; a entrega seguinte de +200 poderá ter 172 V82 +28 V83, sempre no mesmo PR.

Receitas previstas: **14.149 + 188 = pelo menos 14.337**. Só contar receitas realmente novas com pares globais inéditos. Publicar a contagem calculada, nunca aproximada.

## 2. Gate de segurança: exceção impossível de repetir

- O verificador mantém o nome `tools/check-content-batch-200.mjs` por compatibilidade, mas calcula o tamanho exigido a partir da história real do Git.
- Quando o **commit de base** (PR base, ou `github.event.before` da compilação Android) descende do commit V81 identificado acima **e ainda não contém alterações em ficheiros de packs de elementos desde essa V81**, o próximo lote válido é **exatamente +188**. Zero novos IDs permanece permitido para manutenção técnica sem contar como entrega.
- Quando o primeiro lote +188 estiver em `main`, o commit de base das entregas posteriores já terá alteração de packs desde a âncora V81: o gate regressa automaticamente a **exatamente +200**, e assim permanece. Mudanças de documentação ou bugs sem novos elementos não consomem a exceção.
- Bloquear 1–187, 189–199, 201+ na exceção, e bloquear 1–199 ou 201+ depois. O gate recusa remoção/reescrita de IDs históricos, receitas anteriores modificadas, SVGs ausentes ou reutilizados, nomes conflitantes e manifests incoerentes.
- **Jamais usar a exceção para publicar +188 outra vez.** Alterar este plano ou o validador só com aprovação explícita do utilizador, jamais por necessidade de ritmo de produção.

## 3. Qualidade editorial — nenhuma concessão

Cada novo elemento tem: **ID inédito, nome inglês único e claro, descrição própria, uma receita global determinística A+B=B+A=C semanticamente defensável, ingredientes já existentes/alcançáveis e um SVG original que represente especificamente o seu objeto a ~35 px**.

Não preencher quota com renomeações, nomes numerados, variações de cores, SVGs de motivos genéricos ou ligações sem lógica. A prioridade continua a ser gaming, consolas e arcade, com board games, tecnologia, ciência, natureza, cultura e fantasia para equilibrar as progressões. Uma receita alternativa de resultado antigo **não conta como novo elemento**.

Primeiro escrever/validar os pares e a progressão, depois criar ilustrações individuais por sujeito; apresentar galerias comparáveis a 35 px / 90 px. A mera diferença de hash não valida distinção visual. Fazer revisão editorial e de IP; testes automáticos não substituem revisão visual real.

## 4. Families Only, multifamília e integridade do jogo

Cada campanha Family Only tem **exatamente quatro starters temáticos**, deve ser **100% completável a partir deles sem Classic, anúncios, outras famílias ou Merge**, e utiliza a mesma função global A+B=C. Um elemento multifamília tem **um único ID, desenho, nome e resultado**, com partilha entre todas as famílias elegíveis e **sem** transferir automaticamente progresso para Classic. Os saves são separados; Merge mantém duas recompensas reais confirmadas, sem duplicações nem contabilizar starters gratuitos.

Novos elementos **não** devem ser colocados automaticamente numa família sem fechar e verificar o grafo de receitas partindo apenas dos respetivos quatro starters. A campanha Nature & Science é atualmente completável mas ainda apresenta a anomalia conhecida de usar os quatro starters Classic; corrigir com prova de completabilidade, sem simplesmente trocar os IDs.

Ler `docs/FAMILIES_ONLY_CONTRACT_PT.md` antes de alterar qualquer família.

## 5. Publicação económica — poupar GitHub Actions

1. Trabalhar na branch `wip/round-to-6000-188`, com ondas internas de 25/50, **sem workflows GitHub Actions automáticos por push**.
2. Concluir **os 188** novos elementos reais, respetivos SVGs, recipes, manifests e testes. Fazer verificações locais ou análise estática para eliminar conflitos antes de pedir CI.
3. Abrir **uma PR** para `main` com o lote completo. Executar a auditoria de 188 uma vez por candidato; em caso de falha justificada, corrigir e repetir apenas o necessário.
4. Só após CI verde fazer merge e permitir **uma compilação Android**. Verificar o APK e a sua data antes de partilhar como novo.
5. Depois de atingir 6.000, trabalhar sempre com lotes fechados de **200** e o mesmo processo (não 188, não 250 sem nova decisão explícita).

Não publicar checkpoints de 25/50/100/160/188 incompletos; a exceção só passa a ser uma entrega quando os **188 estiverem inteiramente prontos e aprovados**. Se interromper a conversa, documentar o progresso WIP real, sem afirmar publicação.

## 6. Critérios de aceitação e handoff

O relatório de uma entrega tem de apresentar SHA da base, contagem anterior, incremento exato de **188 (só esta vez) ou 200**, contagem final, número de pares globais, galeria visual, QA humano ainda pendente, URL CI, SHA merge e verificação do APK Android.

Preservar UI, Settings, modo Classic, temas, áudio, scroll, receita sem ordem, dados offline, nomes e resultados históricos, e evitar qualquer simulação de rewarded ads. Confirmar pelo menos 320/360/390px e 1280px e testar fisicamente antes de distribuição comercial.

## 7. 250 por entrega?

**Não é a cadência adotada.** Um lote de 250 seria tecnicamente possível se os **250** pares e desenhos individuais passassem os mesmos critérios, mas acrescenta **25% de trabalho editorial e visual por entrega**; não existe base suficiente para prometer a mesma qualidade com esse ritmo. A cadência aprovada e operacional permanece **200 desde os 6.000**, com 145 entregas exatas até 35.000.
