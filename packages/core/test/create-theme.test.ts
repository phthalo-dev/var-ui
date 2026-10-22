import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { flushSync, getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme, disposeDesignTheme } from '../src/theme/create-theme';
import { defaultTheme, registerDefaultTheme } from '../src/theme/register-default';
import { COLOR_MODE_ATTRIBUTE, DEFAULT_THEME_NAME } from '../src/theme/constants';
import { resetRegisteredFontFaces } from '../src/fonts/register-font-face';
import { registerTestGlobals } from './lib/register-test-globals';
import { override } from '../src/runtime';
import { button } from '../src/components/button';
import { badge } from '../src/components/badge';
import { layoutPanel } from '../src/components/layout';
import { sideNav } from '../src/components/sideNav';
import { designTokens } from '../src/tokens';
import { defaultTokens } from '../src/tokens/preset';

/** Runtime uses scopeId `var-ui` — theme classes are `theme-var-ui-<name>`. */
const themeClass = (name: string) => `.theme-var-ui-${name}`;

/** jsdom rejects `@layer`; layered theme CSS lands on `#typestyles-fallback`. */
const TYPESTYLES_FALLBACK_STYLE_ID = 'typestyles-fallback';

function sheetCssText(): string {
  const style = document.getElementById('typestyles') as HTMLStyleElement | null;
  return Array.from(style?.sheet?.cssRules ?? [])
    .map((rule) => rule.cssText)
    .join('\n');
}

function fallbackCssText(): string {
  return document.getElementById(TYPESTYLES_FALLBACK_STYLE_ID)?.textContent ?? '';
}

/** Live injected CSS: CSSOM on `#typestyles` plus text fallback. */
function liveCssText(): string {
  const style = document.getElementById('typestyles') as HTMLStyleElement | null;
  return [sheetCssText(), style?.textContent ?? '', fallbackCssText()].join('\n');
}

function countInLiveCss(needle: string): number {
  const text = liveCssText();
  let count = 0;
  let from = 0;
  while (from < text.length) {
    const found = text.indexOf(needle, from);
    if (found === -1) return count;
    count += 1;
    from = found + needle.length;
  }
  return count;
}

/** Extract the `.theme-var-ui-<name> { … }` rule from layered theme CSS. */
function themeSurfaceBlock(css: string, name: string): string | undefined {
  const marker = themeClass(name);
  let searchFrom = 0;
  let start = -1;
  while (searchFrom < css.length) {
    const found = css.indexOf(marker, searchFrom);
    if (found === -1) return undefined;
    const next = css[found + marker.length];
    if (next === undefined || next === '{' || next === ' ' || next === ',' || next === '\n') {
      start = found;
      break;
    }
    searchFrom = found + marker.length;
  }
  if (start === -1) return undefined;
  const brace = css.indexOf('{', start);
  if (brace === -1) return undefined;
  let depth = 0;
  for (let i = brace; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(start, i + 1);
    }
  }
  return undefined;
}

