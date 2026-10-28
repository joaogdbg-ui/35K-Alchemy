# Gameverse Infinite — V10 UI/UX Contract

## Interaction model
Three views only. **Play**: lightweight header, two craft slots plus left lock, a compact latest-discovery line, searchable scrollable element inventory. **Discoveries**: approved shared feed (Latest, World Firsts, Trending). **Collection**: personal encyclopedia with category filters, favorites later, item details and report option when public.

## Visual system
- Background: `#f7f5f2`; surface: `#ffffff`; canvas: `#efeeeb`; ink `#171717`; muted `#827d78`; fine borders `#e3dfda`.
- Shapes: rounded 14–19 px; understated shadows; no gradients/neon/mountain/sci-fi floor on the normal play surface.
- Typography: UI sans; 21 px compact name, 12–14 px item names; short labels only.
- Element artwork: colorful premium 2D cartoon, permanent static image (not animated sprite), transparent background, readable at 35–40 px.
- No explanatory headline blocks, no permanent text paragraphs, no animated icon frames.
- Discovery feedback: compact modal with unique icon + name + formula; first-world discovery may get extra accent but must be dismissible.

## Performance and accessibility
- Virtualized collection rendering; draw only visible rows plus overscan. Initial cap on DOM cards should scale with viewport instead of total unlocks.
- Icon URLs loaded lazily, decoded asynchronously, size-stable to avoid layout shifts. Cache via normal browser cache and future service-worker policy.
- Pointer gestures from icon region, vertical scroll from label/spacing. Do not re-render the gesture source mid-drag.
- Proper touch targets (ideally 44px), tab labels, aria roles, reduced-motion support, scroll containers with contained overscroll.
- Avoid text injection: player- or AI-provided values are escaped before HTML insertion.

## Navigation and offline states
- World feed displays a clear 'connect to server' state if offline; never fabricated items.
- A combination unknown to the offline pack uses an explicit status; no silent invention.
- UI state (selected tab, filters, query, lock) is separate from global element/recipe data.
- Original `gameverse_alchemy_v2` legacy save remains readable. Native app migration needs one-time import/export of the browser save, since file origins do not automatically share storage.

## Current executable proof
`Gameverse_Infinite_V10_Offline.html` is a new simplified visual shell using all 1,591 original elements and 1,735 original recipes. It preserves the two-slot interaction, left lock, automatic combination, search, and static vector artwork. The global feed is intentionally empty when no API is connected. The V10 shell is an engineering baseline for iterative usability tests, **not** a completed commercial app.

## Required visual acceptance checks
1. On 360x740 and 390x844 Android screens, inventory cards remain fully visible and scrollable.
2. With left lock on, input A survives success, failure, and repeated trials; click A to remove.
3. Fire + Water reveals Steam and increments the user's count exactly once.
4. World view is distinct from personal collection; no fake results while disconnected.
5. Search with 1,000+ unlocked elements does not create 1,000 DOM cards.
6. Artwork is static at rest; the only temporary feedback is the discovery modal/toast.
