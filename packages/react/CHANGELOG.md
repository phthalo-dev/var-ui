# @var-ui/react

## 0.7.0

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

- [#104](https://github.com/phthalo-dev/var-ui/pull/104) [`8ebbcad`](https://github.com/phthalo-dev/var-ui/commit/8ebbcadb7ec6aa92801832482ed10398861b57ad) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - API contract, part 3: one shape for every overlay. Breaking.
  
  - **Shared root hook.** `useOverlayRoot` (with `OverlayTrigger`, `useHoverIntent`, one cleanup-aware `useMergedRef`, `createOverlayContext`) replaces six near-identical copies of the open-state, close-reason, presence and trigger wiring in Dialog, Popover, Tooltip, HoverCard, Menu, Drawer, MobileNav, CommandPalette, TopNavMegaMenu and the Layout panel. The `display: contents` wrapper divs that existed only to catch keydown are gone; the close `reason` now comes from native listeners (`escape-key`, `outside-press`, `trigger-press`, `close-press`, `focus`, `hover`, `imperative`) and `details.cancel()` vetoes a change. A request equal to the current `open` is dropped, so Escape during an exit animation no longer fires a second `onOpenChange(false)`.
  - **Uniform API.** Every overlay Root takes `open`, `defaultOpen` and `onOpenChange(open, details)` (now also MobileNav, TopNavMegaMenu, the Layout panel and CommandPalette); `portalContainer` and `dismissable` are Root-only; parts are `Trigger`, `Backdrop`, `Popup`, `Close`, `Title`, `Description` where the concept exists.
  - **Removed.** `SimpleDialog`, `SimplePopover`, `SimpleTooltip`, and the assembled `AlertDialog`, `HoverCard` and `Drawer` presets (now documented recipes built from the compound parts); `Drawer.Panel` is `Drawer.Popup` and Drawer gains `Trigger`.
  - **Also.** Menu presets and `Menu.Popup` share the hook (a click on the trigger no longer counts as an outside press); MobileNav and the Layout panel now animate out; one tone-to-icon map and one default toast duration; `toast()` without a provider warns once in development, and changing `maxVisibleToasts` keeps existing toasts; `LoadingOverlay` sets `aria-busy` on its root and makes the covered content `inert` (new `content` slot in the core recipe).

- [#106](https://github.com/phthalo-dev/var-ui/pull/106) [`ab34170`](https://github.com/phthalo-dev/var-ui/commit/ab3417006a8be1f65072c4034c6138f8e13e6bc9) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Remove the duplicate `SimpleGrid` and `VStack` components.
  
  - `SimpleGrid` is gone (React component, `simpleGrid` core recipe and `simple-grid` class). Use `<Grid columns={n} gap="...">`; `Grid` `columns` now also accepts `5`, `6` and `8`, and `cols`/`spacing` become `columns`/`gap`.
  - `VStack` is gone (React and Astro). Use `<Stack>`, which is vertical by default. `HStack` stays.
  
  `Grid` columns now use `minmax(0, 1fr)` for every fixed track (previously plain `1fr` for 1-4), so wide content no longer stretches a column.

### Patch Changes

- [#100](https://github.com/phthalo-dev/var-ui/pull/100) [`d0423ba`](https://github.com/phthalo-dev/var-ui/commit/d0423ba02f7918f99b35715166b9a54c6214fa32) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Bug fixes from the component audit:
  
  - `className` now reaches the root of `TextField`, `TextAreaField`, `PasswordInput`, `CheckboxGroup` and `RadioGroup` (string or render-prop function); it was overwritten by the recipe class.
  - `useLayer` no longer sets an inline `z-index: 100` without a `LayerProvider`, so the core dropdown/modal/toast tiers apply; with a provider it sets the layer CSS variable instead of a raw `z-index`.
  - Ship the `'use client'` directive in every `@var-ui/react` module so the package works from Next.js server components (guarded by `scripts/check-use-client.mjs`).
  - `Checkbox` renders an indeterminate state; `Form` reports rejected async `onSubmit` (new optional `onError`) and keeps a stable default `errors`.
  - `Dialog.Description` is wired to `aria-describedby`; `AlertDialog` is no longer dismissed by a backdrop click by default (Escape still closes it).
  - Keyboard-invoked `ContextMenu` anchors to the target instead of the top-left corner; `CommandPalette` fires `onOpenChange(false)` once and its `mod` hotkey is Meta on Apple platforms, Ctrl elsewhere.
  - `PinInput`, `MultiSelector`, `Tokenizer` and `FileInput` accept `name` (so `FormData` includes them); description/error text is linked via `aria-describedby` on `PinInput`, `MultiSelector`, `Tokenizer` and `ColorInput`.
  - `Chip` remove and `FileInput` clear controls are no longer nested inside another button; `Chip` also removes on Backspace/Delete. `ColorPicker` hue/alpha sliders are keyboard operable.
  - `useResizable` no longer reads `localStorage` during the first render (hydration mismatch), `useMediaQuery` no longer resubscribes every render, and storage access in the provider/color mode is guarded.
  - `Carousel` exposes carousel/slide ARIA semantics with overridable labels; `Alert` accepts an optional `role`.

- [#98](https://github.com/phthalo-dev/var-ui/pull/98) [`d3514fc`](https://github.com/phthalo-dev/var-ui/commit/d3514fcadca65aa076a9772fcded6f5c8fadacec) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Fix `Toc` `stickyTop` never applying (the inline style used `--var-ui-toc-sticky-top`, but the recipe variable is `--var-ui-toc-stickytop`). Internal cleanup: route recipe CSS variables through `styleVars`, type the positioner style as `CSSProperties`, and drop unnecessary slot-recipe casts.

## 0.6.0

### Minor Changes

- [#96](https://github.com/phthalo-dev/var-ui/pull/96) [`0623a95`](https://github.com/phthalo-dev/var-ui/commit/0623a957e09968859d18882d49677464c59f157b) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `CommandPalette` DX pass:
  
  - Items accept `onSelect`; `onAction` is now optional.
  - The palette closes itself after an item is chosen (`closeOnAction`, default `true`). Callers that closed it in `onAction` can drop that.
  - Items accept `icon` and `shortcut` (key-cap hints).
  - `hotkey` takes a combo string or array (`'mod+k'`, `'ctrl+shift+p'`) as well as a boolean.
  - New `controller` prop plus `createCommandPalette()` / `useCommandPalette()` to open the palette from outside the component tree.
  - New `highlightMatches` prop wraps matching text in a `<mark>`.
  - Core recipe gains `resultIcon`, `resultBody` and `resultShortcut` slots; `resultLink` is now a flex row.

- [#94](https://github.com/phthalo-dev/var-ui/pull/94) [`b0a8a10`](https://github.com/phthalo-dev/var-ui/commit/b0a8a1099bd246dcf59323bee581341311787055) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `CommandPalette` items accept an optional `group`. Consecutive items sharing a `group` render under a section heading, and keyboard navigation still moves through all items in order.

## 0.5.0

### Minor Changes

- [#91](https://github.com/phthalo-dev/var-ui/pull/91) [`e723033`](https://github.com/phthalo-dev/var-ui/commit/e7230339263e85b6447111ca9456ec9622357be5) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `EditableText`, which swaps a display element (such as a `Heading`) for an input on double-click, click, focus, or Enter/F2. Enter and blur commit, Escape cancels, and the input inherits the display element's typography.

- [#85](https://github.com/phthalo-dev/var-ui/pull/85) [`c961552`](https://github.com/phthalo-dev/var-ui/commit/c961552ea48d5670cddaf046652d63e9ce57f625) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Components now accept a `ref` prop and forward it to their root DOM element.

- [#82](https://github.com/phthalo-dev/var-ui/pull/82) [`6d369b2`](https://github.com/phthalo-dev/var-ui/commit/6d369b2fae2442ec7e4ff0a5e5a4b938ea44bec8) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `LayoutPanel` gains `hasResizeHandle` (and `resizeHandleLabel`): with `resizable`, it renders a `ResizeHandle` on the edge facing the content, in place of the divider. `ResizeHandle` gains `isReversed` to flip drag and arrow-key direction for end-side regions.

- [#81](https://github.com/phthalo-dev/var-ui/pull/81) [`7ac9a21`](https://github.com/phthalo-dev/var-ui/commit/7ac9a21009d1d41c9fc2d447f65b3c1b67a2619e) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `ResizeHandle` now drags with pointer events and pointer capture, so touch and pen input work and the drag keeps tracking outside the handle. The grab target extends 4px past the 1px visible line on each side (`touch-action: none` is set so touch drags don't scroll).

- [#80](https://github.com/phthalo-dev/var-ui/pull/80) [`2a2fee4`](https://github.com/phthalo-dev/var-ui/commit/2a2fee4a88f46295b2488e578c44e9da12ac6fa4) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - `Table.Row` and `Table.Cell` now forward remaining props (`onClick`, `onDoubleClick`, `data-*`, `aria-*`, `id`, …) to the underlying `<tr>`/`<td>`/`<th>` instead of silently dropping them.

## 0.4.0

### Minor Changes

- [#73](https://github.com/phthalo-dev/var-ui/pull/73) [`3febd35`](https://github.com/phthalo-dev/var-ui/commit/3febd3524eaae8aeeb346e3ceb8cc7e95358f739) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Let `CommandPalette` drive async results: add `onQueryChange`, `isLoading`/`loadingLabel`, and `filter={false}` to skip client-side filtering.

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
