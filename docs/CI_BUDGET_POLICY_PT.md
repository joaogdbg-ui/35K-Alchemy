# 35K Alchemy — política de poupança de minutos do GitHub Actions

## Regra de produção: só testar no GitHub quando o lote completo estiver pronto

**Fluxo obrigatório de uma entrega de +200 elementos:**

1. Trabalhar em `wip/...`, guardar o trabalho editorial, SVGs e manifests progressivamente **sem workflows automáticos por push**. Os subgrupos de 25/50 são etapas de edição, **não** entregas.
2. Pré-validar deduplicação, receitas e SVGs com verificações leves locais ou em memória; rever visualmente a 35px. Fazer o máximo de correções antes do primeiro CI cobrado.
3. Aos **+200 completos**, abrir **uma única Pull Request** para `main`. O workflow pre-merge executa o gate de +200 e a suite completa. Evitar mais pushes à PR enquanto a revisão corre; cada atualização pode disparar outro workflow.
4. **Depois de CI verde**, fazer merge uma vez. O workflow Android na `main` executa a compilação e publica **um APK por entrega**.
5. Não iniciar `workflow_dispatch`, `re-run`, CI adicional, ou build Android para cada checkpoint WIP. Apenas exceções fundamentadas (falha crítica, segurança, preparação para publicar), com explicação.

**Observação:** um commit/push por si não tem cobrança de minutos de Actions. São os jobs executados pelos workflows que consomem minutos e podem atingir o limite da conta.

## Workflows do projeto

| Workflow | Quando usar |
|---|---|
| `.github/workflows/ip-audit-pr.yml` | PR de conteúdo completo (+200), antes do merge |
| `.github/workflows/android-debug.yml` | Na `main` após integrar +200, ou explicitamente para uma correção urgente |
| `.github/workflows/wip-200-qa.yml` | **REMOVIDO da branch WIP em 29/10/2026**; não recriar um gatilho `on: push` WIP |

O CI é uma última verificação obrigatória, **não o motor de desenvolvimento da receita ou do ícone**. O objetivo operacional é no máximo **uma execução da auditoria PR e uma compilação Android por entrega de +200** em condições normais. Se existirem falhas reais, a segurança/qualidade prevalece e podem ser necessárias novas execuções justificadas.

**Não contornar a verificação de qualidade para poupar minutos**. Resolver os erros previamente, e nunca lançar um APK sem CI validada.
