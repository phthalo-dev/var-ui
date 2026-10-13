# Responsive layout props

**Date:** 2026-08-05  
**Status:** Proposal  
**Inspired by:** [Reshaped `View` responsive properties](https://reshaped.so/docs/utilities/view)  
**Related:** `stack`, `grid`, `section`, `breakpoint` tokens, `breakpoint()`

## Summary

Add a **CSS-first responsive value layer** so layout primitives accept mobile-first breakpoint objects (`{ sm: 'column', lg: 'row' }`) without exploding recipe variant matrices or requiring client-only hooks for layout.

v1 targets **`Stack` / `HStack` / `VStack`** and **`Grid`**. Scalar values keep today's API unchanged.

## Problem

Layout recipes today only support static variants:

```tsx
<Stack direction="column" gap="md" />
```

Responsive layouts require custom CSS, duplicate wrappers, or `useMediaQuery` branches that diverge between SSR and client:

```tsx
// Today — awkward and SSR-fragile
const isLg = useMediaQuery('(min-width: 1024px)');
<Stack direction={isLg ? 'row' : 'column'} />;
```

Reshaped solves this with responsive object syntax on `View` props, compiled to media queries at build time. var-ui needs an equivalent that fits TypeStyles + framework-agnostic recipes.

## Goals

| Goal                       | Detail                                                                          |
| -------------------------- | ------------------------------------------------------------------------------- |
| **SSR-safe**               | Responsive values emit `@media` rules in extracted CSS — no layout flash        |
| **Backward compatible**    | `direction="row"` continues to work; responsive is opt-in                       |
| **Typed**                  | `Responsive<T>` generic with breakpoint keys `sm \| md \| lg \| xl`             |
| **Recipe-agnostic helper** | Shared `responsive()` utility reusable by future primitives (`Section`, `Text`) |
| **Token-aligned**          | Media queries use `designBreakpoints` via `breakpoint()`                        |

## Non-goals (v1)

- Responsive props on every component (buttons, inputs, etc.)
- Reshaped-style numeric gap multipliers (`gap={2}` → 8px) — keep token scale names
- Container queries (named container query exists separately)
- Astro-specific responsive helpers (recipes work everywhere CSS loads)

## Proposed API

### Types (`packages/core/src/responsive.ts`)

```ts
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Mobile-first: base value optional; each key applies from that breakpoint upward. */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export function isResponsive<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null;
}
```

### React — `Stack`

```tsx
<Stack direction={{ sm: 'column', lg: 'row' }} gap={{ sm: 'sm', lg: 'lg' }} align="stretch" />
```

Scalar props unchanged:

```tsx
<Stack direction="row" gap="md" />
```

### Core helper — `responsiveRules()`

```ts
import { styles } from './runtime';

type CSSProperty = string;

/**
 * Expand a responsive value into base + @media style blocks.
 * Mobile-first: sm applies from 640px, md from 768px, etc.
 */
export function responsiveRules(
  property: CSSProperty,
  value: Responsive<string | number>,
): Record<string, unknown>;
```

Example output for `responsiveRules('flexDirection', { sm: 'column', lg: 'row' })`:

```css
/* base: implicit column if only lg specified — see resolution rules */
flex-direction: column;
@media (min-width: 1024px) {
  flex-direction: row;
}
```

**Resolution rules (mobile-first):**

1. If value is scalar → single declaration, no media queries.
2. If object → smallest defined breakpoint is also the **base** (unprefixed) value.
3. Larger breakpoints override via `min-width` media queries from `breakpoint(name, 'min')`.

### Recipe integration — `stack`

Add a parallel entry point rather than overloading variant keys:

```ts
// packages/core/src/components/stack.ts
export function stackResponsive(options: {
  direction?: Responsive<'column' | 'row'>;
  gap?: Responsive<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
  align?: Responsive<'start' | 'center' | 'end' | 'stretch'>;
  justify?: Responsive<'start' | 'center' | 'end' | 'between'>;
  wrap?: Responsive<boolean>;
}): string; // className
```

`stackResponsive()` composes:

1. Base `stack()` call with default/min-breakpoint variants.
2. A scoped utility class from `styles.rule()` with responsive `@media` overrides for CSS properties (`flexDirection`, `gap` via custom property, etc.).

**Gap handling:** map token names to `t.space[n].var` inside media blocks rather than reusing variant enum (variants can't be responsive today).

### React implementation sketch

```tsx
export function Stack({ direction = 'column', gap = 'md', ... }: StackProps) {
  const hasResponsive =
    isResponsive(direction) || isResponsive(gap) || /* ... */;

  if (!hasResponsive) {
    return <div {...recipeProps(stack({ direction, gap, ... }), className)} />;
  }

  return (
    <div
      {...recipeProps(stackResponsive({ direction, gap, ... }), className)}
      {...props}
    />
  );
}
```

## Architecture

```
Responsive<T> prop
  → stackResponsive() / gridResponsive()
    → responsiveRules() per property
      → styles.rule({ ...responsiveRules('flexDirection', direction) })
        → extracted CSS with @media (SSR-safe)
```

Breakpoint source of truth remains `packages/core/src/tokens/defaults/breakpoint.ts` + `runtime.ts` `breakpoints` config.

## Implementation plan

| Step | Work                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------- |
| 1    | Add `responsive.ts` types + `responsiveRules()` with tests against emitted CSS                    |
| 2    | Add `stackResponsive()` + unit tests                                                              |
| 3    | Extend `Stack` / `HStack` / `VStack` props with `Responsive<>` unions                             |
| 4    | Add `gridResponsive()` for `columns` / `gap` (if `grid` recipe exists with column variants)       |
| 5    | Docs demo: responsive hero layout (column on mobile, row on desktop)                              |
| 6    | Optional: `useResponsiveValue()` hook for non-layout cases (document as client-only escape hatch) |

## Open questions

1. **Class name stability** — should `stackResponsive()` hash options for deterministic class names (TypeStyles `rule` behavior) or use a data-attribute + inline `<style>` per instance? Prefer hashed utility class for zero runtime cost.
2. **Grid column spans** — Reshaped `View.Item columns={6}` responsive object is v2; v1 is direction/gap/align only.
3. **Extend to `Text`/`Heading`** — follow same helper once layout proves out.

## Success criteria

- Responsive `Stack` renders identical layout on SSR and after hydration.
- No new runtime JS required for layout when using responsive props.
- TypeScript errors on invalid breakpoint keys or incompatible values.
