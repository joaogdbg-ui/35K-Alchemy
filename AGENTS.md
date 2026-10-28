# 35K Alchemy — instruções de desenvolvimento

Antes de alterar o projeto, ler `docs/WORKING_RULES_PT.md` e `docs/ANDROID_BUILD.md`, e o handoff da versão mais recente.

- A+B = B+A = C em **todos** os modos. Não alterar resultados antigos.
- IDs, nomes normalizados e pares de receitas são únicos. Validar alcance a partir dos ingredientes iniciais.
- Classic e Families Only têm progresso separado; cada família possui 4 ingredientes iniciais temáticos próprios.
- Elementos multifamília têm um único ID e desbloqueiam-se nas famílias correspondentes.
- Merge para Classic exige 2 anúncios recompensados, preserva crédito 1/2; não criar recompensas fictícias.
- A prioridade é criar novos elementos com receitas intuitivas. 200/versão é objetivo, não quota.
- Cada ícone deve ser específico do objeto e reconhecível a ~35 px; hashes diferentes não bastam.
- Não copiar marcas/logótipos/personagens; auditar nomes e direitos de propriedade intelectual.
- Testar Sort (A–Z, Old first, New first), tap pulse, Dark Mode, áudio em Settings, combiner, Family e Merge.
- Validar Node, catálogo, SVG e UI antes de commits. Nunca afirmar que APK/SSV/AdMob real estão concluídos sem teste.
