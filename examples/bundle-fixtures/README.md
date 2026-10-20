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

Library packages use `vp pack` with `unbundle: true` so consumer bundlers can tree-shake per module. `@var-ui/core` regenerates its export map after each pack via `scripts/generate-subpath-exports.mjs`. `@var-ui/react` publishes `./components/*`.
