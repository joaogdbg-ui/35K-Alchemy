# V14 technical decisions

- Legacy recipes remain highest priority. Pack recipes are only added when the canonical pair does not already exist. Stable `pack:*` IDs.
- 61 hand-curated original fantasy concepts plus 74 pair routes demonstrate creative semantic results offline; no AI is running in the downloaded HTML.
- All new icons reuse colorfully illustrated static SVG families, color palettes, and deterministic accent marks. This approach is cost-free per image generation, but not equivalent to 5,000 individually drawn icons.
- Online AI can optionally use local Ollama via loopback HTTP; it is never embedded in the Android client. Client performance is independent of model inference load.
- Local-provider proposals are only sent to the existing manual approval queue; lexical checks are NOT sufficient for public safety.
- PostgreSQL migration 005 is additive and must run after legacy seeds. Test on actual PG before deployment.
- World discoveries only appear once explicitly approved; no fake player events, no auto-publishing creative pack as personal discoveries.
- V13 tap-to-slot, drag from artwork, right-slot replacement, automatic combination, left lock, new/repeat/invalid feedback are preserved.

Next milestone V15: proper automatic icon family selection for newly AI-proposed concepts, catalog rights provenance, transaction tests against PostgreSQL, rate-limited public API security and remote model load benchmarking.

## Fixed colorful cartoon visual system

V14 bundles 50+ transparent, static miniature raster assets extracted from the locally installed Noto Color Emoji artwork (no font file redistributed). Per-element icons use one base family plus recoloring and tiny overlays. All images are embedded in standalone HTML and remain static. Noto Emoji is Apache-2.0 licensed; keep the attribution and check the exact upstream asset version before commercial launch. Source: https://github.com/googlefonts/noto-emoji and https://github.com/googlefonts/noto-emoji/blob/main/LICENSE.

The ~5,000 individual hand-painted icon library is still future work; V14 is a reusable colorful family atlas.
