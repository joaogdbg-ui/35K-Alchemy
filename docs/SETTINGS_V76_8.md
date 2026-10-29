# V76.8 — Minimal casual-game Settings

## Design decisions grounded in guidelines
Google Android settings guidance (https://developer.android.com/design/ui/mobile/guides/patterns/settings), Apple HIG settings (https://developer.apple.com/design/human-interface-guidelines/settings), and Unity game interface basics (https://unity.com/blog/video-game-ui-ux-basics) recommend a few meaningful preferences, clear states, predictable controls, and moving infrequent information to a separate screen. Example casual game menus informed the **simplicity**, not copied artwork/layout.

## Player-visible structure
**Settings** (default): Sound effects [On/Off], Theme [Light/Dark/Auto], Game mode [Classic/Family Only], Profile & cloud >, Help & about >, one-line local progress note. No top-level tabs, nested marketing boxes, badge overload, in-modal hint button, import/export fields or fake online features. If currently Families Only, the existing Merge into Classic action appears contextually under Game mode (still requires two real rewarded ads).

**Profile & cloud**: Back + local player, discovery count in current mode, platform identity status, Google Play Games leaderboards (disabled), Recover from cloud (disabled). Never claim Google is connected or progress uploaded until native integration exists.

**Help & about**: Back + three native expandable short help items, version. Disclosure controls are real HTML elements, not fake clickable labels.

## Safety and regression
The underlying DATA/items and all recipes/saves are unchanged. The internal backup export/import functions are retained to avoid breaking compatibility and eventual migration, but deliberately not surfaced as actions requested by the player. Google native getStatus remains read-only and Android-only. The local game is not yet safely synced across devices; uninstalling or clearing storage may lose progress.

Automated checks cover: initial settings hierarchy, no tabbed settings, actual sound/theme hookups, screen navigation, disabled cloud/leaderboard controls, old progress functions, constrained viewport heights and dark mode. Physical UX still needs checking on 320/360/390 px devices, with large font and short viewport.
