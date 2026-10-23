# @var-ui/icons

Optional default glyphs for the [var-ui](https://github.com/phthalo-dev/var-ui) design system.

var-ui components never bundle SVGs — they resolve semantic icon names
(`close`, `chevronDown`, `search`, …) through `IconProvider` from
`@var-ui/react`. Default glyph SVGs live here as framework-agnostic
strings (`defaultIconSvgs` from `@var-ui/icons/glyphs`); this package
also wraps them as React nodes so apps don't have to bring their own
icon library. It is an **optional** peer of `@var-ui/react` and a peer
of `@var-ui/astro`. Apps that skip it pay zero icon payload in React
(unmapped names render a shared empty placeholder).

## Install

```bash
pnpm add @var-ui/icons
```

## Usage

```tsx
import { IconProvider } from '@var-ui/react';
import { defaultIcons } from '@var-ui/icons';

<IconProvider icons={defaultIcons}>
  <App />
</IconProvider>;
```

Import one glyph when you do not need the full registry. The React element and the
SVG string are separate subpaths, so the rest of the set stays out of the bundle:

```tsx
import { close } from '@var-ui/icons/close';
import { svg as closeSvg } from '@var-ui/icons/glyphs/close';
```

`import { close, search } from '@var-ui/icons'` tree-shakes the same way. Icons are
minimal inline SVGs — 24×24 viewBox, `currentColor`, `aria-hidden` — and nothing is
auto-imported.

To use a third-party icon library instead, map its glyphs onto `IconName`
keys — see the `@var-ui/react` README.
