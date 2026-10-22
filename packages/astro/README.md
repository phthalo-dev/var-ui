# @var-ui/astro

Astro components for the var-ui design system — same visual system as
`@var-ui/react`, **no React runtime**. Components ship as source `.astro` and
`.ts` files; your Astro app compiles them.

See the full design spec:
[`docs/superpowers/specs/2026-07-18-var-ui-astro-design.md`](../../docs/superpowers/specs/2026-07-18-var-ui-astro-design.md).

## Install

```bash
pnpm add @var-ui/astro @var-ui/core astro
```

**Peer dependencies:** `astro`, `@var-ui/core`. No `react`, `react-aria-components`,
or `@var-ui/react`.

## Styles

Import the published stylesheet in a layout:

```astro
---
import '@var-ui/core/styles.css';
---
```

### Advanced: extract CSS

Use `@typestyles/vite` for custom `createDesignTheme` modules or tree-shaken CSS.
Do not also import `@var-ui/core/styles.css`.

```ts
// typestyles-entry.ts
import '@var-ui/core/styles';
```

```js
// astro.config.mjs
import typestylesVite from '@typestyles/vite';

export default defineConfig({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
  },
});
```

Link the generated stylesheet in your layout (path depends on your build output):

```astro
<link rel="stylesheet" href="/typestyles.css" />
```

See [`examples/astro-app`](../../examples/astro-app) for a working **workspace** setup
(that example still extracts).

## ThemeScript

Add `ThemeScript` in `<head>` before styles to avoid a flash of unstyled content
when restoring color mode from `localStorage`:

```astro
---
import ThemeScript from '@var-ui/astro/ThemeScript';
// or: import { ThemeScript } from '@var-ui/astro';
import { defaultThemeClassName } from '@var-ui/core';
---
<html class={defaultThemeClassName}>
  <head>
    <ThemeScript themeClass={defaultThemeClassName} />
  </head>
  <body>...</body>
</html>
```

Props:

- `themeClass` (required) — theme class from `@var-ui/core` (e.g. `defaultThemeClassName`)
- `storageKey` (optional) — `localStorage` key; defaults to `'theme-mode'`

The inline boot script matches the Astro snippet in `@var-ui/core` README: it reads
the stored mode, adds the theme class, and sets or removes `data-color-mode` on `<html>`.
`light` and `dark` set the attribute. `system` and a missing value remove it so the page
follows the OS.

## ColorModeToggle

Self-contained segmented control for light/dark (and optionally system) mode. No React
context required.

```astro
---
import ColorModeToggle from '@var-ui/astro/ColorModeToggle';
// or: import { ColorModeToggle } from '@var-ui/astro';
---
<ColorModeToggle />
<ColorModeToggle includeSystem appearance="labels" size="sm" />
```

Props match the React `ColorModeToggle`: `includeSystem`, `appearance`
(`'icons' | 'labels' | 'iconsAndLabels'`), `size`, `className`, `aria-label`, and
optional `storageKey` (default `'theme-mode'`).

Use the same `storageKey` on `ThemeScript` and `ColorModeToggle` so boot and toggle
stay in sync.

## Components

Import from the package barrel:

```astro
---
import { Button, Alert, Stack, Tabs } from '@var-ui/astro';
---
```

v0.1 ships a docs/content kit: layout primitives, feedback atoms, and content-site
components (`Button`, `Link`, `CodeBlock`, `Steps`, `Breadcrumbs`, `Tabs`,
`Collapsible`, …). Prop and variant names match `@var-ui/react` where an equivalent
exists; use **named slots** instead of React `children` for structured regions.

## Tabs

Tabbed panels with a small vanilla controller for click and keyboard selection
(ArrowLeft/Right, Home/End). No React Aria.

The first tab panel is visible without JavaScript via the native `hidden` attribute;
other panels start hidden.

```astro
---
import { Tabs } from '@var-ui/astro';
---
<Tabs tabs={[{ id: 'overview', label: 'Overview' }, { id: 'api', label: 'API' }]}>
  <Fragment slot="overview">
    <p>Overview content</p>
  </Fragment>
  <Fragment slot="api">
    <p>API reference</p>
  </Fragment>
</Tabs>
```

Props:

- `tabs` (required) — `{ id: string; label: string }[]`
- `defaultSelectedId` (optional) — tab `id` selected on load; defaults to the first tab
- `className` (optional)

Panel content uses **named slots** matching each tab `id` (e.g. `slot="overview"`).
Pass `defaultSelectedId` to change which panel is shown before the client script runs.

## Layout

Multi-pane page shell for header/footer bands and start/content/end zones. Static
bindings only — same core recipes as `@var-ui/react`, named slots instead of
compound props.

Interactive resize (`useResizable` + `ResizeHandle`) and responsive panel modes
(`overlay` / `hidden`) require React; Astro ships the structural shell and styling
only.

```astro
---
import {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutPanel,
  Heading,
} from '@var-ui/astro';
---
<Layout padding={4}>
  <LayoutHeader slot="header" hasDivider>
    <Heading level={3}>Explorer</Heading>
  </LayoutHeader>
  <LayoutPanel slot="start" side="start" width={200} hasDivider>Nav</LayoutPanel>
  <LayoutContent>Main content</LayoutContent>
  <LayoutPanel slot="end" side="end" width={280} hasDivider>Inspector</LayoutPanel>
</Layout>
```

Props mirror `@var-ui/react` where applicable, with these limitations:

- `LayoutPanel` requires an explicit `side="start"` or `side="end"` — Astro has no
  layout area context.
- `Layout` accepts `contentWidth` (px) to set the shell content-width CSS var on the root.
- No automatic `data-divider-header` / `data-divider-footer` on the layout root — set
  `hasDivider` on `LayoutHeader` / `LayoutFooter` directly.

