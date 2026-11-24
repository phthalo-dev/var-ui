# `@var-ui/docs`

Astro documentation kit **built with Var UI** — for general technical docs sites
(and design-system catalogs via optional plugins).

Chrome uses `@var-ui/astro` + typestyles. Theming DX matches apps:
`createDesignTheme()` drives shell, prose, and **syntax highlighting**
(`syntax: 'design-tokens'` → `color.code.*`).

## Minimal usage (guide-only site)

```js
import { defaultThemeClassName } from '@var-ui/core';
import varDocs from '@var-ui/docs';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    varDocs({
      title: 'My Docs',
      theme: {
        defaultClassName: defaultThemeClassName,
        // Default — fenced code tracks the active design theme.
        syntax: 'design-tokens',
      },
      typestyles: {
        entry: 'typestyles-entry.ts',
      },
      routes: {
        docs: { prefix: '/docs', collection: 'docs' },
      },
      components: {
        Layout: './src/layouts/BaseLayout.astro',
      },
    }),
  ],
});
```

Guide-only sites do **not** need React. The header (`DocsTopBar`: brand, section links, search, a `tools` slot and the `DocsAppearanceMenu` for colour mode and `theme.presets`) is plain Astro + JS, like the rest of the kit chrome, and is shared by `DocsPage` and `DocsMarketingPage` (or use it directly in a custom layout with `DocsMobileMenu`). It persists across view transitions, so it never jumps or cross-fades between pages. `theme.presets` CSS extraction does not require React either.

`output: 'static'` is supported. Injected `/docs` routes prerender, including when Astro `base` is set. Static injected routes accept **exactly one** `routes` prefix in this release (default `/docs`). Sites with several prefixes should use `output: 'server'`, or `disableGuideRoutes` plus `DocsGuidePage` in their own pages:

```astro
---
// src/pages/docs/[...slug].astro
import DocsGuidePage from '@var-ui/docs/DocsGuidePage';
import BaseLayout from '../../layouts/BaseLayout.astro';
import * as mdxComponents from '../../lib/guide-mdx-components';
---
<DocsGuidePage layout={BaseLayout} mdxComponents={mdxComponents} />
```

`examples/astro-docs` dogfoods this setup in the monorepo and aliases workspace packages through Vite. Copy the snippet above for a published-npm consumer — not that example’s `vite.resolve.alias` block.

`varDocs()` wires:

- Config validation (`title`, `theme` incl. optional `presets`, `typestyles`, free-form `routes`, `components`)
- `@typestyles/vite` extraction for the configured entry
- Design-token Shiki theme for MDX fenced code (theme-owned `color.code.*`)
- Lazy showcase theme CSS in dev + `astro:build:start` extract when `theme.presets` includes `lazyCss` entries
- `@astrojs/mdx` + `rehype-slug` when MDX is not already registered
- `virtual:var-docs/config` (+ Layout / MDX component virtual modules)
- Optional injected guide routes + middleware (disable on Netlify SSR sites)
- Markdown views **on by default**: sibling `.md` URLs, `/llms.txt`, and an “Also available as Markdown” link on `DocsPage`. Opt out with `markdownViews: false`. Design-system catalogs pass `extraPrefixes: ['/components']` so the kit indexes CLI-generated component markdown.

### Showcase presets

```js
varDocs({
  title: 'My Docs',
  theme: {
    defaultClassName: defaultThemeClassName,
    syntax: 'design-tokens',
    presets: [
      { id: 'default', label: 'Default', className: defaultThemeClassName, lazyCss: false },
      { id: 'forest', label: 'Forest', className: forestTheme.className, swatch: '#16a34a' },
    ],
  },
  typestyles: { entry: 'typestyles-entry.ts' },
});
```

Add a preset: theme module + `typestyles-themes/{id}.ts` + one `presets` entry (no hardcoded script ID lists).

