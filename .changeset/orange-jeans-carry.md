---
'@var-ui/docs-components': minor
'@var-ui/astro': minor
'@var-ui/react': minor
'@var-ui/core': minor
'@var-ui/docs': minor
'@var-ui/cli': minor
---

### Breaking (@var-ui/react)

- **`DropdownMenu`**, **`ContextMenu`**, and **`MoreMenu`** are removed. Use **`Menu.FromSections`**, **`Menu.ContextMenu`**, and **`Menu.Overflow`** on the `Menu` namespace instead.
- Root export **`MenuContent`** is removed; use **`Menu.Content`** when composing custom menus.

### Breaking (@var-ui/core)

- **`theme.componentStyles(recipe, override)`** is removed. Pass TypeStyles **`components`** on **`createDesignTheme`** (namespace keys such as `button`) for typed recipe restyles.
- **`extendTokens`** (and the **`ModeAwareTokenLeaf`** re-export) are removed. Mint custom namespaces via **`createDesignTheme({ tokens: { brand: … } })`**.
- Theme implementation files live under **`packages/core/src/theme/`**; published export paths (`@var-ui/core/theme-constants`, etc.) are unchanged except as noted below.
- **`@var-ui/core/base-styles`** is removed. Document globals (CSS reset, base HTML styles, and `color-scheme` for root / `data-surface`) ship with **`@var-ui/core/styles`** and **`styles.css`**.
- **`typestyles`** is upgraded to **0.26.x** on `@var-ui/core` (native theme `components`).
- **Spinner** recipe uses **`root`** and **`indicator`** slots (update static HTML markup accordingly).

### Additions

- **`@var-ui/astro`**: **`SegmentedControl`** and **`ToggleButton`** with client init scripts.
- Core **`visuallyHidden`** recipe; side nav, spinner, and TOC align with shared patterns.
- Docs: unified **Menu** component page, theme-aware **`VarUiWordmark`**, shared **`@var-ui/docs/utils`** syntax highlighting.

### Migration (menus)

```tsx
// Before
<DropdownMenu trigger={<Button>Actions</Button>} sections={[…]} />

// After
<Menu.FromSections trigger={<Button>Actions</Button>} sections={[…]} />
```

### Migration (theming)

```ts
// Before
extendTokens('brand', { glow: { light: '…', dark: '…' } });

// After — custom namespaces live on the theme
createDesignTheme({
  name: 'acme',
  tokens: {
    brand: { glow: { light: '…', dark: '…' } },
  },
  components: {
    button: ({ tokens: t }) => ({ base: { borderRadius: t.radius.lg.var } }),
  },
});
```
