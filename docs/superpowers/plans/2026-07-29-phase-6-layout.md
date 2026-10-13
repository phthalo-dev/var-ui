# Phase 6 Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Astryx-parity `Layout*` components, multi-region `useResizable`, responsive `LayoutPanel` modes, Astro static bindings, and docs for the layout family + `Collapsible`.

**Architecture:** One `layout.ts` core file exports five slot-based recipes sharing CSS custom properties for padding and content width. React `Layout` sets data attributes + thin context for zone awareness. `useResizable` gains a `regions` overload without breaking SideNav. `LayoutPanel` responsive modes reuse RAC `Modal` patterns from `MobileNav`.

**Tech Stack:** TypeStyles recipes (`typestyles.recipe`), React Aria Components, `@var-ui/core` tokens, Vite+ (`vp test`, `vp check`), Astro static components.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-29-phase-6-layout-design.md`
- Keep existing `useResizable(boolean | ResizableConfig)` API unchanged for `SideNav`
- Multi-region resize: independent regions only (no coordinated split-pane math)
- Astro: static shell only — no `resizable`, no `responsive`, no client scripts
- Responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px) from `designTokens.breakpoint`
- Run `vp check` and `vp test` before each PR
- Follow existing recipe naming: `var-ui-layout__*` class prefix via component name `layout`

---

## File map

| File                                             | Responsibility                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| `packages/core/src/components/layout.ts`         | All five layout recipes + shared padding var helpers                      |
| `packages/core/src/components/index.ts`          | Export layout recipes                                                     |
| `packages/core/src/themeable-components.ts`      | Register layout recipes for theming                                       |
| `packages/react/src/hooks/useResizable.ts`       | Add `regions` overload; extract `useResizableRegion`                      |
| `packages/react/src/hooks/useResizable.test.tsx` | Multi-region tests                                                        |
| `packages/react/src/components/Layout.tsx`       | Layout, LayoutHeader, LayoutFooter, LayoutContent, LayoutPanel + contexts |
| `packages/react/src/components/Layout.test.tsx`  | React layout tests                                                        |
| `packages/react/src/components/index.ts`         | Export Layout family                                                      |
| `packages/astro/src/components/Layout*.astro`    | Static Astro bindings (5 files)                                           |
| `packages/astro/index.ts`                        | Export Astro layout components                                            |
| `docs/content/components/layout.mdx`             | Layout docs page                                                          |
| `docs/content/components/layout-panel.mdx`       | LayoutPanel docs page                                                     |
| `docs/content/components/collapsible.mdx`        | Collapsible docs page                                                     |
| `docs/src/demos/layout/default/*`                | Default layout demo (react/astro/html/snippets)                           |
| `docs/src/data/components.ts`                    | Registry entries                                                          |
| `docs/src/demos/registry.ts` + demo maps         | Wire demo                                                                 |
| `examples/vite-app/src/App.tsx`                  | Master-detail example                                                     |
| `examples/astro-app/src/pages/index.astro`       | Static 3-zone layout example                                              |
| `ROADMAP.md`                                     | Check off Phase 6                                                         |

**PR split:** Tasks 1–4 → PR 1. Tasks 5–9 → PR 2.

---

### Task 1: Core layout recipes

**Files:**

- Create: `packages/core/src/components/layout.ts`
- Modify: `packages/core/src/components/index.ts`
- Modify: `packages/core/src/themeable-components.ts`
- Test: `packages/core/test/recipes.smoke.test.ts` (auto-covers new registrations)

**Interfaces:**

- Produces: `layout()`, `layoutHeader()`, `layoutFooter()`, `layoutContent()`, `layoutPanel()` — each returns slot class map via `typestyles.recipe`

- [ ] **Step 1: Create `layout.ts` with `layout()` recipe**

```ts
// packages/core/src/components/layout.ts
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export type LayoutPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;

const paddingValue = (step: LayoutPadding) => t.space[step].var;

export const layout = typestyles.recipe(
  'layout',
  (c) => {
    const v = c.vars({
      paddingOuterX: { value: t.space[4].var, syntax: '<length>', inherits: false },
      paddingOuterY: { value: t.space[4].var, syntax: '<length>', inherits: false },
      paddingInnerX: { value: t.space[4].var, syntax: '<length>', inherits: false },
      paddingInnerY: { value: t.space[4].var, syntax: '<length>', inherits: false },
      contentWidth: { value: 'none', syntax: '<length> | none', inherits: false },
    });
    return {
      slots: ['root', 'outer', 'inner', 'middle'],
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          [v.paddingOuterX.name]: t.space[4].var,
          [v.paddingOuterY.name]: t.space[4].var,
          [v.paddingInnerX.name]: t.space[4].var,
          [v.paddingInnerY.name]: t.space[4].var,
        },
        outer: {
          marginInlineStart: 'calc(-1 * var(--container-padding-inline-start, 0px))',
          marginInlineEnd: 'calc(-1 * var(--container-padding-inline-end, 0px))',
          marginBlockStart: 'calc(-1 * var(--container-padding-block-start, 0px))',
          marginBlockEnd: 'calc(-1 * var(--container-padding-block-end, 0px))',
        },
        inner: {
          '--container-padding-inline-start': '0px',
          '--container-padding-inline-end': '0px',
          '--container-padding-block-start': '0px',
          '--container-padding-block-end': '0px',
        },
        middle: {
          display: 'flex',
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
        },
      },
      variants: {
        height: {
          fill: { root: { flex: '1 1 auto', minHeight: 0 } },
          auto: { root: { flex: 'none' } },
        },
        padding: {
          0: {
            root: {
              [v.paddingOuterX.name]: paddingValue(0),
              [v.paddingOuterY.name]: paddingValue(0),
              [v.paddingInnerX.name]: paddingValue(0),
              [v.paddingInnerY.name]: paddingValue(0),
            },
          },
          4: {},
        },
      },
      defaultVariants: { height: 'fill', padding: 4 },
    };
  },
  { layer: 'components' },
);
```

Add `layoutHeader`, `layoutFooter`, `layoutContent`, `layoutPanel` in the same file. Key rules:

- `layoutContent`: `flex: 1`, `minWidth: 0`, `minHeight: 0`, `overflow: auto` when scrollable variant; padding from inner vars; `[data-has-start] &` selectors for edge collapse
- `layoutPanel`: `flexShrink: 0`, width via inline style from React; `dividerStart`/`dividerEnd` border variants; `overlay` + `overlayBackdrop` slots for responsive modal shell
- `layoutHeader`/`layoutFooter`: `flexShrink: 0`, optional bottom/top divider via `data-divider` attribute

- [ ] **Step 2: Export from `components/index.ts`**

```ts
export {
  layout,
  layoutHeader,
  layoutFooter,
  layoutContent,
  layoutPanel,
  type LayoutPadding,
} from './layout';
```

- [ ] **Step 3: Register in `themeable-components.ts`**

```ts
import { layout, layoutHeader, layoutFooter, layoutContent, layoutPanel } from './components/layout';
// add to themeableComponents object:
layout,
layoutHeader,
layoutFooter,
layoutContent,
layoutPanel,
```

- [ ] **Step 4: Run smoke tests**

Run: `vp test packages/core/test/recipes.smoke.test.ts`
Expected: PASS (new recipes invoke without throwing)

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/layout.ts packages/core/src/components/index.ts packages/core/src/themeable-components.ts
git commit -m "feat(core): add layout recipe family for Phase 6"
```

---

### Task 2: Multi-region `useResizable`

**Files:**

- Modify: `packages/react/src/hooks/useResizable.ts`
- Modify: `packages/react/src/hooks/useResizable.test.tsx`
- Modify: `packages/react/src/hooks/index.ts` (export new types if added)

**Interfaces:**

- Consumes: existing `ResizableConfig`, `UseResizableResult`
- Produces:

  ```ts
  export type MultiResizableConfig = {
    regions: Record<string, ResizableConfig>;
    autoSaveId?: string;
  };
  export function useResizable(config?: boolean | ResizableConfig): UseResizableResult;
  export function useResizable(config: MultiResizableConfig): Record<string, UseResizableResult>;
  ```

- [ ] **Step 1: Write failing multi-region test**

```tsx
// append to packages/react/src/hooks/useResizable.test.tsx
it('returns independent regions for multi-region config', () => {
  const { result } = renderHook(() =>
    useResizable({
      regions: {
        start: { defaultWidth: 200, minWidth: 160, maxWidth: 300 },
        end: { defaultWidth: 380, minWidth: 320, maxWidth: 480 },
      },
    }),
  );
  expect(result.current.start.width).toBe(200);
  expect(result.current.end.width).toBe(380);
  act(() => result.current.end.resize(400));
  expect(result.current.end.width).toBe(400);
  expect(result.current.start.width).toBe(200);
});

it('prefixes autoSaveId per region key', () => {
  localStorage.removeItem('var-ui-resizable:panels:end');
  const { result, unmount } = renderHook(() =>
    useResizable({
      autoSaveId: 'panels',
      regions: { end: { defaultWidth: 380 } },
    }),
  );
  act(() => result.current.end.resize(420));
  unmount();
  const { result: result2 } = renderHook(() =>
    useResizable({ autoSaveId: 'panels', regions: { end: { defaultWidth: 380 } } }),
  );
  expect(result2.current.end.width).toBe(420);
  localStorage.removeItem('var-ui-resizable:panels:end');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test packages/react/src/hooks/useResizable.test.tsx`
Expected: FAIL — `result.current.start` undefined

- [ ] **Step 3: Refactor `useResizable.ts`**

Extract internal `useResizableRegion(config: ResizableConfig): UseResizableResult` from current body. Keep public `useResizable` signature:

```ts
function useResizableRegion(config: ResizableConfig, autoSaveId?: string): UseResizableResult {
  // move existing useResizable body here; use autoSaveId param directly
}

export function useResizable(
  config?: boolean | ResizableConfig | MultiResizableConfig,
): UseResizableResult | Record<string, UseResizableResult> {
  if (config && typeof config === 'object' && 'regions' in config) {
    const { regions, autoSaveId } = config;
    const entries = Object.entries(regions);
    const results = entries.map(([key, regionConfig]) =>
      useResizableRegion(regionConfig, autoSaveId ? `${autoSaveId}:${key}` : undefined),
    );
    return Object.fromEntries(entries.map(([key], i) => [key, results[i]]));
  }
  const normalized = normalizeConfig(config as boolean | ResizableConfig | undefined);
  return useResizableRegion(normalized);
}
```

Add file-level eslint comment documenting stable `regions` key contract (same pattern as Astryx).

- [ ] **Step 4: Run tests**

Run: `vp test packages/react/src/hooks/useResizable.test.tsx`
Expected: PASS (all existing + new tests)

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/hooks/useResizable.ts packages/react/src/hooks/useResizable.test.tsx
git commit -m "feat(react): add multi-region useResizable overload"
```

---

### Task 3: React Layout family (inline + resize)

**Files:**

- Create: `packages/react/src/components/Layout.tsx`
- Modify: `packages/react/src/components/index.ts`
- Create: `packages/react/src/components/Layout.test.tsx`

**Interfaces:**

- Consumes: `layout`, `layoutHeader`, `layoutFooter`, `layoutContent`, `layoutPanel` from `@var-ui/core`; `UseResizableResult` from hooks
- Produces:

  ```ts
  export function Layout(props: LayoutProps): JSX.Element;
  export function LayoutHeader(props: LayoutHeaderProps): JSX.Element;
  export function LayoutFooter(props: LayoutFooterProps): JSX.Element;
  export function LayoutContent(props: LayoutContentProps): JSX.Element;
  export function LayoutPanel(props: LayoutPanelProps): JSX.Element;
  export type LayoutPanelResponsive = { below: 'sm' | 'md' | 'lg'; mode: 'overlay' | 'hidden' };
  ```

- [ ] **Step 1: Write failing Layout composition test**

```tsx
// packages/react/src/components/Layout.test.tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Layout, LayoutContent, LayoutHeader, LayoutPanel } from './Layout';

describe('Layout', () => {
  it('renders header, content, and end panel landmarks', () => {
    render(
      <Layout
        header={
          <LayoutHeader>
            <h1>Title</h1>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <p>Body</p>
          </LayoutContent>
        }
        end={
          <LayoutPanel label="Details" role="complementary">
            <p>Inspector</p>
          </LayoutPanel>
        }
      />,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'Details' })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test packages/react/src/components/Layout.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `Layout.tsx`**

Structure (single file, ~300 lines):

1. **Contexts** at top:

   ```ts
   type LayoutSlots = {
     hasHeader: boolean;
     hasFooter: boolean;
     hasStart: boolean;
     hasEnd: boolean;
     defaultHasDividers: boolean;
   };
   const LayoutSlotsContext = createContext<LayoutSlots>({
     hasHeader: false,
     hasFooter: false,
     hasStart: false,
     hasEnd: false,
     defaultHasDividers: false,
   });
   const LayoutAreaContext = createContext<'header' | 'footer' | 'start' | 'end' | 'content'>(
     'content',
   );
   const LayoutDividerContext = createContext<boolean>(false);
   ```

2. **`Layout`** — compute `hasHeader = header != null`, etc.; set data attributes on root:

   ```tsx
   <div
     {...recipeProps(l.root, className)}
     data-has-header={hasHeader || undefined}
     data-has-footer={hasFooter || undefined}
     data-has-start={hasStart || undefined}
     data-has-end={hasEnd || undefined}
     style={contentWidth != null ? { '--var-ui-layout-contentwidth': `${contentWidth}px` } as CSSProperties : undefined}
   >
   ```

   Wrap slots in `LayoutAreaContext` providers. `content` prop wins over `children`.

3. **`LayoutHeader` / `LayoutFooter`** — read `LayoutDividerContext` for default `hasDivider`; set `data-divider` when divider active.

4. **`LayoutContent`** — `role` default undefined (caller sets `main` at page level); `isScrollable` toggles overflow class.

5. **`LayoutPanel`** — read `LayoutAreaContext` for start/end divider edge; width:
   ```ts
   const effectiveWidth = resizable?.width ?? width;
   const panelStyle =
     effectiveWidth != null
       ? { width: typeof effectiveWidth === 'number' ? `${effectiveWidth}px` : effectiveWidth }
       : undefined;
   ```
   **No responsive yet** — defer to Task 5.

- [ ] **Step 4: Export from `components/index.ts`**

```ts
export {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutPanel,
  type LayoutProps,
  type LayoutHeaderProps,
  type LayoutFooterProps,
  type LayoutContentProps,
  type LayoutPanelProps,
  type LayoutPanelResponsive,
} from './Layout';
```

- [ ] **Step 5: Run tests**

Run: `vp test packages/react/src/components/Layout.test.tsx`
Expected: PASS

- [ ] **Step 6: Add resize binding test**

```tsx
it('binds resizable width to LayoutPanel', () => {
  const { result } = renderHook(() =>
    useResizable({ defaultWidth: 380, minWidth: 320, maxWidth: 480 }),
  );
  const region = result.current;
  const { container } = render(
    <Layout
      content={<LayoutContent>Main</LayoutContent>}
      end={
        <LayoutPanel resizable={region} data-testid="panel">
          Inspector
        </LayoutPanel>
      }
    />,
  );
  const panel = container.querySelector('[data-testid="panel"]') as HTMLElement;
  expect(panel.style.width).toBe('380px');
});
```

Run: `vp test packages/react/src/components/Layout.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/react/src/components/Layout.tsx packages/react/src/components/Layout.test.tsx packages/react/src/components/index.ts
git commit -m "feat(react): add Layout family with resize binding"
```

**End PR 1** — open PR with Tasks 1–4, run `vp check && vp test`.

---

### Task 4: LayoutPanel responsive modes

**Files:**

- Modify: `packages/react/src/components/Layout.tsx`
- Modify: `packages/react/src/components/Layout.test.tsx`

**Interfaces:**

- Consumes: `useMediaQuery`, `appShellMobileBreakpointQueries` from `@var-ui/core` / hooks; RAC `Modal`, `ModalOverlay`
- Produces: `LayoutPanel` with `responsive`, `isOpen`, `defaultOpen`, `onOpenChange` props

- [ ] **Step 1: Add breakpoint query map**

```ts
// packages/core/src/breakpoints.ts — add alongside appShellMobileBreakpointQueries
export const layoutBreakpointQueries = {
  sm: appShellMobileBreakpointQueries.sm,
  md: appShellMobileBreakpointQueries.md,
  lg: appShellMobileBreakpointQueries.lg,
} as const;
export type LayoutBreakpoint = keyof typeof layoutBreakpointQueries;
```

Export from `packages/core/src/index.ts`.

- [ ] **Step 2: Write failing responsive tests**

```tsx
function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

it('hidden mode renders nothing below breakpoint when closed', () => {
  mockMatchMedia(true); // below lg
  const { container } = render(
    <Layout
      content={<LayoutContent>Main</LayoutContent>}
      end={
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} defaultOpen={false}>
          Inspector
        </LayoutPanel>
      }
    />,
  );
  expect(container.textContent).not.toContain('Inspector');
});

it('overlay mode renders modal below breakpoint when open', () => {
  mockMatchMedia(true);
  render(
    <Layout
      content={<LayoutContent>Main</LayoutContent>}
      end={
        <LayoutPanel
          responsive={{ below: 'lg', mode: 'overlay' }}
          isOpen
          label="Details"
          role="complementary"
        >
          Inspector
        </LayoutPanel>
      }
    />,
  );
  expect(screen.getByRole('complementary', { name: 'Details' })).toBeTruthy();
});
```

- [ ] **Step 3: Run tests — verify fail**

Run: `vp test packages/react/src/components/Layout.test.tsx`
Expected: FAIL

- [ ] **Step 4: Implement responsive in `LayoutPanel`**

```tsx
const isBelow = useMediaQuery(layoutBreakpointQueries[responsive?.below ?? 'lg']);
const isResponsive = responsive != null && isBelow;
const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
const isOpen = isOpenProp ?? internalOpen;
const setOpen = onOpenChange ?? setInternalOpen;

if (isResponsive && responsive.mode === 'hidden' && !isOpen) return null;

const panelBody = (
  <div {...recipeProps(p.panel, className)} style={panelStyle} role={role} aria-label={label}>
    {children}
  </div>
);

if (isResponsive && responsive.mode === 'overlay') {
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalOverlay className={recipeClassName(p.overlayBackdrop)} />
      <Modal className={recipeClassName(p.overlay)}>{panelBody}</Modal>
    </Modal>
  );
}

return panelBody;
```

Add `data-side={area}` on overlay panel for start/end slide direction in recipe CSS.

- [ ] **Step 5: Run tests + check**

Run: `vp test packages/react/src/components/Layout.test.tsx && vp check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/breakpoints.ts packages/core/src/index.ts packages/react/src/components/Layout.tsx packages/react/src/components/Layout.test.tsx
git commit -m "feat(react): add LayoutPanel responsive overlay and hidden modes"
```

---

### Task 5: Astro static bindings

**Files:**

- Create: `packages/astro/src/components/Layout.astro`
- Create: `packages/astro/src/components/LayoutHeader.astro`
- Create: `packages/astro/src/components/LayoutFooter.astro`
- Create: `packages/astro/src/components/LayoutContent.astro`
- Create: `packages/astro/src/components/LayoutPanel.astro`
- Modify: `packages/astro/index.ts`
- Modify: `packages/astro/README.md`

**Interfaces:**

- Consumes: `layout`, `layoutHeader`, etc. from `@var-ui/core`
- Produces: Astro components mirroring `AppShell.astro` slot pattern

- [ ] **Step 1: Create `Layout.astro`** (follow `AppShell.astro`)

```astro
---
import { layout } from '@var-ui/core';
import { recipeProps } from '../utils';

type Props = {
  height?: 'fill' | 'auto';
  padding?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
  className?: string;
};

const { height = 'fill', padding = 4, className } = Astro.props;
const l = layout({ height, padding });
const hasHeader = Astro.slots.has('header');
const hasFooter = Astro.slots.has('footer');
const hasStart = Astro.slots.has('start');
const hasEnd = Astro.slots.has('end');
---
<div
  {...recipeProps(l.root, className)}
  data-has-header={hasHeader || undefined}
  data-has-footer={hasFooter || undefined}
  data-has-start={hasStart || undefined}
  data-has-end={hasEnd || undefined}
>
  <div {...recipeProps(l.outer)}><div {...recipeProps(l.inner)}>
    {hasHeader && <slot name="header" />}
    <div {...recipeProps(l.middle)}>
      {hasStart && <slot name="start" />}
      <slot />
      {hasEnd && <slot name="end" />}
    </div>
    {hasFooter && <slot name="footer" />}
  </div></div>
</div>
```

- [ ] **Step 2: Create zone wrappers**

`LayoutHeader.astro`, `LayoutFooter.astro`, `LayoutContent.astro`, `LayoutPanel.astro` — each imports its recipe, accepts `className`, `padding`, `hasDivider` (header/footer/panel), `width` (panel), renders default slot.

`LayoutPanel.astro` props:

```astro
type Props = {
  width?: number | string;
  hasDivider?: boolean;
  className?: string;
  label?: string;
  role?: string;
};
```

- [ ] **Step 3: Export from `packages/astro/index.ts`**

```ts
export { default as Layout } from './src/components/Layout.astro';
export { default as LayoutHeader } from './src/components/LayoutHeader.astro';
export { default as LayoutFooter } from './src/components/LayoutFooter.astro';
export { default as LayoutContent } from './src/components/LayoutContent.astro';
export { default as LayoutPanel } from './src/components/LayoutPanel.astro';
```

- [ ] **Step 4: Update README** — note static-only; resize/overlay requires React.

- [ ] **Step 5: Add static example to `examples/astro-app/src/pages/index.astro`**

```astro
<Section title="Layout (static)">
  <Layout padding={4}>
    <LayoutHeader slot="header"><Heading level={3}>Explorer</Heading></LayoutHeader>
    <LayoutPanel slot="start" width={200} hasDivider>Nav</LayoutPanel>
    <LayoutContent>Main content</LayoutContent>
    <LayoutPanel slot="end" width={280} hasDivider>Inspector</LayoutPanel>
  </Layout>
</Section>
```

- [ ] **Step 6: Commit**

```bash
git add packages/astro/ examples/astro-app/src/pages/index.astro
git commit -m "feat(astro): add static Layout family bindings"
```

---

### Task 6: Docs and demos

**Files:**

- Create: `docs/content/components/layout.mdx`
- Create: `docs/content/components/layout-panel.mdx`
- Create: `docs/content/components/collapsible.mdx`
- Create: `docs/src/demos/layout/default/react.tsx`
- Create: `docs/src/demos/layout/default/astro.astro`
- Create: `docs/src/demos/layout/default/html.ts`
- Create: `docs/src/demos/layout/default/snippets.ts`
- Modify: `docs/src/data/components.ts`
- Modify: `docs/src/demos/registry.ts`, `reactDemoMap.ts`, `astroDemoMap.ts`, `htmlDemoMap.ts`

- [ ] **Step 1: Add registry entries in `components.ts`**

```ts
{
  slug: 'layout',
  name: 'Layout',
  category: 'layout',
  description: 'Multi-pane page shell with header, side panels, and scrollable content.',
  importLine: "import { Layout, LayoutContent, LayoutPanel } from '@var-ui/react';",
},
{
  slug: 'layout-panel',
  name: 'LayoutPanel',
  category: 'layout',
  description: 'Fixed-width side panel for Layout start/end slots.',
  importLine: "import { LayoutPanel } from '@var-ui/react';",
},
{
  slug: 'collapsible',
  name: 'Collapsible',
  category: 'layout',
  description: 'Expand/collapse disclosure panel.',
  importLine: "import { Collapsible, CollapsibleGroup } from '@var-ui/react';",
},
```

- [ ] **Step 2: Create MDX pages** (follow `stack.mdx` pattern with `<Demo id="layout.default" />`)

- [ ] **Step 3: Create demo `react.tsx`** — master-detail with table row selection + resizable end panel:

```tsx
import { useState } from 'react';
import {
  Layout,
  LayoutContent,
  LayoutPanel,
  ResizeHandle,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useResizable,
} from '@var-ui/react';

export default function Preview() {
  const [selected, setSelected] = useState<string | null>(null);
  const { end } = useResizable({
    regions: {
      end: { defaultWidth: 320, minWidth: 260, maxWidth: 480, autoSaveId: 'layout-demo' },
    },
  });
  return (
    <Layout
      height="fill"
      padding={0}
      content={
        <LayoutContent padding={0}>
          <Table
            aria-label="Items"
            selectionMode="single"
            onSelectionChange={(keys) => setSelected(([...keys][0] as string) ?? null)}
          >
            <TableHeader>
              <TableColumn>Item</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow id="a">
                <TableCell>Alpha</TableCell>
              </TableRow>
              <TableRow id="b">
                <TableCell>Beta</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </LayoutContent>
      }
      end={
        selected ? (
          <>
            <LayoutPanel
              resizable={end}
              hasDivider
              label="Details"
              role="complementary"
              responsive={{ below: 'lg', mode: 'overlay' }}
              isOpen
            >
              <p>{selected}</p>
            </LayoutPanel>
            <ResizeHandle {...end.handleProps} />
          </>
        ) : null
      }
    />
  );
}
```

Wire snippets/astro/html maps following `docs/src/demos/stack/default/` structure.

- [ ] **Step 4: Add master-detail to `examples/vite-app/src/App.tsx`** (simpler standalone section)

- [ ] **Step 5: Run docs build smoke**

Run: `vp run build --filter docs` or `vp build` in `docs/` per project convention
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add docs/ examples/vite-app/
git commit -m "docs: add Layout, LayoutPanel, and Collapsible pages"
```

---

### Task 7: Roadmap + final validation

**Files:**

- Modify: `ROADMAP.md`

- [ ] **Step 1: Update ROADMAP Phase 6 checkbox**

```markdown
- [x] **Phase 6 — layout polish and collapsible regions** — shipped:
      `Collapsible`/`CollapsibleGroup`; `Resizable` single-region (P5 P2);
      `Layout`/`LayoutContent`/`LayoutPanel`/`LayoutHeader`/`LayoutFooter`,
      multi-region `useResizable`, responsive panel modes, Astro static bindings.
      Spec: `docs/superpowers/specs/2026-07-29-phase-6-layout-design.md`.
```

- [ ] **Step 2: Full validation**

Run: `vp check && vp test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add ROADMAP.md
git commit -m "chore: mark Phase 6 layout complete in ROADMAP"
```

**End PR 2.**

---

## Spec coverage checklist

| Spec requirement                        | Task      |
| --------------------------------------- | --------- |
| Core layout recipes (5 exports)         | Task 1    |
| Multi-region `useResizable`             | Task 2    |
| React Layout family                     | Task 3    |
| Resize binding on LayoutPanel           | Task 3    |
| Responsive overlay + hidden             | Task 4    |
| Astro static bindings                   | Task 5    |
| Docs: layout, layout-panel, collapsible | Task 6    |
| Examples: vite-app + astro-app          | Tasks 5–6 |
| Roadmap checkbox                        | Task 7    |
| Collapsible docs gap                    | Task 6    |
| Out of scope items excluded             | —         |

## Self-review

- No TBD/TODO placeholders in tasks
- Type names consistent: `UseResizableResult`, `LayoutPanelResponsive`, `MultiResizableConfig`
- SideNav API preserved via `normalizeConfig` + single-region path
- PR split aligns with spec (core+React first, responsive+Astro+docs second)