Component catalogs (props tables, framework switcher, theme playground) live in
`@var-ui/docs-components` / `@var-ui/docs-playground`. **`CodeBlock`** is the shared
docs shell for source + optional live preview: syntax highlighting, copy control, and
expand/collapse. Pass **default slot children** for the demo; the kit does not run your
examples — you render islands, Astro, or static markup yourself.

## Content collections

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@var-ui/docs/schema';

export const collections = {
  docs: defineCollection({
    loader: glob({ base: './content/docs', pattern: '**/*.{md,mdx}' }),
    schema: docsSchema(),
  }),
};
```

Add more guide collections as needed and map them in `routes` — e.g. Var UI docs
adds `theming`; a library might add `api` or `guides`. Use `matchGuideRoute()` from
`@var-ui/docs/utils` to map URLs → collection entries.

`@var-ui/docs/utils` is for server code (pages, integrations, build scripts): it also exports
Node-only helpers. In client islands and `<script>`s, import the theme helpers from
`@var-ui/docs/theme-client` instead. It's browser-safe and exports `ensureDocsThemeStyles` (load
a lazy theme's `/themes/<id>.css` once), `createDocsThemeController` and the preset helpers:

```ts
import { ensureDocsThemeStyles } from '@var-ui/docs/theme-client';

ensureDocsThemeStyles('forest', presets, () => repaint());
```

## Shell components

```astro
---
import DocsPage from '@var-ui/docs/DocsPage';
---

<DocsPage
  title="My Docs"
  themeClassName={defaultThemeClassName}
  topNav={topNav}
  sidebarSections={sidebarSections}
  searchItems={searchItems}
>
  <article slot="default">…</article>
</DocsPage>
```

### Install commands (`PackageInstall`, `packageInstallMarkup`)

`<PackageInstall packages="@var-ui/core typestyles" />` renders one code block with a tab per package manager (`dev` for dev dependencies); pass `commands={[{ id: 'pnpm', command: '…' }, …]}` instead when the commands come from content. Sites that build HTML strings (a markdown pipeline) get the same markup from `@var-ui/docs/package-install`:

```ts
import {
  initPackageInstall,
  packageInstallCommands,
  packageInstallMarkup,
  PACKAGE_MANAGER_STORAGE_KEY,
} from '@var-ui/docs/package-install';

const html = packageInstallMarkup({ commands: packageInstallCommands('@var-ui/core') });
// On the client: initPackageInstall() for the tabs, initCodeBlockCopy() (@var-ui/astro) for copy.
```

The chosen manager is shared by every block and remembered under `PACKAGE_MANAGER_STORAGE_KEY` in `localStorage`. Copy buttons copy the visible `pre code`, so the command is not repeated in an attribute.

### Examples + source (`CodeBlock`)

Register `@var-ui/docs/styles` in your TypeStyles entry (includes the `codeBlock` recipe).

Import from **`@var-ui/docs/CodeBlock`** — not `@var-ui/astro`’s `CodeBlock`, which is the
low-level UI primitive.

```astro
---
import DocsCodeBlock from '@var-ui/docs/CodeBlock';
import { Button } from '@var-ui/astro';
const code = `import { Button } from '@var-ui/astro';\n\n<Button>Save</Button>`;
---

<DocsCodeBlock
  code={code}
  language="astro"
  filename="Demo.astro"
  framework="astro"
  title="Basic button"
>
  <Button>Save</Button>
</DocsCodeBlock>
```

Code-only (no default slot):

```astro
<DocsCodeBlock code={code} language="tsx" filename="Example.tsx" framework="react" />
```

Set `copyable={false}` to hide the copy button. Use `@var-ui/docs/CodeDemoCodeBlock` for a
plain highlighted `@var-ui/astro` `CodeBlock` without the docs card chrome.

See `docs/superpowers/specs/2026-08-11-var-docs-kit-design.md`.

Import kit chrome recipes from your TypeStyles extract entry so `DocsPage` header CSS is emitted:

```ts
import '@var-ui/core/styles';
import '@var-ui/docs/styles';
```
