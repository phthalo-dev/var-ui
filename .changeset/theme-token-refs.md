---
'@var-ui/core': minor
---

**Breaking:** theme token refs have one shape. `theme.tokens` and the `tokens` passed to theme `components` factories now give `{ name, var }` leaves for every namespace, like `designTokens`: `t.space.md.var`, `t.app.heroCover.var`. Custom namespaces used to be plain `var(--…)` strings. Built-in namespaces were typed as refs but arrived as strings at runtime, so `t.space.xs.var` inside a factory emitted `undefined`, which silently dropped declarations in theme overrides. Write `t.brand.glow.var` where you wrote `t.brand.glow`.
