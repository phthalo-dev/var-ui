# @var-ui/cli

## 0.14.0

### Minor Changes

- [#240](https://github.com/phthalo-dev/var-ui/pull/240) [`a340f9f`](https://github.com/phthalo-dev/var-ui/commit/a340f9fffa3633941c76db439887ccfd52021720) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - New `var-ui tokens [query] [--json]`: lists design tokens with their CSS variable and default value (light / dark for colours). The query matches the token path or variable name, ignoring case and separators, so a pasted `--var-ui-font-size-md` finds `--var-ui-fontSize-md`. The catalog gains a `tokens` array from `listDesignTokens()`, and the AGENTS.md block mentions the command.

### Patch Changes

- [#281](https://github.com/phthalo-dev/var-ui/pull/281) [`6ac0e2c`](https://github.com/phthalo-dev/var-ui/commit/6ac0e2cb2c52c3acb9b5d159cc729954faa05187) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `@var-ui/react` no longer depends on `react-aria`, directly or as a peer: install `react`, `react-dom`, `react-aria-components` and `@var-ui/core`. Our popups no longer render under a react-aria trigger's press responder, which removes the one reason we imported `react-aria` (its `Overlay`, to clear that responder).
  
  - `Menu` provides react-aria's menu contexts itself (`MenuContext`, `RootMenuTriggerStateContext`, the popover and overlay-state contexts) instead of wrapping in RAC `MenuTrigger`. The trigger handles its own click and keys: ArrowDown, Enter and Space open with the first item focused, ArrowUp with the last. Submenus, Menubar and the presets are unchanged.
  - `ColorInput`'s picker is a var-ui `Popover` (a light-dismiss native popover) instead of RAC `DialogTrigger`. It still takes focus when it opens and gives it back to the swatch.
  - The internal popover shell renders its content in place, without `Overlay`. If a var-ui popup is placed inside a RAC `MenuTrigger` / `DialogTrigger`, it keeps its anchor and warns in development.

- [#265](https://github.com/phthalo-dev/var-ui/pull/265) [`765e234`](https://github.com/phthalo-dev/var-ui/commit/765e234720745d2d276a3ecc79547d8d336a85ec) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Component props data includes recipe variant defaults (`size`, `tone`, `appearance`, …), so `var-ui component <name>` and the docs Markdown views show them, not only the docs props table. JSDoc `@default` still wins.

- [#250](https://github.com/phthalo-dev/var-ui/pull/250) [`993ae7f`](https://github.com/phthalo-dev/var-ui/commit/993ae7f2902079c2bfe56221bf5efcf4dd97fc7c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `react-aria` is now a peer dependency (`^3.50.0`) instead of an exact dependency, so apps install one copy: the one `react-aria-components` uses. Two copies made menu items take over their trigger's ref, so `Menu` popups anchored to their own first item and rendered at the window's corner. A popup now ignores a trigger that sits inside itself and warns in development that `react-aria` is duplicated. `@react-aria/i18n` is gone (`isRTL` comes from `react-aria-components`).
  
  Install it next to `react-aria-components`: `pnpm add react-aria`, then check `npm ls react-aria` lists one version.

- [#254](https://github.com/phthalo-dev/var-ui/pull/254) [`f066000`](https://github.com/phthalo-dev/var-ui/commit/f066000932f40cb1bfffc5e3d4cc7cc70d6cd121) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every published package now ships its `CHANGELOG.md`. A new **Upgrading** guide (`/docs/upgrading`) covers the 0.6 → 0.13 breaks: platform prop names, `filled` → `solid`, native overlays, space tokens and removed exports. The core README lists `typestyles` as the one TypeStyles export (no root `recipe`/`style`), and the React README no longer describes the package as React Aria wrappers. `IconButton` warns once in development when it renders without an `icon` (any cause, including the pre-0.7 `name="close"`).

## 0.13.0

No changes in this release.

## 0.12.0

### Patch Changes

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

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header, round 2.
  
  - `TopNav`: the selected item's fill is one pill that slides between items (`observeTopNavIndicator` in `@var-ui/core/components/indicators/top-nav`; React and Astro start it for you). Whatever moves `data-selected` moves the pill; it only animates after first placement and follows the duration tokens, so reduced motion turns it off. Dark hover is quieter than the selected pill, the dark selected tint is stronger, and items and menu triggers share the button's pressed nudge. The bar hairline uses `border.default` in light mode.
  - `SegmentedControl`: the thumb uses the same sliding-indicator engine (`indicators/sliding`) and no longer animates in from the left edge on first paint.
  - `SearchInput` (`variant="command"`): filled tray with a hairline, the same chrome as a `SegmentedControl` track; the ⌘K key cap sits one step above the field so it stays visible on hover in dark mode. Collapsed, the icon brightens on hover like the bar's other icon buttons.
  - `MobileNav`: the toggle is a square 32px icon button with the shared pressed state.
  - `CommandPalette` (React and Astro): ~44px rows with a muted 12px subtitle, a leading type-icon tile (`icon` takes an icon name; React still accepts a node), matched text highlighted by default (`highlightMatches={false}` to opt out), and `recentKey` to list recently chosen items under "Recent" on an empty query. Astro clears `aria-activedescendant` when nothing matches. Both share `findTextMatch` (`@var-ui/core/shared/textMatch`).
  - `Menu` (React and Astro): items take `icon` (and `swatch` in React, matching Astro); a section with `layout: 'row'` renders compact icon items side by side (arrow left/right move along it in Astro). Section labels are quiet 12px text and long menus scroll inside a capped height.
  - `@var-ui/icons`: new `page`, `component` and `palette` glyphs (and icon names in core).
  - `@var-ui/docs`: the mobile drawer opens from the end side (where the hamburger is) with the brand in its header; the header selection moves when navigation starts, not after the swap; the Appearance trigger shows the theme as a colour bar under the mode glyph instead of a badge dot, with Mode as a 3-icon row; search results get type icons, subtitles and recents; the mobile bar uses one 8px rhythm.

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header round 3: menu keyboard model, palette states, drawer footer, stronger selection.
  
  - **core** `topNav`: hover is a 5% ink wash, visible on a white bar (the neutral surface step all but vanished in light mode).
  - **core** new `@var-ui/core/shared/menuNavigation` (`menuArrowTarget`): the arrow-key model for menus with `layout: 'row'` sections, shared by React and Astro.
  - **core** `menu`: list rows share one 36px rhythm; row-section items keep their 32px segments.
  - **core** `segmentedControl`: unselected segments a step quieter than `text.secondary`; the light thumb gets a `border.default` hairline, the dark thumb is clearly lighter than the track with a lit top edge (new `indicatorHighlight` var).
  - **core** `searchInput` (`command`): the hairline goes transparent while focused, so the focus ring is the only outline.
  - **core** `commandPalette`: new `emptyIcon`, `emptyTitle`, `emptyHint` and `cancel` slots; the footer hides while the list is empty (`data-empty` on `frame`) and on touch-first devices, where `cancel` shows instead. Matches use one treatment in titles and subtitles (accent ink, no chip).
  - **core** `mobileNav`: new `footer` slot, pinned under the scrolling body.
  - **react / astro** `Menu`: in a `layout: 'row'` section ArrowLeft/Right wrap within the row and ArrowUp/Down treat the row as one stop (entering on the checked item); picking a row item keeps the menu open. `CommandPalette`: the empty state echoes the query (`No results for “…”`) with an optional `emptyHint`, a `cancelLabel` button for touch, and Recent items name their group in the subtitle. `MobileNav`: `footer` prop (React) / `footer` slot (Astro).
  - **docs** `DocsMobileMenu`: a divider between the site sections and the page tree; Preferences are pinned in the drawer footer. `DocsSearch`: an `emptyHint` suggestion. `DocsAppearanceMenu`: the theme cue is a ringed swatch dot at the glyph's corner instead of an underline bar.

- [#204](https://github.com/phthalo-dev/var-ui/pull/204) [`6c3482d`](https://github.com/phthalo-dev/var-ui/commit/6c3482db9fd93768a355a9fc8c834359d37c2473) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header polish, round 5:
  
  - `Menu` sections take `closeOnSelect` (React and Astro). Set it to `false` to keep the menu open on a pick, as `layout: 'row'` sections already do. The docs Appearance menu now stays open on a Theme pick too.
  - `SegmentedControl` takes `fullWidth` (React and Astro): it fills its container and gives every segment an equal share. `FrameworkSwitcher` passes it through.
  - `SideNav.Section` / `SideNavSection` takes `selectionStyle: 'fill' | 'text'`. With `'text'`, the current item shows accent text only, with no fill and no bar. The docs drawer uses it for the site sections, so the current page row is the only filled row.
  - Icons: the brand mark has a 16px optical size, `varUiMarkSmall` / `varUiMarkSmallSvg` (16 grid, 2px strokes on whole pixels). `varUiFaviconSvg` now uses it.
  - Command palette: one match highlight style (accent ink at the line's own weight) for titles and descriptions. Ranking now puts word starts above camelCase humps and description starts above mid-description hits, and adds one-typo title matching for queries of 4+ characters when nothing matches as typed.
  - Top nav: the light hover chip comes from the neutral hover step plus a touch of ink, so it keeps the palette's hue.
  - Docs kit: one 24px gap after the brand at every width, and the drawer's brand, links and preferences share one 16px inset.
  - Docs kit: the bar shows the `var(--ui)` lockup from `lg` up (the tile alone below), and the search trigger reads "Search…" (accessible name "Search docs") so the tablet-width bar fits without overflowing. `DocsSearch` gains `triggerPlaceholder` and `label`.

- [#204](https://github.com/phthalo-dev/var-ui/pull/204) [`6c3482d`](https://github.com/phthalo-dev/var-ui/commit/6c3482db9fd93768a355a9fc8c834359d37c2473) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header polish, round 6:
  
  - Breakpoints: `typestyles.breakpoint(name, 'max')` and `media(name, 'max', …)` now emit an exclusive range query (`(width < 48rem)`), so "below md" and "md and up" no longer both match at exactly 768px. `AppShell` / `Layout` mobile queries follow. Calling `breakpoint(name)` without a feature now means `'min'` (it used to emit an invalid `@media (48rem)`). This works around phthalo-dev/typestyles#345.
  - Button: neutral `ghost` buttons hover in the same warm chip as the top nav (`neutralHoverChip`), and every `ghost` button keeps its hover fill while its popup is open (`aria-expanded="true"`). New recipe var: `--var-ui-button-ghosthover`.
  - Command palette: the active row keeps body ink (`resultSelectedForeground` defaults to `text.primary`), so the accent match highlight stays visible in it.
  - Command palette ranking: a mid-word title or keyword hit (`sel` in Carousel) ranks below description word starts; keywords match at word starts. One-typo ties prefer the longer correctly typed prefix (`inpt` → Input* above Installation).
  - Command palette items take `headings` (React and Astro): section headings searched below the title and description prefix. When a heading is the match, it is shown as the subtitle.
  - Docs kit: `DocsPage` / `DocsMarketingPage` take a `drawerBrand` slot (falls back to `brand`) for the drawer header. Guide frontmatter takes `keywords`. The drawer's divider under the site sections is full-bleed.
  - core: `syntaxCodeTokens(light?, dark?)` builds mode-aware `color.code` tokens from two syntax faces. The Forest and Classic System docs themes use it, so their wordmark and code colours no longer stay light-mode on dark surfaces.

- [#174](https://github.com/phthalo-dev/var-ui/pull/174) [`d3b7295`](https://github.com/phthalo-dev/var-ui/commit/d3b72952bba9454117dad9adf78a19876e3f1327) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `CopyButton` to `@var-ui/astro`, closing the React/Astro parity gap. Static pages can render a copyable one-liner (install command, API key, share link) without hydrating a React island: the component renders the same `copyButton` recipe markup and labels as React (`value`, `timeout`, `copyLabel`, `copiedLabel`, `errorLabel`) and copies via a small progressive-enhancement script that reuses the `codeBlockCopy` clipboard logic. The render-prop `children` chrome remains React-only. The CLI patch republishes the docs catalog with the new component.

- [#202](https://github.com/phthalo-dev/var-ui/pull/202) [`f923338`](https://github.com/phthalo-dev/var-ui/commit/f9233389382488f3cc54088b0e3d711e30bcb6ce) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - CommandPalette ranks results by relevance in React and Astro: exact title, then title prefix, title word-start, title substring, keyword and description matches. Groups are ordered by their best hit and the top hit is active. A description-only match shows the highlighted snippet around it in the subtitle. On touch-first devices no row is pre-highlighted while the query is empty. The shared helpers live in `@var-ui/core/shared/commandSearch` and `@var-ui/core/shared/pointer`.

- [#176](https://github.com/phthalo-dev/var-ui/pull/176) [`c4e28d0`](https://github.com/phthalo-dev/var-ui/commit/c4e28d09a6f9124b9af3fbae100e3c0e9afe1c13) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Marketing-grade primitives and fixes:
  
  - Tokens: fluid `fontSize.display.{sm,md,lg}`, `letterSpacing.display`, `fontWeight.light`; `size.control.xl` is now `3rem`.
  - `Heading`: `size` replaces `display` with `display-sm` / `display-md` / `display-lg`, adds a `weight` axis, and balances wrapping.
  - `Text`: new `mono` boolean.
  - `Button`: new `xl` size and `pill` boolean.
  - `Table`: cells center vertically and body row headers no longer pick up the base `th` fill.
  - `Slider`: never wider than its container.
  - `CodeBlock`: lighter shadow; Astro plain/terminal code is no longer double-escaped (`&quot;`).
  - `DocsMarketingPage`: `bleed` prop for edge-to-edge pages and a `footer` slot.
  - Radius scale is now `sm` 4px / `md` 6px / `lg` 12px / `xl` 16px; `Card` uses `lg` radius and `lg` padding; `SegmentedControl` uses the control radius (`md`).
  - New `color.overlay.shadow` ink token; shadows no longer tint with the (light) text color in dark mode.
  - New `xxl` (90rem) breakpoint.
  - `MobileNav` toggle declares its color vars on the `toggle` slot, so the hamburger is visible when rendered outside the popup (docs header ≤768px).
  - New `color.background.code` / `codeHeader` tokens (surface nudged toward the accent); `CodeBlock` uses them, and generated themes include them.
  - `Tabs`: the grid track shrinks (`minmax(0, 1fr)`), so wide panel content scrolls instead of overflowing.
  - `SideNav`: button items (no `href`) reset native button chrome.
  - Tone faces: filled-surface text never uses a fallback that fails 4.5:1 (falls back to near-black ink).
  - `CodeBlock`: scroll-driven right-edge fade while code overflows horizontally (new `scrollFade` var; no fade when nothing overflows or without scroll timelines).
  - Code surface tokens mix in sRGB (no hue drift toward pink on warm neutrals); light mode tints the surface rather than `subtle`.
  - New `figtreeGrotesk` font preset (Figtree body, Space Grotesk display, JetBrains Mono).
  - Type scale: `fontSize.xs` / `sm` pinned to 12px / 13px (legibility floor for captions, badges, mono labels).
  - `Calendar`: the day grid and nav buttons opt out of element base styles (table borders, `th` fill, native button chrome).
  - `Calendar`: new `marked` prop (ISO strings or date values) draws a marker dot on those days; today gets a ring; selection/hover now style the day cell itself (they targeted a child that doesn't exist); the standalone grid shrinks with narrow containers.
  - New `scrollFade` recipe: scroll-driven edge fades for any horizontal scroller (shared with `CodeBlock`'s fade via an internal helper).
  - `ChatMessage`: the 80% width cap moved from the bubble to the message content column, so short bubbles no longer wrap into a narrow column.
  - `Switch` / `Checkbox` / `Radio`: the control root is `position: relative`, so the visually-hidden native input sits on the control. It used to resolve against a distant positioned ancestor, and focusing or clicking a control inside a scroll container scrolled that ancestor (blanking an app shell).
  - `Layout` content / panel scrollers and `AppShell` main are containing blocks (`position: relative`), so absolutely positioned descendants scroll with them.
  - `CodeBlock`: new `fontSize` var (defaults to `fontSize.sm`) for the code and line numbers.
  - `atDarkMode()`: emits its two pinned-dark selectors as separate keys, so styles nested under it (`& child`) apply on both branches. Before, a nested rule also matched the host itself, which turned the whole docs page italic and bold after switching to dark mode.
  - `Checkbox` / `CheckboxGroup`: the ✓ / − indicator is `aria-hidden`, so a checked box's accessible name no longer gains a leading "✓".
  - `Code`: new `nowrap` boolean (`inlineCode` recipe `nowrap` variant) keeps a snippet such as `@var-ui/react` on one line. New Astro `Code` component with the same props.
  - `ChatMessageBubble`: the bubble is `inline-block` instead of a flex column, so inline markup (`<code>`, links, emphasis) flows with the message text instead of breaking onto its own row.
  - `@var-ui/cli`: republish the generated docs catalog for the component changes above.

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - - `@var-ui/docs`: lazy theme stylesheets (`/themes/<id>.css`) keep the cascade layer their rules were emitted in. The extract sliced from the theme class mid-`@layer tokens { … }` block, dropping the opener, so the theme's `color-scheme: light dark` became unlayered and overrode the `data-color-mode` pin: Light/Dark did nothing on every non-default theme. The plain theme rule also matches `:root.theme-<id>` so its tokens beat the base `:root` tokens in that layer whatever order the stylesheets load in, and its redundant `color-scheme` is dropped (base styles set it for every theme class).
  - `MobileNav`: the close button has a 32px control-sized box and sizes its icon (core), and the Astro `MobileNav` now renders the close icon (it rendered an empty 8px button).

## 0.3.3

### Patch Changes

- [#151](https://github.com/phthalo-dev/var-ui/pull/151) [`79c5191`](https://github.com/phthalo-dev/var-ui/commit/79c5191b5fc3b8f926c05dc7b6f328bfdd49152c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `var-ui component <Name>` now shows only the component's own props by default: the inlined table lists Var UI and React Aria props, with a one-line note that the component also accepts all standard HTML attributes, and `--all-props` prints the complete inherited list (text and `--json`). Prop rows now carry their `source` so the filter is exact, and props declared in `@var-ui/core` recipe types (e.g. Badge's `tone`/`appearance`) are classified as the component's own instead of DOM attributes.

- [#149](https://github.com/phthalo-dev/var-ui/pull/149) [`3c64c92`](https://github.com/phthalo-dev/var-ui/commit/3c64c924ab887443170f7f6d20ce3ec72a3834bf) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Keep the shipped docs catalog from going stale against @var-ui/react. The generated catalog now records the @var-ui/* versions and git commit it was built from, `var-ui` warns on stderr when the installed @var-ui/react does not match the catalog, and a CI check fails when core/react/icons/astro have a pending changeset but the CLI does not, so the CLI is republished whenever the catalog changes.

## 0.3.2

### Patch Changes

- [#91](https://github.com/phthalo-dev/var-ui/pull/91) [`e723033`](https://github.com/phthalo-dev/var-ui/commit/e7230339263e85b6447111ca9456ec9622357be5) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Include `EditableText` in the bundled component catalog.

## 0.3.1

### Patch Changes

- [#65](https://github.com/phthalo-dev/var-ui/pull/65) [`aafa8c9`](https://github.com/phthalo-dev/var-ui/commit/aafa8c9e41921b5365187e4d5733900b7b57e3d7) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - AppShell can fill a parent shorter than the viewport.

- [#67](https://github.com/phthalo-dev/var-ui/pull/67) [`0dc2162`](https://github.com/phthalo-dev/var-ui/commit/0dc21629ed03b79e34d2819974730065429f9690) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add a swatch-only ColorInput appearance with a per-control accessible name.

- [#66](https://github.com/phthalo-dev/var-ui/pull/66) [`5191648`](https://github.com/phthalo-dev/var-ui/commit/51916482ec63227e586910939e2120cc93ad79da) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add a FileTrigger so an existing button can open a file picker.

- [#64](https://github.com/phthalo-dev/var-ui/pull/64) [`6e81488`](https://github.com/phthalo-dev/var-ui/commit/6e81488264ddfd1f92a9496ba8d6bfc0a888dc62) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Keep `className` on Switch and Checkbox by merging it with the recipe class.

## 0.3.0

### Minor Changes

- [#50](https://github.com/phthalo-dev/var-ui/pull/50) [`0d76419`](https://github.com/phthalo-dev/var-ui/commit/0d764197303f96399a53f9a8cc28611be3feac68) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add the semantic tones to `Text`: `accent`, `success`, `warning`, `danger` and `info` (for example `<Text tone="danger">`), each colored with that tone's foreground token. Previously `tone` only accepted `primary` and `secondary`, so a downstream `tone="danger"` was a type error and was ignored at runtime. The axis is built from the token tone keys, so a new tone token has to be styled here. Closes [#48](https://github.com/phthalo-dev/var-ui/issues/48).

### Patch Changes

- [#51](https://github.com/phthalo-dev/var-ui/pull/51) [`ed40135`](https://github.com/phthalo-dev/var-ui/commit/ed4013573234c74db03efb22b2ae1b6dced431d2) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `Button` accepts a `ref` and forwards it to the underlying `<button>`, so callers can return focus to the trigger. Closes [#49](https://github.com/phthalo-dev/var-ui/issues/49).

- [#46](https://github.com/phthalo-dev/var-ui/pull/46) [`4ae01ee`](https://github.com/phthalo-dev/var-ui/commit/4ae01ee3fc7847c3ec4c2976ccfed4369ffd1436) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Build against `@types/react` 19 (matching the React 19 peer dependency; it was 18). The CLI's component catalog is regenerated from the new types.

## 0.2.1

### Patch Changes

- [#31](https://github.com/phthalo-dev/var-ui/pull/31) [`2a43136`](https://github.com/phthalo-dev/var-ui/commit/2a4313660b8856e39921dfa258fd7bb20fff4d7e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Point the repository metadata at the phthalo-dev GitHub organization.

## 0.2.0

### Minor Changes

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

- [#20](https://github.com/var-ui/var-ui/pull/20) [`eab9dbc`](https://github.com/var-ui/var-ui/commit/eab9dbc29b3d3c5ab1e2f3b2d8f8b1a2dab9bd36) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `@var-ui/cli` for agent-readable component docs, and markdown views (`llms.txt`, sibling `.md`, DocsPage link) in `@var-ui/docs`.

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

### Patch Changes

- [#28](https://github.com/var-ui/var-ui/pull/28) [`eba04de`](https://github.com/var-ui/var-ui/commit/eba04deacd4f6e6210cedc91c32f9293e2613543) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Trim the `@var-ui/core` public entry down to recipes, tokens, and theme helpers. Variant props come from the TypeStyles recipes, and package subpaths only list real components.

  ### Breaking (@var-ui/core)
  - The `types` re-export barrel is gone. `DesignTheme*` and `OverrideConfigFor` stay on the theme entry. TypeStyles passthroughs (`OverrideConfig`, `SlotOverrideConfig`, `CreateTokenValues`, `colorModes`, `conditional`, and the rest) are no longer re-exported — import them from `typestyles`.
  - Hand-written recipe aliases are gone (`*RecipeProps`, `DrawerSize`, `TimelineSize`, `AvatarSize`, `AvatarStatusTone`, `ToastPlacement`, `ScrollAreaFade`, `ScrollAreaOrientation`, `SpinnerAppearance`, `ProgressBarAppearance`, `StatusDotAppearance`). Use `RecipeVariants<typeof recipe>`, plus `ControlSize`, `Size`, `FillAppearance`, and the `placement` axis.
  - Example recipes `layoutUtility`, `text`, and `namedContainerQuery` are removed, including the `ds-layout`, `ds-text`, and `ds-named-cq-*` classes.
  - Short subpaths such as `@var-ui/core/button` are removed. Import from `@var-ui/core` or `@var-ui/core/components/button`. Authoring helpers (`controlSize`, `controlFocus`, `fieldChrome`, `layoutShellVars`, `breakpoints`) are not entry points.
  - `@var-ui/core/internal` is removed. Overlay motion is `@var-ui/core/shared/overlayMotion`. Shared tone and variant axes are `@var-ui/core/shared/semanticTone` and `@var-ui/core/shared/variantAxes`.
  - Hex and HSV converters are no longer exported from core.

  ### Breaking (@var-ui/react)
  - The `layout` and `text` style helpers are removed. Use `Stack`, `Text`, and `Heading`.
  - `DrawerSize`, `TimelineSize`, `AvatarSize`, and `AvatarStatusTone` are no longer re-exported. `ToastPlacement` remains and is derived from the shared `placement` axis.

  ### Patch (@var-ui/cli)
  - The published catalog matches the trimmed core exports.

- [#22](https://github.com/var-ui/var-ui/pull/22) [`22802d5`](https://github.com/var-ui/var-ui/commit/22802d58b57ec40b7c8caea3811a210947d546a3) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Publish `@var-ui/core/styles.css` so apps can skip TypeStyles extract setup. `var-ui init` tells agents to import that file.

- [#27](https://github.com/var-ui/var-ui/pull/27) [`58b7b23`](https://github.com/var-ui/var-ui/commit/58b7b23682f0526ce23e8ec763849146ece3049e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - ### Breaking (@var-ui/core)

  - The unused **`typeahead`** recipe is removed (the React `Typeahead` component is unchanged — it composes `Combobox`).
  - The **`themeableVars`** helper and its subpath export are removed; recipe var-definition metadata comes from TypeStyles itself.
  - No-op single-option axes are gone: `layoutHeader`/`layoutFooter` no longer declare a `chrome` variant, and the shared `containerAppearance` axis is removed (so `chatComposer`/`chatLayout` no longer take it).

  ### Additions (@var-ui/core)
  - Every variant-bearing recipe exports a **`XxxVariantProps`** type (`RecipeVariants<typeof recipe>`), so consumers derive variant unions instead of restating literals.
  - Shared axes (`controlSize`, `density`, `gap`, `orientation`, `fillAppearance`, `sender`, `placement`, `paneVariant`) are declared once and reused, keeping option names and defaults identical wherever a concept recurs.

  ### Breaking-ish (@var-ui/react, @var-ui/astro)
  - Public prop unions are now derived from the recipes, so a few hand-written unions widened to the recipe's full option set: `Pagination.size` (`'sm' | 'md' | 'lg'`), `Text.size` (adds `'xs'`), `Heading.size` (`'display'`), `ChatMessageBubble.group` (adds `'none'`), `ScrollArea.fade`, and `Thumbnail.size`. `Alert.variant`/`CommandPalette.isOpen`/`ColorPicker.swatchesPerRow` keep their public names.

  ### Additions (@var-ui/react)
  - **`Combobox.Root`**, **`Select`**/**`Select.Root`**, and **`InputGroup`** accept **`size`** (`'sm' | 'md' | 'lg'`, default `'md'`) and pass it down to their compound parts; **`NumberInput`** gains **`size`** as well.
  - **`ColorModeToggle`** and **`Typeahead`** inherit the same size axis through their composed controls.

  ### Fixes (@var-ui/astro)
  - **`Heading`** accepts an optional **`id`**, forwarded to the heading element, so owning sections can use `aria-labelledby`.
  - `LayoutContent.role` / `LayoutPanel.role` are typed as the DOM ARIA role union and `Link.referrerpolicy` as the anchor's attribute union; both were loose `string`s that did not type-check against the rendered element.
  - `Toc` no longer passes a nonexistent `hideBelow` selection to the recipe (the rail has always hidden itself below `xl` in CSS, so markup is unchanged).

  ### Fixes (@var-ui/docs)
  - `astro check` clean: the kit declares `App.Locals.varDocsRoute` itself, allows `.ts` import specifiers like Astro's presets, and `CodeBlockLayout` no longer passes an invalid `{}` part to `combine()`.

  ### Tooling
  - `astro check` now covers every package that ships `.astro` files (`@var-ui/astro`, `@var-ui/docs`, `@var-ui/docs-components`, `@var-ui/docs-site`) and runs in `vp run ci`; `vp run astro:check` runs them all locally. Previously only the example app's own pages were checked, so library frontmatter was never type-checked.
