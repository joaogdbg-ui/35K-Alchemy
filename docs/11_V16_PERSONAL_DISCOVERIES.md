# V16 — Personal finds, progress and World Firsts

**Terminology.** Collected = unique elements in the library, including four starter ingredients. My Finds = unique elements unlocked through play beyond those four. World First = an approved globally new generated element attributed by the server to the anonymous guest that initiated its winning combination. Being the first to unlock an existing element **on your own device** is not a World First.

**Feedback.** A personal new discovery opens a reveal with illustration, name, input ingredients and cumulative personal count. A repeated discovery shows a short toast, without increasing the personal total. Once server-verification detects a newly confirmed World First for the guest session, a separate `WORLD FIRST` toast is shown, and the collection marks it with a star. Static icons do not animate.

**Storage.** `gameverse_ledger_v16` holds per-element unlock provenance (`at`, `source`, `ingredients`), with old V2/V11 saves preserved. Old elements migrate as imported with unknown dates, not retroactive World Firsts. Guest-first confirmations are cached per API/session and refreshed from D1.

**Backend.** `GET /v1/me/stats`, `/v1/me/world-firsts`, and `/v1/me/discoveries` require a bearer token. Firsts count and list are server-authoritative. The server's approval step links the global first to `creator_id`; replayed recipes, imported IDs and other users cannot steal that first credit.

**Scaling.** World-first list is paged; catalog still virtualized. Client refreshes on Collection entry subject to a two-minute throttle or Settings sync, rather than continuous polling. No additional AI calls are needed to compute scores.

**Limitations.** No live server or AI has been deployed; account recovery between devices remains a planned feature. Verified World First displays `—` offline until a server session can confirm.
