# @var-ui/react

## 0.3.1

### Patch Changes

- [#65](https://github.com/phthalo-dev/var-ui/pull/65) [`aafa8c9`](https://github.com/phthalo-dev/var-ui/commit/aafa8c9e41921b5365187e4d5733900b7b57e3d7) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - AppShell can fill a parent shorter than the viewport.

- [#67](https://github.com/phthalo-dev/var-ui/pull/67) [`0dc2162`](https://github.com/phthalo-dev/var-ui/commit/0dc21629ed03b79e34d2819974730065429f9690) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add a swatch-only ColorInput appearance with a per-control accessible name.

- [#66](https://github.com/phthalo-dev/var-ui/pull/66) [`5191648`](https://github.com/phthalo-dev/var-ui/commit/51916482ec63227e586910939e2120cc93ad79da) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add a FileTrigger so an existing button can open a file picker.

- [#64](https://github.com/phthalo-dev/var-ui/pull/64) [`6e81488`](https://github.com/phthalo-dev/var-ui/commit/6e81488264ddfd1f92a9496ba8d6bfc0a888dc62) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Keep `className` on Switch and Checkbox by merging it with the recipe class.

- [#56](https://github.com/phthalo-dev/var-ui/pull/56) [`096a582`](https://github.com/phthalo-dev/var-ui/commit/096a582e144a94db57bc7bb4dcf7bbc4ff964650) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Accept compatible TypeStyles releases instead of an exact version. `@var-ui/core` and `@var-ui/react` depend on `typestyles@^0.33.0`, and `@var-ui/docs` depends on `@typestyles/build-runner@^0.6.4`.

## 0.3.0

### Minor Changes

- [#50](https://github.com/phthalo-dev/var-ui/pull/50) [`0d76419`](https://github.com/phthalo-dev/var-ui/commit/0d764197303f96399a53f9a8cc28611be3feac68) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add the semantic tones to `Text`: `accent`, `success`, `warning`, `danger` and `info` (for example `<Text tone="danger">`), each colored with that tone's foreground token. Previously `tone` only accepted `primary` and `secondary`, so a downstream `tone="danger"` was a type error and was ignored at runtime. The axis is built from the token tone keys, so a new tone token has to be styled here. Closes [#48](https://github.com/phthalo-dev/var-ui/issues/48).

### Patch Changes

- [#45](https://github.com/phthalo-dev/var-ui/pull/45) [`ac9b442`](https://github.com/phthalo-dev/var-ui/commit/ac9b44273ec88d22fafab47e75897cfc70e1dcea) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Paint focus rings with the accent foreground, and share one 2px ring across controls.

- [#51](https://github.com/phthalo-dev/var-ui/pull/51) [`ed40135`](https://github.com/phthalo-dev/var-ui/commit/ed4013573234c74db03efb22b2ae1b6dced431d2) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `Button` accepts a `ref` and forwards it to the underlying `<button>`, so callers can return focus to the trigger. Closes [#49](https://github.com/phthalo-dev/var-ui/issues/49).

- [#54](https://github.com/phthalo-dev/var-ui/pull/54) [`1761cf9`](https://github.com/phthalo-dev/var-ui/commit/1761cf9bc4cdfc814992babc3388f1cebc32b249) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Paint portaled menu surfaces and item labels. Menu color variables now name the `popover` slot, so typestyles emits the default and theme overrides on the popover itself. React portals that slot outside `.var-ui-menu`, where a custom property set only on the host stays transparent.

- [#46](https://github.com/phthalo-dev/var-ui/pull/46) [`4ae01ee`](https://github.com/phthalo-dev/var-ui/commit/4ae01ee3fc7847c3ec4c2976ccfed4369ffd1436) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Build against `@types/react` 19 (matching the React 19 peer dependency; it was 18). The CLI's component catalog is regenerated from the new types.

## 0.2.1

### Patch Changes

- [#31](https://github.com/phthalo-dev/var-ui/pull/31) [`2a43136`](https://github.com/phthalo-dev/var-ui/commit/2a4313660b8856e39921dfa258fd7bb20fff4d7e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Point the repository metadata at the phthalo-dev GitHub organization.

## 0.2.0

### Minor Changes

- [#27](https://github.com/var-ui/var-ui/pull/27) [`58b7b23`](https://github.com/var-ui/var-ui/commit/58b7b23682f0526ce23e8ec763849146ece3049e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Cleanup

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

- [#30](https://github.com/var-ui/var-ui/pull/30) [`55ef44d`](https://github.com/var-ui/var-ui/commit/55ef44dd1ca98d5313499e04f2b3ed04cf9f32a1) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Publish each React component once, at `@var-ui/react/components/Button`, through a `./components/*` wildcard. Drop the `./Button` and `./button` aliases.

  `@var-ui/docs/shiki` no longer exports `varUiCodeTheme`. Use `designTokenShikiTheme`.

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

## 0.1.1

### Patch Changes

- [#18](https://github.com/var-ui/var-ui/pull/18) [`e16cf73`](https://github.com/var-ui/var-ui/commit/e16cf73998a012a7172b9e62f829845906b4179b) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Keep `@var-ui/core/styles` registrations through `vp pack` so the published extraction entry is not an empty module.

  1.x and 2.x were unpublished; this package is on 0.x until a stable 1.0.

## 0.1.0

### Minor Changes

- [#15](https://github.com/var-ui/var-ui/pull/15) [`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Support replacing and disposing runtime `createDesignTheme` surfaces. Add `Text` xs/lineClamp, inline `Code`, and `Surface`.

### Patch Changes

- Updated dependencies [[`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d)]:
  - @var-ui/core@0.1.0
  - @var-ui/icons@0.1.0

## 0.0.1

### Minor Changes

- [#8](https://github.com/var-ui/var-ui/pull/8) [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - **Breaking:** `Dialog` is now the compound Root (`Dialog.Trigger` / `Backdrop` / `Popup`). Use `SimpleDialog` for the old `triggerLabel` / `title` / `description` API.

  Popover and Tooltip follow the same split (`SimplePopover`, `SimpleTooltip`). HoverCard, AlertDialog, and Drawer keep their preset signatures and gain compound parts. New `Menu` compound API; `DropdownMenu` is unchanged.

- [#8](https://github.com/var-ui/var-ui/pull/8) [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add compound `Field.Root` / `Label` / `Control` / `Description` / `Error` (preset `Field` unchanged) with validity data attributes and native `validationMessage`. New `Form` component focuses the first invalid field and accepts a server `errors` map. `@var-ui/form` `useForm` is unchanged.

- [#8](https://github.com/var-ui/var-ui/pull/8) [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add overlay enter/exit data attributes, positioner CSS variables, and change-event details (`reason` + `cancel()`). Recipes animate dialog, popover, tooltip, drawer, menu, and command palette. CommandPalette spreads the presence attributes. No `@base-ui/react` dependency.

- [#9](https://github.com/var-ui/var-ui/pull/9) [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add DirectionProvider / useDirection (including RAC I18nProvider wrapping) and an SSR-safe Hidden utility with CSS media-query hide.

### Patch Changes

- [#3](https://github.com/var-ui/var-ui/pull/3) [`5607a30`](https://github.com/var-ui/var-ui/commit/5607a30a0efb5e6565b4281b9c3c59713d4a9c89) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add an optional `portalContainer` prop to `Select` and `Dialog`, forwarded to
  their internal overlay's `UNSTABLE_portalContainer`. Lets consumers render a
  Select's dropdown or a Dialog's modal inside a specific themed subtree
  instead of `document.body`, so the overlay picks up that subtree's CSS
  custom properties instead of the page's ambient theme.
- Updated dependencies [[`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23)]:
  - @var-ui/core@0.0.1
  - @var-ui/icons@0.0.1
