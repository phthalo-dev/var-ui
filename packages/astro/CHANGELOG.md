# @var-ui/astro

## 0.14.0

### Minor Changes

- [#275](https://github.com/phthalo-dev/var-ui/pull/275) [`d166a77`](https://github.com/phthalo-dev/var-ui/commit/d166a77b6f9b6eda8b3844fdc24d04eea784c2dc) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `Card` gaps from real apps:
  
  - **react** `onClick` makes a div card pressable. The title renders as a `<button>` whose `::after` covers the card: button semantics, focus and Enter/Space, the title as its accessible name, and no block content inside a button. Inner links and buttons stay clickable.
  - **react, astro** Every card takes `description`, and `titleEnd` (Astro: the `title-end` slot) for a badge at the end of the title row. React link cards accept a node `title`.
  - **core** `card` recipe: new `header`, `titleEnd`, `description` and `action` slots and the `data-pressable` root state. A div card with no children no longer renders an empty body, which added a stray gap.

- [#279](https://github.com/phthalo-dev/var-ui/pull/279) [`2473fcb`](https://github.com/phthalo-dev/var-ui/commit/2473fcb9fb2dbe94cae5d2263a7a9eaa0dd0b8c6) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Named colors for identity, not status:
  
  - **Badge and StatusDot `color`** takes any name from the base palette: `blue`, `red`, `violet`, `teal`, `sage`, `stone` and the rest of the 40 families. It sets the hue instead of `tone`, in every appearance. `none` (the default) leaves `tone` in charge. `<Badge color="violet">Reviewer</Badge>`.
  - **Tokens:** `color.hue.<name>` for every palette family, mode-aware: step 7 in light mode (≥ 5.5:1 on surface and subtle) and step 4 in dark mode (≥ 8:1), so each works as badge text, an outline and a fill.
  - `color.categorical.1`–`8` lists eight of them in chart series order (blue, orange, teal, pink, grass, violet, amber, red). Chart chrome: `color.chart.axis`, `gridline` and `plot`.

- [#295](https://github.com/phthalo-dev/var-ui/pull/295) [`974ba64`](https://github.com/phthalo-dev/var-ui/commit/974ba64b504eed4bcb5fb664b5ad3c64bde2c559) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every `data-*` attribute a component renders is now either public (documented) or internal (`data-var-ui-*`). There is no undocumented middle ground any more.
  
  - **Public**: recipe variant axes and every attribute the recipes select on, including root flags set on an ancestor of a slot (AppShell `data-aside`, Layout `data-has-header`, …) and markers inside a slot (Calendar `data-calendar-mark`). They are listed in each component's Styling hooks table. Newly documented in the Plain CSS guide: `data-valid`, `data-dirty`, `data-touched` (Field), `data-has-children` (Tree items), `data-row-header` (Table), `data-trigger` (react-aria popups), `data-language` (code block).
  - **Renamed to `data-var-ui-*`** (script wiring and config, not a styling API): the Astro script attributes for Accordion, Banner, ColorModeToggle, CommandPalette, CopyButton, Menu, SegmentedControl, SideNav, Toast, Toc, the shared copy vocabulary (`data-var-ui-code`, `data-var-ui-copy-label`, `data-var-ui-copied-label`, `data-var-ui-error-label`, `data-var-ui-timeout`, `data-var-ui-value`) and the `data-class-*` payloads (now `data-var-ui-class-*`); React's Carousel, Menubar, ToggleGroup, Splitter, Tree, context-menu, icon-fallback and popover markers; TopNav's `data-label` (now `data-var-ui-label`).
  - **Removed** (each part already has a slot class): `data-codeblock`, `data-codeblock-header`, `-body`, `-pre`, `data-alert-action`, `data-empty-state-icon`, `data-loading-overlay-content`, `data-timeline`, `data-timeline-item`, ScrollArea `data-edge`, AppShell `data-has-top-nav`. Select `.var-ui-code-block`, `.var-ui-code-block__body`, `.var-ui-alert__actionLink` and so on instead.

- [#238](https://github.com/phthalo-dev/var-ui/pull/238) [`e97729d`](https://github.com/phthalo-dev/var-ui/commit/e97729de25f8d93d88a373708ef5efabd11bc2db) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `prose` gains an opt-out, and the docs-only prose recipe moves out of core.
  
  - **`data-not-prose`** (`NOT_PROSE_ATTRIBUTE`): prose element styles skip the marked element and everything inside it (a live demo, an embedded widget), while the element still takes part in the vertical flow. **`proseRules()`** scopes your own element rules the same way when you extend prose.
  - **`proseContent` is removed from `@var-ui/core`** (class `docs-prose`). It was the docs site's reading style, and it sat in the `utilities` layer, so it overrode component styles and needed `data-prose-isolate` to keep out of demos. `@var-ui/docs` now has `docsProse` (in `@var-ui/docs/styles`), which sets `prose`'s vars to the docs ramp and adds the docs extras. It lives in the `base` layer, so components inside win. `data-prose-isolate` is replaced by `data-not-prose`.
  - `prose` no longer gives inline children of list items and blockquotes (`code`, badges) a bottom margin; only block children are spaced.
  - `Table` sets `display: table` on its `<table>`, so it keeps its layout inside `Prose` (which makes bare tables scrollable blocks).

- [#233](https://github.com/phthalo-dev/var-ui/pull/233) [`8af0092`](https://github.com/phthalo-dev/var-ui/commit/8af0092b83f602a5de6843ece7f91eea7f2c6844) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `CodeBlock` and `CopyButton` share one set of copy props and events.
  
  - **`CodeBlock`** (React and Astro): `copyErrorLabel` is now `errorLabel`, matching `CopyButton`. `copyText` and `errorText` are removed: the copy button is icon-only, so `copyLabel` / `copiedLabel` / `errorLabel` (its accessible name in each state) are the only labels. A copy failure shows the error icon, as `CopyButton` does.
  - **React `CodeBlock`** gains `onCopied(value)` and `onCopyError(error, value)` and is built on `useCopy`. It resets after 2 seconds like `CopyButton` (it was 1.2s). The status region now announces success as well as failure; success is screen-reader-only.
  - **Astro**: `CodeBlock` fires the same events as `CopyButton`, renamed to `var-ui:copied` / `var-ui:copy-error` (`COPIED_EVENT` / `COPY_ERROR_EVENT`; previously `COPY_BUTTON_COPIED_EVENT` / `COPY_BUTTON_ERROR_EVENT`), and honours `data-var-ui-timeout`. The hand-written markup contract uses `data-var-ui-error-label` (was `data-copy-error-label`) and drops the `[data-codeblock-copy-text]` span.
  - **`CopyButton`**'s default `errorLabel` is now `Copy failed` (was `Error`), and `useCopy` clears `error` after the timeout, as it already did for `copied`.

- [#261](https://github.com/phthalo-dev/var-ui/pull/261) [`c3313b6`](https://github.com/phthalo-dev/var-ui/commit/c3313b64c8fcf24c5a85f7e9e453c70ceacc159f) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Collapsible `SideNav` sections can be controlled and remembered.
  
  - **react** `SideNav.Section` takes `open` / `onOpenChange` (controlled). A parent that ignores the change keeps the section as it is.
  - **react, astro** `SideNav persistKey` remembers which collapsible sections the reader opened or closed, in `localStorage`. Sections are keyed by `id`, or else their title. The section holding the current page always starts open. Astro `SideNav` also initializes navs swapped in by the client router (`astro:page-load`).
  - **core** `persistDisclosures(root, key)` (`@var-ui/core/shared/disclosureState`) is the framework-agnostic helper behind both.
  - **docs** The sidebar uses `persistKey`. The custom `docsSidebarState` script is removed.

- [#278](https://github.com/phthalo-dev/var-ui/pull/278) [`a8ce869`](https://github.com/phthalo-dev/var-ui/commit/a8ce8697018d50b36fc720432e656ea122177fa7) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Astro `Tabs`: the list and panels can live in different layout regions. The controller finds a tab's panel by `aria-controls` anywhere in the document, `Tabs` takes `id` and `panels={false}` (list only), and the new `TabPanel` (`tabs`, `value`, `selected`) renders a panel anywhere. Tab and panel ids are scoped by the `Tabs` id (`<id>-tab-<value>`), fixing collisions between two tab sets with the same values on one page. Arrow keys follow the reading direction (RTL), and navs swapped in by the client router initialize.

- [#258](https://github.com/phthalo-dev/var-ui/pull/258) [`c0da8e5`](https://github.com/phthalo-dev/var-ui/commit/c0da8e5bece67e75e333ac97e964f7c0f6ddc984) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Toasts fit around app chrome.
  
  - **core** `toast` recipe (its screen-edge axis export is now `toastPlacement`, was `placement`): `top-center` and `bottom-center` placements, and `offsetBlock` / `offsetInline` vars (`--var-ui-toast-offsetblock` / `--var-ui-toast-offsetinline`) that move the region off its edges. They use TypeStyles' `inheritOverride`, so a value set on `:root` reaches the region, for example above a bottom player bar. Also fixes the region's `max-width`, which was a single-quoted string with an uninterpolated `${…}` and so was never applied.
  - **react** `ToastProvider` and `ToastRegion` take `offset` (a length, or `{ block, inline }`). `ToastProvider` also takes `className`, `style` and an existing `queue`, which keeps its own limit unless `maxVisibleToasts` is passed. New `createToaster(queue)` returns the imperative `toast` API bound to a queue you own, for apps that render their own `ToastRegion`.
  - **astro** `ToastRegion` takes `offset` with the same shape. `Grid`, `Text` and `AspectRatio` use the shared `mergeInlineStyle` helper instead of their own copies, so a `style` object no longer loses to the component's own vars.

- [#232](https://github.com/phthalo-dev/var-ui/pull/232) [`01f82e4`](https://github.com/phthalo-dev/var-ui/commit/01f82e41063527985fd1eedb327de667c64a909b) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `Button` and `IconButton` take `size="xs"`, a 20px button for dense rows, tags and code-block headers. An invisible layer grows its pointer target to 24px (WCAG 2.2 target size) without changing layout. New `size.icon.xs` token (12px) and `Icon size="xs"`. `xs` is button-only: text inputs and selects keep the `sm`–`lg` control scale.

### Patch Changes

- [#273](https://github.com/phthalo-dev/var-ui/pull/273) [`70443fb`](https://github.com/phthalo-dev/var-ui/commit/70443fbaa5f1bebdee7c73f9062444f70d1092e7) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - New `codeBlockMarkup({ code, language, filename, copyable, … })` in core: the structure of a code block (header, language label, copy button, body, `pre`, `code`) as plain attribute maps. The React and Astro `CodeBlock`s and the docs Shiki transformer all render from it, so they can't drift. They had: markdown fences put the language in the filename slot, showed a visible "Copy" label, and used `data-copy-error-label`, which the copy script never read. The root also carries `data-language`.
  
  **Fix (react):** a `CodeBlock` without highlighted HTML double-escaped its code, so `<div>` showed as `&lt;div&gt;`.

- [#277](https://github.com/phthalo-dev/var-ui/pull/277) [`5aded0c`](https://github.com/phthalo-dev/var-ui/commit/5aded0cbdc139372b4cc6e0760c41f3e4b4c3ca6) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - CommandPalette closes when a result is clicked, not only on Enter. With view transitions the palette can live in a persisted element (as on the docs site), so navigating left it open. Modifier clicks (open in a new tab) keep it open.

- [#260](https://github.com/phthalo-dev/var-ui/pull/260) [`0a7c3b0`](https://github.com/phthalo-dev/var-ui/commit/0a7c3b07a997a2d8298c6cb03149c045c01dec60) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `Grid`'s responsive `columns` map (`{ base: 2, md: 3 }`) works with extracted CSS and SSR. In Astro it silently stayed one column, because the old `gridColumnsStyle()` built a runtime-hashed class that never reached the build-time stylesheet. The `grid` recipe's `fixed` variant is now static CSS that reads per-breakpoint track vars (`columns.base` … `columns.xl` recipe vars with TypeStyles' `inheritOverride`, so an unset breakpoint stays unset). Each breakpoint falls back to the nearest smaller one that is set, and before the first set one to the `auto` template. The components set those variables inline.
  
  **Breaking (core):** `gridColumnsStyle` is replaced by `gridColumnsVars(counts)`, which returns the inline vars to pair with `grid({ columns: 'fixed' })`.

- [#254](https://github.com/phthalo-dev/var-ui/pull/254) [`f066000`](https://github.com/phthalo-dev/var-ui/commit/f066000932f40cb1bfffc5e3d4cc7cc70d6cd121) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every published package now ships its `CHANGELOG.md`. A new **Upgrading** guide (`/docs/upgrading`) covers the 0.6 → 0.13 breaks: platform prop names, `filled` → `solid`, native overlays, space tokens and removed exports. The core README lists `typestyles` as the one TypeStyles export (no root `recipe`/`style`), and the React README no longer describes the package as React Aria wrappers. `IconButton` warns once in development when it renders without an `icon` (any cause, including the pre-0.7 `name="close"`).

## 0.13.0

### Minor Changes

- [#223](https://github.com/phthalo-dev/var-ui/pull/223) [`b6a3775`](https://github.com/phthalo-dev/var-ui/commit/b6a37759ed1ac65691daa21f7bf52da6e52431b0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Data-driven icons for SegmentedControl options and Astro menu items ([#182](https://github.com/phthalo-dev/var-ui/issues/182)).
  
  - **astro** `SegmentedControl` options take `icon` (a registry name or `{ svg }` markup). Menu items' `icon` also accepts `{ svg }`. New `AstroIcon` type and `iconMarkup()`; an unknown icon name now throws at render instead of rendering nothing. Astro named slots can't be generated inside a `map`, so per-option content now travels with the data. `ColorModeToggle` is built on it.
  - **react** `SegmentedControl` options take `icon` (registry name or node), the same shape as Astro.
  - In both, with `layout="icon"` only the icon shows and a string `label` becomes the segment's accessible name, so icon-only options no longer need a separate `aria-label`.
  - **docs-components** `FrameworkSwitcher` uses option icons instead of one slot per framework.

- [#214](https://github.com/phthalo-dev/var-ui/pull/214) [`18beb11`](https://github.com/phthalo-dev/var-ui/commit/18beb11b23819ecc2db804365bfed954f0ccb0d7) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - New `Prose` for rendered markdown in app UI ([#147](https://github.com/phthalo-dev/var-ui/issues/147)).
  
  - **core** `prose` recipe: styles the bare elements a markdown renderer emits (headings, paragraphs, lists, links, inline and fenced code, blockquotes, tables, rules), relative to the inherited font size. `density` (`compact | balanced | spacious`) sets the rhythm and heading scale. Element rules sit in the `base` cascade layer, so Var UI components inside keep their own styles. `inlineCode` is now `0.875em` instead of a fixed `xs`, so `Code` scales with its text.
  - **react** `Prose` and `proseComponents`, an element map for react-markdown / MDX: fenced code → `CodeBlock` (language from `language-*`), inline code → `Code`, links → `Link`, GFM tables → `Table` parts with column alignment.
  - **astro** `Prose`.

- [#219](https://github.com/phthalo-dev/var-ui/pull/219) [`df329e0`](https://github.com/phthalo-dev/var-ui/commit/df329e092e4b0313efb9aa4748daacf2d6bd7a05) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - SPA colour-mode setup and a runtime token list ([#148](https://github.com/phthalo-dev/var-ui/issues/148)).
  
  - **core** One colour-mode init script for every setup: `getColorModeInitScript` (`@var-ui/core/color-mode-script`, also from the root). New Vite plugin `varUiColorMode` (`@var-ui/core/vite`) injects it first in `index.html`, so SPAs get no flash on reload without server rendering. New `listDesignTokens()` returns every built-in token's path, CSS variable, `var()` ref and default value (`designTokens` is a proxy with no enumerable keys).
  - **react** `getColorModeInitScript` is the core implementation (same signature).
  - **astro** `ThemeScript` renders the core script and takes `defaultColorMode`; across view transitions it copies the resolved theme class and mode onto the incoming page. Removed `applyThemeBoot`, `bootTheme` and `watchThemeOnNavigation`: an unused copy of the boot logic that ran too late (a module script) to prevent a flash. Use `ThemeScript`.

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

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - App header, round 2.
  
  - `TopNav`: the selected item's fill is one pill that slides between items (`observeTopNavIndicator` in `@var-ui/core/components/indicators/top-nav`; React and Astro start it for you). Whatever moves `data-selected` moves the pill; it only animates after first placement and follows the duration tokens, so reduced motion turns it off. Dark hover is quieter than the selected pill, the dark selected tint is stronger, and items and menu triggers share the button's pressed nudge. The bar hairline uses `border.default` in light mode.
  - `SegmentedControl`: the thumb uses the same sliding-indicator engine (`indicators/sliding`) and no longer animates in from the left edge on first paint.
  - `SearchInput` (`variant="command"`): filled tray with a hairline, the same chrome as a `SegmentedControl` track; the ⌘K key cap sits one step above the field so it stays visible on hover in dark mode. Collapsed, the icon brightens on hover like the bar's other icon buttons.
  - `MobileNav`: the toggle is a square 32px icon button with the shared pressed state.
  - `CommandPalette` (React and Astro): ~44px rows with a muted 12px subtitle, a leading type-icon tile (`icon` takes an icon name; React still accepts a node), matched text highlighted by default (`highlightMatches={false}` to opt out), and `recentKey` to list recently chosen items under "Recent" on an empty query. Astro clears `aria-activedescendant` when nothing matches. Both share `findTextMatch` (`@var-ui/core/shared/textMatch`).
  - `Menu` (React and Astro): items take `icon` (and `swatch` in React, matching Astro); a section with `layout: 'row'` renders compact icon items side by side (arrow left/right move along it in Astro). Section labels are quiet 12px text and long menus scroll inside a capped height.
  - `@var-ui/icons`: new `page`, `component` and `palette` glyphs (and icon names in core).
  - `@var-ui/docs`: the mobile drawer opens from the end side (where the hamburger is) with the brand in its header; the header selection moves when navigation starts, not after the swap; the Appearance trigger shows the theme as a colour bar under the mode glyph instead of a badge dot, with Mode as a 3-icon row; search results get type icons, subtitles and recents; the mobile bar uses one 8px rhythm.

- [#174](https://github.com/phthalo-dev/var-ui/pull/174) [`d3b7295`](https://github.com/phthalo-dev/var-ui/commit/d3b72952bba9454117dad9adf78a19876e3f1327) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `CopyButton` to `@var-ui/astro`, closing the React/Astro parity gap. Static pages can render a copyable one-liner (install command, API key, share link) without hydrating a React island: the component renders the same `copyButton` recipe markup and labels as React (`value`, `timeout`, `copyLabel`, `copiedLabel`, `errorLabel`) and copies via a small progressive-enhancement script that reuses the `codeBlockCopy` clipboard logic. The render-prop `children` chrome remains React-only. The CLI patch republishes the docs catalog with the new component.

- [#205](https://github.com/phthalo-dev/var-ui/pull/205) [`59d4ff2`](https://github.com/phthalo-dev/var-ui/commit/59d4ff2d15808da8f48a28bf69c9057a1d4f36fa) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - - `ColorInput` gains `format="css"`: it accepts any CSS color (`var(--brand)`, `oklch(…)`, named colors) as typed, allows an empty value, paints the swatch with it (falling back to `defaultValue`), and starts the picker from the resolved color. The `colorField` recipe has a matching `format` variant (`hex` keeps the upper-case input).
  - Text inputs in `textField` and `colorField` end long values in an ellipsis at rest.
  - `Tabs` gains `size: 'sm' | 'md'` (React and Astro; core `tabs` recipe variant) for compact rows in side panels.

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs visual design pass, built into the system:
  
  - `tabs` gains `appearance: 'underline' | 'pill'` (React and Astro `Tabs` take `appearance`); tabs lay out an icon + label.
  - `codeBlock`: 40px header, icon-only 28px copy button (label kept for screen readers), neutral code surface, and `tabs` / `tab` slots for tabbed blocks.
  - `proseContent`: 16/26 reading type, 44/28/20 heading ramp, lead paragraph, neutral inline-code chip, quiet link underline, hairline tables.
  - `sideNav`: 32px rows, semibold active item with a 2px accent bar. `toc`: uppercase label, accent indicator.
  - `appShell`: CSS twin of `data-mobile`, so the side nav and aside hide below the mobile breakpoint on first paint.
  - Tokens: warm three-step dark surfaces (canvas / chrome / raised), warm borders and muted text, neutral code surfaces, a restrained three-hue syntax palette, a desaturated dark accent. Disabled buttons drain their hue.
  - `@var-ui/docs`: `DocsPageHeader` (eyebrow, title, lead, metadata list), `PackageInstall` (tabbed pnpm / npm / yarn / bun block), markdown fences rendered as the shared code block, demo frames as dot-grid stages, a centered content + TOC grid, a sidebar that becomes the mobile drawer, and a props-table recipe.
  - `@var-ui/docs-components`: `ComponentDocTabs` uses pill tabs with icons; the TOC lives in the `DocsPage` rail.

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs visual design, round 2:
  
  - New core `stage` recipe (`pattern: dots | grid | none`, `tone: neutral | accent`, `fade: none | start | end`): the shared showcase surface for demos, playgrounds and page heroes.
  - `proseContent` stops at `[data-prose-isolate]` subtrees (export `PROSE_ISOLATE_ATTRIBUTE`), so live demos keep their own typography. Inline code is quieter (0.875em, 1px 4px, 4px radius) and mono-only in tables and lists.
  - `codeBlock`: `codeLanguageLabel()` gives one label convention (TSX, CSS, Shell); filename and language share a 12px/500 muted style. React and Astro `CodeBlock` use it.
  - `Card` gains a full-bleed `media` slot (React `media` prop, Astro `media` slot) and an accent-edged hover lift.
  - Pill `Tabs` stay on one scrollable row with unclipped focus rings; the selected pill is a raised surface in dark mode.
  - Neutral filled controls are a softer ink / off-white; the dark-mode selected nav item has a real accent tint.
  - `@var-ui/react` re-exports `combine`, `cx` and `mergeProps`, like `@var-ui/astro`.
  - `@var-ui/docs`: `DocsPageHeader` is an accent stage band with a copyable import and one metadata row; the TOC rail keeps its column on every tab; `guideEntryExists()` (`@var-ui/docs/guide-entry`) lets routes 404 before rendering; the props-table recipe stacks into cards below 640px.

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

- [#212](https://github.com/phthalo-dev/var-ui/pull/212) [`fd1bb25`](https://github.com/phthalo-dev/var-ui/commit/fd1bb2598248ec88120ae5767133c7106ccc5e36) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Small API gaps and naming alignment ([#146](https://github.com/phthalo-dev/var-ui/issues/146)).
  
  - **One appearance vocabulary.** `button`'s `filled` appearance is now `solid`, matching badge, alert, chip, toast, banner, progress and meter. `chatMessageBubble`'s `variant` axis is now `appearance` (`solid | subtle | ghost`; React `ChatMessageBubble` prop `variant` → `appearance`). Theme overrides keyed on `appearance.filled` move to `appearance.solid`; plain CSS selectors move to `[data-appearance="solid"]`.
  - **New `UnstyledButton`** (core `unstyledButton`, React, Astro): a native `<button>` without chrome that keeps the cursor, focus ring and disabled state, for inline toggles and custom pressable regions.
  - **Link** (core, React, Astro): `link` is now a recipe with `root` and `icon` slots. New `tone` (`accent | primary | secondary`) and `size` (`inherit | xs | sm | md | lg`). A link now inherits the surrounding font size by default (was a fixed `md`). React adds `startIcon` / `endIcon`; Astro adds `start-icon` / `end-icon` slots. Disabled links get the disabled style.
  - **ProgressBar** (core, React, Astro): new `size` (`sm | md | lg`, the same track steps as `Meter`; `md` is 0.5rem, was 0.375rem). `minValue` / `maxValue` are now `min` / `max`, like `Meter` and `ProgressCircle`. Astro gains `valueLabel`.
  - **ProgressBar and Meter** show value text by default only when there is a `label`, so a bare bar needs just an `aria-label`.
  - **CopyButton**: `onCopied(value)` and `onCopyError(error, value)` (React; also on `useCopy`). Astro dispatches bubbling `var-ui:copy-button-copied` / `var-ui:copy-button-error` events (`COPY_BUTTON_COPIED_EVENT`, `COPY_BUTTON_ERROR_EVENT`) and exports `initCopyButton(s)`.
  - **Types**: `TabDefinition`, `GridColumns`, `PaginationLabels`, `ButtonAsButtonProps`, `ButtonAsLinkProps`, the `Combobox` part props and the `Select` section/header props are exported from `@var-ui/react`. A test now fails when a component module exports a type the package root doesn't.

### Patch Changes

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

- [#202](https://github.com/phthalo-dev/var-ui/pull/202) [`f923338`](https://github.com/phthalo-dev/var-ui/commit/f9233389382488f3cc54088b0e3d711e30bcb6ce) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - CommandPalette ranks results by relevance in React and Astro: exact title, then title prefix, title word-start, title substring, keyword and description matches. Groups are ordered by their best hit and the top hit is active. A description-only match shows the highlighted snippet around it in the subtitle. On touch-first devices no row is pre-highlighted while the query is empty. The shared helpers live in `@var-ui/core/shared/commandSearch` and `@var-ui/core/shared/pointer`.

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - - `@var-ui/docs`: lazy theme stylesheets (`/themes/<id>.css`) keep the cascade layer their rules were emitted in. The extract sliced from the theme class mid-`@layer tokens { … }` block, dropping the opener, so the theme's `color-scheme: light dark` became unlayered and overrode the `data-color-mode` pin: Light/Dark did nothing on every non-default theme. The plain theme rule also matches `:root.theme-<id>` so its tokens beat the base `:root` tokens in that layer whatever order the stylesheets load in, and its redundant `color-scheme` is dropped (base styles set it for every theme class).
  - `MobileNav`: the close button has a 32px control-sized box and sizes its icon (core), and the Astro `MobileNav` now renders the close icon (it rendered an empty 8px button).

## 0.8.0

### Minor Changes

- [#159](https://github.com/phthalo-dev/var-ui/pull/159) [`167a67b`](https://github.com/phthalo-dev/var-ui/commit/167a67bca37aa1f34071d16663cfc63e80034610) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - The Astro `CodeBlock` paints unified-diff lines in `variant="diff"` and gains a `maxHeight` prop that caps the body height with internal scrolling.

- [#157](https://github.com/phthalo-dev/var-ui/pull/157) [`0a53eac`](https://github.com/phthalo-dev/var-ui/commit/0a53eacba79eecedf79f08079630eba926d8fe33) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - The Astro `Collapsible` gains a named `icon` slot rendered alongside a custom `trigger` slot, and a `hideIcon` prop to drop the default chevron.

- [#155](https://github.com/phthalo-dev/var-ui/pull/155) [`c12a5b3`](https://github.com/phthalo-dev/var-ui/commit/c12a5b328d309dc5f8cb364134c6e6956a66a90f) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - The Astro `Grid` accepts responsive `columns` (`{ base: 2, sm: 3, lg: 7 }`, theme breakpoints), any integer column count, and a `minColumnWidth` prop that sets the auto-track minimum without `styleVars`.

- [#157](https://github.com/phthalo-dev/var-ui/pull/157) [`0a53eac`](https://github.com/phthalo-dev/var-ui/commit/0a53eacba79eecedf79f08079630eba926d8fe33) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - The Astro `Stack`/`HStack` gain an `as` prop (`'div' | 'span'`) so layout stacks work inside buttons and links.

- [#156](https://github.com/phthalo-dev/var-ui/pull/156) [`81de958`](https://github.com/phthalo-dev/var-ui/commit/81de9585fb1b961671be84b324bb522dd758b8f8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - The Astro `Text` gains `eyebrow`, `whiteSpace`, and accepts any positive `lineClamp` (counts above 3 assign the `lineClamp` variable); `size` now includes `xl` and `weight` includes `bold`.

### Patch Changes

- [#158](https://github.com/phthalo-dev/var-ui/pull/158) [`9765b4f`](https://github.com/phthalo-dev/var-ui/commit/9765b4f0e40d4291189b23fcaaebbb299a75a038) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - The Astro `CodeBlock` copy script toggles state with `data-copied`/`data-error`/`data-tone` attributes instead of swapping class names, and the component merges one recipe slot per element (no more typestyles dev warnings from `combine()`).

- [#154](https://github.com/phthalo-dev/var-ui/pull/154) [`4fe10de`](https://github.com/phthalo-dev/var-ui/commit/4fe10dec7ef3dadfcc669bd7fcb34b7a85325b35) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Keep the rendered default gap of the Astro `Stack` and `HStack` at 12px after the core spacing-vocabulary change (gap names now map 1:1 to the `space.*` tokens): the component default is now `gap="sm"` instead of `gap="md"`, which used to resolve to 12px.

## 0.7.0

### Minor Changes

- [#123](https://github.com/phthalo-dev/var-ui/pull/123) [`d35c057`](https://github.com/phthalo-dev/var-ui/commit/d35c057df3af7218feda794315677e18a73ea34f) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every form control takes the shared `size` axis (`sm` / `md` / `lg`, default `md`).
  
  - New `size` variant and React prop on `TextAreaField`, `MultiSelector`, `Tokenizer`, `DateInput`, `DateRangeInput`, `DateTimeInput`, `TimeInput`, `FileInput`, `Checkbox`, `Switch`, `RadioGroup`, `CheckboxGroup`, `Slider` and `ColorPicker`. Like `TextField`, the size resolves as `size`, then the surrounding control size (`InputGroup`, `Toolbar`, `Select.Root`, `Combobox.Root`), then `md`. Text-entry controls match `TextField` at each size; checkbox, radio and switch scale the indicator, label type and gap; group sizes apply to every option; `Slider` scales the track and thumb; `ColorPicker` scales the panel, rails, thumbs and swatches (`ColorInput` opens its picker at its own size).
  - `Button` and `IconButton` now inherit the surrounding control size instead of always defaulting to `md`. A button inside an `InputGroup`, `Toolbar` or compound root matches it unless it sets `size`.
  - `Toolbar` provides its `size` to the controls inside it, and falls back to the surrounding control size.
  - Breaking: the `size.indicator` tokens are per size: `size.indicator.box.{sm,md,lg}`, `dot.{sm,md,lg}`, `trackWidth.{sm,md,lg}`, `trackHeight.{sm,md,lg}` (CSS `--var-ui-size-indicator-box-md`, ...). The switch geometry moved to recipe variables (`--var-ui-switch-trackwidth`, `--var-ui-switch-trackheight`, `--var-ui-switch-thumbsize`).
  - Breaking: `StatusDot` uses the shared surface appearance axis: `appearance` is `solid` / `subtle` / `outline` (default `solid`). `filled` is now `solid`.
  - Breaking: the size styles key on `data-size`, so plain-CSS markup for these controls needs `data-size` on each slot (the recipes and components set it).

## 0.6.0

### Minor Changes

- [#126](https://github.com/phthalo-dev/var-ui/pull/126) [`718be2b`](https://github.com/phthalo-dev/var-ui/commit/718be2bd0ff08b07076b7525842e48ac941e64af) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Merge `Outline` into `Toc`. `Toc` (React and Astro) now accepts a flat `items` list and a controlled `activeId`; `Outline` and its `outline` recipe are removed.

### Patch Changes

- [#122](https://github.com/phthalo-dev/var-ui/pull/122) [`eea1c13`](https://github.com/phthalo-dev/var-ui/commit/eea1c13ee4012a1e09a9da9a007d3b11b2112a56) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Move the last hand-written styles into recipes: `mobileNav` gains a `headerContent` slot (React and Astro use it instead of an inline style or a `<style>` block), the `searchInput` `command` variant sizes its trigger in the recipe instead of a `<style>` block in Astro, CommandPalette drops a redundant inline style on its input, and ProgressCircle sets its progress through the recipe's var ref instead of a hand-written custom property.

## 0.5.0

### Minor Changes

- [#121](https://github.com/phthalo-dev/var-ui/pull/121) [`08224f6`](https://github.com/phthalo-dev/var-ui/commit/08224f60b9c2b5ed722ce6ad062479e292d6d5d2) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - API contract and React/Astro parity leftovers:
  
  - `useTableSelection` uses the same vocabulary as `Select`: `multiple` (opt-in), plus `value`, `defaultValue` and `onValueChange` with row ids as `string[]`. It returns `value`, `isSelected`, `toggle`, `selectAll`, `clear` and `setValue`. The `selectedKeys`/`onSelectionChange` options and the `SelectionMode` type are gone.
  - `useChatNewMessages` takes `locked` instead of `isLocked`. The public-props guard now also checks hook options.
  - `Menu` (React) supports a single choice: `value`, `defaultValue` and `onValueChange` on `Menu`/`Menu.Root` and `Menu.FromSections` turn items into `menuitemradio` with a check mark. Astro `Menu` replaces `selectionMode` and `selectedId` with the same `defaultValue` (`null` = selectable, nothing checked).
  - `Card` takes `href`: the whole card becomes a link with `title`, `description` and `hint`, like `Button`. `ClickableCard` is removed from both packages; use `<Card href>`.
  - `Pill` is removed; use `<Chip onRemove>`.
  - Astro `ToggleButton` takes `defaultSelected` instead of `pressed`, matching React.

- [#117](https://github.com/phthalo-dev/var-ui/pull/117) [`ff8bf54`](https://github.com/phthalo-dev/var-ui/commit/ff8bf545a526840a28c6a68a8caf922fe2f1fa59) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Space tokens use t-shirt names, like `fontSize` and `radius`: `none` (0), `xxs` (0.25rem), `xs` (0.5rem), `sm` (0.75rem), `md` (1rem), `lg` (1.5rem), `xl` (2rem), `xxl` (2.5rem), `xxxl` (3rem) and `xxxxl` (4rem). The old numeric keys map as `0→none`, `1→xxs`, `2→xs`, `3→sm`, `4→md`, `5→lg`, `6→xl`, `10→xxl`, `8→xxxl` and `12→xxxxl`. The unused steps `7`, `9`, `11`, `16` and `20` are removed. CSS variables follow, so `--var-ui-space-4` is now `--var-ui-space-md`.
  
  Scale names use letters only: `fontSize` and `size.panel` rename `2xl` to `xxl`, and `fontSize` renames `3xl` to `xxxl`.
  
  `Layout`, `LayoutHeader`, `LayoutFooter`, `LayoutContent`, `LayoutPanel` (`padding`) and `AppShell` (`contentPadding`) take space names instead of numbers, for example `padding="none"` instead of `padding={0}`.

### Patch Changes

- [#115](https://github.com/phthalo-dev/var-ui/pull/115) [`28ffffa`](https://github.com/phthalo-dev/var-ui/commit/28ffffacd2399e1b79d066c6a2ba48b94ca719e6) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Export `Density`, `Gap`, `Orientation` and `Sender`, the value types of the shared `density`, `gap`, `orientation` and `sender` variant axes, alongside `Tone`, `SurfaceAppearance` and `ControlSize`. React and Astro component props that use a shared axis now name it with these types instead of `NonNullable<XVariantProps['axis']>`. The accepted values are unchanged.

- [#119](https://github.com/phthalo-dev/var-ui/pull/119) [`fa2dcb2`](https://github.com/phthalo-dev/var-ui/commit/fa2dcb2f21dc0d8f939aa2ff993c541b0b16790f) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Toast: the last toast now fades out before its region unmounts (React and Astro), and a toast arriving mid-exit cancels the removal. Popups cap their width against the usable viewport instead of `100vw`, so a very wide popup no longer extends under a classic scrollbar (the root element is now a CSS anchor named `--var-ui-viewport`).

- [#118](https://github.com/phthalo-dev/var-ui/pull/118) [`e1b8706`](https://github.com/phthalo-dev/var-ui/commit/e1b87060e9fb3abb847d15ddeb774d125d08d6fa) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Depend on `typestyles` `^0.35.2`, which keeps recipe `.vars` in `compile: true` (zero-runtime) builds, so components that set recipe vars at runtime work with the compile transform.

- [#117](https://github.com/phthalo-dev/var-ui/pull/117) [`ff8bf54`](https://github.com/phthalo-dev/var-ui/commit/ff8bf545a526840a28c6a68a8caf922fe2f1fa59) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Depend on `typestyles` `^0.35.1`.

## 0.4.0

### Minor Changes

- [#102](https://github.com/phthalo-dev/var-ui/pull/102) [`44ae60c`](https://github.com/phthalo-dev/var-ui/commit/44ae60c7b9dd62d8a7a65fe8c9ff4809c93b41de) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - API contract, part 1: native passthrough, refs and shared field plumbing.
  
  - Components accept and spread their element's native props (`id`, `data-*`, `aria-*`, `style`, handlers) and merge `className`; this covers the display, data, navigation, button, overlay-part and field components in React and the matching Astro components. Overlay triggers and `Close` merge onto their child.
  - Field components render label/description/error through shared `FieldFrame`/`RacFieldFrame`; `errorMessage` implies invalid, ids are wired into `aria-describedby`. `ref` now points at the native control (`<input>`, `<button>`, …) where one exists; date/time fields use the segmented input, and Slider/PinInput/InputGroup/EditableText the nearest real element.
  - `Button` takes `href` and renders an anchor. New `Toolbar.astro`. `ResizeHandle.astro` takes `aria-label` instead of `label`.
  - User-visible default strings are overridable props (Pagination takes a `labels` object). Heading levels are overridable on Accordion, Collapsible, Card, Section and EmptyState.
  - `Menu.Popup` takes `placement`, `Menu.Item` takes `textValue`, menu presets compose the same root (presence, layer, `portalContainer`), `MenuContent` no longer nests a second menu.
  - `FileInput` puts dropped files into the native input so `FormData` sees them; `Field` accepts `name` and shows `<Form errors>`; one shared calendar body backs the date fields; `SearchInput` drops the unsupported `variant="command"` type in React; `Toc` drops `hideBelowXl` (the rail already hides below `xl`).
  - Inline style objects in Accordion, Collapsible, Table, Tree, List, SideNav, TopNav and Layout moved into recipes.

- [#103](https://github.com/phthalo-dev/var-ui/pull/103) [`0980a84`](https://github.com/phthalo-dev/var-ui/commit/0980a84a88292c0e0c7497976082aa73f7a4b8b8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - API contract, part 2: platform vocabulary. Breaking.
  
  - **Booleans drop the `is` prefix:** `disabled`, `required`, `readOnly`, `invalid`, `open`/`defaultOpen`, `expanded`/`defaultExpanded`, `collapsed`/`defaultCollapsed`, `dismissable`, `loading`, `selected`, `nested`, `active`, `striped`, `scrollable`, `indeterminate`, `rowHeader`, `streaming`, `reversed`, `labelHidden`, `iconOnly`, `destructive`, `wheelDisabled`, `unavailable`. Checkbox and Switch use `checked` / `defaultChecked` / `indeterminate`. Core recipe axes `isScrollable` and `isStriped` are now `scrollable` and `striped`.
  - **Events:** `onChange` is always the native DOM event (via `...rest`, or a capture handler on the root for Checkbox, Switch, RadioGroup, CheckboxGroup and Slider); parsed values arrive through `onValueChange` (`onCheckedChange` for Checkbox/Switch, `onSelectedChange` for toggle chips and buttons, `onValueCommit` on Slider). `onPress` is gone: use `onClick`. Select, Tabs, SegmentedControl, Tree selection, Pagination and the date/time fields have no native `onChange`.
  - **Collections** use `value` / `defaultValue` / `onValueChange` (`string | null` for single, `string[]` with `multiple`/`selectionMode="multiple"`) and `{ value, label, disabled? }` options: Select, Combobox, Typeahead, MultiSelector, Tokenizer, SegmentedControl, ChipGroup, RadioGroup, CheckboxGroup, Tabs, TabList, Tree, Pagination, Accordion. `selectedKey(s)`, `Selection` and `Set` values are gone from the public API; Tree and CollapsibleGroup expansion uses `expanded` / `defaultExpanded` / `onExpandedChange(string[])`.
  - **Renames:** Alert `variant` -> `tone`; `IconButton name` -> `icon`; `PinInput type` -> `characters`; Button `pending` -> `loading`; NumberInput/Slider/date fields `minValue`/`maxValue` -> `min`/`max`; date `isDateUnavailable` -> `unavailable`; `ResizeHandle onChange` -> `onValueChange`; `CollapsibleGroup allowsMultipleExpanded` -> `multiple`; `MobileNav` context `isOpen` -> `open` (and `open()` -> `show()`).
  - **New:** `CommandPalette` and `AlertDialog` take `defaultOpen`; `CommandPalette` `onOpenChange(open, details)` with `details.cancel()`; Drawer is uncontrolled when `open` is omitted; `ChatComposerInput` takes a native `onChange`, its `ref` now points at the textarea; chat components pass native props through.
  - `Pill.astro` is removed (it duplicated `Chip.astro`); `Pill` is a removable `Chip` in React only. `ChipGroup` is single-select unless `multiple`.
  - A compiler-based test (`publicProps.test.ts`) fails if any exported component prop starts with `is`/`defaultIs` or uses `onPress*`, `selectedKey(s)` or `onSelectionChange`.

- [#105](https://github.com/phthalo-dev/var-ui/pull/105) [`40b24be`](https://github.com/phthalo-dev/var-ui/commit/40b24be346f5e0a92d32c82aa8c86a4a1e00423a) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - CSS-first theming and platform accessibility features.
  
  - **Reduced motion at the token level.** The `duration.fast|medium|slow` tokens resolve to `0ms` under `prefers-reduced-motion: reduce` (a theme `mode` added to every `createDesignTheme` theme), and the `transition.*` tokens are built from them, so any recipe that uses duration or transition tokens respects it without per-recipe code. Every hard-coded `140ms`/`0.15s`/`200ms` literal in the recipes is now a token or `transitionOf()`; keyframe animations use `atReducedMotion`; no recipe contains a raw `@media` any more. Unused duration `*-min`/`*-max` tokens are removed. New transition tokens: `border`, `borderShadow`, `background`, `chrome`, `transform`.
  - **Forced colors and contrast.** New `atForcedColors`, `atMoreContrast`, `when.forcedColors`, `when.moreContrast`. Components that conveyed state or boundaries only through background or box-shadow (checkbox/radio/switch, selected tabs/segments/chips/menu items, progress and slider fills, calendar and date segments, skeleton, spinner, swatches, chat bubbles, dividers, ...) now keep a visible cue in Windows High Contrast.
  - **RTL.** Physical properties in the recipes became logical (inline/block sides, `text-align: start`, logical radii and insets); the switch thumb, table resize handle, progress indeterminate animation, scroll fades and menu placement edges are mirrored under `[dir="rtl"]`.
  - **Tokens.** One shadow scale (`xs`-`xl`; `shadow.elevation` is removed); new `zIndex.lifted`; raw z-index integers and opacity literals use tokens; codeBlock diff colours use `tone.success|danger.subtleBackground`; shared `border()` / `borderSide()` helpers replace ~110 longhand borders.
  - **Stability.** New tests snapshot every recipe's slot class names, component CSS variables and axes, and the `data-*` state hooks the components emit, so renames show up in review. Unused `data-alert-*` attributes are removed.
  - **Docs.** New "Plain CSS" page under Theming describing the class names, `data-*` hooks, component variables, cascade layers, dark mode, reduced motion, forced colors and RTL; `ROADMAP.md` rewritten to match reality.
  - `defaultTheme` is a `const` export; the dark-mode condition constants are shared.

- [#110](https://github.com/phthalo-dev/var-ui/pull/110) [`86493c6`](https://github.com/phthalo-dev/var-ui/commit/86493c63d7cd9fe251948710341d8aedabace6d1) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `Fieldset`: a grouping container on the native `<fieldset>` and `<legend>`, with `Fieldset.Legend`, `Fieldset.Description` and `Fieldset.Error`, `gap` and `orientation` axes, a visually hidden legend option, and an Astro peer. The core `fieldset` recipe has the slots `root`, `legend`, `description`, `error` and `content`.

- [#111](https://github.com/phthalo-dev/var-ui/pull/111) [`5eda7a9`](https://github.com/phthalo-dev/var-ui/commit/5eda7a987bdf5a74156252ef290cac21feabf318) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add a small set of general-purpose hooks and two utilities. Hooks: `useDisclosure` (`{ open, setOpen, show, hide, toggle }`, shaped for `<Dialog open onOpenChange>`), `useControllableState`, `useDebouncedValue`, `useDebouncedCallback` (with `cancel` and `flush`), `useClickOutside` (capture-phase pointer events, ref or refs) and `useHotkeys` (`mod+k` style combos, platform-aware `mod`, ignores text inputs by default). `useHotkeys` is generalised from the `CommandPalette` hotkey parser, which now runs on top of it. Components: `VisuallyHidden` (a `<span>` using the existing recipe; `Spinner` now uses it; Astro peer included) and `Portal` (renders into `document.body` or a `container`; renders nothing on the server). New docs: a Hooks reference covering every public hook, and pages for VisuallyHidden and Portal.

- [#101](https://github.com/phthalo-dev/var-ui/pull/101) [`85418a0`](https://github.com/phthalo-dev/var-ui/commit/85418a011d2993d9270ad388e38d0ba02d9c2d07) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - React and Astro components now import recipes from narrow `@var-ui/core/components/*` subpaths instead of the barrel, so importing one component no longer registers every recipe's CSS during extraction. `@var-ui/core` gains `./tokens/declare` and `./icons/iconNames` subpaths (plus existing `./components/*` / `./shared/*` wildcards).
  
  Public surface trim (intentional break): `@var-ui/core` root no longer re-exports `style` / `recipe` / `tokens` / `global` / `override` / `breakpoint` / `media` from `runtime` (use `typestyles.*`); `@var-ui/react` no longer exports overlay helpers (`mergeOverlayChild`, `inferOverlayCloseReason`, `OverlayCloseContext`, `useOverlayClose`), `FormErrorsContext`, `useTocSpy`, or `useTreeFocus`.
  
  Implementation helpers moved to unpublished `src/internal/` (`controlSize`, `fieldChrome`, `focusRing` in core; `menuContent`, `menuPresets`, `controlSizeContext`, `commandPaletteHotkey`, `commandPaletteController`, `racClassName` in react). Package `exports` are static wildcards; the `generate-subpath-exports` build step is removed. `focusRing` remains available from the `@var-ui/core` root barrel.

- [#107](https://github.com/phthalo-dev/var-ui/pull/107) [`2d821d8`](https://github.com/phthalo-dev/var-ui/commit/2d821d8d18b8138b6725b5cbadfdf05e270d9d37) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Native `<dialog>` overlays (P6 part A). Breaking.
  
  - **Dialog, AlertDialog, Drawer, MobileNav, the Layout panel overlay and CommandPalette now render a native `<dialog>` opened with `showModal()`**: native focus trap, inert background, top layer (no z-index), `::backdrop`, native focus return and Escape. react-aria's `Modal`/`ModalOverlay`/`Dialog` are gone from these components.
  - **API.** `Popup` _is_ the `<dialog>` and accepts its native props; the `Backdrop` parts are removed (style `::backdrop` of the popup); `portalContainer` is removed everywhere (dialogs render in place; theme and token scope follow the DOM; note a `<button>` inside a dialog inside a `<form>` submits that form, and DOM events bubble through real ancestors). `dismissable` stays on Root and now also on MobileNav. Triggers must be button-like. `autoFocus` has no effect inside a native dialog on plain elements: use the native `autofocus` attribute.
  - **Close reasons from native events:** `escape-key`, `outside-press`, `close-press`, `trigger-press`, `imperative`. `details.cancel()` vetoes opening and click-driven changes; Escape can be vetoed once per user activation (Chromium), after which a controlled `open=true` re-shows the dialog. The `event` on an Escape close is the `keydown`; `details.cancel()` is the veto.
  - **CSS.** Enter and exit use `@starting-style` with `allow-discrete` transitions; the `::backdrop` fades; scroll lock is a global `html:has(dialog:modal)` rule with `scrollbar-gutter: stable`. Recipes: `dialog`, `drawer`, `mobileNav` and `layoutPanel` have a single `popup` slot (plus `content` padding on dialog), `commandPalette`'s `root` is the dialog, and the `overlay` recipe is deleted. New helpers in `shared/overlayMotion`: `nativeEnterExit`, `nativeSlideFrom`, `nativeBackdrop`, `nativeDialogReset`.
  - `MobileNav.astro` and the command palette use a native `<dialog>`; their DOM and script hooks changed accordingly.
  - **Interim:** Select, Combobox, Menu, the date pickers and other react-aria popups render into the open dialog through a small internal shim until the popover migration lands.
  - **Tests.** Real-Chromium browser tests (`*.browser.test.tsx`, vitest browser mode with Playwright) now run next to the jsdom tests; see AGENTS.md. CI installs Chromium (cached).

- [#108](https://github.com/phthalo-dev/var-ui/pull/108) [`4ecd3a5`](https://github.com/phthalo-dev/var-ui/commit/4ecd3a5f56428363d8755c471d413a324ae52de8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Native `popover` overlays with CSS anchor positioning (P6 part B). Breaking.
  
  - **Popover, Tooltip, HoverCard, Menu (and its presets), Toast and the Select, Combobox, Typeahead, MultiSelector, Tokenizer, date-picker and ColorInput popups render a native `[popover]` element**, in place (top layer, no portal, no `z-index`), positioned with CSS anchor positioning (`anchor-name`/`position-anchor`, `position-area`, `position-try-fallbacks`, `anchor-size()` for listboxes that match the trigger width). react-aria's `Popover`, `Tooltip`, `DialogTrigger` and `OverlayArrow` are gone from these components; Menu, Select, ComboBox, DatePicker and the Toast queue keep react-aria for keyboard, typeahead and state through one small adapter (`internal/NativePopover`, the only file that reads react-aria's `PopoverContext`). `react-aria` is now a direct dependency, pinned to the version react-aria-components uses.
  - **API.** `portalContainer` is removed everywhere (overlays render in place; theme and token scope follow the DOM). `placement` is `top | bottom | start | end` with an optional `start | center | end` alignment (`bottom start`); `left`/`right` are gone (logical, RTL-correct); the offset is the `--var-ui-popup-offset` custom property (and an `offset` prop). `Popover.Arrow` is removed. Tooltip `delay` is now `openDelay` and there is a `closeDelay`; Tooltip and HoverCard take `disabled`. Click-opened popovers need a button-like trigger (it gets `popovertarget`).
  - **Behaviour.** `details.reason` comes from native events (`escape-key`, `outside-press`, `trigger-press`, `close-press`, `focus`, `hover`, `imperative`). `details.cancel()` vetoes opening; vetoing a popover close re-shows it (a visible blink), so treat it as best effort for Escape and outside dismissal. Tooltip and HoverCard use `manual` popovers with our own hover/focus/Escape handling (warm-up window between tooltips, hoverable popup, WCAG 1.4.13). Toasts are re-promoted above an open modal dialog but are inert while a modal is open. `useVirtualAnchor` anchors the ContextMenu at the pointer.
  - **CSS.** New `shared/anchored` helpers (`anchored`, `anchoredMatchWidth`, `popupSurface`) drive every popup recipe; enter and exit use `@starting-style` with `allow-discrete` transitions on `:popover-open`. Removed: `data-starting-style`/`data-ending-style`, `--var-ui-available-height/-width`, `--var-ui-anchor-width`, `--var-ui-transform-origin`, the `popover.arrow` slot and `z-index` in the popup recipes. An unlayered consumer reset such as `[popover]{margin:0}` removes the anchor offset; see the Plain CSS page.
  - `Menu.astro` and the Astro Toast use `popovertarget`/`popover` and the new placement values.
  - The interim dialog shim from the native-dialog change is deleted.

- [#110](https://github.com/phthalo-dev/var-ui/pull/110) [`86493c6`](https://github.com/phthalo-dev/var-ui/commit/86493c63d7cd9fe251948710341d8aedabace6d1) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `ProgressCircle` and `Meter`. `ProgressCircle` is a circular progress indicator (determinate or indeterminate) on react-aria's ProgressBar, with `value`, `min`, `max`, `label`, `valueLabel`, `size`, `tone`, `appearance` and centered `children`; the arc follows `--var-ui-progress-circle-progress`. `Meter` shows a measurement within a range with the `<meter>` attributes `value`, `min`, `max`, `low`, `high` and `optimum`, deriving a success, warning or danger tone like browsers do (overridable with `tone`). Core adds the `progressCircle` and `meter` recipes and `getMeterTone`; both components have Astro peers.

- [#110](https://github.com/phthalo-dev/var-ui/pull/110) [`86493c6`](https://github.com/phthalo-dev/var-ui/commit/86493c63d7cd9fe251948710341d8aedabace6d1) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `Rating`: a star (or custom icon) rating built on a native radio group, so arrow keys, Home/End, Tab, `name`/`form`/`required`/`disabled` and form submission come from the browser. Props: `value`/`defaultValue`/`onValueChange`, native `onChange`, `max`, `readOnly` (a `role="img"` display that also accepts fractional values such as `3.5`), `clearable`, `size`, `tone`, `icon`/`emptyIcon`, `getItemLabel`, `getValueLabel`, and `label`/`description`/`errorMessage`. Hover preview is pure CSS and mirrors in RTL. New core `rating` recipe, a read-only `Rating.astro`, and a `star` glyph (`star` joins the semantic icon names).

- [#114](https://github.com/phthalo-dev/var-ui/pull/114) [`2b837cd`](https://github.com/phthalo-dev/var-ui/commit/2b837cd2938eda6144af5772e702c90072fc672e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Move all sizing to `rem` and onto design tokens. `space`, `fontSize`, `radius`, `borderWidth` and `breakpoint` defaults are now `rem`, and no component style uses `px` (the one exception is the `toc` scroll-spy `rootMargin`, which `IntersectionObserver` only accepts in `px`). `size.control` gains `xs` and `xl`, and new `size.field`, `size.panel`, `size.indicator` and `size.media` groups replace repeated literals (field min-widths, popup/dialog/drawer widths, checkbox/radio/switch geometry, thumbnails and empty-state artwork). `Avatar` sizes come from `size.control`, and its status dot is now a `StatusDot` positioned by the `status` slot (no wrapper span, no ring, no `data-avatar-status`). `ProgressCircle`'s `thickness` var is now a unitless number. A few sizes shift slightly (Avatar `sm`/`lg`, ProgressCircle `sm`/`md`, some panel widths, prose headings).

- [#106](https://github.com/phthalo-dev/var-ui/pull/106) [`ab34170`](https://github.com/phthalo-dev/var-ui/commit/ab3417006a8be1f65072c4034c6138f8e13e6bc9) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Remove the duplicate `SimpleGrid` and `VStack` components.
  
  - `SimpleGrid` is gone (React component, `simpleGrid` core recipe and `simple-grid` class). Use `<Grid columns={n} gap="...">`; `Grid` `columns` now also accepts `5`, `6` and `8`, and `cols`/`spacing` become `columns`/`gap`.
  - `VStack` is gone (React and Astro). Use `<Stack>`, which is vertical by default. `HStack` stays.
  
  `Grid` columns now use `minmax(0, 1fr)` for every fixed track (previously plain `1fr` for 1-4), so wide content no longer stretches a column.

### Patch Changes

- [#101](https://github.com/phthalo-dev/var-ui/pull/101) [`85418a0`](https://github.com/phthalo-dev/var-ui/commit/85418a011d2993d9270ad388e38d0ba02d9c2d07) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Declare `typestyles` as a dependency (it was only a devDependency, but `@var-ui/astro` re-exports `cx`, `combine` and `mergeProps` from it, which could fail to resolve under strict package managers).

- [#98](https://github.com/phthalo-dev/var-ui/pull/98) [`d3514fc`](https://github.com/phthalo-dev/var-ui/commit/d3514fcadca65aa076a9772fcded6f5c8fadacec) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Fix `Toc` `stickyTop` never applying (the inline style used `--var-ui-toc-sticky-top`, but the recipe variable is `--var-ui-toc-stickytop`). Internal cleanup: route recipe CSS variables through `styleVars`, type the positioner style as `CSSProperties`, and drop unnecessary slot-recipe casts.

## 0.3.0

### Minor Changes

- [#50](https://github.com/phthalo-dev/var-ui/pull/50) [`0d76419`](https://github.com/phthalo-dev/var-ui/commit/0d764197303f96399a53f9a8cc28611be3feac68) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add the semantic tones to `Text`: `accent`, `success`, `warning`, `danger` and `info` (for example `<Text tone="danger">`), each colored with that tone's foreground token. Previously `tone` only accepted `primary` and `secondary`, so a downstream `tone="danger"` was a type error and was ignored at runtime. The axis is built from the token tone keys, so a new tone token has to be styled here. Closes [#48](https://github.com/phthalo-dev/var-ui/issues/48).

## 0.2.1

### Patch Changes

- [#31](https://github.com/phthalo-dev/var-ui/pull/31) [`2a43136`](https://github.com/phthalo-dev/var-ui/commit/2a4313660b8856e39921dfa258fd7bb20fff4d7e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Point the repository metadata at the phthalo-dev GitHub organization.

## 0.2.0

### Minor Changes

- [#27](https://github.com/var-ui/var-ui/pull/27) [`58b7b23`](https://github.com/var-ui/var-ui/commit/58b7b23682f0526ce23e8ec763849146ece3049e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Cleanup

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

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

  1.x and 2.x were unpublished; this package is on 0.x until a stable 1.0.

## 0.1.0

### Patch Changes

- Updated dependencies [[`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d)]:
  - @var-ui/core@0.1.0

## 0.0.1

### Minor Changes

- [#9](https://github.com/var-ui/var-ui/pull/9) [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add DirectionProvider / useDirection (including RAC I18nProvider wrapping) and an SSR-safe Hidden utility with CSS media-query hide.

### Patch Changes

- [`e13d16f`](https://github.com/var-ui/var-ui/commit/e13d16f8f8a28f21cf16b416eb00a4e6b89d72dd) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Initial release of `@var-ui/astro`: source-shipped Astro components for the var-ui docs/content kit (layout, feedback, Button/Link/Alert/Banner, CodeBlock, Steps, Breadcrumbs, Tabs, Collapsible, ThemeScript, ColorModeToggle). No React runtime.

- Updated dependencies [[`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23)]:
  - @var-ui/core@0.0.1
