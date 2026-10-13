# RTL direction + Hidden Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `DirectionProvider` / `useDirection()` (with RAC `I18nProvider` wrapping) and an SSR-safe `Hidden` utility so RTL `dir` and responsive show/hide work without `useMediaQuery` branch rendering.

**Architecture:** Pure helpers (`hiddenStyle`, `resolveDirection`, `resolveI18nProviderLocale`) sit under testable modules. Static TypeStyles `style` pieces (utilities layer) compose into `hiddenClassName` so CSS extracts at build time. `DesignSystemProvider` composes `DirectionProvider`. Nested islands set `dir` on a `display: contents` wrapper and never write `document.documentElement`.

**Tech Stack:** React 19, react-aria-components, `@react-aria/i18n`, TypeStyles, Vitest via `vp test`, Testing Library, Astro.

**Spec:** `docs/superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md`

## Global Constraints

- Stay on React Aria + TypeStyles. Do not add `@base-ui/react`.
- `useDirection()` defaults to `{ direction: 'ltr', isRtl: false }` outside a provider — it does **not** throw (unlike `useColorMode`).
- Public Hidden keys are `base` plus `sm` / `md` / `lg` / `xl` only. No Reshaped `s` / `m` aliases. No `visible` prop. No `VisuallyHidden`.
- `hide` is mobile-first and-up. Default at `base` is visible. Shown: `display: contents`. Hidden: `display: none`. No HTML `hidden` attribute. No `!important`.
- `'ar'` is an `I18nProvider` locale workaround only — never set `html lang="ar"` unless the caller passed `locale`.
- If both `direction` and `locale` are set, `direction` wins for `dir` / CSS. If `direction` is omitted and `locale` is set, derive `direction` from RAC `isRTL(locale)`.
- Nested `DirectionProvider` never writes `document.documentElement`.
- Do not rewrite `DocsPage` TOC (`max-width: 960px`) or replace AppShell JS mobile nav.
- Do not convert `fileTree` / `tree` indent, `list`, `table`, `avatar`, `prose`, `steps`, `chat`, Carousel `scrollBy({ left })`, or Calendar/Date chevrons.
- Before Task 1: create an isolated worktree from **updated `origin/main`** (`using-git-worktrees`) on branch `feat/rtl-hidden`. Do not implement on the stale overlay-lifecycle worktree.
- Run `vp test run <file>` after each code task; `vp check` before the changeset.

## File map

| File                                           | Responsibility                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `packages/core/src/components/hidden.ts`       | `hiddenStyle`, static `style` pieces, `hiddenClassName`           |
| `packages/core/src/components/hidden.test.ts`  | Style-object + class-name tests                                   |
| `packages/core/src/styles.ts`                  | Side-effect import so Hidden CSS extracts                         |
| `packages/core/src/index.ts`                   | Public export of Hidden types/helpers                             |
| `packages/core/src/components/icon.ts`         | `[data-mirror] { transform: scaleX(-1) }`                         |
| `packages/core/src/components/breadcrumbs.ts`  | `marginLeft` → `marginInlineStart`                                |
| `packages/core/src/components/mobileNav.ts`    | `[dir="rtl"]` `translateX` flip                                   |
| `packages/react/src/direction.ts`              | `Direction` type, `resolveDirection`, `resolveI18nProviderLocale` |
| `packages/react/src/DirectionProvider.tsx`     | Context, `dir`/`lang`, RAC `I18nProvider`                         |
| `packages/react/src/DesignSystemProvider.tsx`  | Compose `DirectionProvider` (`direction?`, `locale?`)             |
| `packages/react/src/components/Hidden.tsx`     | React wrapper around `hiddenClassName`                            |
| `packages/react/src/icons/Icon.tsx`            | `data-mirror` on the icon span                                    |
| `packages/react/src/components/IconButton.tsx` | Forward `data-mirror` to inner `Icon`                             |
| `packages/react/src/components/Pagination.tsx` | Mirror prev/next chevrons                                         |
| `packages/react/src/components/SideNav.tsx`    | Mirror collapse + nested expand chevrons                          |
| `packages/react/src/components/Tree.tsx`       | Mirror expand chevron                                             |
| `packages/astro/src/components/Hidden.astro`   | Slot + `hiddenClassName`                                          |
| `packages/astro/index.ts`                      | Export `Hidden`                                                   |
| `docs/content/components/hidden.mdx`           | Component page                                                    |
| `docs/content/docs/getting-started.mdx`        | `direction` / `locale` / RAC limitation                           |
| `.changeset/rtl-hidden.md`                     | Minor for core, react, astro                                      |

---

### Task 1: `hiddenStyle` + `hiddenClassName`

**Files:**

- Create: `packages/core/src/components/hidden.ts`
- Create: `packages/core/src/components/hidden.test.ts`
- Modify: `packages/core/src/styles.ts` (add `import './components/hidden';` next to the other side-effect imports)
- Modify: `packages/core/src/index.ts` (export Hidden helpers; do **not** export them from `packages/core/src/components/index.ts` — `hiddenClassName` is a function and would fail `themeableComponents` completeness)

**Interfaces:**

- Produces: `HiddenBreakpoint`, `HiddenMap`, `hiddenStyle(hide?: boolean | HiddenMap)`, `hiddenClassName(options?: { hide?: boolean | HiddenMap }): string`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vite-plus/test';
import { styles } from '../runtime';
import { hiddenClassName, hiddenStyle } from './hidden';

describe('hiddenStyle', () => {
  it('hides at every size when hide is true', () => {
    expect(hiddenStyle(true)).toEqual({ display: 'none' });
  });

  it('shows with display contents when hide is omitted, false, or empty', () => {
    expect(hiddenStyle()).toEqual({ display: 'contents' });
    expect(hiddenStyle(false)).toEqual({ display: 'contents' });
    expect(hiddenStyle({})).toEqual({ display: 'contents' });
  });

  it('hides from md up when hide is { md: true }', () => {
    expect(hiddenStyle({ md: true })).toEqual({
      display: 'contents',
      [breakpoint('md', 'min')]: { display: 'none' },
    });
  });

  it('shows from md up when hide is { base: true, md: false }', () => {
    expect(hiddenStyle({ base: true, md: false })).toEqual({
      display: 'none',
      [breakpoint('md', 'min')]: { display: 'contents' },
    });
  });
});

