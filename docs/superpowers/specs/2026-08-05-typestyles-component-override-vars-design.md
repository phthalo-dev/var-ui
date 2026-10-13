# Typestyles — typed `vars` in `override()`

**Date:** 2026-08-05  
**Status:** Implemented in [typestyles 0.22.0](https://github.com/type-styles/typestyles/pull/199)  
**Audience:** typestyles maintainers  
**Consumer:** [var-ui](https://github.com/var-ui/var-ui) (`createDesignTheme({ components })` → `override`)

## Summary

Library authors declare component-internal CSS custom properties with `c.vars()` inside `recipe()`. Consumers restyle those surfaces today by setting raw `--{scope}-{recipe}-{var}` strings in override style blocks — untyped, easy to mistype, and mixed with layout CSS.

Typestyles **0.21** already reserves a top-level `vars` key on `OverrideConfig` (`vars?: never`, comment: _"phase 2 — typed component vars"_) and ignores `vars` during override emission. This spec defines phase 2: **typed, first-class `vars` on override configs**, compiled to the same custom properties recipes already register.

## Problem

```ts
// Consumer today (var-ui forest theme)
sideNav: (t) => ({
  base: {
    root: {
      '--var-ui-side-nav-border': 'transparent', // stringly, no autocomplete
      margin: t.space[2].var,
    },
  },
}),
```

Pain points:

1. **No typed keys** — consumers guess `--var-ui-side-nav-border` vs `headingColor` vs `heading-color`.
2. **Mixed concerns** — semantic var overrides sit beside layout properties (`margin`, `borderRadius`).
3. **Duplicated knowledge** — var names are an implementation detail of the recipe; only authors should know the `--…` spelling.
4. **Nested vars** — `padding.outer.x` flattens to `padding-outer-x`; manual strings are worse.

var-ui (and any design-system wrapper) wants consumers to write:

```ts
sideNav: (t) => ({
  vars: {
    border: 'transparent',
    headingColor: t.color.text.primary,
  },
  base: {
    root: { margin: t.space[2].var, borderRadius: t.radius.lg.var },
  },
}),
```

…with full TypeScript autocomplete on `border`, `headingColor`, etc.

## Goals

| Goal                    | Detail                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| **Typed override API**  | Top-level `vars` on `OverrideConfig` / `SlotOverrideConfig` / `FlatOverrideConfig`                     |
| **Logical keys**        | Consumers use recipe var keys (`border`, `padding.outer.x`), not `--…` names                           |
| **Compile-time safety** | Unknown keys error in TS when schema is known; dev warnings at runtime otherwise                       |
| **Runtime parity**      | `override(recipe, { vars })` emits the same CSS as setting custom properties on the var host slot      |
| **Zero recipe churn**   | Existing `c.vars({ … })` declarations continue to work; no migration for authors who only use defaults |
| **Downstream wrappers** | `OverrideConfigFor<typeof button>` (and slot variants) gains `vars` without wrapper-specific shims     |

## Non-goals (v1)

- Per-slot `vars` blocks (e.g. `base.stickyTop.vars`) — all internal vars target the **var host slot** (see below).
- Variant-scoped var overrides (`variants.tone.accent.vars`) — defer; base-only in v1.
- Changing `@property` registration or var naming rules.
- Replacing `assignVars()` for per-instance inline styles — that API stays for instance-level tweaks.

## Current state (typestyles 0.21)

Relevant existing behavior:

1. **`c.vars(definitions)`** — flattens nested objects to logical paths (`padding.outer.x` → `padding-outer-x`), registers `--{scopedNamespace}-{path}` with optional `@property` syntax, returns `ComponentVarRefTree` (`.name`, `.var` on leaves).

2. **`mergeComponentVarDefaultsInto(config, defaults)`** — merges `varBaseDefaults` (`Record<cssVarName, value>`) onto the **var host slot**:
   - Slotted recipes: `root` if present in `slots`, else first slot.
   - Dimensioned / flat: `base`.

3. **`override()`** — `emitFlatOverride` already skips `key === 'vars'`; **no emission** for `vars` today. `transformOverrideConfigWithUtils` also preserves `vars` untouched.

4. **`ComponentMeta`** — `{ namespace, kind, base, slots, variants }` — **does not** expose registered var paths/names to overrides.

5. **`OverrideConfig`** — `vars?: never` blocks typed usage.

## Proposed consumer API

### Dimensioned component (button)

```ts
override(button, {
  vars: {
    background: 'crimson',
    foreground: 'white',
  },
  base: { borderRadius: '999px' },
  variants: {
    tone: { accent: { textTransform: 'uppercase' } },
  },
});
```

### Slotted component (side-nav)

```ts
override(sideNav, {
  vars: {
    border: 'transparent',
    headingColor: 'var(--brand-heading)',
  },
  base: {
    root: { margin: '8px' },
  },
});
```

### Nested logical paths (layout-style)

```ts
override(layout, {
  vars: {
    padding: {
      outer: { x: '24px', y: '16px' },
    },
    content: { width: '1200px' },
  },
});
```

Equivalent flat assignment (also supported):

```ts
vars: { 'padding.outer.x': '24px' } // optional sugar; prefer nested object
```

### Emitted CSS (illustrative)

```css
@layer overrides {
  .theme-acme .var-ui-side-nav {
    --var-ui-side-nav-border: transparent;
    --var-ui-side-nav-heading-color: var(--brand-heading);
  }
}
```

Layout overrides on `base.root` continue to emit separately on `.var-ui-side-nav` (merged in cascade).

## Var host slot

Reuse **`mergeComponentVarDefaultsInto` host resolution** — overrides must target the same element that owns default var declarations.

| Recipe kind           | Host slot                             | Selector source   |
| --------------------- | ------------------------------------- | ----------------- |
| `dimensioned`         | `base`                                | `meta.base`       |
| `flat`                | `base`                                | `meta.base`       |
| `slot` / `multi-slot` | `root` if in `slots`, else `slots[0]` | `meta.base[slot]` |

`vars` always compiles to the host slot’s class selector, never to child slots.

## Runtime design

### 1. Capture var registry at component definition

Extend `createComponentConfigContextPair` to accumulate:

```ts
type RegisteredComponentVar = {
  /** Logical path: `border`, `padding-outer-x` */
  path: string;
  /** Full custom property name: `--var-ui-side-nav-border` */
  name: string;
  syntax?: string;
  defaultValue?: string;
};

type ComponentVarRegistry = {
  hostSlot: string;
  vars: RegisteredComponentVar[];
  byPath: Map<string, RegisteredComponentVar>;
};
```

Attach to `ComponentMeta`:

```ts
type ComponentMetaBase = {
  // …existing fields
  varRegistry?: ComponentVarRegistry;
};
```

Populate `byPath` in `registerVarValue` / `varsFn` / `varsDeclareFn` (same flatten path as today).

### 2. Resolve `config.vars` → style declarations

New helper `resolveVarOverrides(registry, varsInput): Record<string, string>`:

1. Flatten nested `varsInput` to logical paths (same algorithm as `flattenComponentVars`, but values are consumer assignments, not descriptors).
2. For each path, look up `registry.byPath`. Unknown path → dev warning, skip in production.
3. Output `{ [registered.name]: resolvedValue }` for `serializeStyle`.

Value resolution:

- `string | number` → `String(value)`
- `CSSVarRef` (`var(--…)`) → pass through
- `{ light, dark }` → use existing `serializeStyle` color-mode expansion (same as style blocks)

### 3. Emit in `createOverride`

Before / alongside existing emitters, for every override config shape:

```ts
if (config.vars && meta.varRegistry) {
  const declarations = resolveVarOverrides(meta.varRegistry, config.vars);
  const hostClass = resolveHostClass(meta, meta.varRegistry.hostSlot);
  emitStyledSelector(classNaming, `.${hostClass}`, declarations, options, 'vars');
}
```

If `config.vars` is set but `varRegistry` is empty → dev warning: _"component has no registered internal vars"_.

Merge order: var declarations and `base[hostSlot]` both target the same selector; cascade merge is fine (disjoint keys). If both set the same custom property, **`base` wins** (emit `base` after `vars`, or document `vars` lower priority).

**Recommendation:** emit `vars` first, then `base` so explicit layout blocks can still override a var in the same override call if needed.

### 4. `override` utils / conditions

- `vars` is **not** expanded by style utils (`calc`, breakpoints on var values are rare). Keep as-is in `transformOverrideConfigWithUtils`.
- `conditions` do not apply to `vars` in v1.

## Type system design

### New types

```ts
/** Leaf values assignable to a component internal var */
type ComponentVarAssignValue = string | number | CSSVarRef | { light: string; dark: string }; // when colorModes configured

/** Map logical definition tree → partial assignment tree */
type ComponentVarValues<T extends ComponentVarDefinitions> = {
  [K in keyof T]?: T[K] extends ComponentVarDescriptor | string | number
    ? ComponentVarAssignValue
    : T[K] extends Record<string, unknown>
      ? ComponentVarValues<T[K]>
      : never;
};
```

### Attaching schema to components (for inference)

`c.vars(definitions)` alone is not visible to TypeScript on the return type. Two supported patterns:

#### Pattern A — exported definitions (recommended for design systems)

```ts
export const sideNavVarDefinitions = {
  border: { value: '…', syntax: '<color>' as const },
  headingColor: { value: '…', syntax: '<color>' as const },
} as const;

export const sideNav = styles.component('side-nav', (c) => {
  const v = c.vars(sideNavVarDefinitions);
  return { slots: ['root', …], root: { … } };
});

export type SideNavOverride = OverrideConfigFor<
  typeof sideNav,
  typeof sideNavVarDefinitions
>;
```

#### Pattern B — optional `varDefinitions` on component options

```ts
styles.component('side-nav', factory, {
  layer: 'components',
  varDefinitions: sideNavVarDefinitions,
});
```

Stamps `__varDefinitions` on the return type for inference without a second generic at call sites.

### Updated override config types

```ts
type OverrideConfig<
  V extends VariantDefinitions,
  Vars extends ComponentVarDefinitions = never,
> = {
  base?: StylableOverride;
  variants?: …;
  compoundVariants?: …;
  vars?: Vars extends never ? never : Partial<ComponentVarValues<Vars>>;
};

type SlotOverrideConfig<
  Slots extends readonly string[],
  V extends SlotVariantDefinitions<Slots[number]>,
  Vars extends ComponentVarDefinitions = never,
> = {
  base?: Partial<Record<Slots[number], StylableOverride>>;
  variants?: …;
  compoundVariants?: …;
  vars?: Vars extends never ? never : Partial<ComponentVarValues<Vars>>;
};

// FlatOverrideConfig and MultiSlotOverrideConfig gain the same optional `vars`.
```

### `OverrideConfigFor`

```ts
type OverrideConfigFor<C, Vars extends ComponentVarDefinitions = InferVarDefinitions<C>> =
  C extends ComponentReturn<infer V>
    ? OverrideConfig<V, Vars>
    : C extends SlotComponentFunction<infer Slots, infer V>
      ? SlotOverrideConfig<Slots, V, Vars>
      : // …other branches
        never;

type InferVarDefinitions<C> = C extends {
  readonly __varDefinitions: infer D extends ComponentVarDefinitions;
}
  ? D
  : never;
```

When schema is unknown, `vars` is optional `Record<string, ComponentVarAssignValue>` (escape hatch) or omitted from the type — **prefer dev-time runtime validation + docs** over fully untyped `vars`.

## Library author guidance

1. **Export `*VarDefinitions` const** alongside themeable recipes (var-ui already does this for `layout`).
2. **Declare each var once** via `c.vars(definitions)`; use `v.border.var` in styles, not hard-coded `--…` strings.
3. **Document public vars** in component docs (var-ui: CSS variables reference page can read `varRegistry` from meta in a follow-up).

Optional helper (typestyles export):

```ts
/** Build `[var.name]: value` for non-override contexts (e.g. inline style) */
function assignComponentVars<T extends ComponentVarDefinitions>(
  definitions: T,
  values: Partial<ComponentVarValues<T>>,
  namespace: string,
  scopeId?: string,
): Record<string, string>;
```

Uses the same flatten + naming rules as `c.vars` without requiring a mounted component.

## var-ui adoption (downstream)

Once typestyles ships this:

1. Bump `typestyles` catalog dep in var-ui.
2. Remove any var-ui shim that rewrites `vars` → custom properties (if added before upstream lands).
3. Extract inline `c.vars({ … })` to exported `*VarDefinitions` for themeable nav chrome (`sideNav`, `topNav`) first, then remaining recipes.
4. Update `docs/content/theming/customize.mdx` — **prefer `vars` over raw `--…` strings** for single-property component tweaks.
5. `ThemeComponentsConfig` inherits typing via `OverrideConfigFor` — no separate var-ui override type layer.

Example target (forest theme):

```ts
import { sideNavVarDefinitions } from '@var-ui/core'; // optional: re-export for docs

export const forestTheme = createDesignTheme({
  name: 'forest',
  components: {
    sideNav: (t) => ({
      vars: { border: 'transparent' },
      base: {
        root: {
          margin: t.space[2].var,
          borderRadius: t.radius.lg.var,
          overflow: 'hidden',
        },
      },
    }),
  },
});
```

## Error handling & dev warnings

| Condition                               | Behavior                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Unknown var key in `vars`               | `console.warn`, skip key (dev); silent skip (prod)                           |
| `vars` on component with no registry    | warn once per override call                                                  |
| `vars: {}`                              | no-op                                                                        |
| Assign value incompatible with `syntax` | no compile-time enforcement in v1; optional dev-only `@property` check later |

## Testing (typestyles)

### Unit

- `resolveVarOverrides` — flat + nested paths, unknown keys, `CSSVarRef`, `{ light, dark }`
- Host slot selection for dimensioned / flat / slot / multi-slot configs
- `createOverride` emits expected rules under `selectorPrefix` + `layer`

### Integration

- Override `vars` + `base` on same host: disjoint keys merge; collision policy documented
- Attribute naming mode (var-ui uses `mode: 'attribute'`)
- Zero-runtime extraction (`@typestyles/vite`) includes var override rules

### Type tests (tsd / expect-type)

- `OverrideConfigFor<typeof sideNav, typeof sideNavVarDefinitions>` accepts known keys, rejects unknown keys
- Nested `padding.outer.x` typing
- Components without `varDefinitions` → `vars` absent or `never`

## Implementation phases

| Phase  | Work                                                                                   |
| ------ | -------------------------------------------------------------------------------------- | --- |
| **P0** | `ComponentVarRegistry` + attach to meta at definition time                             |
| **P1** | `resolveVarOverrides` + emit in `createOverride` (all recipe kinds)                    |
| **P2** | Type definitions: `ComponentVarValues`, extend `OverrideConfig*` + `OverrideConfigFor` |
| **P3** | `varDefinitions` component option + `InferVarDefinitions`                              | 0   |
| **P4** | Docs + llms.txt + migration note; optional `assignComponentVars` helper                |
| **P5** | var-ui bump + recipe extraction (consumer, separate PR)                                |

## Open questions

1. **Collision policy** — if `base.root['--var-ui-side-nav-border']` and `vars.border` both set, should TS forbid duplicate? (Recommend: allow, `base` wins at runtime; document.)
2. **Untyped escape hatch** — should `vars` be allowed on any override as `Record<string, …>` when schema unknown, or strictly opt-in via `varDefinitions`?
3. **Public meta API** — expose `getComponentVarRegistry(component)` for docs generators (var-ui `CssVariableReference`)?
4. **Minimum typestyles version** — minor bump (0.22) since this replaces `vars?: never` with real types.

## References

- typestyles 0.21: `OverrideConfig.vars?: never` — `dist/index.d.ts` ~L444
- Runtime: `mergeComponentVarDefaultsInto`, `createComponentConfigContextPair`, `createOverride` — `dist/index.js`
- var-ui precedent: `packages/core/src/components/layoutShellVars.ts`
- var-ui consumer path: `packages/core/src/theme-component-overrides.ts` → `override(…, { selectorPrefix: '.theme-…' })`
