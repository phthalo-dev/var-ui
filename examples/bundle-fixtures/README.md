# Bundle size fixtures

Small Vite apps that mirror **real customer setup**: they consume published `@var-ui/core` /
`@var-ui/react` **dist** output (no source aliases), use `@typestyles/vite` zero-runtime
extraction, and are checked by `scripts/bundle-budget.mjs`.

## Fixtures

| Fixture                         | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `button-only`                   | `Button` + `DesignSystemProvider` — primary tree-shaking signal |
| `form-kit`                      | Common form primitives without heavy React Aria date widgets    |
| `date-kit`                      | `Calendar` + `DateInput` — ceiling for RAC date primitives      |
| `gallery` (`examples/vite-app`) | Full component showcase — regression ceiling only               |

## Commands

```bash
# Build library + all fixtures, then assert budgets
pnpm test:bundle-budgets

# Record new baselines after intentional size changes
pnpm test:bundle-budgets:update
```

Baselines live in `baselines.json` (5% regression tolerance).

Each fixture's `typestyles-entry.ts` (run in Node by `@typestyles/vite`, so never tree-shaken) imports only
the component modules that fixture renders (`@var-ui/react/components/<X>`) plus
`@var-ui/core/register-default-theme`. React components import recipes from narrow
`@var-ui/core/components/<x>` subpaths (enforced by lint), so unused components add no CSS. Add the
modules a fixture renders to its entry when you change its app code.

Library packages use `vp pack` with `unbundle: true` so consumer bundlers can tree-shake per module. Both `@var-ui/core` and `@var-ui/react` publish static `./components/*` (and core `./shared/*`) wildcards; implementation helpers live under `src/internal/` and are not exported.
