# 35K Alchemy — contrato funcional Families Only (obrigatório)

**Objetivo:** cada campanha é uma experiência própria, autónoma e possível de completar 100%, com partilha legítima de descobertas multifamília, sem contaminação do progresso Classic.

## 1. Quatro starters temáticos e autonomia real

Cada família `f` dispõe de **quatro IDs iniciais próprios, únicos entre si, tematicamente relacionados e gratuitos**. Os seus quatro primeiros ingredientes são distintos do conjunto `Water, Fire, Earth, Air` do Classic; não se permite copiar integralmente os quatro como arranque de uma família. Os starters pertencem ao catálogo global e a `f.items`, não podem ser apenas elementos visuais.

O jogador deve poder fazer 100% das descobertas da sua campanha utilizando **somente estes quatro starters e receitas do próprio grafo**. É proibido depender de: iniciar Classic, obter um ingrediente noutra família, ver rewarded ads, importar save, fazer Merge ou consultar um servidor. Pode usar anúncios de pistas **opcionais**, nunca como pré-requisito da progressão.

## 2. Definição verificável de campanha completável

Para cada família, ignorar temporariamente os saves e a sincronização:

```text
reachable = Set(f.starters)
repeat
  para cada receita global (A,B)->C compatível com f:
    se A e B estão em reachable e C pertence a f.items:
      adicionar C a reachable
until nenhum elemento novo
PASSA somente quando reachable == Set(f.items)
```

A combinação é sem ordem (`A+B=B+A`) e **o resultado é o mesmo em Classic e em todas as famílias**. Uma receita específica da família só é válida se for uma receita global já reconhecida; nunca criar `A+B=C` numa família e `A+B=D` noutra. Receitas alternativas podem abrir caminhos para o mesmo C, mas mantêm invariantes globais e não contam como elementos novos.

Validar a cobertura **de cada família individualmente**, mesmo que um mesmo ID pertença a várias, para garantir que não é preciso jogar outra campanha primeiro.

## 3. Elementos multifamília — identidade e propagação

Um elemento presente em duas ou mais famílias tem **um único ID no catálogo**, uma arte original, um nome, uma descrição e um conjunto global de receitas. Descobri-lo numa família válida desbloqueia **o mesmo ID** em todas as outras campanhas que o incluem. Isto não duplica elementos, não cria variantes, não duplica crédito de Merge e não altera o resultado de combinações.

A sincronização deve ser idempotente, persistente e restrita às famílias elegíveis. Não importar elementos Classic para Families Only, não marcar receitas como tentadas/conhecidas por engano e não partilhar pistas, estado de modo ou coleções de outra campanha. Um elemento multifamília descoberto só uma vez conta uma vez no Classic após Merge.

A partilha **não substitui a possibilidade de completar cada família do zero**; todos os seus itens têm de ser alcançáveis na simulação independente.

## 4. Isolamento Classic e Merge

Classic inicia somente com Water, Fire, Earth e Air e tem progresso próprio. Families Only tem saves separados. A única transferência permitida para Classic é `Merge Elements into Classic`, com **duas** recompensas reais concluídas, crédito **1/2** preservado se interrompido, exclusão de starters gratuitos, não duplicação de IDs e sem simulação offline de anúncios.

## 5. Estado do código verificado em 29/10/2026

A fonte ativa é `client/src/family-mode-v53-campaigns.js`; a sincronização é definida em `client/src/family-shared-v51.js`, e o Merge em `client/src/family-merge-v60.js`. Uma simulação de fecho de receitas `pair -> result` a partir dos quatro starters de cada campanha mostrou:

| Família | Starters ativos | Alcançáveis | Elementos totais |
|---|---|---:|---:|
| Nature & Science | Water, Fire, Earth, Air | 476 | 476 |
| People & Culture | `legacy:45`, `legacy:51`, `legacy:207`, `legacy:58` | 211 | 211 |

Interseção: **31 IDs multifamília** entre as duas campanhas. O módulo de sincronização foi desenhado para propagar IDs entre famílias elegíveis, mantendo Classic isolado. Esta é uma verificação estrutural do código e dos dados, **não substitui testes manuais em dispositivo**.

**Desvio real a corrigir:** Nature & Science continua a usar precisamente os quatro starters do Classic. A campanha já é completável, mas **não cumpre o requisito de starters temáticos distintos**. A correção exige adaptar/expandir o grafo de receitas sem quebrar receitas globais, e provar novamente alcance de 476/476. Não trocar os quatro IDs de arranque sem solucionar as dependências; não declarar o requisito corrigido antecipadamente.

## 6. Gate antes de cada entrega de +200

1. Confirmar quatro starters únicos, temáticos e listados em `items` de cada família.
2. Calcular `reachable` em modo isolado, sem sincronização; **cobertura de 100%** de cada `items`.
3. Verificar ausência de IDs duplicados ou receitas contraditórias entre famílias e Classic.
4. Testar desbloqueio multifamília de A para B, preservando um único ID, e sincronização repetida (idempotência).
5. Testar isolamento Classic e Merge com duas recompensas confirmadas e 1/2 persistente.
6. Qualquer nova família ou novo elemento associado a uma família deve passar de novo todos os testes. Não aceitar "categoria correta" como substituto da progressão.

Nenhuma campanha é considerada completa apenas porque mostra 100% num estado importado de outra família.

## 7. Alchemy 10K / V82 — duas campanhas temáticas adicionais

A aplicação compõe os dados históricos de `client/src/family-mode-v53-campaigns.js` com `client/src/family-campaigns-v82.js`, usando **exclusivamente a tabela de receitas globais Classic** para as novas campanhas. A seleção mostra quatro campanhas jogáveis, cada uma com quatro starters. Verificação estrutural no ramo de desenvolvimento: Nature & Science **476/476**, People & Culture **211/211**, Mythology & Gods **16/16** e Prehistory & Dinosaurs **9/9**; sem divergências de resultados entre os respetivos grafos. A Nature mantém o defeito histórico dos quatro starters iguais aos de Classic.

Os 16/9 elementos das novas campanhas já existiam no catálogo V81, pelo que **não** se afirma ter criado Zeus, Odin, Triceratops ou outros elementos planeados. Futuros elementos só são inscritos automaticamente quando explicitamente identificados com `familyCampaigns: ['mythology']` e/ou `familyCampaigns: ['prehistoric']` no seu registo global e alcançáveis, nessa campanha, desde os quatro starters. O módulo lança erro de validação se a cadeia não for completável; não omite silenciosamente itens impossíveis. Os IDs partilhados continuam únicos. Elementos iniciais gratuitos nunca são propagados como descobertas conquistadas.
