# RTL direction + SSR-safe responsive visibility

**Date:** 2026-08-05 (revised 2026-08-23)  
**Status:** Approved  
**Inspired by:** [Reshaped `useRTL`](https://reshaped.so/docs/getting-started/overview), [`Hidden` utility](https://reshaped.so/docs/getting-started/overview)  
**Related:** `DesignSystemProvider`, breakpoint tokens (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280), `useMediaQuery`, layout recipes, React Aria `I18nProvider`

## Summary

Two related DX gaps, one design pass:

1. **`DirectionProvider` + `useDirection()`** — propagate `dir`, optional `locale`, and a hook for directional icons. Stay on React Aria + TypeStyles.
2. **`Hidden`** — responsive show/hide via CSS `@media` + `display: none` so markup stays in the HTML (SSR-safe, no `useMediaQuery` branch rendering).

## Problem

### RTL

There is no documented `dir` propagation from the app root, no hook for mirroring directional icons, and a few remaining physical CSS properties in high-traffic chrome. `layout` / `LayoutPanel` / `menu` / `sideNav` chrome are already mostly logical.

React Aria overlays (`Popover`, `Menu`, `start` / `end` placement) take direction from **locale**, not from an independent `direction` prop. `I18nProvider` only accepts `locale`. Passing `direction="rtl"` without a locale does not flip those overlays unless we also wrap `I18nProvider`.

### Responsive visibility

Hiding content with `useMediaQuery` and conditional render causes SSR/client mismatch (flash or hydration warnings). Reshaped’s `Hidden` always renders markup and applies `display: none` through breakpoint CSS.

## Goals

| Goal                 | Detail                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Direction context    | `direction` on `DesignSystemProvider` / `DirectionProvider` sets `dir` and `{ direction, isRtl }` |
| RAC overlays         | Wrap `I18nProvider` so `start` / `end` placement can follow RTL when locale agrees                |
| `useDirection()`     | Defaults to `{ direction: 'ltr', isRtl: false }` when no provider (does **not** throw)            |
| Icon mirroring       | Opt-in `data-mirror` + `scaleX(-1)` — do not mirror the whole icon set                            |
| Logical CSS (narrow) | Fix remaining physical CSS in breadcrumbs and `mobileNav` slide                                   |
| `Hidden` SSR-safe    | `hide` boolean or mobile-first map → hashed class with `@media` + `display: none`                 |

## Non-goals (v1)

- Automatic locale detection
- `Visible` sugar (invert `hide` yourself)
- `VisuallyHidden` (separate future recipe; Spinner already inlines SR-only styles)
- Reshaped `s` / `m` / `l` breakpoint aliases — public keys are `base` plus `sm` / `md` / `lg` / `xl`
- `paddingStart` style props on layout primitives
- Astro i18n routing
- Mirroring every SVG; Calendar / Date month chevrons; Carousel `scrollBy({ left })`
- Boiling the ocean: `fileTree` / `tree` indent, `list` `paddingLeft`, `table` `borderRight`, `avatar` overlap, `prose`, `steps`, `chat`
- Rewriting `DocsPage` TOC (`max-width: 960px` is not a token) or replacing AppShell’s JS mobile nav with `Hidden`

## Decisions (locked)

1. **RAC:** `direction` sets `dir` **and** wraps RAC `I18nProvider`. `useDirection()` defaults to `ltr` outside a provider.
2. **Breakpoints:** TypeStyles tokens only (`sm` / `md` / `lg` / `xl`) plus `base` for 0px. No Reshaped aliases.
3. **Hide mechanism:** CSS `display: none` via `@media` + hashed class. Markup stays in HTML. `display: none` removes the subtree from the accessibility tree while hidden (correct for duplicate nav). Do not set the HTML `hidden` attribute (it cannot be media-query scoped).
4. **No `Visible` / `VisuallyHidden` in v1.**
5. **Nested `DirectionProvider`**, composed by `DesignSystemProvider`.

## Architecture

```
DesignSystemProvider
  ├── existing color mode / theme class
  └── DirectionProvider
        ├── dir (+ lang when locale is passed)
        ├── DirectionContext
        └── RAC I18nProvider (when locale or rtl workaround applies)

hiddenClassName({ hide })  →  hashed TypeStyles class
Hidden (React / Astro)     →  that class on `as` / a real HTML tag
```

`DirectionProvider` is a real nested provider. `DesignSystemProvider` composes it (`direction?`, `locale?`). Callers may nest another `DirectionProvider` for an RTL (or LTR) island.

**Where `dir` lives**

- Root `DesignSystemProvider` with `applyToDocument`: set `dir` on `document.documentElement`. Set `lang` on `html` **only when the caller passed `locale`**.
- Otherwise: set `dir` (and `lang` if `locale`) on the existing `display: contents` theme wrapper.
- Nested `DirectionProvider` **never** writes `document.documentElement`. It sets `dir` on its own `display: contents` wrapper so an island can override the document.

**RAC `I18nProvider` (locale-only)**

Adobe derives direction from locale. There is no independent `direction` prop.

| Caller input                           | `dir` / CSS                        | `I18nProvider` locale             | Overlays (`start` / `end`)            |
| -------------------------------------- | ---------------------------------- | --------------------------------- | ------------------------------------- |
| `direction="rtl"` + `locale="he-IL"`   | RTL                                | `he-IL`                           | Flip; dates/numbers follow `he`       |
| `direction="rtl"` only                 | RTL                                | `'ar'` **workaround, I18n only**  | Flip; do **not** set `html lang="ar"` |
| `locale="he-IL"` only                  | RTL (derived from `isRTL(locale)`) | `he-IL`                           | Flip                                  |
| `locale="en-US"` + `direction="rtl"`   | RTL                                | `en-US` (keep English formatting) | **May not flip** — document this      |
| `direction="ltr"` / omitted, no locale | LTR                                | Do not wrap (leave RAC default)   | LTR                                   |

Use RAC `isRTL(locale)` when deciding whether a provided locale is already RTL.

**Deriving `direction`:** if the caller omits `direction` but passes `locale`, set `direction` from `isRTL(locale)` (`rtl` vs `ltr`). If both are passed, **`direction` wins for `dir` / CSS** (the conflict row above). Real apps should pass a real `locale` (for example `he-IL`). The `'ar'` fallback exists so docs and demos that only set `direction="rtl"` still get overlay flip.

**`useDirection()` vs `useColorMode()`:** color mode throws outside `DesignSystemProvider`. Direction must **not** throw — default `{ direction: 'ltr', isRtl: false }`.

## Direction API

```ts
export type Direction = 'ltr' | 'rtl';

export type DirectionProviderProps = {
  direction?: Direction; // @default 'ltr'
  locale?: string;
  /** Only the root DesignSystemProvider passes true. Nested islands stay false. */
  applyToDocument?: boolean;
  children: ReactNode;
};

export function useDirection(): { direction: Direction; isRtl: boolean };
```

`DesignSystemProvider` gains the same `direction?` and `locale?` props and renders `DirectionProvider` inside the color-mode tree.

### Icon mirroring

Do not auto-mirror every `Icon`. Opt in:

```tsx
const { isRtl } = useDirection();
<Icon name="chevronRight" data-mirror={isRtl || undefined} />;
```

Icon recipe:

```css
[data-mirror] {
  transform: scaleX(-1);
}
```

`IconButton` forwards `data-mirror` to the inner `Icon` (Pagination uses `IconButton`, not `Icon`).

v1 callers:

- Pagination prev / next
- SideNav collapse + nested expand chevrons
- Tree expand chevron

## Hidden API

```ts
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Mobile-first and-up. `base` is 0px (unprefixed). Named keys use TypeStyles min-widths. */
export type HiddenMap = Partial<Record<'base' | Breakpoint, boolean>>;

export function hiddenClassName(options: { hide?: boolean | HiddenMap }): string;
```

React `Hidden`:

```ts
export type HiddenProps = {
  children: ReactNode;
  hide?: boolean | HiddenMap;
  /** @default 'div' */
  as?: ElementType;
  className?: string;
};
```

Semantics:

| `hide`                      | Result                                 |
| --------------------------- | -------------------------------------- |
| `true`                      | Always `display: none`                 |
| `false` / omitted / `{}`    | Always shown (`display: contents`)     |
| `{ md: true }`              | Visible below `md`, hidden `md` and up |
| `{ base: true, md: false }` | Hidden below `md`, visible `md` and up |

Unspecified keys inherit the previous value. Default at `base` is visible (`false`).

`base` is required so “hide on small screens” does not leave `0–639px` visible: `sm` is min-width `640px`, not “from 0”.

**CSS:** one hashed TypeStyles class (token breakpoints via `breakpoint(name, 'min')`). When shown: `display: contents` so the wrapper is not a flex/grid item. When hidden: `display: none`. No `!important`. No HTML `hidden` attribute.

Astro: `<Hidden hide={...}>` wraps the slot the same way; raw HTML uses `hiddenClassName` on a real tag (`<aside class={hiddenClassName({ hide: { md: true } })}>`).

## Recipe audit (v1)

Hidden does not wait on this list. Confirm already-logical (`layout` / `LayoutPanel`, `menu` `marginInlineStart`, `sideNav` chrome, `collapsible` open `rotate(180deg)`) and only change what still reads LTR:

| Area                      | Change                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| breadcrumbs               | Separator `marginLeft` → `marginInlineStart`                                              |
| mobileNav                 | `[dir="rtl"]` override so start/end `translateX(±100%)` still exit off the start/end edge |
| icon                      | `[data-mirror] { transform: scaleX(-1) }`                                                 |
| Pagination, SideNav, Tree | `data-mirror={isRtl \|\| undefined}` on directional chevrons                              |

Follow-up (logged, not this PR): `fileTree` / `tree` indent, `list`, `table`, `avatar`, `prose`, `steps`, `chat`, Carousel `scrollBy({ left })`, Calendar/Date chevrons.

## Tests

jsdom — do not assert layout under live media queries.

- Core: `hiddenClassName` for `true`, `{ md: true }`, and `{ base: true, md: false }` emits the matching `display` / `@media` pairing. Breadcrumbs uses `marginInlineStart`. Icon recipe includes `[data-mirror]`.
- React: `useDirection()` is `ltr` with no provider; `DirectionProvider` / `DesignSystemProvider direction` update context; `applyToDocument` sets `dir` (and `lang` only when `locale` is passed) on `html`; otherwise `dir` is on the theme wrapper. Nested `DirectionProvider` does not clobber `html`. `Hidden` always renders children, honors `as`.
- Do not unit-test RAC overlay flip. Document the locale workaround instead.

## Docs

- Component page `Hidden` (layout category): demos for hide-from-`md` and show-from-`md`; Astro demo uses `hiddenClassName` on a real tag.
- Getting started: `direction` + optional `locale` on `DesignSystemProvider`; pass a real RTL locale in apps; `direction="rtl"` alone uses `'ar'` for RAC placement only; LTR `locale` + `direction="rtl"` does not reliably flip overlays; `data-mirror` on Icon.
- RTL **island** demo (SideNav + Breadcrumbs + mirrored chevrons). Do not set `dir` on the whole docs site.
- No `Visible` / `VisuallyHidden` pages.

SSR no-flash is proven by the Hidden demo (markup + CSS), not by rewriting `DocsPage`.

## Packages / export

| Package         | Export                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@var-ui/core`  | `hiddenClassName`, `HiddenMap` / breakpoint types, icon `[data-mirror]`                                                           |
| `@var-ui/react` | `DirectionProvider`, `useDirection`, `Hidden`; `DesignSystemProvider` `direction` / `locale`; `Icon` / `IconButton` `data-mirror` |
| `@var-ui/astro` | `Hidden.astro`                                                                                                                    |
| docs            | Hidden page, getting-started notes, RTL island demo                                                                               |

One minor changeset covering the public API.

## Success criteria

- Hidden demo markup is in the SSR HTML and visibility is CSS-only (no hydration flash, no new `useMediaQuery` for that pattern).
- `direction="rtl"` island: SideNav + Breadcrumbs mirror; Pagination / SideNav / Tree chevrons use `data-mirror`.
- `useDirection()` works without a provider (defaults `ltr`).
- `applyToDocument` + `direction="rtl"` sets `html.dir`; nested island does not clobber it.
- Getting started documents the RAC locale limitation and the `'ar'` workaround.
