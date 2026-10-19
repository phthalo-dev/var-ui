---
'@var-ui/core': minor
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/docs': patch
'@var-ui/cli': patch
---

### Breaking (@var-ui/core)

- The unused **`typeahead`** recipe is removed (the React `Typeahead` component is unchanged — it composes `Combobox`).
- The **`themeableVars`** helper and its subpath export are removed; recipe var-definition metadata comes from TypeStyles itself.
- No-op single-option axes are gone: `layoutHeader`/`layoutFooter` no longer declare a `chrome` variant, and the shared `containerAppearance` axis is removed (so `chatComposer`/`chatLayout` no longer take it).

### Additions (@var-ui/core)

- Every variant-bearing recipe exports a **`XxxVariantProps`** type (`RecipeVariants<typeof recipe>`), so consumers derive variant unions instead of restating literals.
- Shared axes (`controlSize`, `density`, `gap`, `orientation`, `fillAppearance`, `sender`, `placement`, `paneVariant`) are declared once and reused, keeping option names and defaults identical wherever a concept recurs.

### Breaking-ish (@var-ui/react, @var-ui/astro)

- Public prop unions are now derived from the recipes, so a few hand-written unions widened to the recipe's full option set: `Pagination.size` (`'sm' | 'md' | 'lg'`), `Text.size` (adds `'xs'`), `Heading.size` (`'display'`), `ChatMessageBubble.group` (adds `'none'`), `ScrollArea.fade`, and `Thumbnail.size`. `Alert.variant`/`CommandPalette.isOpen`/`ColorPicker.swatchesPerRow` keep their public names.

### Additions (@var-ui/react)

- **`Combobox.Root`**, **`Select`**/**`Select.Root`**, and **`InputGroup`** accept **`size`** (`'sm' | 'md' | 'lg'`, default `'md'`) and pass it down to their compound parts; **`NumberInput`** gains **`size`** as well.
- **`ColorModeToggle`** and **`Typeahead`** inherit the same size axis through their composed controls.

### Fixes (@var-ui/astro)

- **`Heading`** accepts an optional **`id`**, forwarded to the heading element, so owning sections can use `aria-labelledby`.
- `LayoutContent.role` / `LayoutPanel.role` are typed as the DOM ARIA role union and `Link.referrerpolicy` as the anchor's attribute union; both were loose `string`s that did not type-check against the rendered element.
- `Toc` no longer passes a nonexistent `hideBelow` selection to the recipe (the rail has always hidden itself below `xl` in CSS, so markup is unchanged).

### Fixes (@var-ui/docs)

- `astro check` clean: the kit declares `App.Locals.varDocsRoute` itself, allows `.ts` import specifiers like Astro's presets, and `CodeBlockLayout` no longer passes an invalid `{}` part to `combine()`.

### Tooling

- `astro check` now covers every package that ships `.astro` files (`@var-ui/astro`, `@var-ui/docs`, `@var-ui/docs-components`, `@var-ui/docs-site`) and runs in `vp run ci`; `vp run astro:check` runs them all locally. Previously only the example app's own pages were checked, so library frontmatter was never type-checked.
