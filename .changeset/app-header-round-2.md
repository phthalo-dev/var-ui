---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/icons': minor
'@var-ui/docs': patch
'@var-ui/cli': patch
---

App header, round 2.

- `TopNav`: the selected item's fill is one pill that slides between items (`observeTopNavIndicator` in `@var-ui/core/components/indicators/top-nav`; React and Astro start it for you). Whatever moves `data-selected` moves the pill; it only animates after first placement and follows the duration tokens, so reduced motion turns it off. Dark hover is quieter than the selected pill, the dark selected tint is stronger, and items and menu triggers share the button's pressed nudge. The bar hairline uses `border.default` in light mode.
- `SegmentedControl`: the thumb uses the same sliding-indicator engine (`indicators/sliding`) and no longer animates in from the left edge on first paint.
- `SearchInput` (`variant="command"`): filled tray with a hairline, the same chrome as a `SegmentedControl` track; the ⌘K key cap sits one step above the field so it stays visible on hover in dark mode. Collapsed, the icon brightens on hover like the bar's other icon buttons.
- `MobileNav`: the toggle is a square 32px icon button with the shared pressed state.
- `CommandPalette` (React and Astro): ~44px rows with a muted 12px subtitle, a leading type-icon tile (`icon` takes an icon name; React still accepts a node), matched text highlighted by default (`highlightMatches={false}` to opt out), and `recentKey` to list recently chosen items under "Recent" on an empty query. Astro clears `aria-activedescendant` when nothing matches. Both share `findTextMatch` (`@var-ui/core/shared/textMatch`).
- `Menu` (React and Astro): items take `icon` (and `swatch` in React, matching Astro); a section with `layout: 'row'` renders compact icon items side by side (arrow left/right move along it in Astro). Section labels are quiet 12px text and long menus scroll inside a capped height.
- `@var-ui/icons`: new `page`, `component` and `palette` glyphs (and icon names in core).
- `@var-ui/docs`: the mobile drawer opens from the end side (where the hamburger is) with the brand in its header; the header selection moves when navigation starts, not after the swap; the Appearance trigger shows the theme as a colour bar under the mode glyph instead of a badge dot, with Mode as a 3-icon row; search results get type icons, subtitles and recents; the mobile bar uses one 8px rhythm.
