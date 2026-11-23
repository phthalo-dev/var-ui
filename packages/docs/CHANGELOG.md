# @var-ui/docs

## 0.14.0

### Minor Changes

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

### Patch Changes

- [#291](https://github.com/phthalo-dev/var-ui/pull/291) [`df5fd15`](https://github.com/phthalo-dev/var-ui/commit/df5fd15c995cb56d5b6f8634d8b9969656b193f8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - **Fonts.** Add the `alloGrotesk` pairing: Allo (Latin subset, variable weight) for body and UI, Space Grotesk for display, JetBrains Mono for code, each webfont backed by a metric-matched Arial fallback so text doesn't rewrap when the webfont swaps in. `defineFonts` slots accept several faces (upright + italic of one family), register a face shared by two slots once, and take an optional `metricFallback` face; `FontFaceDefinition` gains `sizeAdjust`, `ascentOverride`, `descentOverride` and `lineGapOverride`.
  
  **Letter-spacing tokens resolve at the text that uses them.** `letterSpacing.*` tokens were registered as `<length-percentage>`, so `em` values computed once against the root font size: `caps` (0.06em) rendered as 0.08em on 12px labels and `display` tracking didn't scale with headline size. They are now unregistered (`*` syntax), so `em` resolves at the use site.
  
  **Tabular figures** on `badge` and the `slider` output.
  
  **Docs prose:** H3–H6 use the body face (H3 at weight 650); the lead paragraph and page-header lead track at −0.005em.

- [#273](https://github.com/phthalo-dev/var-ui/pull/273) [`70443fb`](https://github.com/phthalo-dev/var-ui/commit/70443fbaa5f1bebdee7c73f9062444f70d1092e7) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - New `codeBlockMarkup({ code, language, filename, copyable, … })` in core: the structure of a code block (header, language label, copy button, body, `pre`, `code`) as plain attribute maps. The React and Astro `CodeBlock`s and the docs Shiki transformer all render from it, so they can't drift. They had: markdown fences put the language in the filename slot, showed a visible "Copy" label, and used `data-copy-error-label`, which the copy script never read. The root also carries `data-language`.
  
  **Fix (react):** a `CodeBlock` without highlighted HTML double-escaped its code, so `<div>` showed as `&lt;div&gt;`.

- [#272](https://github.com/phthalo-dev/var-ui/pull/272) [`0ef2a05`](https://github.com/phthalo-dev/var-ui/commit/0ef2a059a916e900445b7ce353b6a821dee44c5c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - New reading type tokens: `fontSize.prose.{body, lead, h1, h2, h3}` (16 / 19 / 44 / 28 / 20px) and the paired fixed line heights `lineHeight.prose.*` (26 / 28 / 48 / 34 / 28px), so themes can tune long-form type apart from the 14px control scale. The docs kit (`docsProse`, the page header lead) uses them instead of hard-coded rems. `Prose` itself stays relative to its inherited font size.

- [#261](https://github.com/phthalo-dev/var-ui/pull/261) [`c3313b6`](https://github.com/phthalo-dev/var-ui/commit/c3313b64c8fcf24c5a85f7e9e453c70ceacc159f) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Collapsible `SideNav` sections can be controlled and remembered.
  
  - **react** `SideNav.Section` takes `open` / `onOpenChange` (controlled). A parent that ignores the change keeps the section as it is.
  - **react, astro** `SideNav persistKey` remembers which collapsible sections the reader opened or closed, in `localStorage`. Sections are keyed by `id`, or else their title. The section holding the current page always starts open. Astro `SideNav` also initializes navs swapped in by the client router (`astro:page-load`).
  - **core** `persistDisclosures(root, key)` (`@var-ui/core/shared/disclosureState`) is the framework-agnostic helper behind both.
  - **docs** The sidebar uses `persistKey`. The custom `docsSidebarState` script is removed.

- [#254](https://github.com/phthalo-dev/var-ui/pull/254) [`f066000`](https://github.com/phthalo-dev/var-ui/commit/f066000932f40cb1bfffc5e3d4cc7cc70d6cd121) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Every published package now ships its `CHANGELOG.md`. A new **Upgrading** guide (`/docs/upgrading`) covers the 0.6 → 0.13 breaks: platform prop names, `filled` → `solid`, native overlays, space tokens and removed exports. The core README lists `typestyles` as the one TypeStyles export (no root `recipe`/`style`), and the React README no longer describes the package as React Aria wrappers. `IconButton` warns once in development when it renders without an `icon` (any cause, including the pre-0.7 `name="close"`).

## 0.13.0

### Minor Changes

- [#220](https://github.com/phthalo-dev/var-ui/pull/220) [`2d043fa`](https://github.com/phthalo-dev/var-ui/commit/2d043fa2f7d1e2187a020e17056a60a8f36a4904) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - New browser-safe entry `@var-ui/docs/theme-client` with `ensureDocsThemeStyles`, `createDocsThemeController` and the theme preset helpers ([#169](https://github.com/phthalo-dev/var-ui/issues/169)). `@var-ui/docs/utils` also re-exports Node-only modules, so importing it from a client island pulled `node:` imports into the browser bundle.

### Patch Changes

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

- [#205](https://github.com/phthalo-dev/var-ui/pull/205) [`59d4ff2`](https://github.com/phthalo-dev/var-ui/commit/59d4ff2d15808da8f48a28bf69c9057a1d4f36fa) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - - `DocsGuidePage` forwards a `preview` slot to the hero showcase, for section landing pages.
  - The page frame no longer spreads a short page's spare height into blank bands around the hero (`align-content: start`), and the rail's "View as Markdown" drops its hairline when the auto TOC is hidden.

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

- [#184](https://github.com/phthalo-dev/var-ui/pull/184) [`5e09594`](https://github.com/phthalo-dev/var-ui/commit/5e09594ebe82a1154ae9e213ec5e04ec54044a4c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs component pages, round 4:
  
  - `tabs` underline appearance is now true page tabs: a full-width hairline rail, a 2px accent indicator that slides (respecting reduced motion), 44px tall tabs with a neutral hover underline and an accented icon on the selected tab. The row scrolls sideways with a trailing fade.
  - `@var-ui/docs`:
    - The hero (`DocsPageHeader`) spans the full content frame (main column + rail), with a large showcase plate set into the band.
    - The rail (TOC or per-tab list) starts below the hero and tabs, and sticks under the new collapsed page bar.
    - The collapsed page bar (`docsPageBar`): once the hero scrolls away, a compact sticky bar shows the page name, the page tabs, source and Markdown links and the import copy button. It reveals with a CSS scroll-driven animation on the hero's view timeline, falling back to an IntersectionObserver; a fade-only variant applies under reduced motion. It is exposed to AT and keyboard only while visible.
  - `@var-ui/docs-components`: `ComponentDocTabs` uses the underline tabs and joins the page grid (`data-docs-page-tabs`).

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

- [#205](https://github.com/phthalo-dev/var-ui/pull/205) [`59d4ff2`](https://github.com/phthalo-dev/var-ui/commit/59d4ff2d15808da8f48a28bf69c9057a1d4f36fa) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs visual design, round 7 (layout and hero):
  
  - `@var-ui/docs`: below `lg` the section sidebar moves into the mobile drawer (the shell switches to `mobileBreakpoint="lg"` on pages with a sidebar, and the header hamburger shows from there). The `DocsPageHeader` hero hangs its text from the top and, with a showcase, is a fixed-height slot, so the H1 and page tabs land at the same y on every page; below `xl` the showcase is dropped so the lead, import line and metadata keep the full frame. The showcase halo stays inside the page frame.
  - `stage`: the neutral dot field is stronger in light mode (19% ink; 13% in dark).
  - `select` and `combobox`: the selected option shows a trailing check mark, so selection does not rely on colour alone (`dropdownSelectedCheck` in the shared field chrome).

- [#205](https://github.com/phthalo-dev/var-ui/pull/205) [`59d4ff2`](https://github.com/phthalo-dev/var-ui/commit/59d4ff2d15808da8f48a28bf69c9057a1d4f36fa) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Docs visual design, round 8:
  
  - `toc`: the rail no longer hides itself below `xl`; the layout that holds it decides (an `AppShell` aside, a docs frame).
  - `collapsible` / `Accordion`: a closed panel (`hidden="until-found"`) drops its padding, so a closed row is its trigger only.
  - `segmentedControl`: segments never shrink below label + padding; a row too wide for its container scrolls sideways.
  - `chatLayout`: the composer dock is no longer `position: sticky` (it floated over messages inside clipped or scrolling ancestors); bound the root's height and the messages scroll above it.
  - `ColorInput` `format="css"` shows a short label at rest (`phthalo-7` for `var(--var-ui-color-palette-phthalo-7)`, also for the placeholder) with the full value in the tooltip and on focus; the form value travels in a hidden input. New `colorValueLabel()` in `@var-ui/core/shared/colorLabel`.
  - `@var-ui/docs`: the main content area is a size container (`docsMainContainer`); the rail and hero showcase respond to its width (shown down to a 1200px viewport with the sidebar), the showcase shrinks before it hides, and the single-column frame keeps its left edge. On pages with tabs the hero showcase overhangs the tab row, so the tabs follow the metadata by 40px; elsewhere it is sized to its scene. The showcase ends on the frame edge. `DocsPage` and `DocsGuidePage` take a `rail` slot (content above the TOC).

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

### Patch Changes

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

- [#203](https://github.com/phthalo-dev/var-ui/pull/203) [`f575b81`](https://github.com/phthalo-dev/var-ui/commit/f575b812ed888d26713667e7ff1051fd84ee5f72) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add the Var UI brand mark: `(-)`, the `var(--)` call in miniature, drawn from Inconsolata's proportions on the 24×24 icon grid. `@var-ui/icons/brand` exports the strings (`varUiMarkInnerHtml`, `varUiMarkSvg`, `varUiFaviconSvg()`), for Astro and plain HTML; `varUiMark` is the React element.
  
  `varDocs()` takes a `favicon` option. `DocsPage` and `DocsMarketingPage` emit it in `<head>`, and `DocsFavicon` covers site layouts that write their own `<head>`.

- [#202](https://github.com/phthalo-dev/var-ui/pull/202) [`f923338`](https://github.com/phthalo-dev/var-ui/commit/f9233389382488f3cc54088b0e3d711e30bcb6ce) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - CommandPalette ranks results by relevance in React and Astro: exact title, then title prefix, title word-start, title substring, keyword and description matches. Groups are ordered by their best hit and the top hit is active. A description-only match shows the highlighted snippet around it in the subtitle. On touch-first devices no row is pre-highlighted while the query is empty. The shared helpers live in `@var-ui/core/shared/commandSearch` and `@var-ui/core/shared/pointer`.

- [#212](https://github.com/phthalo-dev/var-ui/pull/212) [`fd1bb25`](https://github.com/phthalo-dev/var-ui/commit/fd1bb2598248ec88120ae5767133c7106ccc5e36) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Small API gaps and naming alignment ([#146](https://github.com/phthalo-dev/var-ui/issues/146)).
  
  - **One appearance vocabulary.** `button`'s `filled` appearance is now `solid`, matching badge, alert, chip, toast, banner, progress and meter. `chatMessageBubble`'s `variant` axis is now `appearance` (`solid | subtle | ghost`; React `ChatMessageBubble` prop `variant` → `appearance`). Theme overrides keyed on `appearance.filled` move to `appearance.solid`; plain CSS selectors move to `[data-appearance="solid"]`.
  - **New `UnstyledButton`** (core `unstyledButton`, React, Astro): a native `<button>` without chrome that keeps the cursor, focus ring and disabled state, for inline toggles and custom pressable regions.
  - **Link** (core, React, Astro): `link` is now a recipe with `root` and `icon` slots. New `tone` (`accent | primary | secondary`) and `size` (`inherit | xs | sm | md | lg`). A link now inherits the surrounding font size by default (was a fixed `md`). React adds `startIcon` / `endIcon`; Astro adds `start-icon` / `end-icon` slots. Disabled links get the disabled style.
  - **ProgressBar** (core, React, Astro): new `size` (`sm | md | lg`, the same track steps as `Meter`; `md` is 0.5rem, was 0.375rem). `minValue` / `maxValue` are now `min` / `max`, like `Meter` and `ProgressCircle`. Astro gains `valueLabel`.
  - **ProgressBar and Meter** show value text by default only when there is a `label`, so a bare bar needs just an `aria-label`.
  - **CopyButton**: `onCopied(value)` and `onCopyError(error, value)` (React; also on `useCopy`). Astro dispatches bubbling `var-ui:copy-button-copied` / `var-ui:copy-button-error` events (`COPY_BUTTON_COPIED_EVENT`, `COPY_BUTTON_ERROR_EVENT`) and exports `initCopyButton(s)`.
  - **Types**: `TabDefinition`, `GridColumns`, `PaginationLabels`, `ButtonAsButtonProps`, `ButtonAsLinkProps`, the `Combobox` part props and the `Select` section/header props are exported from `@var-ui/react`. A test now fails when a component module exports a type the package root doesn't.

- [#167](https://github.com/phthalo-dev/var-ui/pull/167) [`c746322`](https://github.com/phthalo-dev/var-ui/commit/c746322cb119b3ac41d45f78759cf1d666f52d2e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Pin the typestyles extract to the stable `typestyles.css` filename. `@typestyles/vite` 0.7+ hashes the emitted sheet when no `fileName` is configured, and its HTML retargeting only runs for Vite HTML inputs — Astro SSR pages keep linking `/typestyles.css`, which 404'd in production (served as `text/html`, rejected by strict MIME checking).

- [#183](https://github.com/phthalo-dev/var-ui/pull/183) [`9577997`](https://github.com/phthalo-dev/var-ui/commit/9577997f4292789a2342b9f7b13c8be341ce2c22) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - - `@var-ui/docs`: lazy theme stylesheets (`/themes/<id>.css`) keep the cascade layer their rules were emitted in. The extract sliced from the theme class mid-`@layer tokens { … }` block, dropping the opener, so the theme's `color-scheme: light dark` became unlayered and overrode the `data-color-mode` pin: Light/Dark did nothing on every non-default theme. The plain theme rule also matches `:root.theme-<id>` so its tokens beat the base `:root` tokens in that layer whatever order the stylesheets load in, and its redundant `color-scheme` is dropped (base styles set it for every theme class).
  - `MobileNav`: the close button has a 32px control-sized box and sizes its icon (core), and the Astro `MobileNav` now renders the close icon (it rendered an empty 8px button).

- [#172](https://github.com/phthalo-dev/var-ui/pull/172) [`487e469`](https://github.com/phthalo-dev/var-ui/commit/487e469d695ee26f15b984e5a3d2a0dcb15631dd) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Drop base-theme `@font-face` rules from lazy theme stylesheets. The theme CSS extract now builds the main TypeStyles entry once, collects its font faces, and omits faces it already defines from every `/themes/<id>.css`. Matching uses family + weight + style + src, so descriptor differences such as `unicode-range` or `font-display` cannot leave duplicates behind.

## 0.3.1

### Patch Changes

- [#151](https://github.com/phthalo-dev/var-ui/pull/151) [`79c5191`](https://github.com/phthalo-dev/var-ui/commit/79c5191b5fc3b8f926c05dc7b6f328bfdd49152c) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Getting started gains a Routing section: how to mount React Aria's `RouterProvider` for client-side navigation with react-router, TanStack Router, and the Next.js App Router, which link-rendering components honour it, and the caveat that `Card href` renders a native `<a>`. Link, Button, SideNav, Breadcrumbs, Toc and TopNav docs note that their links honour `RouterProvider`.

## 0.3.0

### Minor Changes

- [#126](https://github.com/phthalo-dev/var-ui/pull/126) [`718be2b`](https://github.com/phthalo-dev/var-ui/commit/718be2bd0ff08b07076b7525842e48ac941e64af) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Merge `Outline` into `Toc`. `Toc` (React and Astro) now accepts a flat `items` list and a controlled `activeId`; `Outline` and its `outline` recipe are removed.

## 0.2.2

### Patch Changes

- [#56](https://github.com/phthalo-dev/var-ui/pull/56) [`096a582`](https://github.com/phthalo-dev/var-ui/commit/096a582e144a94db57bc7bb4dcf7bbc4ff964650) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Accept compatible TypeStyles releases instead of an exact version. `@var-ui/core` and `@var-ui/react` depend on `typestyles@^0.33.0`, and `@var-ui/docs` depends on `@typestyles/build-runner@^0.6.4`.

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

- [#20](https://github.com/var-ui/var-ui/pull/20) [`eab9dbc`](https://github.com/var-ui/var-ui/commit/eab9dbc29b3d3c5ab1e2f3b2d8f8b1a2dab9bd36) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `@var-ui/cli` for agent-readable component docs, and markdown views (`llms.txt`, sibling `.md`, DocsPage link) in `@var-ui/docs`.

- [#30](https://github.com/var-ui/var-ui/pull/30) [`55ef44d`](https://github.com/var-ui/var-ui/commit/55ef44dd1ca98d5313499e04f2b3ed04cf9f32a1) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Publish each React component once, at `@var-ui/react/components/Button`, through a `./components/*` wildcard. Drop the `./Button` and `./button` aliases.

  `@var-ui/docs/shiki` no longer exports `varUiCodeTheme`. Use `designTokenShikiTheme`.

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

### Patch Changes

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

    1.x and 2.x were unpublished; this package is on 0.x until a stable 1.0.

## 0.1.0

### Patch Changes

- Updated dependencies [[`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d)]:
  - @var-ui/core@0.1.0
  - @var-ui/react@0.1.0
  - @var-ui/astro@0.1.0
  - @var-ui/icons@0.1.0

## 0.0.2

### Patch Changes

- [#13](https://github.com/var-ui/var-ui/pull/13) [`e61a5e6`](https://github.com/var-ui/var-ui/commit/e61a5e6a7f0d6e74c2ddbb430733b9e6db52f48a) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Support `output: 'static'` for injected guide routes. React, `@var-ui/react`, and `@var-ui/icons` are optional peers for guide-only sites.

## 0.0.1

### Patch Changes

- [`c28fdba`](https://github.com/var-ui/var-ui/commit/c28fdba598df30e9788d590d19a9cde2851a5dd0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Initial release of the Astro docs kit: `@var-ui/docs` (guide shell, theming, search, TOC) and `@var-ui/docs-components` (optional design-system catalog plugin). Both ship source `.astro`/`.ts` files.

- Updated dependencies [[`e13d16f`](https://github.com/var-ui/var-ui/commit/e13d16f8f8a28f21cf16b416eb00a4e6b89d72dd), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23), [`5607a30`](https://github.com/var-ui/var-ui/commit/5607a30a0efb5e6565b4281b9c3c59713d4a9c89)]:
  - @var-ui/astro@0.0.1
  - @var-ui/core@0.0.1
  - @var-ui/react@0.0.1
  - @var-ui/icons@0.0.1
