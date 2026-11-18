import { describe, expect, it } from 'vite-plus/test';
import {
  createThemeClassMap,
  getDocsThemeStylesHref,
  getLazyThemePresets,
  resolveThemePresets,
} from './presets';
import { extractFontFaces, extractThemeOnlyCss } from './extract-theme-css';

const samplePresets = [
  { id: 'default', label: 'Default', className: 'theme-var-ui-default', swatch: '#64748b' },
  { id: 'forest', label: 'Forest', className: 'theme-var-ui-forest', swatch: '#16a34a' },
];

describe('resolveThemePresets', () => {
  it('defaults lazyCss false for first/default and true for others', () => {
    const resolved = resolveThemePresets(samplePresets);
    expect(resolved[0]?.lazyCss).toBe(false);
    expect(resolved[1]?.lazyCss).toBe(true);
    expect(resolved[1]?.entry).toBe('typestyles-themes/forest.ts');
  });

  it('respects explicit lazyCss / entry', () => {
    const resolved = resolveThemePresets([
      { id: 'custom', label: 'Custom', className: 'x', lazyCss: true, entry: 'themes/custom.ts' },
    ]);
    expect(resolved[0]).toMatchObject({ lazyCss: true, entry: 'themes/custom.ts' });
  });
});

describe('getLazyThemePresets / href', () => {
  it('lists only lazy presets and builds hrefs', () => {
    expect(getLazyThemePresets(samplePresets).map((p) => p.id)).toEqual(['forest']);
    expect(getDocsThemeStylesHref('forest', samplePresets)).toBe('/themes/forest.css');
    expect(getDocsThemeStylesHref('default', samplePresets)).toBeUndefined();
  });

  it('builds class map', () => {
    expect(createThemeClassMap(samplePresets)).toEqual({
      default: 'theme-var-ui-default',
      forest: 'theme-var-ui-forest',
    });
  });
});

