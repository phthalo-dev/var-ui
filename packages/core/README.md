# @var-ui/core

Framework-agnostic design tokens and recipes used by the [docs site](../../docs/README.md), [`@var-ui/react`](../react/README.md), and example apps.

This is a **library package** (not a standalone app). Import it from apps or the docs site; styles register as side effects when modules load.

## Quick start

```ts
import '@var-ui/core/styles.css';
import { button, layout, designTokens, defaultThemeClassName } from '@var-ui/core';

document.body.className = defaultThemeClassName; // `theme-var-ui-default`
element.className = button({ tone: 'accent', appearance: 'filled' });
// `layout` — multi-pane page shell; `stack` and `textBlock` — section and body text
```

Custom themes return a `DesignTheme` from `createDesignTheme({ name: 'acme' })` — use
`theme.className` the same way. See [Theme surfaces](#theme-surfaces).

### Advanced: TypeStyles extraction

Use extract for custom `createDesignTheme` modules, app-owned recipes, or tree-shaken CSS.
Do not import `@var-ui/core/styles.css` in the same app.

Add a build entry that side-effect-imports the styles bundle, then point
`@typestyles/vite` at it:

```ts
// typestyles-entry.ts
import '@var-ui/core/styles';

// Optional: custom theme presets and app-owned recipe() modules
import './acme-theme';
```

```ts
// vite.config.ts
import typestylesVite from '@typestyles/vite';

export default defineConfig({
  plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
});
```

`@var-ui/core/styles` registers every component recipe, document globals (reset, base
HTML styles, `color-scheme`), layout utilities, and the built-in default theme surface.
For tree-shaken fixture apps that only use a few components, import the recipes you need
instead (see [`examples/bundle-fixtures`](../../examples/bundle-fixtures/)).

Syntax highlighting is app-owned: use `color.code` tokens and wire them to your
highlighter (see [Syntax highlighting](#syntax-highlighting) below).

See [`examples/vite-app`](../../examples/vite-app/README.md) and [`examples/astro-app`](../../examples/astro-app/) for full workspace setups.

### Key exports

| Area              | Exports                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Themes**        | `createDesignTheme`, `defaultTheme`, `disposeDesignTheme`, `DEFAULT_THEME_NAME`, `defaultThemeClassName`, `COLOR_MODE_ATTRIBUTE`, `mergeThemeOverrides` |
| **Tokens**        | `designTokens`, `tokens`, `tokenValues`, `generateColors`, `lightSyntaxValues`, `darkSyntaxValues`                                                      |
| **Customization** | `when`, `defineFonts`, `groteskMono`                                                                                                                    |
| **TypeStyles**    | `typestyles`, `style`, `recipe`, `tokens`, `global`, `breakpoint`, `media`, `override`                                                                  |
| **Types**         | `DesignTheme`, `DesignThemeConfig`, `DesignThemeTokenValues`, `OverrideConfigFor`, …                                                                    |

## Recipe inventory

Every recipe follows the [`c.vars()` override contract](#authoring-recipes) and
emits stable public class names.

| Category       | Recipes                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **Actions**    | `button`, `link`                                                                                              |
| **Data input** | `textField`, `textAreaField`, `checkbox`, `radio`, `switchStyles`, `select`, `field` (+ `fieldChrome` helper) |
| **Feedback**   | `alert`, `banner`, `badge`, `spinner`, `skeleton`, `progressBar`, `statusDot`                                 |
| **Layout**     | `stack`, `grid`, `section`, `center`, `aspectRatio`, `divider`, `layout` (shell)                              |
| **Content**    | `heading`, `textBlock`, `kbd`, `emptyState`, `codeBlock`, `proseContent`, `steps`, `fileTree`                 |
| **Containers** | `card`, `carousel`, `thumbnail`, `avatar`, `avatarGroup`                                                      |
| **Overlay**    | `dialog`, `overlay`, `commandPalette`, `tabs`                                                                 |
| **Icons**      | `icon` recipe + `IconName` union / `iconNameList` (glyphs live in `@var-ui/icons`)                            |

## Token layers

Tokens are declared once via `tokens.declare(tokenSchema)` and exposed as `designTokens`
(aliases: `tokens`). Default values live in `tokenValues`; the built-in theme surface
registers them on package load.

| Export         | Role                                                                 |
| -------------- | -------------------------------------------------------------------- |
| `designTokens` | All registered token refs (`palette`, `space`, `color`, `stroke`, …) |
| `tokens`       | Alias for `designTokens` (the `tokens.declare` handle)               |
| `tokenValues`  | Default registered values (root `defaultTheme` token tree)           |

### Token namespaces (expanded)

| Namespace                    | Keys (indicative)                 | Notes                                                                                                                |
| ---------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `palette`                    | 39 families × 10 steps            | Fixed primitive ramp                                                                                                 |
| `space`                      | `0`–`20` (non-contiguous)         | Layout spacing                                                                                                       |
| `size.control` / `size.icon` | `sm`, `md`, `lg`                  | Control heights + icon box                                                                                           |
| `breakpoint`                 | `sm`–`xl`                         | Mode-invariant media-query widths                                                                                    |
| `zIndex`                     | `base` … `max`                    | Stacking scale                                                                                                       |
| `opacity`                    | `disabled`, `muted`               | Shared opacity semantics                                                                                             |
| `letterSpacing`              | `tight`, `normal`, `wide`, `caps` | Typography rhythm                                                                                                    |
| `color.*`                    | semantic UI colors                | Full tree via `tokens.declare`; defaults use mode-aware `{ light, dark }` leaves → CSS `light-dark()`                |
| `color.code`                 | syntax-highlighting palette       | Semantic groups for app-owned highlighter wiring; aliases `lightSyntaxValues` / `darkSyntaxValues` for theme authors |
| `shadow.elevation`           | `low`, `med`, `high`              | Soft elevation (alongside brutalist `shadow.xs`–`xl`)                                                                |
| `stroke`                     | `default`, `strong`               | Border shorthand (fixed)                                                                                             |

Theme overrides example (child theme via `.override()`):

```ts
defaultTheme.override({
  name: 'acme',
  tokens: {
    size: { control: { md: '36px' } },
    zIndex: { toast: 600 },
    color: {
      background: {
        popover: {
          light: designTokens.color.palette['sand-1'].var,
          dark: designTokens.color.palette['sand-9'].var,
        },
      },
    },
  },
});
```

**Non-goals:** no `tokens.components.*`, chart/data palette, or Astryx-style communication hue tables — recipes compose global `color.*` instead.

Theme values accept **token-ref leaves**: raw CSS (`'#0064E0'`, `'16px'`) or refs into registered tokens (`designTokens.color.palette['sky-7']`, `designTokens.radius.lg`). Refs stringify to `var(--var-ui-…)` in emitted CSS.

**Note:** syntax-highlighting colors live under `color.code` (`--var-ui-color-code-*`), not a
top-level `syntax` namespace. There is no `codeBlock` token namespace — the `codeBlock` recipe
reads semantic `color.*` plus Tier 1 `c.vars()`.

## Theme surfaces

Themes are thin wrappers around TypeStyles `tokens.createTheme`. Class names use the
configured scope: `theme-var-ui-<name>` (e.g. `theme-var-ui-default`).

### Runtime themes

`createDesignTheme` is supported in the browser. Calling it again with the same `name`
replaces the surface (theme editors). `disposeDesignTheme(name)` unregisters it.
`@typestyles/vite` extract still covers recipes + the default theme. User-authored
themes inject at runtime.

### Default theme

Import `@var-ui/core/styles` in your typestyles extraction entry to register the
built-in default surface (`defaultTheme`). Use the class name or theme object at runtime:

| Export                  | Value                    | Role                                         |
| ----------------------- | ------------------------ | -------------------------------------------- |
| `defaultTheme`          | `DesignTheme`            | Root theme — fork with `.override()`         |
| `DEFAULT_THEME_NAME`    | `'default'`              | Built-in theme name                          |
| `defaultThemeClassName` | `'theme-var-ui-default'` | Class for the pre-registered default surface |

Additional palette themes (forest, rose, amber, Windows 95, …) are **not** bundled exports —
copy examples from [`docs/src/themes/`](../../docs/src/themes/) in the docs repo.

### Authoring a theme

Follow TypeStyles: root themes use `createDesignTheme` / `tokens.createTheme`; child themes
use `.override()`. Light/dark values are mode-aware `{ light, dark }` leaves on token paths
(compiled to CSS `light-dark()`).

1. **`defaultTheme.override({ name, tokens, … })`** — partial patches onto the built-in tree
2. **`createDesignTheme({ name, tokens, … })`** — root themes (full tree and/or new namespaces)
3. **`generateColors({ accent })`** — mode-aware `tokens.color` tree from one accent
4. **`modes` / `fonts` / `components`** — conditional layers, `@font-face`, recipe restyles

```ts
import { defaultTheme, designTokens, generateColors } from '@var-ui/core';

const color = generateColors({ accent: '#7c3aed' });

export const acmeTheme = defaultTheme.override({
  name: 'acme',
  tokens: {
    color,
    radius: { md: designTokens.radius.lg.var },
  },
  components: {
    button: ({ tokens: t }) => ({
      base: { borderRadius: t.radius.lg.var },
    }),
  },
});

// acmeTheme.className → `theme-var-ui-acme`
```

New token namespaces (e.g. `brand`) belong on a root `createDesignTheme`, not on `.override()`:

```ts
import { createDesignTheme, tokenValues } from '@var-ui/core';

export const acmeWithBrand = createDesignTheme({
  name: 'acme-brand',
  tokens: {
    ...tokenValues,
    brand: {
      glow: { light: '0 0 0 3px blue', dark: '0 0 16px navy' },
    },
  },
});
```

### What `createDesignTheme` compiles to

```ts
typestyles.tokens.createTheme({
  name: 'acme',
  tokens: {
    color: {
      text: { primary: { light: '#111', dark: '#eee' } },
    },
    brand: { … }, // custom namespaces on root themes only
  },
  modes: [...extraModes],
  replace: true,
  components: { button: ({ tokens }) => ({ base: { … } }) },
});

// Child themes:
defaultTheme.override({ name: 'forest', tokens: { color: { … } } });
```

Each return value is a **`DesignTheme`**: TypeStyles `Theme` (`className`, `name`, `source`,
`override`, `tokens`). Recipe restyles belong in `components` (or ad-hoc `override`).

### Color mode (`COLOR_MODE_ATTRIBUTE`)

Import `COLOR_MODE_ATTRIBUTE` (`'data-color-mode'`) from `@var-ui/core`. Omit the attribute
to follow the OS (`color-scheme: light dark` on `:root`). Set `data-color-mode="light"` or
`"dark"` on any element to pin that node and its descendants. The same attribute sets
`color-scheme` (so `light-dark()` tokens flip) and matches component color-mode selectors.
Only the **color** tree (including `color.code`) flips; radius, fontSize, etc. stay on
mode-invariant theme tokens.

```html
<html class="theme-var-ui-default">
  <article data-color-mode="dark" class="var-ui-card-root">…</article>
</html>
```

A descendant can pin the opposite mode. It cannot drop back to “follow the OS” while an
ancestor is pinned, because the ancestor attribute still matches.

### Astro (no React context)

Use a tiny inline script to set **one** palette class on `document.documentElement` and
**`data-color-mode`** for an explicit light or dark choice. Leave the attribute off for system:

```astro
---
import { defaultThemeClassName } from '@var-ui/core';
---
<script is:inline define:vars={{ themeClass: defaultThemeClassName }}>
  const key = 'theme-mode';
  const stored = localStorage.getItem(key);
  document.documentElement.classList.add(themeClass);
  document.documentElement.style.colorScheme = '';
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-color-mode', stored);
  } else {
    document.documentElement.removeAttribute('data-color-mode');
  }
</script>
```

`import.meta.env.SSR` stays irrelevant: the snippet runs in the browser only. Swap
`defaultThemeClassName` for another theme's `className` when you change brand themes.

## Theming helpers

Prefer `defaultTheme.override` for brand patches. Use `generateColors` for an accent-generated
mode-aware color tree, or author `{ light, dark }` leaves directly:

```ts
import { defaultTheme, generateColors } from '@var-ui/core';

const color = generateColors({ accent: '#7c3aed' });

export const acme = defaultTheme.override({
  name: 'acme',
  tokens: { color },
});

// Or hand-author mode-aware leaves:
defaultTheme.override({
  name: 'rose',
  tokens: {
    color: {
      background: {
        app: { light: 'oklch(98% 0.02 350)', dark: 'oklch(18% 0.03 350)' },
      },
      tone: {
        accent: {
          foreground: { light: 'oklch(45% 0.18 350)', dark: 'oklch(75% 0.14 350)' },
        },
      },
    },
  },
});
```

## Authoring recipes

Component recipes expose themeable **surface colors** (background, border, foreground) as
component-scoped CSS custom properties via `c.vars()` in the recipe callback:

- Register colors with `{ value, syntax: '<color>' }` (see `button.ts`).
- Use `v.background.var` (etc.) in base styles; assign variants with `[v.background.name]: tokenValue`.
- Layout, spacing, and type scale stay as direct token references unless a theme need appears.

This is the primary override surface (Tier 1) — values inherit through nested `.theme-*`
boundaries without `@scope` or extra cascade tricks.

## Customizing components

### Tier 1 — component-scoped CSS variables (preferred)

Override a recipe's registered vars in theme CSS or `createDesignTheme` overrides. Example
for buttons on a custom theme:

```css
.theme-var-ui-acme .var-ui-button {
  /* component-scoped vars from c.vars() — exact names match the recipe */
  --var-ui-button-background: var(--var-ui-color-accent-default);
  --var-ui-button-foreground: var(--var-ui-color-text-on-accent);
}
```

### Tier 2 — plain CSS against semantic class names

When a property was not exposed as a var, target the public class name directly. For a
single theme region, a later cascade layer wins:

```css
@layer utilities {
  .theme-var-ui-acme .var-ui-card-root {
    box-shadow: var(--var-ui-shadow-lg);
  }
}
```

### Tier 2 — nested conflicting themes (`styles.scope()`)

When two theme regions nest and both override the same component, use TypeStyles'
`styles.scope()` so proximity — not source order — decides the winner (`@scope` requires
Chrome 118+, Firefox 128+, Safari 17.4+):

```ts
import { styles } from '@var-ui/core';

styles.scope({ root: '.theme-var-ui-windows-95', layer: 'utilities' }, 'button-base', {
  borderColor: 'var(--color-border-strong)',
  backgroundColor: 'var(--color-background-subtle)',
});
```

See [TypeStyles theming docs](https://typestyles.dev/docs/theming) for engine details.

## Public class name contract

Semantic class names emitted by `recipe()` / `style()` in this package are
**public API**. Consumers may target them with plain CSS or `styles.scope()`. Renaming a
namespace or variant key is a **semver-major** change for `@var-ui/core`.

Guard accidental renames with a committed snapshot:

```bash
cd packages/core
pnpm exec typestyles snapshot --write
```

Adding class names is free; removing or renaming requires a major bump and a deliberate
`snapshot --write`. CI enforces this via `@typestyles/no-removed-public-classname`.

## Extending tokens safely

1. **New primitive or semantic keys** — Add values under `src/tokens/`, extend `DesignTokens` / `DesignThemeTokenValues`, and include them in `tokenSchema` + `tokenValues`.
2. **Theme-level patches** — Prefer `defaultTheme.override({ tokens, modes })` (or root `createDesignTheme`). Code-block chrome uses Tier 1 `c.vars()` / `components`, not a dedicated token namespace.
3. **Breaking renames** — Avoid renaming existing CSS custom properties; add aliases if you must migrate consumers gradually.

## CodeBlock copy helper pattern

Use the `codeBlock` recipe with `data-*` hooks so any framework (or vanilla JS) can attach clipboard behavior:

```html
<div class="...codeBlock('root')" data-codeblock>
  <div class="...codeBlock('header')" data-codeblock-header>
    <div class="...codeBlock('actions')">
      <button
        type="button"
        class="...codeBlock('copyButton') ...codeBlock('copyButtonIdle')"
        data-codeblock-copy
        data-copy-label="Copy code"
        data-copied-label="Copied"
        aria-label="Copy code"
      >
        Copy
      </button>
      <span
        class="...codeBlock('feedback') ...codeBlock('feedbackInline')"
        data-codeblock-feedback
        role="status"
        aria-live="polite"
      ></span>
    </div>
  </div>
  <pre><code>...</code></pre>
</div>
```

Minimal behavior:

1. On `[data-codeblock-copy]` click, read text from the closest code element and write to `navigator.clipboard`.
2. Toggle `data-copied` or `data-error` on the button for visual state styles.
3. Set button `aria-label` to `Copied` on success, and restore to `Copy code` after a timeout.
4. Announce status text through `[data-codeblock-feedback]` (`role="status"` + `aria-live="polite"`).

## Syntax highlighting

var-ui defines semantic **`color.code`** tokens (`--var-ui-color-code-*`) but does
not ship highlighter-specific CSS. Map those variables to whatever toolchain you use
(highlight.js selectors, a Shiki theme, Prism, etc.) so highlighted output matches
your design system in light and dark mode.

`lightSyntaxValues` / `darkSyntaxValues` are aliases for theme presets.

| Token                             | Meaning                                              |
| --------------------------------- | ---------------------------------------------------- |
| `base`                            | Default foreground                                   |
| `keyword`                         | Keywords, types, `language_*`                        |
| `title`                           | Titles, class names, function names                  |
| `attr`                            | Attributes, numbers, operators, variables, selectors |
| `string`                          | Strings, regexps                                     |
| `builtIn`                         | Built-ins, symbols                                   |
| `comment`                         | Comments, doc formulas                               |
| `name`                            | XML tags, pseudo-selectors                           |
| `section`                         | Headings                                             |
| `bullet`                          | List bullets                                         |
| `addition` / `additionBackground` | Diff additions (foreground / wash)                   |
| `deletion` / `deletionBackground` | Diff deletions (foreground / wash)                   |

Defaults ship as mode-aware `{ light, dark }` leaves on `tokenValues.color.code`.
Override via theme `tokens.color.code` (or `generateColors`).

The [documentation site](../../docs/README.md) includes a reference highlight.js
mapping in `docs/src/styles/codeHighlight.ts`.

## Learn more

- [`@var-ui/react`](../react/README.md) — React wrappers for these recipes
- [Design system guide](https://typestyles.dev/docs/design-system) — patterns for building your own
- [Documentation site](../../docs/README.md) — primary consumer of this package

## Prose / docs content primitives (`proseContent`)

Long-form markdown helpers live in `proseContent` from `@var-ui/core`. Put `proseContent('root')` on the element that wraps rendered HTML.

Covered primitives:

| Primitive         | Markdown / HTML                    | Notes                                                                      |
| ----------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| **Blockquote**    | `> …`                              | Tinted panel + accent border                                               |
| **`kbd`**         | `<kbd>Ctrl</kbd>`                  | Keyboard cap styling                                                       |
| **Badge**         | `<span data-docs-badge>New</span>` | Optional `data-docs-badge-tone`: `success`, `warning`, `danger`, `info`    |
| **Table**         | GFM tables                         | For wide tables wrap with `<div class="…proseContent('tableWrap')">`       |
| **Divider**       | `---` → `<hr>`                     | Themed horizontal rule                                                     |
| **Heading links** | `h1`–`h6`                          | Apps can inject `<a data-prose-heading-anchor>` permalinks (see docs site) |

**Docs site** composes `proseContent('root')` with site overrides and passes a custom
`createDesignTheme` surface so semantic `--var-ui-color-*` tracks the shell.

### Admonition-style callouts (markdown-only)

GFM does not have native admonitions. Options:

1. **`Alert` recipe** — Prefer Astro/React components (`alert` + `Alert.astro` / `Alert.tsx`) for `neutral` | `accent` | `success` | `warning` | `danger` | `info` with solid/subtle modes.
2. **Blockquote convention** — Use a leading label line:

   ```md
   > **Note**  
   > Short supporting copy in plain markdown.
   ```

   Style tweaks for `blockquote > p:first-child strong` can be added in your app if you want label colors per keyword.

3. **Raw HTML** — bare markup is not styled; use the `alert()` classes from the design system or the component wrappers above.
