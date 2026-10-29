# Regras permanentes do 35K Alchemy

## Conteúdo e motor

1. Receita determinística e global: `A+B=C`, `B+A=C` e **nunca** `A+B=D` noutro modo.
2. Não alterar IDs ou resultados anteriores, nem introduzir nomes normalizados e pares duplicados.
3. Classic começa com Water, Fire, Earth e Air, deve alcançar todo o catálogo.
4. Campanhas Families Only começam com quatro elementos temáticos diferentes; têm de ser alcançáveis autonomamente, com receitas compatíveis com Classic.
5. Um ID multifamília é partilhado: descobri-lo numa campanha desbloqueia-o nas demais. Classic mantém progresso distinto.
6. Merge Elements into Classic transfere em lote descobertas obtidas nas famílias e ainda em falta no Classic; exclui elementos iniciais gratuitos, não duplica IDs, cobra **duas recompensas de anúncios distintas**. Salvar 1/2 até concluir 2/2; não mudar de modo.
7. Anúncios recompensados: primeira escolha de modo gratuita; mudanças posteriores, hints, Batch Combine e Merge só com recompensa SDK confirmada. HTML offline nunca simula anúncio ou concede desbloqueio sem recompensa.
8. Novos elementos têm prioridade sobre receitas alternativas para elementos existentes. Receitas precisam de coerência intuitiva.
9. **OBRIGATÓRIO: cada entrega futura de expansão acrescenta exatamente 200 elementos NOVOS e validados face ao último commit publicado.** Se houver 1–199 prontos, manter numa branch WIP e continuar; não publicar um micro-lote. Qualidade não se negocia: substituir elementos rejeitados em vez de encher a quota. Ler `docs/CONTENT_200_BATCH_POLICY_PT.md`.
10. Cada elemento novo precisa de SVG específico e legível a 35 px. Evitar motivos genéricos repetidos; revisão humana + verificador de semelhança.
11. UI em inglês: modo claro/escuro/sistema, contador junto ao logótipo, som em Settings, botão de modo à direita, Hint e Batch na mesma linha, Already discovered em linha própria sem toast duplicado, pesquisa compacta e Sort A–Z / Old first / New first.
12. Proteção de marcas e copyright: ilustrações originais, revisão de referências a terceiros antes da Google Play.

## Produção escalável de 200 — regra de entrega

- A partir de V80B, **um lote publicado = +200 IDs novos**, com receitas próprias, nomes normalizados únicos, SVGs individuais semanticamente distintos e 35px legíveis. Ondas internas 25/50 não são entregas e não podem ser integradas em `main` como conteúdo parcial.
- V80B é a base histórica de **5.612** elementos; a próxima entrega inclui **160 elementos restantes em V80 + 40 iniciais em V81, num mesmo merge**, total **5.812**. Após 147 entregas de +200 a partir desta base chega-se a **35.012** elementos (35K é mínimo, não contagem exata).
- Não admitir atalhos de geração de nomes arbitrários, receitas sem lógica, cópias de SVG ou motivos repetidos. O artefacto de produção só conta após validações e revisão visual.
- O CI e build Android executam `tools/check-content-batch-200.mjs` e **bloqueiam conteúdo parcial**; zero novos elementos para correções técnicas é permitido. Para continuidade entre conversas, manter sempre branch WIP e estado do handoff.
- Produzir por blueprint de 200, 8 frentes de 25 e 4 ondas internas de 50; rever e corrigir sem cortar a quota. O processo completo está em `docs/CONTENT_200_BATCH_POLICY_PT.md`.

## Processo obrigatório

- Ler handoff e normas antes de editar; incrementar versão, documentação e testes.
- Executar `node --test client/test/*.test.mjs`, validador do catálogo, auditor de arte e `python tools/build-standalone.py`.
- Verificar 320/360/390/1280 px, Sort, combinação normal e inexistente, temas, Family Only e Merge.
- Nunca juntar uma mudança de sistema Android à expansão editorial sem testes de regressão separados.
- Guardar chaves e credenciais fora do Git. Publicação Android só após teste físico, consentimento, revisão IP e assinatura.
