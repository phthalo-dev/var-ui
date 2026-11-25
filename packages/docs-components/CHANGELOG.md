# @var-ui/docs-components

## 0.15.0

No changes in this release.

## 0.14.0

### Patch Changes

- [#254](https://github.com/phthalo-dev/var-ui/pull/254) [`f066000`](https://github.com/phthalo-dev/var-ui/commit/f066000932f40cb1bfffc5e3d4cc7cc70d6cd121) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every published package now ships its `CHANGELOG.md`. A new **Upgrading** guide (`/docs/upgrading`) covers the 0.6 → 0.13 breaks: platform prop names, `filled` → `solid`, native overlays, space tokens and removed exports. The core README lists `typestyles` as the one TypeStyles export (no root `recipe`/`style`), and the React README no longer describes the package as React Aria wrappers. `IconButton` warns once in development when it renders without an `icon` (any cause, including the pre-0.7 `name="close"`).

## 0.13.0

### Patch Changes

- [#223](https://github.com/phthalo-dev/var-ui/pull/223) [`b6a3775`](https://github.com/phthalo-dev/var-ui/commit/b6a37759ed1ac65691daa21f7bf52da6e52431b0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Data-driven icons for SegmentedControl options and Astro menu items ([#182](https://github.com/phthalo-dev/var-ui/issues/182)).
  
  - **astro** `SegmentedControl` options take `icon` (a registry name or `{ svg }` markup). Menu items' `icon` also accepts `{ svg }`. New `AstroIcon` type and `iconMarkup()`; an unknown icon name now throws at render instead of rendering nothing. Astro named slots can't be generated inside a `map`, so per-option content now travels with the data. `ColorModeToggle` is built on it.
  - **react** `SegmentedControl` options take `icon` (registry name or node), the same shape as Astro.
  - In both, with `layout="icon"` only the icon shows and a string `label` becomes the segment's accessible name, so icon-only options no longer need a separate `aria-label`.
  - **docs-components** `FrameworkSwitcher` uses option icons instead of one slot per framework.

## 0.12.0

### Minor Changes

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header chrome: one calm, consistent header across docs pages.
  
  - **core** `sideNav`: sections and items rendered outside a `SideNav` root (e.g. in a `MobileNav` drawer) get the default colours instead of the transparent `@property` initial values.
  - **core** `topNav`: items are the 32px control height with a quieter hover than the selected pill, selected items are semibold, and a new `itemLabel` slot reserves the bold width so selecting never shifts neighbours. The bar drops its shadow for a `border.subtle` hairline.
  - **core** `segmentedControl`: new `layout: 'icon'` (square segments), nested indicator radius (the focus ring matches it), hover colour on unselected segments, a hairline track and a lifted indicator in dark mode. `toggleButton({ segmented: true })` no longer uses a pill radius.
  - **core** `searchInput`: new `collapseBelow` variant (`none | sm | md | lg | xl`, default `md`, was a fixed `xl`) for the command trigger, a hover fill, a single focus ring on the field, and an even inset around the shortcut key cap. The collapsed trigger is a quiet icon button.
  - **core** `kbd`: a centred fixed-height key cap. `commandPalette`: new `footer` / `footerHint` slots; the search input hides the UA clear button.
  - **react** `SegmentedControl` / `ColorModeToggle`: `layout` prop (`ColorModeToggle` uses `icon` for icon-only segments). `CommandPalette`: keyboard hints footer (`hints`, default on). `Menu.FromSections`: a section `defaultValue` makes it an independent single-choice group. `TopNavItem` renders the `itemLabel` slot.
  - **astro** `SegmentedControl` is a radio group of native radios (one tab stop, arrow keys move and check, like React); new `layout`, `name`, `disabled` props and `setSegmentedControlValue` / `getSegmentedControlValue`. `ColorModeToggle` is built on it. `Menu` sections take `defaultValue` for per-section radio groups. `SearchInput` takes `collapseBelow` and shows `Ctrl K` off Apple platforms. `CommandPalette` renders its group headings with the recipe's `groupHeading` slot (was an unstyled `<h2>`) and a hints footer (`hints`). New `COLOR_MODE_CHANGE_EVENT`, `readColorModePreference` (unset = `system`).
  - **docs** One shared header, `DocsTopBar` (with `DocsMobileMenu`), used by `DocsPage` and `DocsMarketingPage`: the same brand and links on every page, persisted across view transitions (no jump or cross-fade; the selected link moves on navigation). `DocsThemePicker` is replaced by `DocsAppearanceMenu` (colour mode + theme presets in one icon menu); the `themePicker` slot is gone and a `drawerTools` slot puts tools in the mobile drawer. The docs sidebar moves into the drawer below `md`.
  - **docs-components** `FrameworkSwitcher` is the Astro `SegmentedControl` (radio group, icon layout) with `size` and `appearance` props.

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs visual design pass, built into the system:
  
  - `tabs` gains `appearance: 'underline' | 'pill'` (React and Astro `Tabs` take `appearance`); tabs lay out an icon + label.
  - `codeBlock`: 40px header, icon-only 28px copy button (label kept for screen readers), neutral code surface, and `tabs` / `tab` slots for tabbed blocks.
  - `proseContent`: 16/26 reading type, 44/28/20 heading ramp, lead paragraph, neutral inline-code chip, quiet link underline, hairline tables.
  - `sideNav`: 32px rows, semibold active item with a 2px accent bar. `toc`: uppercase label, accent indicator.
  - `appShell`: CSS twin of `data-mobile`, so the side nav and aside hide below the mobile breakpoint on first paint.
  - Tokens: warm three-step dark surfaces (canvas / chrome / raised), warm borders and muted text, neutral code surfaces, a restrained three-hue syntax palette, a desaturated dark accent. Disabled buttons drain their hue.
  - `@var-ui/docs`: `DocsPageHeader` (eyebrow, title, lead, metadata list), `PackageInstall` (tabbed pnpm / npm / yarn / bun block), markdown fences rendered as the shared code block, demo frames as dot-grid stages, a centered content + TOC grid, a sidebar that becomes the mobile drawer, and a props-table recipe.
  - `@var-ui/docs-components`: `ComponentDocTabs` uses pill tabs with icons; the TOC lives in the `DocsPage` rail.

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs component pages, round 4:
  
  - `tabs` underline appearance is now true page tabs: a full-width hairline rail, a 2px accent indicator that slides (respecting reduced motion), 44px tall tabs with a neutral hover underline and an accented icon on the selected tab. The row scrolls sideways with a trailing fade.
  - `@var-ui/docs`:
    - The hero (`DocsPageHeader`) spans the full content frame (main column + rail), with a large showcase plate set into the band.
    - The rail (TOC or per-tab list) starts below the hero and tabs, and sticks under the new collapsed page bar.
    - The collapsed page bar (`docsPageBar`): once the hero scrolls away, a compact sticky bar shows the page name, the page tabs, source and Markdown links and the import copy button. It reveals with a CSS scroll-driven animation on the hero's view timeline, falling back to an IntersectionObserver; a fade-only variant applies under reduced motion. It is exposed to AT and keyboard only while visible.
  - `@var-ui/docs-components`: `ComponentDocTabs` uses the underline tabs and joins the page grid (`data-docs-page-tabs`).

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

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs visual design, round 3:
  
  - Prose inline code is one chip everywhere except table cells (mono only, first column keeps the chip).
  - Pill `Tabs` scroll with snap and a scroll-driven trailing-edge fade.
  - `@var-ui/docs`:
    - `DocsPageHeader` takes a `preview` slot: a live component plate in the right half of the hero band.
    - Guide pages render the same hero (eyebrow from frontmatter `eyebrow` or the section name, lead from `description`); the MDX title is hidden by `docsGuideArticle`.
    - The import pill truncates with an ellipsis and keeps its copy button; metadata links underline on hover only.
    - Demo stages size to their content (120px floor) and get a hover toolbar: preview in the opposite color mode, and right-to-left.
    - The TOC hairline only shows under a rendered TOC.
  - `@var-ui/docs-components`: the component tabs script shows a per-tab rail block (`data-rail`), so non-Documentation tabs keep useful right-rail content.

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs component pages, round 5:
  
  - `SideNav.Section` (React and Astro) gains `collapsible`, `defaultOpen` and `count`: a native `<details>` disclosure whose title row sticks to the top of the scroll area, with a trailing chevron and an item count. New `sideNav` slots: `sectionSummary`, `sectionCount`, `sectionChevron`, `sectionItems`.
  - Underline `tabs`: the rail ends flush with the container edge.
  - `@var-ui/docs`:
    - The collapsed page bar is a full-bleed sub-header (edge to edge across the content area, content on the page frame, hairline bottom border) with core underline tabs whose indicator sits on the hairline.
    - It reveals as a discrete 140ms fade once the page's real tab row has passed under it, so labels and tab rows never double up.
    - Bar-tab jumps land the panel 24px under a shown bar.
    - The bar never truncates the name; it drops source links and the Markdown label below `xl`, and the eyebrow below `lg`.
    - The hero band is borderless and its showcase sits directly on the band (no plate).
    - `DocsSidebar` groups collapse (the current group open, the open state remembered).
  - `@var-ui/docs-components`: page tabs below the hero use the pill appearance again.

## 0.2.1

### Patch Changes

- [#31](https://github.com/phthalo-dev/var-ui/pull/31) [`2a43136`](https://github.com/phthalo-dev/var-ui/commit/2a4313660b8856e39921dfa258fd7bb20fff4d7e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Point the repository metadata at the phthalo-dev GitHub organization.

## 0.2.0

### Minor Changes

- [#29](https://github.com/var-ui/var-ui/pull/29) [`a3d3459`](https://github.com/var-ui/var-ui/commit/a3d34594d6dde3b24d150d27d733dffa2c21b289) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Drop leftover public helpers and move default glyph SVG strings to `@var-ui/icons/glyphs`. Each icon is also its own subpath (`@var-ui/icons/close`, `@var-ui/icons/glyphs/close`) so one glyph does not pull the rest of the set.

  `@var-ui/core` no longer exports `linkButton`, `themeWhen`, the layout shell var initializer, or the default glyph strings. Astro components read those strings from `@var-ui/icons/glyphs`, so `@var-ui/astro`, `@var-ui/docs`, and `@var-ui/docs-components` now peer `@var-ui/icons`.

- [#25](https://github.com/var-ui/var-ui/pull/25) [`5c2691b`](https://github.com/var-ui/var-ui/commit/5c2691b38333a3bdae64aea303adcc4bc04b11e0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - ### Breaking (@var-ui/react)

  - **`DropdownMenu`**, **`ContextMenu`**, and **`MoreMenu`** are removed. Use **`Menu.FromSections`**, **`Menu.ContextMenu`**, and **`Menu.Overflow`** on the `Menu` namespace instead.
  - Root export **`MenuContent`** is removed; use **`Menu.Content`** when composing custom menus.

  ### Breaking (@var-ui/core)
  - **`theme.componentStyles(recipe, override)`** is removed. Pass TypeStyles **`components`** on **`createDesignTheme`** (namespace keys such as `button`) for typed recipe restyles.
  - **`extendTokens`** (and the **`ModeAwareTokenLeaf`** re-export) are removed. Mint custom namespaces via **`createDesignTheme({ tokens: { brand: … } })`**.
  - Theme implementation files live under **`packages/core/src/theme/`**; published export paths (`@var-ui/core/theme-constants`, etc.) are unchanged except as noted below.
  - **`@var-ui/core/base-styles`** is removed. Document globals (CSS reset, base HTML styles, and `color-scheme` for root / `data-surface`) ship with **`@var-ui/core/styles`** and **`styles.css`**.
  - **`typestyles`** is upgraded to **0.26.x** on `@var-ui/core` (native theme `components`).
  - **Spinner** recipe uses **`root`** and **`indicator`** slots (update static HTML markup accordingly).

  ### Additions
  - **`@var-ui/astro`**: **`SegmentedControl`** and **`ToggleButton`** with client init scripts.
  - Core **`visuallyHidden`** recipe; side nav, spinner, and TOC align with shared patterns.
  - Docs: unified **Menu** component page, theme-aware **`VarUiWordmark`**, shared **`@var-ui/docs/utils`** syntax highlighting.

  ### Migration (menus)

  ```tsx
  // Before
  <DropdownMenu trigger={<Button>Actions</Button>} sections={[…]} />

  // After
  <Menu.FromSections trigger={<Button>Actions</Button>} sections={[…]} />
  ```

  ### Migration (theming)

  ```ts
  // Before
  extendTokens('brand', { glow: { light: '…', dark: '…' } });

  // After — custom namespaces live on the theme
  createDesignTheme({
    name: 'acme',
    tokens: {
      brand: { glow: { light: '…', dark: '…' } },
    },
    components: {
      button: ({ tokens: t }) => ({ base: { borderRadius: t.radius.lg.var } }),
    },
  });
  ```

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

  1.x and 2.x were unpublished; this package is on 0.x until a stable 1.0.

## 0.1.0

### Patch Changes

- Updated dependencies [[`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d)]:
  - @var-ui/core@0.1.0
  - @var-ui/astro@0.1.0
  - @var-ui/docs@0.1.0

## 0.0.1

### Patch Changes

- [`c28fdba`](https://github.com/var-ui/var-ui/commit/c28fdba598df30e9788d590d19a9cde2851a5dd0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Initial release of the Astro docs kit: `@var-ui/docs` (guide shell, theming, search, TOC) and `@var-ui/docs-components` (optional design-system catalog plugin). Both ship source `.astro`/`.ts` files.

- Updated dependencies [[`e13d16f`](https://github.com/var-ui/var-ui/commit/e13d16f8f8a28f21cf16b416eb00a4e6b89d72dd), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`c28fdba`](https://github.com/var-ui/var-ui/commit/c28fdba598df30e9788d590d19a9cde2851a5dd0), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23)]:
  - @var-ui/astro@0.0.1
  - @var-ui/core@0.0.1
  - @var-ui/docs@0.0.1
