# var-ui Roadmap

Current status only. Done work lives in git history and the changelogs; the audit that drives
the active workstreams is in [`audit/`](./audit/README.md).

## What exists

- **`@var-ui/core`**: about 100 TypeStyles recipes (`packages/core/src/components`), the
  token system (`designTokens`, `tokenValues`, `generateColors`), `createDesignTheme` /
  `defaultTheme`, cascade layers (`reset`, `base`, `tokens`, `components`, `overrides`,
  `utilities`), and the `atDarkMode` / `atReducedMotion` / `atForcedColors` / `atMoreContrast`
  condition helpers. Built to `dist`.
- **`@var-ui/react`**: React Aria based components over the core recipes, plus
  `DesignSystemProvider`, `DirectionProvider`, overlays on one shared root.
- **`@var-ui/astro`**: static Astro bindings with small progressive-enhancement scripts.
  Ships source.
- **`@var-ui/icons`**, **`@var-ui/cli`** (component catalog), docs site under `docs/` (Astro,
  deployed to Netlify), examples under `examples/`.
- Built on TypeStyles (`typestyles` ^0.33). Engine features var-ui relies on: token
  `modes` and conditions, `light-dark()` color leaves, `override()` and component `vars`,
  `typestyles/color-scale` and `typestyles/token-scale`. Engine work is tracked in the
  TypeStyles repo, not here.

## Audit workstreams

| Stream | Topic                                           | Status                                          |
| ------ | ----------------------------------------------- | ----------------------------------------------- |
| P0     | Correctness bugs                                | Done                                            |
| P1     | Packaging, narrow core imports, export trimming | Done                                            |
| P2/P3  | API contract: passthrough, vocabulary, overlays | Done (parts 1 to 3)                             |
| P4     | CSS-first theming, accessibility media features | In progress, see `audit/p4-spec.md`             |
| P5     | Internal duplication and cruft                  | Open                                            |
| P6     | Platform migration (dialog, popover, details)   | Open                                            |
| P7     | TypeStyles upstream fixes (casts, workarounds)  | Open, see `audit/detail/typestyles-upstream.md` |
| P8     | Component gaps                                  | Open, see `audit/detail/gaps.md`                |

## P4 in flight

- Reduced motion at the token level (duration tokens zero under `prefers-reduced-motion`),
  forced-colors and contrast handling, logical properties for RTL, magic numbers to tokens.
- A class name, CSS variable and `data-*` hook stability test, and a "write plain CSS" docs
  page (`docs/content/theming/plain-css.mdx`).
- Density stays a variant axis. A CSS-first density (tokens plus `data-density` on an
  ancestor) is not built.

## Component backlog

- Lightbox / Overlay.
- NavIcon / NavMenu.
- Chat: composer drawer, mention / token composer input, dictation button, tokenized text.
- Table filtering and column resize.
- Select polish: nullable / clear, sections, inline filter, start icon.
- Date and time fields, Calendar and Color pickers still hand-build some React Aria parts.

## Later

- Public theme gallery and packaging decision for standalone `@var-ui/theme-*` packages.
- Surface tone overrides (a marked subtree with fixed light or dark faces) using the
  TypeStyles `descendant` condition scope.
- Container queries for responsive components (layout, card, table). Nothing blocks authors
  from using `@container` today; var-ui just does not build features on it yet.
- Per-recipe structured docs for human and agent discovery, delivered through the CLI catalog.
- Progressive interactivity for Astro components beyond the current scripts.