describe('hiddenClassName', () => {
  it('returns a class string for always-hidden and mapped hide', () => {
    expect(hiddenClassName({ hide: true })).toContain('hidden-always');
    expect(hiddenClassName({ hide: { md: true } })).toContain('hidden-md-true');
    expect(hiddenClassName({ hide: { base: true, md: false } })).toContain('hidden-base-true');
    expect(hiddenClassName({ hide: { base: true, md: false } })).toContain('hidden-md-false');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/core/src/components/hidden.test.ts`

Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
import { cx } from 'typestyles';
import { styles, typestyles } from '../runtime';

export type HiddenBreakpoint = 'sm' | 'md' | 'lg' | 'xl';
export type HiddenMap = Partial<Record<'base' | HiddenBreakpoint, boolean>>;

const HIDDEN_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const satisfies readonly HiddenBreakpoint[];
const layer = { layer: 'utilities' as const };

export function hiddenStyle(hide?: boolean | HiddenMap): Record<string, unknown> {
  if (hide === true) return { display: 'none' };
  if (hide === false || hide == null || Object.keys(hide).length === 0) {
    return { display: 'contents' };
  }
  const style: Record<string, unknown> = {};
  if ('base' in hide) {
    style.display = hide.base ? 'none' : 'contents';
  } else {
    style.display = 'contents';
  }
  for (const bp of HIDDEN_BREAKPOINTS) {
    if (bp in hide) {
      style[breakpoint(bp, 'min')] = { display: hide[bp] ? 'none' : 'contents' };
    }
  }
  return style;
}

const hiddenAlways = typestyles.style('hidden-always', { display: 'none' }, layer);
const hiddenBaseTrue = typestyles.style('hidden-base-true', { display: 'none' }, layer);
const hiddenBaseFalse = typestyles.style('hidden-base-false', { display: 'contents' }, layer);

const hiddenAt = {
  sm: {
    true: typestyles.style(
      'hidden-sm-true',
      { [breakpoint('sm', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-sm-false',
      { [breakpoint('sm', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  md: {
    true: typestyles.style(
      'hidden-md-true',
      { [breakpoint('md', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-md-false',
      { [breakpoint('md', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  lg: {
    true: typestyles.style(
      'hidden-lg-true',
      { [breakpoint('lg', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-lg-false',
      { [breakpoint('lg', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  xl: {
    true: typestyles.style(
      'hidden-xl-true',
      { [breakpoint('xl', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-xl-false',
      { [breakpoint('xl', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
} as const;

export function hiddenClassName(options: { hide?: boolean | HiddenMap } = {}): string {
  const hide = options.hide;
  if (hide === true) return hiddenAlways;
  if (
    hide === false ||
    hide == null ||
    (typeof hide === 'object' && Object.keys(hide).length === 0)
  ) {
    return hiddenBaseFalse;
  }
  const classes: string[] = [];
  if ('base' in hide) {
    classes.push(hide.base ? hiddenBaseTrue : hiddenBaseFalse);
  } else {
    classes.push(hiddenBaseFalse);
  }
  for (const bp of HIDDEN_BREAKPOINTS) {
    if (bp in hide) {
      classes.push(hide[bp] ? hiddenAt[bp].true : hiddenAt[bp].false);
    }
  }
  return cx(...classes);
}
```

Add to `packages/core/src/styles.ts` (extraction entry must import the module so the static classes land in `typestyles.css`):

```ts
import './components/hidden';
```

Add to `packages/core/src/index.ts`:

```ts
export {
  hiddenClassName,
  hiddenStyle,
  type HiddenBreakpoint,
  type HiddenMap,
} from './components/hidden';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test run packages/core/src/components/hidden.test.ts`

Expected: PASS. If class strings do not contain `hidden-always` (hashed names), inspect the actual string and assert with `toContain` on the real token TypeStyles emits — do not weaken the style-object tests.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/hidden.ts packages/core/src/components/hidden.test.ts packages/core/src/styles.ts packages/core/src/index.ts
git commit -m "$(cat <<'EOF'
feat(core): add SSR-safe hiddenClassName utility

EOF
)"
```

---

### Task 2: React `Hidden`

**Files:**

- Create: `packages/react/src/components/Hidden.tsx`
- Create: `packages/react/src/components/Hidden.test.tsx`
- Modify: `packages/react/src/components/index.ts` (export next to `Center`)
- Modify: `packages/react/src/index.ts` (root barrel is an **explicit** list — add `Hidden` / `HiddenProps` next to `Center`, around line 96)

**Interfaces:**

- Consumes: `hiddenClassName({ hide })` from `@var-ui/core`
- Produces: `HiddenProps`, `Hidden`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Hidden } from './Hidden';

describe('Hidden', () => {
  it('always renders children', () => {
    render(
      <Hidden hide={{ md: true }}>
        <span>sidebar</span>
      </Hidden>,
    );
    expect(screen.getByText('sidebar')).toBeTruthy();
  });

  it('honors as', () => {
    const { container } = render(
      <Hidden as="aside" hide={{ md: true }}>
        nav
      </Hidden>,
    );
    expect(container.querySelector('aside')).toBeTruthy();
  });

  it('applies a hidden class for hide true', () => {
    const { container } = render(<Hidden hide>secret</Hidden>);
    expect(container.firstElementChild?.className).toContain('hidden-always');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/react/src/components/Hidden.test.tsx`

Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react';
import { createElement } from 'react';
import { hiddenClassName, type HiddenMap } from '@var-ui/core';
import { cx } from './utils';

export type HiddenProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  hide?: boolean | HiddenMap;
  /** @default 'div' */
  as?: ElementType;
};

export function Hidden({
  as = 'div',
  hide,
  className,
  children,
  ...props
}: HiddenProps): JSX.Element {
  return createElement(
    as,
    { ...props, className: cx(hiddenClassName({ hide }), className) },
    children,
  );
}
```

Export from `packages/react/src/components/index.ts` immediately after Center:

```ts
export { Hidden, type HiddenProps } from './Hidden';
```

In `packages/react/src/index.ts`, add `Hidden` and `type HiddenProps` to the existing `./components` import/export list next to `Center`.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test run packages/react/src/components/Hidden.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/components/Hidden.tsx packages/react/src/components/Hidden.test.tsx packages/react/src/components/index.ts packages/react/src/index.ts
git commit -m "$(cat <<'EOF'
feat(react): add Hidden wrapper for CSS media-query hide

EOF
)"
```

---

### Task 3: Direction helpers + `DirectionProvider`

**Files:**

- Create: `packages/react/src/direction.ts`
- Create: `packages/react/src/direction.test.ts`
- Create: `packages/react/src/DirectionProvider.tsx`
- Create: `packages/react/src/DirectionProvider.test.tsx`
- Modify: `packages/react/package.json` — add `"@react-aria/i18n": "catalog:"` if the catalog has it; otherwise add the version already pulled by `react-aria-components` (check `pnpm why @react-aria/i18n`). Import `I18nProvider` from `react-aria-components` if exported; otherwise from `react-aria` and add that package as a direct dependency too.
- Modify: `packages/react/src/index.ts` — export `DirectionProvider`, `useDirection`, types, and the resolve helpers

**Interfaces:**

- Produces: `Direction = 'ltr' | 'rtl'`, `resolveDirection({ direction?, locale? }): Direction`, `resolveI18nProviderLocale({ direction, locale? }): string | undefined`, `RTL_I18N_FALLBACK_LOCALE = 'ar'`, `DirectionProviderProps`, `useDirection(): { direction: Direction; isRtl: boolean }`

- [ ] **Step 1: Write the failing tests**

`packages/react/src/direction.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { RTL_I18N_FALLBACK_LOCALE, resolveDirection, resolveI18nProviderLocale } from './direction';

describe('resolveDirection', () => {
  it('defaults to ltr', () => {
    expect(resolveDirection({})).toBe('ltr');
  });

  it('lets an explicit direction win over locale', () => {
    expect(resolveDirection({ direction: 'rtl', locale: 'en-US' })).toBe('rtl');
    expect(resolveDirection({ direction: 'ltr', locale: 'he-IL' })).toBe('ltr');
  });

  it('derives rtl from an RTL locale when direction is omitted', () => {
    expect(resolveDirection({ locale: 'he-IL' })).toBe('rtl');
    expect(resolveDirection({ locale: 'en-US' })).toBe('ltr');
  });
});

describe('resolveI18nProviderLocale', () => {
  it('returns undefined for ltr with no locale (do not wrap I18nProvider)', () => {
    expect(resolveI18nProviderLocale({ direction: 'ltr' })).toBeUndefined();
  });

  it('uses the caller locale when provided', () => {
    expect(resolveI18nProviderLocale({ direction: 'rtl', locale: 'he-IL' })).toBe('he-IL');
    expect(resolveI18nProviderLocale({ direction: 'rtl', locale: 'en-US' })).toBe('en-US');
  });

  it('falls back to ar when direction is rtl and locale is omitted', () => {
    expect(resolveI18nProviderLocale({ direction: 'rtl' })).toBe(RTL_I18N_FALLBACK_LOCALE);
  });
});
```

`packages/react/src/DirectionProvider.test.tsx`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { render, renderHook, screen } from '@testing-library/react';
import { DirectionProvider, useDirection } from './DirectionProvider';

describe('useDirection', () => {
  it('defaults to ltr outside a provider', () => {
    const { result } = renderHook(() => useDirection());
    expect(result.current).toEqual({ direction: 'ltr', isRtl: false });
  });

  it('reads rtl from DirectionProvider', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: ({ children }) => (
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      ),
    });
    expect(result.current).toEqual({ direction: 'rtl', isRtl: true });
  });
});

