# `@var-ui/docs-components`

Optional plugin for **design-system component catalogs** on top of `@var-ui/docs`.

Guide-only sites (e.g. TypeStyles) should **not** install this package.

## Features (Phase 4)

- Framework cookie helpers + `FrameworkSwitcher`
- `ComponentDocTabs` page chrome
- Props extract Vite plugin (consumer provides `writeComponentProps`)
- `componentDocsSchema()` for component MDX frontmatter
- `HiddenPropsTable` for MDX documentation tabs

Demo hosts, product-specific props tables, and registry data stay in the consumer
for now — wire them as MDX / page components. Package owns framework switcher,
component tabs chrome, props-extract Vite plugin, and schemas.

## Usage

```js
import varDocs from '@var-ui/docs';
import componentDocsPlugin from '@var-ui/docs-components';
import { writeComponentProps } from './src/lib/extract-component-props.ts';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    varDocs({
      /* … */
    }),
    componentDocsPlugin({
      extractProps: {
        write: writeComponentProps,
        outputDir: 'src/generated/props',
        watch: ['../packages/react/src'],
      },
      disableComponentRoutes: true,
      disableMiddleware: true,
    }),
  ],
});
```

Site middleware should set `locals.framework` using `@var-ui/docs-components/framework` when `disableMiddleware: true`.

See `docs/superpowers/plans/2026-08-11-var-docs-kit-phase-4.md`.
