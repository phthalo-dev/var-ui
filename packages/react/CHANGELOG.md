# @var-ui/react

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