describe('DirectionProvider applyToDocument', () => {
  function cleanup() {
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
  }

  it('sets dir on html and lang only when locale is passed', () => {
    render(
      <DirectionProvider direction="rtl" applyToDocument>
        <span>a</span>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBeNull();
    cleanup();
  });

  it('sets lang on html when locale is passed', () => {
    render(
      <DirectionProvider direction="rtl" locale="he-IL" applyToDocument>
        <span>a</span>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('he-IL');
    cleanup();
  });

  it('does not set lang=ar for the I18n fallback', () => {
    render(
      <DirectionProvider direction="rtl" applyToDocument>
        <span>a</span>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('lang')).not.toBe('ar');
    cleanup();
  });
});

describe('DirectionProvider wrapper', () => {
  it('sets dir on a contents wrapper when applyToDocument is false', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <span>island</span>
      </DirectionProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('dir')).toBe('rtl');
    expect(wrapper.style.display).toBe('contents');
    expect(screen.getByText('island')).toBeTruthy();
  });

  it('does not clobber html when nested without applyToDocument', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    render(
      <DirectionProvider direction="ltr" applyToDocument>
        <DirectionProvider direction="rtl">
          <span>island</span>
        </DirectionProvider>
      </DirectionProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    document.documentElement.removeAttribute('dir');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `vp test run packages/react/src/direction.test.ts packages/react/src/DirectionProvider.test.tsx`

Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

`packages/react/src/direction.ts`:

```ts
import { isRTL } from '@react-aria/i18n';

export type Direction = 'ltr' | 'rtl';

export const RTL_I18N_FALLBACK_LOCALE = 'ar';

export function resolveDirection(options: { direction?: Direction; locale?: string }): Direction {
  if (options.direction) return options.direction;
  if (options.locale && isRTL(options.locale)) return 'rtl';
  return 'ltr';
}

export function resolveI18nProviderLocale(options: {
  direction: Direction;
  locale?: string;
}): string | undefined {
  if (options.locale) return options.locale;
  if (options.direction === 'rtl') return RTL_I18N_FALLBACK_LOCALE;
  return undefined;
}
```

`packages/react/src/DirectionProvider.tsx`:

```tsx
import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { I18nProvider } from 'react-aria-components';
import { useIsomorphicLayoutEffect } from './color-mode';
import { type Direction, resolveDirection, resolveI18nProviderLocale } from './direction';

export type { Direction };

export type DirectionProviderProps = {
  direction?: Direction;
  locale?: string;
  applyToDocument?: boolean;
  children: ReactNode;
};

type DirectionContextValue = { direction: Direction; isRtl: boolean };

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function useDirection(): DirectionContextValue {
  return useContext(DirectionContext) ?? { direction: 'ltr', isRtl: false };
}

export function DirectionProvider({
  direction: directionProp,
  locale,
  applyToDocument = false,
  children,
}: DirectionProviderProps): JSX.Element {
  const direction = resolveDirection({ direction: directionProp, locale });
  const value = useMemo<DirectionContextValue>(
    () => ({ direction, isRtl: direction === 'rtl' }),
    [direction],
  );
  const i18nLocale = resolveI18nProviderLocale({ direction, locale });

  useIsomorphicLayoutEffect(() => {
    if (!applyToDocument || typeof document === 'undefined') return;
    const root = document.documentElement;
    const previousDir = root.getAttribute('dir');
    const previousLang = root.getAttribute('lang');
    root.setAttribute('dir', direction);
    if (locale) root.setAttribute('lang', locale);
    return () => {
      if (previousDir == null) root.removeAttribute('dir');
      else root.setAttribute('dir', previousDir);
      if (locale) {
        if (previousLang == null) root.removeAttribute('lang');
        else root.setAttribute('lang', previousLang);
      }
    };
  }, [applyToDocument, direction, locale]);

  let content: ReactNode = children;
  if (!applyToDocument) {
    content = (
      <div dir={direction} lang={locale} style={{ display: 'contents' }}>
        {children}
      </div>
    );
  }
  if (i18nLocale) {
    content = <I18nProvider locale={i18nLocale}>{content}</I18nProvider>;
  }

  return <DirectionContext.Provider value={value}>{content}</DirectionContext.Provider>;
}
```

If `I18nProvider` is not exported from `react-aria-components`, switch the import to `react-aria` and add that package as a direct dependency. If `useIsomorphicLayoutEffect` is not exported from `./color-mode`, copy the existing import path used by `DesignSystemProvider.tsx`.

Export from `packages/react/src/index.ts` next to `DesignSystemProvider`:

```ts
export {
  DirectionProvider,
  useDirection,
  type Direction,
  type DirectionProviderProps,
} from './DirectionProvider';
export { resolveDirection, resolveI18nProviderLocale, RTL_I18N_FALLBACK_LOCALE } from './direction';
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test run packages/react/src/direction.test.ts packages/react/src/DirectionProvider.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/direction.ts packages/react/src/direction.test.ts packages/react/src/DirectionProvider.tsx packages/react/src/DirectionProvider.test.tsx packages/react/src/index.ts packages/react/package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(react): add DirectionProvider and useDirection

EOF
)"
```

---

### Task 4: Compose direction into `DesignSystemProvider`

**Files:**

- Modify: `packages/react/src/DesignSystemProvider.tsx`
- Modify: `packages/react/src/color-mode.test.tsx` (add a describe block at the end, or create `packages/react/src/DesignSystemProvider.direction.test.tsx` if you prefer not to grow color-mode tests)

**Interfaces:**

- Consumes: `DirectionProvider` with `applyToDocument` forwarded
- Produces: `DesignSystemProviderProps.direction?`, `DesignSystemProviderProps.locale?`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vite-plus/test';
import { render, renderHook } from '@testing-library/react';
import { DesignSystemProvider } from './DesignSystemProvider';
import { useDirection } from './DirectionProvider';

describe('DesignSystemProvider direction', () => {
  it('provides useDirection from direction prop', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider direction="rtl">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.isRtl).toBe(true);
  });

  it('sets html dir when applyToDocument is set', () => {
    render(
      <DesignSystemProvider direction="rtl" applyToDocument>
        <span>app</span>
      </DesignSystemProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.className = '';
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/react/src/DesignSystemProvider.direction.test.tsx`

Expected: FAIL (`direction` is not a valid prop / dir not set).

- [ ] **Step 3: Write minimal implementation**

In `DesignSystemProviderProps` add:

```ts
import type { Direction } from './DirectionProvider';
import { DirectionProvider } from './DirectionProvider';

export type DesignSystemProviderProps = {
  // existing fields...
  direction?: Direction;
  locale?: string;
};
```

Wrap the returned tree (both `applyToDocument` and wrapper branches) with:

```tsx
<DirectionProvider direction={direction} locale={locale} applyToDocument={applyToDocument}>
  {children}
</DirectionProvider>
```

Place `DirectionProvider` **inside** `ColorModeContext.Provider` so color mode stays the outer app concern. Pass `direction` / `locale` through from props (do not default `direction` in DSP — `DirectionProvider` already defaults to `ltr`).

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test run packages/react/src/DesignSystemProvider.direction.test.tsx`

Expected: PASS. Also run `vp test run packages/react/src/color-mode.test.tsx` so existing DSP tests still pass.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/DesignSystemProvider.tsx packages/react/src/DesignSystemProvider.direction.test.tsx
git commit -m "$(cat <<'EOF'
feat(react): compose DirectionProvider in DesignSystemProvider

EOF
)"
```

---

### Task 5: Icon `data-mirror`

**Files:**

- Modify: `packages/core/src/components/icon.ts`
- Create: `packages/core/src/components/icon.mirror.test.ts` (or add to an existing icon test if one exists)
- Modify: `packages/react/src/icons/Icon.tsx`
- Modify: `packages/react/src/icons/Icon.test.tsx`
- Modify: `packages/react/src/components/IconButton.tsx`
- Modify: `packages/react/src/components/Actions.test.tsx` (IconButton describe)

**Interfaces:**

- Produces: Icon recipe `[data-mirror] { transform: scaleX(-1) }`; `IconProps['data-mirror']`; `IconButtonProps['data-mirror']` forwarded onto the inner `Icon`, **not** left on the RAC button

- [ ] **Step 1: Write the failing tests**

Core — export a small helper from `icon.ts` **or** assert via the recipe style object. Prefer adding `iconMirrorSelector` next to the recipe if inspecting hashed CSS is awkward. Simpler: put the mirror rule in the recipe `base` and test React DOM.

React `Icon.test.tsx` addition:

```ts
it('sets data-mirror on the shell when requested', () => {
  const { container } = render(<Icon name="search" data-mirror />);
  expect(container.firstElementChild?.getAttribute('data-mirror')).not.toBeNull();
});
```

`Actions.test.tsx` IconButton addition:

```ts
it('forwards data-mirror to the inner icon, not the button', () => {
  wrap(<IconButton name="close" aria-label="Close" data-mirror />);
  const button = screen.getByRole('button', { name: 'Close' });
  expect(button.hasAttribute('data-mirror')).toBe(false);
  expect(button.querySelector('[data-mirror]')).toBeTruthy();
});
```

Core `icon.ts` — add a unit that the style object includes the selector. If the recipe callback is not exported, add:

```ts
export const iconMirrorStyle = {
  '&[data-mirror]': { transform: 'scaleX(-1)' },
} as const;
```

and spread it into `base`. Test:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { iconMirrorStyle } from './icon';

describe('iconMirrorStyle', () => {
  it('flips on data-mirror', () => {
    expect(iconMirrorStyle['&[data-mirror]']).toEqual({ transform: 'scaleX(-1)' });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `vp test run packages/core/src/components/icon.mirror.test.ts packages/react/src/icons/Icon.test.tsx packages/react/src/components/Actions.test.tsx`

Expected: FAIL (`data-mirror` not a prop / style missing).

- [ ] **Step 3: Write minimal implementation**

In `icon.ts` `base`, spread `iconMirrorStyle` (or inline `'&[data-mirror]': { transform: 'scaleX(-1)' }`).

`Icon.tsx`:

```tsx
export type IconProps = {
  name?: IconName;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'inherit';
  className?: string;
  'aria-label'?: string;
  'data-mirror'?: boolean | '';
};

export function Icon({
  name,
  children,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  'data-mirror': dataMirror,
}: IconProps): JSX.Element {
  const icons = useIcons();
  const glyph = children ?? (name ? icons[name] : undefined) ?? emptyFallback;
  return (
    <span
      {...recipeProps(icon({ size }), className)}
      data-mirror={dataMirror ? '' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {glyph}
    </span>
  );
}
```

`IconButton.tsx` — pull `data-mirror` out of `...props` before spreading onto `AriaButton`, pass it to `Icon`:

```tsx
export type IconButtonProps = Omit<RACButtonProps, 'className' | 'children'> & {
  'aria-label': string;
  name: IconName;
  className?: string;
  icon?: ReactNode;
  'data-mirror'?: boolean | '';
} & ButtonVariantProps;

export function IconButton({
  name,
  icon,
  intent = 'secondary',
  tone,
  appearance,
  size = 'md',
  elevated,
  className,
  'data-mirror': dataMirror,
  ...props
}: IconButtonProps): JSX.Element {
  // existing button() call...
  return (
    <AriaButton {...props} {...recipeProps(recipeProps_, className)}>
      {icon ?? (
        <Icon
          name={name}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          data-mirror={dataMirror}
        />
      )}
    </AriaButton>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test run packages/core/src/components/icon.mirror.test.ts packages/react/src/icons/Icon.test.tsx packages/react/src/components/Actions.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/icon.ts packages/core/src/components/icon.mirror.test.ts packages/react/src/icons/Icon.tsx packages/react/src/icons/Icon.test.tsx packages/react/src/components/IconButton.tsx packages/react/src/components/Actions.test.tsx
git commit -m "$(cat <<'EOF'
feat: add opt-in data-mirror icon flip for RTL

EOF
)"
```

---

### Task 6: Breadcrumbs + mobileNav logical CSS

**Files:**

- Modify: `packages/core/src/components/breadcrumbs.ts`
- Create: `packages/core/src/components/breadcrumbs.rtl.test.ts`
- Modify: `packages/core/src/components/mobileNav.ts`
- Create: `packages/core/src/components/mobileNav.rtl.test.ts`

**Interfaces:**

- Produces: breadcrumbs `::after` uses `marginInlineStart`; mobileNav start/end closed transforms flip under `[dir="rtl"]`

- [ ] **Step 1: Write the failing tests**

Export tiny style fragments from the recipes (same pattern as `iconMirrorStyle`) so tests do not scrape hashed CSS.

In `breadcrumbs.ts` (next to the recipe):

```ts
export const breadcrumbsSeparatorMargin = {
  marginInlineStart: /* existing t.space[1].var — after you change it */,
} as const;
```

Do not do that if it duplicates tokens. Instead export:

```ts
export const breadcrumbsPhysicalForbid = ['marginLeft', 'marginRight'] as const;
```

Cleaner: a source scan test:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vite-plus/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

describe('breadcrumbs RTL', () => {
  it('uses logical margin for the separator', () => {
    const src = readFileSync(join(here, 'breadcrumbs.ts'), 'utf8');
    expect(src).toContain('marginInlineStart');
    expect(src).not.toContain('marginLeft');
  });
});

describe('mobileNav RTL', () => {
  it('flips closed translateX under dir=rtl', () => {
    const src = readFileSync(join(here, 'mobileNav.ts'), 'utf8');
    expect(src).toContain('[dir="rtl"]');
    expect(src).toContain('translateX(100%)');
    expect(src).toContain('translateX(-100%)');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `vp test run packages/core/src/components/breadcrumbs.rtl.test.ts packages/core/src/components/mobileNav.rtl.test.ts`

Expected: FAIL (`marginLeft` still present / no `[dir="rtl"]`).

- [ ] **Step 3: Write minimal implementation**

`breadcrumbs.ts`: change both `marginLeft: t.space[1].var` (item `::after` and ellipsisItem `::after`) to `marginInlineStart: t.space[1].var`.

`mobileNav.ts` panel slot — inside `'&[data-side="start"]'` add:

```ts
'[dir="rtl"] &:not([data-open])': {
  transform: 'translateX(100%)',
},
```

Inside `'&[data-side="end"]'` add:

```ts
'[dir="rtl"] &:not([data-open])': {
  transform: 'translateX(-100%)',
},
```

Keep the existing LTR `translateX(-100%)` / `translateX(100%)` closed rules.

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test run packages/core/src/components/breadcrumbs.rtl.test.ts packages/core/src/components/mobileNav.rtl.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/breadcrumbs.ts packages/core/src/components/breadcrumbs.rtl.test.ts packages/core/src/components/mobileNav.ts packages/core/src/components/mobileNav.rtl.test.ts
git commit -m "$(cat <<'EOF'
fix(core): logical breadcrumbs margin and RTL mobileNav slide

EOF
)"
```

---

### Task 7: Mirror chevrons on Pagination, SideNav, Tree

**Files:**

- Modify: `packages/react/src/components/Pagination.tsx`
- Modify: `packages/react/src/components/Pagination.test.tsx`
- Modify: `packages/react/src/components/SideNav.tsx`
- Modify: `packages/react/src/components/SideNav.test.tsx`
- Modify: `packages/react/src/components/Tree.tsx`
- Modify: `packages/react/src/components/Tree.test.tsx`

**Interfaces:**

- Consumes: `useDirection()`, `data-mirror` on `Icon` / `IconButton`
- Produces: `data-mirror` present on those chevrons iff `isRtl`

- [ ] **Step 1: Write the failing tests**

Pagination:

```ts
it('mirrors prev/next icons when direction is rtl', () => {
  render(
    <DirectionProvider direction="rtl">
      <Pagination page={2} onChange={() => {}} totalPages={5} />
    </DirectionProvider>,
  );
  const prev = screen.getByRole('button', { name: 'Go to previous page' });
  const next = screen.getByRole('button', { name: 'Go to next page' });
  expect(prev.querySelector('[data-mirror]')).toBeTruthy();
  expect(next.querySelector('[data-mirror]')).toBeTruthy();
});
```

SideNav (collapse button is rendered when `collapsible`):

```ts
it('mirrors the collapse chevron when direction is rtl', () => {
  wrap(
    <DirectionProvider direction="rtl">
      <SideNav collapsible>
        <span>item</span>
      </SideNav>
    </DirectionProvider>,
  );
  const collapse = screen.getByRole('button', { name: 'Collapse navigation' });
  expect(collapse.querySelector('[data-mirror]')).toBeTruthy();
});
```

Use the actual collapse button accessible name from existing SideNav tests (`Expand navigation` / `Collapse navigation`). Nested `SideNav.Item` expand chevron: render a collapsible item with children and assert the expand `IconButton` has `data-mirror` under RTL.

Tree:

```ts
it('mirrors the expand chevron when direction is rtl', () => {
  render(
    <DirectionProvider direction="rtl">
      <Tree items={FILE_TREE_ITEMS} aria-label="Files" />
    </DirectionProvider>,
  );
  expect(document.querySelector('[data-mirror]')).toBeTruthy();
});
```

Import `DirectionProvider` from `../DirectionProvider`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `vp test run packages/react/src/components/Pagination.test.tsx packages/react/src/components/SideNav.test.tsx packages/react/src/components/Tree.test.tsx`

Expected: FAIL (no `data-mirror`).

- [ ] **Step 3: Write minimal implementation**

In each component, `const { isRtl } = useDirection();` and pass `data-mirror={isRtl || undefined}` to:

- Pagination: both `IconButton`s (`chevronLeft` / `chevronRight`)
- SideNav: collapse `Icon` and nested expand `IconButton` (`chevronRight` / `chevronDown` — still set `data-mirror` when `isRtl`; `chevronDown` flipping is harmless)
- Tree: both `Icon name="chevronRight"` nodes (toggle button and spacer)

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test run packages/react/src/components/Pagination.test.tsx packages/react/src/components/SideNav.test.tsx packages/react/src/components/Tree.test.tsx`

Expected: PASS (including existing tests).

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/components/Pagination.tsx packages/react/src/components/Pagination.test.tsx packages/react/src/components/SideNav.tsx packages/react/src/components/SideNav.test.tsx packages/react/src/components/Tree.tsx packages/react/src/components/Tree.test.tsx
git commit -m "$(cat <<'EOF'
feat(react): mirror directional chevrons from useDirection

EOF
)"
```

---

### Task 8: Astro `Hidden`

**Files:**

- Create: `packages/astro/src/components/Hidden.astro`
- Modify: `packages/astro/index.ts` (export next to Center)
- Create: `packages/astro/src/components/Hidden.test.ts` — if Astro components are not unit-tested, skip a `.astro` render test and instead add a tiny test that documents the public export by importing `hiddenClassName` usage from a `packages/astro/src/hiddenClassName.test.ts` that only asserts `hiddenClassName` still works when imported the same way the `.astro` file will. Prefer matching `Center.astro`.

**Interfaces:**

- Consumes: `hiddenClassName`, `recipeProps` from `../utils`
- Produces: Astro `Hidden` with `hide` + `as` + slot

- [ ] **Step 1: Write the failing test**

There is no Center.astro unit test. Add `packages/astro/src/hiddenClassName.test.ts` that locks the contract the `.astro` file will call:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { hiddenClassName } from '@var-ui/core';
import { recipeProps } from './utils';

describe('Astro Hidden class contract', () => {
  it('recipeProps + hiddenClassName yield a className string', () => {
    const rp = recipeProps(hiddenClassName({ hide: { md: true } }));
    expect(rp.className).toContain('hidden-md-true');
  });
});
```

(`recipeProps` lives at `packages/astro/src/utils.ts` — import that path.)

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/astro/src/hiddenClassName.test.ts`

Expected: FAIL until Hidden’s class names exist (Task 1) — if Task 1 already landed, this should pass as soon as the test file exists. If it passes immediately, that is OK; the `.astro` file is still required in Step 3.

- [ ] **Step 3: Write the Astro component**

`packages/astro/src/components/Hidden.astro`:

```astro
---
import { hiddenClassName, type HiddenMap } from '@var-ui/core';
import { recipeProps } from '../utils';

type Props = {
  hide?: boolean | HiddenMap;
  as?: string;
  className?: string;
};

const { hide, as = 'div', className } = Astro.props;
const rp = recipeProps(hiddenClassName({ hide }), className);
const Tag = as;
---
<Tag {...rp}><slot /></Tag>
```

`packages/astro/index.ts` after Center:

```ts
export { default as Hidden } from './src/components/Hidden.astro';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test run packages/astro/src/hiddenClassName.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/astro/src/components/Hidden.astro packages/astro/index.ts packages/astro/src/hiddenClassName.test.ts
git commit -m "$(cat <<'EOF'
feat(astro): add Hidden for SSR-safe responsive hide

EOF
)"
```

---

### Task 9: Docs — Hidden page, demos, getting started, RTL island

**Files:**

- Create: `docs/content/components/hidden.mdx`
- Create: `docs/src/demos/hidden/hide-md/{react.tsx,astro.astro,html.ts,snippets.ts}`
- Create: `docs/src/demos/hidden/show-md/{react.tsx,astro.astro,html.ts,snippets.ts}`
- Create: `docs/src/demos/direction/rtl/{react.tsx,astro.astro,html.ts,snippets.ts}`
- Modify: `docs/src/data/components.ts` (registry entry after Center)
- Modify: `docs/src/data/component-docs-coverage.test.ts` (add `'hidden'` to `REQUIRED_FAMILY_SLUGS` under Layout / nav)
- Modify: `docs/src/demos/types.ts` (`'hidden.hide-md' | 'hidden.show-md' | 'direction.rtl'`)
- Modify: `docs/src/demos/registry.ts` (DEMO_IDS, snippet imports, loaders, demoRegistry entries — copy the `center.default` pattern)
- Modify: `docs/src/demos/reactDemoMap.ts`, `astroDemoMap.ts`, `htmlDemoMap.ts`
- Modify: `docs/content/docs/getting-started.mdx`
- Modify: `docs/superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md` — set **Status:** Approved

**Interfaces:**

- Consumes: `Hidden`, `hiddenClassName`, `DirectionProvider`, `SideNav`, `Breadcrumbs`

- [ ] **Step 1: Write the failing coverage assertion**

In `REQUIRED_FAMILY_SLUGS` add `'hidden'` next to `'center'`’s neighborhood (layout). Run:

`vp test run docs/src/data/component-docs-coverage.test.ts`

Expected: FAIL (`missing MDX page: hidden.mdx` and/or missing registry entry).

- [ ] **Step 2: Add registry + MDX + demos**

`docs/src/data/components.ts` after Center:

```ts
{
  slug: 'hidden',
  name: 'Hidden',
  category: 'layout',
  description: 'SSR-safe responsive show/hide via CSS media queries.',
  importLine: "import { Hidden } from '@var-ui/react';",
},
```

`docs/content/components/hidden.mdx`:

```mdx
---
title: Hidden
description: SSR-safe responsive show/hide via CSS media queries.
---

# Hidden

Hides children with `display: none` inside breakpoint media queries. Markup stays in the HTML (no `useMediaQuery` / conditional render), so SSR and hydration match.

`hide` is mobile-first and-up. Keys are `base` (0px) plus TypeStyles `sm` / `md` / `lg` / `xl`. Default at `base` is visible. When shown, the wrapper uses `display: contents`.

## Examples

### Hide from md

Visible below `md`, hidden from `md` up.

<Demo id="hidden.hide-md" />

### Show from md

Hidden below `md`, visible from `md` up (`base: true`, then `md: false`).

<Demo id="hidden.show-md" />

## Props

<PropsTable slug="hidden" />

## Accessibility

`display: none` removes the subtree from the accessibility tree while hidden. That is the intended behavior for duplicate navigation. Do not use the HTML `hidden` attribute — it cannot be scoped to a media query.

Astro and HTML should put `hiddenClassName({ hide })` on a real tag (`aside`, `nav`) when a landmark matters.
```

`docs/src/demos/hidden/hide-md/react.tsx`:

```tsx
import { Hidden, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Hidden hide={{ md: true }} as="aside">
      <Text>Visible below md</Text>
    </Hidden>
  );
}
```

`docs/src/demos/hidden/hide-md/astro.astro`:

```astro
---
import { Hidden, Text } from '@var-ui/astro';
---
<Hidden hide={{ md: true }} as="aside">
  <Text>Visible below md</Text>
</Hidden>
```

`docs/src/demos/hidden/hide-md/html.ts`:

```ts
import { hiddenClassName, textBlock } from '@var-ui/core';
import { recipeProps } from '../../../lib/recipeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const hiddenRp = recipeProps(hiddenClassName({ hide: { md: true } }));
  const text = serializeHtmlTag('p', recipeProps(textBlock({})), 'Visible below md');
  return serializeHtmlTag('aside', hiddenRp, text);
}
```

`docs/src/demos/hidden/hide-md/snippets.ts` — mirror those three snippets as template strings (`satisfies DemoSnippets`), same pattern as `docs/src/demos/center/default/snippets.ts`.

`show-md` copies the above with `hide={{ base: true, md: false }}` and copy “Visible from md”.

`docs/src/demos/direction/rtl/react.tsx`:

```tsx
import { Breadcrumbs, DirectionProvider, SideNav, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <DirectionProvider direction="rtl">
      <div
        style={{
          height: 280,
          width: 240,
          border: '1px solid var(--var-ui-color-border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <SideNav header={<SideNav.Heading heading="Docs" />}>
          <SideNav.Section title="Main">
            <SideNav.Item label="Overview" href="#overview" isSelected />
            <SideNav.Item label="Hidden" href="#hidden" />
          </SideNav.Section>
        </SideNav>
      </div>
      <Breadcrumbs
        items={[
          { id: 'home', label: 'Home', href: '#' },
          { id: 'here', label: 'Current' },
        ]}
      />
      <Text>dir=rtl island</Text>
    </DirectionProvider>
  );
}
```

Astro/HTML versions wrap the same chrome in `<div dir="rtl">` (no React provider). Copy SideNav markup from `docs/src/demos/side-nav/sections/react.tsx` / `astro.astro` / `html.ts` if the compound slots differ.

Wire demo maps: add `'hidden.hide-md'`, `'hidden.show-md'`, `'direction.rtl'` to `DemoId`, `DEMO_IDS` (after `center.default`), snippet imports, `reactDemoLoaders`, `demoRegistry`, `reactDemoMap`, `astroDemoMap`, `htmlDemoMap`. Follow `center.default` entries exactly.

Add a short section to Hidden MDX after examples:

```mdx
### RTL island

`DirectionProvider` sets `dir` on a subtree. Side nav and breadcrumbs follow logical properties; chevrons opt into `data-mirror`.

<Demo id="direction.rtl" />
```

`docs/content/docs/getting-started.mdx` — after “Wrap your app”, add:

````mdx
## Direction and locale

Pass `direction` and a real `locale` on `DesignSystemProvider`:

```tsx
<DesignSystemProvider applyToDocument direction="rtl" locale="he-IL">
  {children}
</DesignSystemProvider>
```
````

React Aria overlays (`Popover`, `Menu`, `start` / `end` placement) take direction from **locale**, not from `dir`. `I18nProvider` only accepts `locale`.

- Prefer a real RTL locale (`he-IL`, `ar-EG`) so dates, numbers, and overlays agree.
- `direction="rtl"` with no locale wraps `I18nProvider` with `ar` so placement still flips. That workaround does **not** set `html lang="ar"`.
- `locale="en-US"` plus `direction="rtl"` keeps English formatting; overlays may **not** flip.
- If you omit `direction` but pass `locale`, `dir` is derived from RAC `isRTL(locale)`.
- `useDirection()` returns `{ direction, isRtl }` and defaults to `ltr` when no provider is mounted.
- Directional icons opt in: `<Icon name="chevronRight" data-mirror={isRtl || undefined} />`.

Do not set `dir` on the whole docs site to try this — use a `DirectionProvider` island (see Hidden).

````

Fix SideNav compound names against the existing side-nav demo before committing.

- [ ] **Step 3: Run docs tests**

Run: `vp test run docs/src/data/component-docs-coverage.test.ts docs/src/demos/registry.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add docs/content/components/hidden.mdx docs/content/docs/getting-started.mdx docs/src/data/components.ts docs/src/data/component-docs-coverage.test.ts docs/src/demos docs/superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md
git commit -m "$(cat <<'EOF'
docs: Hidden page, RTL island, and direction getting-started notes

EOF
)"
````

---

### Task 10: Changeset + verification

**Files:**

- Create: `.changeset/rtl-hidden.md`

- [ ] **Step 1: Add changeset**

```md
---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
---

Add DirectionProvider / useDirection (including RAC I18nProvider wrapping) and an SSR-safe Hidden utility with CSS media-query hide.
```

- [ ] **Step 2: Run full verification**

Run: `vp check && vp test run packages/core && vp test run packages/react && vp test run packages/astro && vp test run docs/src/data/component-docs-coverage.test.ts && vp test run docs/src/demos/registry.test.ts`

Expected: PASS. Fix format/lint failures; do not skip hooks.

- [ ] **Step 3: Commit**

```bash
git add .changeset/rtl-hidden.md
git commit -m "$(cat <<'EOF'
chore: changeset for direction and Hidden

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement                                         | Task       |
| -------------------------------------------------------- | ---------- |
| `DirectionProvider` + nested islands                     | 3          |
| `useDirection()` default ltr, no throw                   | 3          |
| DSP `direction` / `locale` / `applyToDocument` `dir`     | 4          |
| RAC `I18nProvider` + `'ar'` workaround, no `lang=ar`     | 3          |
| `direction` wins over locale for `dir`                   | 3          |
| Derive `dir` from `isRTL(locale)` when direction omitted | 3          |
| `hiddenClassName` / `HiddenMap` + `base`                 | 1          |
| React `Hidden` + `as`                                    | 2          |
| Astro `Hidden`                                           | 8          |
| Icon `data-mirror` + IconButton forward                  | 5          |
| Pagination / SideNav / Tree mirrors                      | 7          |
| breadcrumbs `marginInlineStart`                          | 6          |
| mobileNav `[dir=rtl]` translate                          | 6          |
| Docs Hidden page + getting started + RTL island          | 9          |
| Out of scope (DocsPage TOC, calendar, fileTree, …)       | not tasked |
| Minor changeset                                          | 10         |
