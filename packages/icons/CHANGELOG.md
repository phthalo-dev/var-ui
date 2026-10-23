# @var-ui/icons

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
