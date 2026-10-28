# Gameverse Infinite — AI, Semantic Quality and Moderation

## Text model: `gameverse_element_proposal` v1
System goal: construct one meaningful, reusable entity from ingredient A and B, not a concatenation. Supply names, types, canonical IDs and relevant known relationships; ask model for a structured proposal. When ambiguous, prefer `no_match` over unsupported factual claims. Never allow user-provided output to override system rules.

The schema fields implemented in `server/src/ai-provider.mjs`:
- `status`: `candidate`, `no_match`, `blocked`
- `name`, `category`, `summary`, `reason`, `icon_brief`
- `fictional` and `real_person_sensitive` boolean flags

**Validation beyond JSON schema**: canonical name uniqueness, alias resolution, causal/factual plausibility, semantic relevance to both ingredients, distinct reuse potential, adult/child safety, brand/character rights, output formatting. Structured outputs guarantee shape, not factual truth. Model generated results remain `pending_review` until a moderator or vetted policy path approves them.

### Good / bad contrast
- Input `Samurai + Robot` → **good**: `Mecha Samurai`, a cybernetic swordsman with a coherent visual identity; **bad**: `Super Ultra Samurai Robot 9000` with no distinctive meaning.
- Input `Film + Shark` → **good**: `Jaws`, with verified relationship; **bad**: a made-up movie presented as real.
- Input `Living Politician + Fictional Villain` → **manual review**; no fake factual accusations or claims of real association.
- Input `Anime Character + Metal Armor` → **possible fictional concept**, not automatic publishing of derivative franchise likeness or word stack. Distinguish unofficial fan concepts, impersonation, trademarks and rights before art/publication.

## Safety pipeline
1. **Input**: ingredient ID allowlist and authentication, no free-form prompt injection from client.
2. **Lexical and language-aware filters**: profanity, threats, sexual exploitation of minors, hate slurs, spam, URL injection, PII exposure.
3. **Semantic model moderation**: context-sensitive safety classifier; treat sexual content involving real people, defamatory links, hateful/violent content, extremist glorification and illicit instructions as blockers or reviewer-only.
4. **Truth/identity**: names, titles, actors, politicians, facts; verify through authoritative source catalog, or mark explicitly fictional and route to review.
5. **Originality**: avoid existing canonical keys, aliases, banal duplication and meaningless modifier stacking.
6. **Post-publication**: report button, quarantine/flag, human appeal and takedown workflow. Never assume a blocklist alone solves all harms.

For a public store launch add an actual moderation service (e.g., model-based text/image moderation), multilingual test sets, queue SLAs, reviewer tools, complaint contact and audit trails. The regex patterns in the starter are deliberately insufficient.

## Icon style lock v1
- Colored premium cartoon 2D object art, centered and recognizably relevant; transparent background; no labels, watermark, card frame, template cube, photorealism or sprite animation.
- Fixed 1:1 aspect; generate a high-quality 1024x1024 source if supported, crop with transparent margin, downsample to **256x256 master** and **128x128 thumbnail** with proper alpha.
- Consistent contour thickness and soft shadows. Avoid text/letters inside art (except physical hardware where essential and rights-safe).
- Describe primary object, silhouette, color palette, two distinctive details, exclusion list. Keep only approved art.
- If a player discovers a new element before art exists, show a relevant **curated** icon family temporarily; generate/validate art asynchronously; do not block crafting.
- Save `icon_style_version`, generation model/version, image provenance, moderation outcome, hash and final asset key.
- Human and fictional IP likenesses default to **manual review**. Do not automatically create copyrighted logo/trademark replicas or deepfake realism for famous people.

### Reference icon brief
```json
{
 "element": "Mecha Samurai",
 "primary_subject": "futuristic armored samurai",
 "silhouette": "distinctive kabuto helmet and sheathed katana",
 "palette": ["warm red", "steel silver", "teal accent"],
 "details": ["segmented shoulder plates", "glowing visor"],
 "negative_constraints": ["no text", "no logo", "no photo", "no background scene"],
 "style_version": "gameverse-cartoon-v1"
}
```

## Icon pipeline states
`queued -> generating -> visual_qa -> rights_review(if needed) -> ready`, or `failed` with bounded retries. Worker uses idempotent `(element_id, style_version)` key. Assets stored in S3/R2 or equivalent, served via CDN. No direct generated base64 blob stored in a SQL row.

## Image QA gates
- PNG/WebP alpha present; correct dimensions and crop; no extra background or illegible parts.
- Perceptual-hash duplicate scan plus semantic embedding similarity versus adjacent known assets.
- Content moderation of image and description.
- Icon still reads at 40px. If a source model cannot generate transparent backgrounds, apply a reviewed isolation pipeline rather than claiming transparency.

## Public feed and real people
Names of actors, musicians or political figures can appear as factual catalogue entries; invented relationships must not be presented as fact. Generic cartoon symbols are safest as interim art. The public feed only contains approved discoveries, and users have a report/appeal path. Public credit is opt-in, not a side effect of discovering an element.