describe('createDesignTheme', () => {
  beforeEach(() => {
    reset();
    resetRegisteredFontFaces();
    registerTestGlobals();
    registerDefaultTheme();
  });

  it('registers declared tokens with inheritable @property rules', async () => {
    const { vi } = await import('vite-plus/test');
    vi.resetModules();
    reset();
    registerTestGlobals();
    await import('../src/tokens/declare');
    const css = getRegisteredCss();
    expect(css).toContain(
      '@property --var-ui-fontSize-md { syntax: "<length-percentage>"; inherits: true;',
    );
    expect(css).toContain(
      '@property --var-ui-fontFamily-body { syntax: "*"; inherits: true; initial-value: none;',
    );
    expect(css).toContain(
      '@property --var-ui-shadow-sm { syntax: "*"; inherits: true; initial-value: none;',
    );
    expect(css).toContain(
      '@property --var-ui-easing-standard { syntax: "*"; inherits: true; initial-value: none;',
    );
    expect(css).toContain(
      '@property --var-ui-transition-overlayFade { syntax: "*"; inherits: true; initial-value: none;',
    );
    expect(css).toContain(
      '@property --var-ui-stroke-default { syntax: "*"; inherits: true; initial-value: none;',
    );
  });

  it('emits dark color values via light-dark() on theme tokens', () => {
    defaultTheme.override({
      name: 'color-only-dark',
      tokens: {
        fontSize: { md: '20px' },
        color: {
          tone: {
            accent: {
              foreground: { light: designTokens.color.tone.accent.foreground.var, dark: '#ff0000' },
              background: { light: designTokens.color.tone.accent.background.var, dark: '#ff0000' },
            },
          },
        },
      },
    });
    const css = getRegisteredCss();
    expect(css).toMatch(/--var-ui-color-tone-accent-foreground:\s*light-dark\(/);
    expect(css).toContain('light-dark(');
    expect(css).toContain('#ff0000');
    expect(css).toContain('--var-ui-fontSize-md: 20px');
  });

  it('accepts token refs in tokens.color', () => {
    defaultTheme.override({
      name: 'ref-accent',
      tokens: {
        color: {
          tone: {
            accent: {
              foreground: {
                light: designTokens.color.palette['sky-7'].var,
                dark: designTokens.color.palette['sky-4'].var,
              },
              background: {
                light: designTokens.color.palette['sky-7'].var,
                dark: designTokens.color.palette['sky-4'].var,
              },
            },
          },
        },
      },
    });
    const css = getRegisteredCss();
    expect(css).toMatch(
      /--var-ui-color-tone-accent-foreground:\s*light-dark\(var\(--var-ui-color-palette-sky-7\),\s*var\(--var-ui-color-palette-sky-4\)\)/,
    );
  });

  it('sets color-scheme on the theme surface for light-dark() resolution', () => {
    defaultTheme.override({ name: 'with-surface' });
    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('with-surface')} { color-scheme: light dark`);
    expect(css).not.toContain(`${themeClass('with-surface')} [${COLOR_MODE_ATTRIBUTE}="dark"]`);
  });

  it('does not emit surface color mode rules (surfaces use global color-scheme)', () => {
    defaultTheme.override({ name: 'ambient-only' });

    const css = getRegisteredCss();
    expect(css).not.toContain(`${themeClass('ambient-only')} [${COLOR_MODE_ATTRIBUTE}="dark"]`);
    expect(css).not.toContain(`${themeClass('ambient-only')}[${COLOR_MODE_ATTRIBUTE}="dark"]`);
    expect(css).toMatch(/--var-ui-color-tone-accent-foreground:\s*light-dark\(/);
  });

  it('does not emit prefers-color-scheme color token rules on the theme class', () => {
    defaultTheme.override({ name: 'system-fixture' });

    const css = getRegisteredCss();
    expect(css).not.toMatch(
      /@media \(prefers-color-scheme:\s*dark\)\s*{\s*\.theme-var-ui-system-fixture\s*{/,
    );
    expect(css).not.toContain(`${themeClass('system-fixture')}[${COLOR_MODE_ATTRIBUTE}="dark"]`);
    expect(css).toMatch(/--var-ui-color-tone-accent-foreground:\s*light-dark\(/);
  });

  it('compiles inline { light, dark } leaves in tokens.color to light-dark()', () => {
    defaultTheme.override({
      name: 'inline-mode-leaves',
      tokens: {
        color: {
          background: {
            app: {
              light: 'oklch(95% 0.02 150)',
              dark: 'oklch(23% 0.02 165)',
            },
          },
        },
      },
    });

    const css = `${getRegisteredCss()}\n${liveCssText()}`;
    expect(css).toMatch(/--var-ui-color-background-app:\s*light-dark\(oklch\(95% 0\.02 150\)/);
  });

  it('deep-merges mode-aware color leaves onto the default theme with light-dark()', () => {
    defaultTheme.override({
      name: 'partial-palette',
      tokens: {
        color: {
          tone: {
            accent: {
              foreground: { light: 'oklch(55% 0.2 290)', dark: 'oklch(72% 0.16 290)' },
              background: { light: 'oklch(55% 0.2 290)', dark: 'oklch(72% 0.16 290)' },
            },
          },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toMatch(
      /--var-ui-color-tone-accent-foreground:\s*light-dark\(oklch\(55% 0\.2 290\), oklch\(72% 0\.16 290\)\)/,
    );
  });

  it('custom token namespaces merge refs onto theme.tokens and scope light-dark values', () => {
    const acme = createDesignTheme({
      name: 'acme-custom',
      tokens: {
        ...defaultTokens,
        brand: {
          accent: {
            light: 'blue',
            dark: 'navy',
          },
          halo: 'radial-gradient(circle, red, transparent)',
        },
      },
    });

    expect(acme.tokens.brand.accent).toBe('var(--var-ui-brand-accent)');
    expect(acme.tokens.brand.halo).toBe('var(--var-ui-brand-halo)');
    expect(acme.tokens.color).toBeDefined();

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-custom')}`);
    expect(css).toMatch(/--var-ui-brand-accent:\s*light-dark\(blue, navy\)/);
    expect(css).toContain('--var-ui-brand-halo: radial-gradient(circle, red, transparent)');
  });

  it('custom namespaces keep dark override rules for shadow-like mode-aware leaves', () => {
    createDesignTheme({
      name: 'acme-glow',
      tokens: {
        ...defaultTokens,
        brandGlow: {
          glow: {
            light: '0 0 0 3px oklch(90% 0.1 280)',
            dark: '0 0 16px oklch(70% 0.2 280)',
          },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-brandGlow-glow: 0 0 0 3px oklch(90% 0.1 280)');
    expect(css).toContain(`${themeClass('acme-glow')}[${COLOR_MODE_ATTRIBUTE}="dark"]`);
    expect(css).toContain(`${themeClass('acme-glow')} [${COLOR_MODE_ATTRIBUTE}="dark"]`);
    expect(css).toContain('--var-ui-brandGlow-glow: 0 0 16px oklch(70% 0.2 280)');
  });

  it('components emits overrides under the theme class', () => {
    button({ tone: 'accent', appearance: 'filled', size: 'md' });

    defaultTheme.override({
      name: 'acme-components',
      components: {
        button: {
          styles: ({ tokens: t }) => ({
            base: {
              borderRadius: t.radius.lg.var,
            },
            variants: {
              tone: {
                accent: { textTransform: 'uppercase' },
              },
              appearance: {
                filled: {},
              },
            },
          }),
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toMatch(/@layer overrides/);
    expect(css).toContain(`${themeClass('acme-components')} .var-ui-button`);
    expect(css).toContain('text-transform: uppercase');
  });

  it('components emits typed vars overrides on the var host slot', () => {
    sideNav();

    defaultTheme.override({
      name: 'acme-nav-vars',
      components: {
        'side-nav': {
          vars: { border: 'transparent' },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-nav-vars')} .var-ui-side-nav`);
    expect(css).toContain('--var-ui-side-nav-border: transparent');
  });

  it('components emits layoutPanel vars on the panel host slot', () => {
    layoutPanel();

    defaultTheme.override({
      name: 'acme-layout-panel-vars',
      components: {
        'layout-panel': {
          vars: { border: 'transparent' },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-layout-panel-vars')} .var-ui-layout-panel__panel`);
    expect(css).toContain('--var-ui-layout-panel-border: transparent');
  });

  it('components accepts plain objects and per-key factories', () => {
    button({ tone: 'accent', appearance: 'filled', size: 'md' });
    badge({});

    createDesignTheme({
      name: 'acme-mixed',
      tokens: {
        ...defaultTokens,
        brand: {
          accent: { light: 'blue', dark: 'navy' },
        },
      },
      components: {
        button: {
          styles: ({ tokens: t }) => ({
            base: { color: t.brand.accent },
          }),
        },
        badge: {
          styles: { base: { borderRadius: '999px' } },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-mixed')} .var-ui-button`);
    expect(css).toContain('color: var(--var-ui-brand-accent)');
    expect(css).toContain(`${themeClass('acme-mixed')} .var-ui-badge`);
    expect(css).toContain('border-radius: 999px');
  });

  it('override without selectorPrefix applies globally in overrides layer', () => {
    button({ size: 'sm' });
    override({
      recipe: button,
      layer: 'overrides',
      styles: {
        base: { borderRadius: '999px' },
      },
    });

    const css = getRegisteredCss();
    expect(css).toMatch(/@layer overrides \{[\s\S]*\.var-ui-button \{/);
    expect(css).toContain('border-radius: 999px');
  });

  // @vitest-environment jsdom
  it('replacing a theme with the same name does not grow CSS without bound', () => {
    createDesignTheme({
      name: 'live-edit',
      tokens: { fontSize: { md: '16px' } },
    });
    const afterCreate = getRegisteredCss();
    const createCount = afterCreate.split('.theme-var-ui-live-edit').length - 1;

    for (let i = 0; i < 40; i += 1) {
      createDesignTheme({
        name: 'live-edit',
        tokens: { fontSize: { md: `${16 + (i % 4)}px` } },
      });
    }
    flushSync();
    const afterReplace = getRegisteredCss();
    const replaceCount = afterReplace.split('.theme-var-ui-live-edit').length - 1;
    expect(replaceCount).toBe(createCount);
    expect(afterReplace).toContain('--var-ui-fontSize-md: 19px');
    const liveTheme = themeSurfaceBlock(liveCssText(), 'live-edit');
    expect(liveTheme).toContain('--var-ui-fontSize-md: 19px');
    expect(liveTheme).not.toContain('--var-ui-fontSize-md: 16px');
    expect(countInLiveCss('.theme-var-ui-live-edit')).toBe(1);
  });

  // @vitest-environment jsdom
  // TypeStyles dispose uses key prefixes — theme names that share a segment prefix (e.g. `dark` vs `dark-mode`)
  // must not collide; upstream should use boundary-safe invalidation if that regresses.
  it('disposeDesignTheme does not drop sibling themes with a shared name prefix', () => {
    createDesignTheme({
      name: 'dark',
      tokens: { fontSize: { md: '20px' } },
    });
    createDesignTheme({
      name: 'dark-mode',
      tokens: { fontSize: { md: '22px' } },
    });
    flushSync();

    disposeDesignTheme('dark');
    flushSync();

    const registered = getRegisteredCss();
    const live = liveCssText();
    expect(themeSurfaceBlock(registered, 'dark-mode')).toContain('--var-ui-fontSize-md: 22px');
    expect(themeSurfaceBlock(registered, 'dark-mode')).not.toContain('--var-ui-fontSize-md: 20px');
    expect(themeSurfaceBlock(registered, 'dark')).toBeUndefined();
    expect(themeSurfaceBlock(live, 'dark-mode')).toContain('--var-ui-fontSize-md: 22px');
    expect(themeSurfaceBlock(live, 'dark')).toBeUndefined();
  });

  // @vitest-environment jsdom
  it('disposeDesignTheme unregisters the surface', () => {
    createDesignTheme({
      name: 'ephemeral',
      tokens: { fontSize: { md: '21px' } },
    });
    flushSync();
    expect(themeSurfaceBlock(getRegisteredCss(), 'ephemeral')).toContain(
      '--var-ui-fontSize-md: 21px',
    );
    expect(themeSurfaceBlock(liveCssText(), 'ephemeral')).toContain('--var-ui-fontSize-md: 21px');
    disposeDesignTheme('ephemeral');
    flushSync();
    expect(themeSurfaceBlock(getRegisteredCss(), 'ephemeral')).toBeUndefined();
    expect(themeSurfaceBlock(liveCssText(), 'ephemeral')).toBeUndefined();
  });

  describe('theme fonts', () => {
    beforeEach(() => {
      reset();
      resetRegisteredFontFaces();
      registerTestGlobals();
      registerDefaultTheme();
    });

    it('registers fonts from config', () => {
      createDesignTheme({
        name: 'with-fonts',
        fonts: [
          {
            family: 'Space Grotesk',
            src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
            fontWeight: '300 700',
          },
        ],
      });

      const css = getRegisteredCss();
      expect(css).toContain('@font-face');
      expect(css).toContain('font-family: "Space Grotesk"');
    });

    it('registers fonts on createDesignTheme', () => {
      createDesignTheme({
        name: 'merged-fonts',
        fonts: [
          {
            family: 'JetBrains Mono',
            src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
          },
          {
            family: 'Space Grotesk',
            src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
          },
        ],
      });

      const css = getRegisteredCss();
      expect(css).toContain('font-family: "JetBrains Mono"');
      expect(css).toContain('font-family: "Space Grotesk"');
    });

    describe('default theme', () => {
      beforeEach(() => {
        reset();
        resetRegisteredFontFaces();
        registerTestGlobals();
      });

      it('does not register @font-face rules', () => {
        createDesignTheme({ name: DEFAULT_THEME_NAME, tokens: defaultTokens });
        const css = getRegisteredCss();
        expect(css).not.toContain('@font-face');
      });
    });
  });
});
