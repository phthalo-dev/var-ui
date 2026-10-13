# @var-ui/react

React component library built with [typestyles](https://github.com/type-styles/typestyles) and [`@var-ui/core`](../core/README.md) tokens. Consumed by the docs site and `examples/vite-app`.

Framework-specific wrappers around accessible primitives ([React Aria Components](https://react-spectrum.adobe.com/react-aria/)) with typed variants, design tokens, and theme context.

## Install

```bash
pnpm add @var-ui/react @var-ui/core react react-dom react-aria-components
```

Within this monorepo:

```json
{
  "dependencies": {
    "@var-ui/react": "workspace:*"
  }
}
```

Peer dependencies: `react`, `react-dom`, `react-aria-components`, and `@var-ui/core`.

## Usage

```tsx
import '@var-ui/core/styles.css';
import { Button, DesignSystemProvider, layout, text } from '@var-ui/react';

export function App() {
  return (
    <DesignSystemProvider applyToDocument>
      <main className={layout({ stack: true })}>
        <h1 className={text({ title: true })}>Hello</h1>
        <Button intent="primary">Click me</Button>
      </main>
    </DesignSystemProvider>
  );
}
```

For custom `createDesignTheme` modules or tree-shaken CSS, extract with `@typestyles/vite`
instead of importing `styles.css`. Do not use both. Workspace apps in this repo still extract.

## Icons

var-ui components never bundle SVGs. They resolve **semantic icon names**
(`close`, `chevronDown`, `search`, `info`, …) through `IconProvider`; unmapped
names render a single shared empty placeholder (correctly sized, zero payload).

**1. Required — mount an `IconProvider`** (icons come from the provider only):

```tsx
import { DesignSystemProvider, IconProvider } from '@var-ui/react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider>
      {/* Pass at least an empty object — unmapped names use the empty fallback */}
      <IconProvider icons={{}}>{children}</IconProvider>
    </DesignSystemProvider>
  );
}
```

**2. Optional — var-ui default glyphs** (`@var-ui/icons`, optional peer):

```bash
pnpm add @var-ui/react @var-ui/core @var-ui/icons
```

```tsx
import { defaultIcons } from '@var-ui/icons';

<IconProvider icons={defaultIcons}>
  <App />
</IconProvider>;
```

**3. Alternative — bring your own icon library** (no `@var-ui/icons`):

```tsx
import { Check, ChevronDown, CircleAlert, CircleCheck, Copy, Info, Search, X } from 'lucide-react';
import type { IconName } from '@var-ui/core';

const lucideIcons: Partial<Record<IconName, React.ReactNode>> = {
  close: <X />,
  chevronDown: <ChevronDown />,
  search: <Search />,
  check: <Check />,
  copy: <Copy />,
  info: <Info />,
  success: <CircleCheck />,
  warning: <CircleAlert />,
  error: <CircleAlert />,
};

<IconProvider icons={lucideIcons}>
  <App />
</IconProvider>;
```

Per-component overrides bypass the registry (e.g. `<Alert icon={<Custom />} />`;
pass `icon={null}` to hide a default glyph). Nested providers shallow-merge
over the parent registry for their subtree. Use `<Icon name="…" />` directly
for your own UI, or `<Icon>{node}</Icon>` for one-off custom glyphs.

## Exports

| Category             | Examples                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Actions & forms**  | `Button`, `Link`, `TextField`, `TextAreaField`, `Checkbox`, `Switch`, `RadioGroup`, `Select`, `Field` |
| **Layout**           | `Stack` / `HStack` / `VStack`, `Grid`, `Section`, `Center`, `AspectRatio`, `Divider`                  |
| **Content**          | `Heading`, `Text`, `Timestamp`, `EmptyState`, `CodeBlock`                                             |
| **Containers**       | `Card`, `ClickableCard`, `Carousel`, `Thumbnail`, `Avatar`, `AvatarGroup`, `Badge`                    |
| **Feedback**         | `Alert`, `Banner`, `Spinner`, `ProgressBar`                                                           |
| **Overlay & nav**    | `Dialog`, `Tabs`                                                                                      |
| **Icons**            | `Icon`, `IconProvider`, `useIcons` (+ optional `@var-ui/icons` glyph package)                         |
| **Layers**           | `LayerProvider`, `useLayer` — z-index coordination for floating UI                                    |
| **Hooks**            | `useMediaQuery`, `useScrollLock`                                                                      |
| **Layout utilities** | `layout`, `text` — re-exported from `@var-ui/core`                                                    |
| **Tokens**           | `designTokens`, typed value exports                                                                   |
| **Theming**          | `DesignSystemProvider`, `useColorMode`, `ColorModeToggle`                                             |

Core-only recipes without wrappers (use the class helpers from `@var-ui/core`):
`skeleton`, `statusDot`, `kbd`, `overlay`, plus everything in the core README's
inventory.

Document globals (reset, base HTML styles, `color-scheme`) ship with `@var-ui/core/styles`
or `@var-ui/core/styles.css`.

## Structure

```text
src/
  components/     # React Aria–based UI
  icons/          # IconProvider, useIcons, Icon, empty fallback
  layers/         # LayerProvider / useLayer z-index coordination
  hooks/          # useMediaQuery, useScrollLock, …
  styles.ts       # re-exports layout + text from @var-ui/core
  tokens.ts       # Re-exports / aliases @var-ui/core tokens
  color-mode.tsx            # useColorMode, getColorModeInitScript
  DesignSystemProvider.tsx  # DesignSystemProvider
  index.ts        # Public API
```

## Learn more

- [`@var-ui/core`](../core/README.md) — framework-agnostic tokens and recipes
- [Component libraries guide](https://typestyles.dev/docs/component-libraries)
- [Vite example](../../examples/vite-app/) — consumes this package
