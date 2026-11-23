# @var-ui/icons

## 0.14.0

### Patch Changes

- [#254](https://github.com/phthalo-dev/var-ui/pull/254) [`f066000`](https://github.com/phthalo-dev/var-ui/commit/f066000932f40cb1bfffc5e3d4cc7cc70d6cd121) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every published package now ships its `CHANGELOG.md`. A new **Upgrading** guide (`/docs/upgrading`) covers the 0.6 → 0.13 breaks: platform prop names, `filled` → `solid`, native overlays, space tokens and removed exports. The core README lists `typestyles` as the one TypeStyles export (no root `recipe`/`style`), and the React README no longer describes the package as React Aria wrappers. `IconButton` warns once in development when it renders without an `icon` (any cause, including the pre-0.7 `name="close"`).

## 0.13.0

No changes in this release.

## 0.12.0

### Minor Changes

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header, round 2.
  
  - `TopNav`: the selected item's fill is one pill that slides between items (`observeTopNavIndicator` in `@var-ui/core/components/indicators/top-nav`; React and Astro start it for you). Whatever moves `data-selected` moves the pill; it only animates after first placement and follows the duration tokens, so reduced motion turns it off. Dark hover is quieter than the selected pill, the dark selected tint is stronger, and items and menu triggers share the button's pressed nudge. The bar hairline uses `border.default` in light mode.
  - `SegmentedControl`: the thumb uses the same sliding-indicator engine (`indicators/sliding`) and no longer animates in from the left edge on first paint.
  - `SearchInput` (`variant="command"`): filled tray with a hairline, the same chrome as a `SegmentedControl` track; the ⌘K key cap sits one step above the field so it stays visible on hover in dark mode. Collapsed, the icon brightens on hover like the bar's other icon buttons.
  - `MobileNav`: the toggle is a square 32px icon button with the shared pressed state.
  - `CommandPalette` (React and Astro): ~44px rows with a muted 12px subtitle, a leading type-icon tile (`icon` takes an icon name; React still accepts a node), matched text highlighted by default (`highlightMatches={false}` to opt out), and `recentKey` to list recently chosen items under "Recent" on an empty query. Astro clears `aria-activedescendant` when nothing matches. Both share `findTextMatch` (`@var-ui/core/shared/textMatch`).
  - `Menu` (React and Astro): items take `icon` (and `swatch` in React, matching Astro); a section with `layout: 'row'` renders compact icon items side by side (arrow left/right move along it in Astro). Section labels are quiet 12px text and long menus scroll inside a capped height.
  - `@var-ui/icons`: new `page`, `component` and `palette` glyphs (and icon names in core).
  - `@var-ui/docs`: the mobile drawer opens from the end side (where the hamburger is) with the brand in its header; the header selection moves when navigation starts, not after the swap; the Appearance trigger shows the theme as a colour bar under the mode glyph instead of a badge dot, with Mode as a 3-icon row; search results get type icons, subtitles and recents; the mobile bar uses one 8px rhythm.

### Patch Changes

- [#204](https://github.com/phthalo-dev/var-ui/pull/204) [`6c3482d`](https://github.com/phthalo-dev/var-ui/commit/6c3482db9fd93768a355a9fc8c834359d37c2473) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header polish, round 5:
  
  - `Menu` sections take `closeOnSelect` (React and Astro). Set it to `false` to keep the menu open on a pick, as `layout: 'row'` sections already do. The docs Appearance menu now stays open on a Theme pick too.
  - `SegmentedControl` takes `fullWidth` (React and Astro): it fills its container and gives every segment an equal share. `FrameworkSwitcher` passes it through.
  - `SideNav.Section` / `SideNavSection` takes `selectionStyle: 'fill' | 'text'`. With `'text'`, the current item shows accent text only, with no fill and no bar. The docs drawer uses it for the site sections, so the current page row is the only filled row.
  - Icons: the brand mark has a 16px optical size, `varUiMarkSmall` / `varUiMarkSmallSvg` (16 grid, 2px strokes on whole pixels). `varUiFaviconSvg` now uses it.
  - Command palette: one match highlight style (accent ink at the line's own weight) for titles and descriptions. Ranking now puts word starts above camelCase humps and description starts above mid-description hits, and adds one-typo title matching for queries of 4+ characters when nothing matches as typed.
  - Top nav: the light hover chip comes from the neutral hover step plus a touch of ink, so it keeps the palette's hue.
  - Docs kit: one 24px gap after the brand at every width, and the drawer's brand, links and preferences share one 16px inset.
  - Docs kit: the bar shows the `var(--ui)` lockup from `lg` up (the tile alone below), and the search trigger reads "Search…" (accessible name "Search docs") so the tablet-width bar fits without overflowing. `DocsSearch` gains `triggerPlaceholder` and `label`.

- [#203](https://github.com/phthalo-dev/var-ui/pull/203) [`f575b81`](https://github.com/phthalo-dev/var-ui/commit/f575b812ed888d26713667e7ff1051fd84ee5f72) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add the Var UI brand mark: `(-)`, the `var(--)` call in miniature, drawn from Inconsolata's proportions on the 24×24 icon grid. `@var-ui/icons/brand` exports the strings (`varUiMarkInnerHtml`, `varUiMarkSvg`, `varUiFaviconSvg()`), for Astro and plain HTML; `varUiMark` is the React element.
  
  `varDocs()` takes a `favicon` option. `DocsPage` and `DocsMarketingPage` emit it in `<head>`, and `DocsFavicon` covers site layouts that write their own `<head>`.

## 0.3.0

### Minor Changes

- [#110](https://github.com/phthalo-dev/var-ui/pull/110) [`86493c6`](https://github.com/phthalo-dev/var-ui/commit/86493c63d7cd9fe251948710341d8aedabace6d1) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `Rating`: a star (or custom icon) rating built on a native radio group, so arrow keys, Home/End, Tab, `name`/`form`/`required`/`disabled` and form submission come from the browser. Props: `value`/`defaultValue`/`onValueChange`, native `onChange`, `max`, `readOnly` (a `role="img"` display that also accepts fractional values such as `3.5`), `clearable`, `size`, `tone`, `icon`/`emptyIcon`, `getItemLabel`, `getValueLabel`, and `label`/`description`/`errorMessage`. Hover preview is pure CSS and mirrors in RTL. New core `rating` recipe, a read-only `Rating.astro`, and a `star` glyph (`star` joins the semantic icon names).

## 0.2.2

### Patch Changes

- [#46](https://github.com/phthalo-dev/var-ui/pull/46) [`4ae01ee`](https://github.com/phthalo-dev/var-ui/commit/4ae01ee3fc7847c3ec4c2976ccfed4369ffd1436) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Build against `@types/react` 19 (matching the React 19 peer dependency; it was 18). The CLI's component catalog is regenerated from the new types.

## 0.2.1

### Patch Changes

- [#31](https://github.com/phthalo-dev/var-ui/pull/31) [`2a43136`](https://github.com/phthalo-dev/var-ui/commit/2a4313660b8856e39921dfa258fd7bb20fff4d7e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Point the repository metadata at the phthalo-dev GitHub organization.

## 0.2.0

### Minor Changes

- [#29](https://github.com/var-ui/var-ui/pull/29) [`a3d3459`](https://github.com/var-ui/var-ui/commit/a3d34594d6dde3b24d150d27d733dffa2c21b289) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Drop leftover public helpers and move default glyph SVG strings to `@var-ui/icons/glyphs`. Each icon is also its own subpath (`@var-ui/icons/close`, `@var-ui/icons/glyphs/close`) so one glyph does not pull the rest of the set.

  `@var-ui/core` no longer exports `linkButton`, `themeWhen`, the layout shell var initializer, or the default glyph strings. Astro components read those strings from `@var-ui/icons/glyphs`, so `@var-ui/astro`, `@var-ui/docs`, and `@var-ui/docs-components` now peer `@var-ui/icons`.

  1.x and 2.x were unpublished; this package is on 0.x until a stable 1.0.

## 0.1.0

### Patch Changes

- Updated dependencies [[`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d)]:
  - @var-ui/core@0.1.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23)]:
  - @var-ui/core@0.0.1