describe('extractThemeOnlyCss', () => {
  it('slices from @font-face or theme class', () => {
    const css = '/* head */\n@font-face{font-family:x}\n.theme-var-ui-forest{--c:1}';
    const extracted = extractThemeOnlyCss(css, 'forest');
    expect(extracted).toContain('@font-face{font-family:x}');
    expect(extracted).toContain('.theme-var-ui-forest{--c:1}');
  });

  it('declares the TypeStyles layer order before any @layer blocks', () => {
    const css = `@font-face{font-family:x}
@layer tokens { .theme-var-ui-forest { --c: 1 } }
@layer overrides { .theme-var-ui-forest .var-ui-top-nav { margin: 8px } }`;
    const extracted = extractThemeOnlyCss(css, 'forest');
    expect(
      extracted.startsWith('@layer reset, base, tokens, components, overrides, utilities;'),
    ).toBe(true);
    expect(extracted.indexOf('@layer tokens')).toBeGreaterThan(extracted.indexOf('@layer reset,'));
  });

  it('keeps the theme class inside the @layer block it was emitted in', () => {
    // TypeStyles nests every rule of a layer in one block, so the theme class can sit
    // mid-block. Slicing from it used to drop `@layer tokens {` but keep its `}`, leaving
    // `color-scheme: light dark` unlayered so it beat the layered `data-color-mode` pin.
    const css = `@layer tokens { :root { color-scheme: light dark; }
.theme-var-ui-forest { color-scheme: light dark; --c: 1; }
}
@layer overrides { .theme-var-ui-forest .var-ui-top-nav { margin: 8px } }`;
    const extracted = extractThemeOnlyCss(css, 'forest');
    const body = extracted.replace(
      '@layer reset, base, tokens, components, overrides, utilities;',
      '',
    );
    expect(body.trim().startsWith('@layer tokens {')).toBe(true);
    expect(body).not.toMatch(/:root\s*\{/);
    const opens = (body.match(/\{/g) ?? []).length;
    const closes = (body.match(/\}/g) ?? []).length;
    expect(opens).toBe(closes);
  });

  it('lets the theme tokens beat :root on the document root, whatever the load order', () => {
    const css = `@layer tokens { :root { --c: 0; }
.theme-var-ui-forest { color-scheme: light dark; --c: 1; }
@media (prefers-color-scheme: dark) { .theme-var-ui-forest:not([data-color-mode="light"]) { --c: 2; } }
}`;
    const extracted = extractThemeOnlyCss(css, 'forest');
    expect(extracted).toContain(':root.theme-var-ui-forest, .theme-var-ui-forest {');
    expect(extracted).toContain('--c: 1;');
    // Base styles own color-scheme; a (0,2,0) copy here would tie with the color-mode pin.
    expect(extracted).not.toContain('color-scheme: light dark');
    // Compound selectors are left alone.
    expect(extracted).toContain('.theme-var-ui-forest:not([data-color-mode="light"]) { --c: 2; }');
    expect(extracted).not.toContain(':root.theme-var-ui-forest:not');
  });

  it('throws when theme class missing', () => {
    expect(() => extractThemeOnlyCss('.other{}', 'forest')).toThrow(/No theme CSS/);
  });

  it('drops @font-face rules already present in the base stylesheet', () => {
    const baseFontFaces = extractFontFaces(
      `@font-face { font-family: "JetBrains Mono"; src: url('/fonts/jetbrains-mono.woff2'); font-weight: 100 800; font-style: normal; font-display: swap; unicode-range: U+0000-00FF; }`,
    );
    const themeCss = `@font-face { font-family: "Newsreader"; src: url('/fonts/newsreader.woff2'); font-weight: 200 800; font-style: normal; font-display: swap; }
@font-face { font-family: "JetBrains Mono"; src: url('/fonts/jetbrains-mono.woff2'); font-weight: 100 800; font-style: normal; font-display: swap; unicode-range: U+0000-00FF; }
.theme-var-ui-forest { --c: 1 }`;

    const extracted = extractThemeOnlyCss(themeCss, 'forest', { baseFontFaces });
    expect(extracted).toContain('font-family: "Newsreader"');
    expect(extracted).not.toContain('JetBrains Mono');
    expect(extracted).toContain('.theme-var-ui-forest { --c: 1 }');
    // Without the base set the theme keeps its own copy (legacy behaviour).
    expect(extractThemeOnlyCss(themeCss, 'forest')).toContain('JetBrains Mono');
  });

  it('ignores unicode-range / font-display differences when matching base faces', () => {
    const baseFontFaces = extractFontFaces(
      `@font-face { font-family: "Figtree"; src: url('/fonts/figtree.woff2'); font-weight: 300 900; font-style: normal; unicode-range: U+0000-00FF; }`,
    );
    const themeCss = `@font-face { font-family: "Figtree"; src: url('/fonts/figtree.woff2'); font-weight: 300 900; font-style: normal; font-display: swap; }
.theme-var-ui-forest { --c: 1 }`;

    const extracted = extractThemeOnlyCss(themeCss, 'forest', { baseFontFaces });
    expect(extractFontFaces(extracted)).toHaveLength(0);
    expect(extracted).toContain('.theme-var-ui-forest { --c: 1 }');
  });

  it('keeps faces whose descriptors differ in family, weight, style or src', () => {
    const baseFontFaces = extractFontFaces(
      `@font-face { font-family: "Figtree"; src: url('/fonts/figtree.woff2'); font-weight: 300 900; font-style: normal; }`,
    );
    const themeCss = `@font-face { font-family: "Figtree"; src: url('/fonts/figtree-italic.woff2'); font-weight: 300 900; font-style: italic; }
@font-face { font-family: "Figtree"; src: url('/fonts/figtree.woff2'); font-weight: 400; font-style: normal; }
.theme-var-ui-forest { --c: 1 }`;

    const extracted = extractThemeOnlyCss(themeCss, 'forest', { baseFontFaces });
    expect(extractFontFaces(extracted)).toHaveLength(2);
  });
});
