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
9. Meta de ~200 elementos por expansão subordinada à qualidade editorial e artística.
10. Cada elemento novo precisa de SVG específico e legível a 35 px. Evitar motivos genéricos repetidos; revisão humana + verificador de semelhança.
11. UI em inglês: modo claro/escuro/sistema, contador junto ao logótipo, som em Settings, botão de modo à direita, Hint e Batch na mesma linha, Already discovered em linha própria sem toast duplicado, pesquisa compacta e Sort A–Z / Old first / New first.
12. Proteção de marcas e copyright: ilustrações originais, revisão de referências a terceiros antes da Google Play.

## Processo obrigatório

- Ler handoff e normas antes de editar; incrementar versão, documentação e testes.
- Executar `node --test client/test/*.test.mjs`, validador do catálogo, auditor de arte e `python tools/build-standalone.py`.
- Verificar 320/360/390/1280 px, Sort, combinação normal e inexistente, temas, Family Only e Merge.
- Nunca juntar uma mudança de sistema Android à expansão editorial sem testes de regressão separados.
- Guardar chaves e credenciais fora do Git. Publicação Android só após teste físico, consentimento, revisão IP e assinatura.
