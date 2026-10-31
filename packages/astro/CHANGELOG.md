# @var-ui/astro

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