## Collapsible

Expand/collapse panel built on native `<details>` / `<summary>` (no React Aria).

```astro
---
import { Collapsible } from '@var-ui/astro';
---
<Collapsible title="Show code" defaultExpanded={false}>
  <pre>…</pre>
</Collapsible>
```

v0.1 omits controlled `isExpanded` / `onExpandedChange` and `CollapsibleGroup`; use
[`Accordion`](#accordion) for multi-panel layouts or standalone `Collapsible` for a single panel.

## Accordion

Multi-panel expand/collapse built on native `<details>` / `<summary>` with a small script for
single-open mode, keyboard navigation, and optional `collapsible={false}`.

```astro
---
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@var-ui/astro';
---
<Accordion type="single">
  <AccordionItem id="billing" defaultExpanded>
    <AccordionTrigger>Billing</AccordionTrigger>
    <AccordionPanel>
      <p>Update payment method and view invoices.</p>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem id="shipping">
    <AccordionTrigger>Shipping</AccordionTrigger>
    <AccordionPanel>
      <p>Manage delivery addresses and preferences.</p>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
```

`AccordionItem` also accepts a `title` prop instead of `AccordionTrigger`. Set
`defaultExpanded` on each item for the initial open state. When `variant="flush"` is used on
`Accordion`, pass `variant="flush"` to each `AccordionItem` as well.

## Menu

Dropdown action menu (trigger button + popup list) with a small vanilla controller —
no React Aria. Data-driven via `sections`, mirroring the React `Menu.FromSections`
preset. The popover is positioned with CSS relative to the trigger (`placement` prop);
no portaling or JS positioning.

```astro
---
import { Menu } from '@var-ui/astro';
---
<Menu
  triggerLabel="Actions"
  sections={[
    {
      label: 'File',
      items: [
        { id: 'new', label: 'New file', shortcut: '⌘N' },
        { id: 'open', label: 'Open…' },
        { id: 'save', label: 'Save', disabled: true },
      ],
    },
    {
      items: [
        { id: 'docs', label: 'Documentation', href: '/docs' },
        { id: 'delete', label: 'Delete', danger: true },
      ],
    },
  ]}
/>
```

Props:

- `sections` (required) — `{ label?: string; items: MenuItemDefinition[] }[]`. Items are
  `{ id, label, shortcut?, disabled?, danger?, href?, swatch? }`; `href` renders a link
  that navigates natively, `swatch` renders a leading color dot (theme pickers).
  Sections are separated by a rule; `label` renders a section header.
- `triggerLabel` — text for the default trigger button (a chevron icon is added).
- `aria-label` — accessible name for the trigger; required when the trigger has no text.
- `menuLabel` — accessible name for the menu list (defaults to `triggerLabel` / `aria-label`).
- `placement` — `'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`
  (default `'bottom-start'`).
- `selectionMode` — `'none'` (default, mirrors the React Menu) or `'single'`, which
  renders items as `menuitemradio` with a check affordance and tracks one
  `aria-checked` item. Pair with `selectedId` for the initial checked item.
- `className` — applied to the menu root.
- Trigger appearance accepts the same variant props as `Button` (`tone`,
  `appearance`, `size`, `layout`, `elevated`); defaults to an `outline` `md` button.

Slots:

- `trigger` — custom trigger button content. Combine with `layout="icon"` and
  `aria-label` for icon-only triggers.
- `<item-id>` — replaces the inner content of the item with that `id` (e.g. leading
  icons or swatches); `trigger` is a reserved slot name.

Behavior:

- Opens on trigger click, `ArrowDown`/`ArrowUp`, or `Enter`/`Space`; closes on `Escape`,
  `Tab`, outside press, or item activation. In `single` selection mode the checked
  item receives initial focus.
- Arrow keys, `Home`/`End`, and single-character typeahead move focus between items
  (including disabled items, which are focusable but not activatable).
- On activation the root dispatches a bubbling `var-ui:menu-action` CustomEvent with
  `event.detail.id`; use `initMenus()` / `getMenuController()` from the package barrel
  for imperative control. `controller.select(id)` moves `aria-checked` in `single`
  mode (e.g. when the selection changes elsewhere).

## Toast

Presentational toast markup for static docs or SSR previews:

```astro
---
import { Toast } from '@var-ui/astro';
---
<Toast tone="success" title="Saved" description="Your draft was stored." />
```

For live notification queues without React, mount a `ToastRegion` and call the imperative
`toast` API from any client script:

```astro
---
import { ToastRegion } from '@var-ui/astro';
---
<ToastRegion placement="bottom-end" />

<button type="button" id="save-btn">Save</button>

<script>
  import { toast } from '@var-ui/astro';

  document.getElementById('save-btn')?.addEventListener('click', () => {
    toast.show({
      tone: 'success',
      title: 'Saved',
      description: 'Your draft was stored.',
    });
  });
</script>
```

`toast.show()`, `toast.update(id, patch)`, `toast.dismiss(id)`, and `toast.dismissAll()` mirror
the React imperative API. `toast()` is shorthand for `toast.show()`.

## Interactivity ladder

Components climb only as far as needed — no React, no React Aria:

1. **Zero JS** — styled markup + recipes.
2. **Native platform** — `<button>`/`<a>`, `<details>`, semantic lists.
3. **Small vanilla TS** — color mode, Tabs selection/keyboard, Menu; scripts enhance
   SSR markup.
4. **Zag.js (post–v0.1)** — Dialog, Select, complex overlays.

## Utilities

```ts
import { mergeProps, combine, cx } from '@var-ui/astro';
```

See `@var-ui/core` for theme tokens and component recipes used by Astro components.
