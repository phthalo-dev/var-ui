import { readFileSync } from 'node:fs';
import { getRegisteredCss, reset } from 'typestyles';
import { afterEach, describe, expect, it } from 'vite-plus/test';

afterEach(() => {
  reset();
});

describe('@var-ui/core/styles', () => {
  it('loads without throwing', async () => {
    await expect(import('../src/styles')).resolves.toBeDefined();
  });

  it('registers the default theme surface when the extraction entry loads', async () => {
    reset();
    const { stylesEntry } = await import('../src/styles');
    stylesEntry.registerDefaultTheme();
    stylesEntry.registerBaseStyles();
    const css = getRegisteredCss();
    expect(css).toContain('.theme-var-ui-default');
    expect(css).toMatch(/--var-ui-color-tone-accent-foreground:\s*light-dark\(/);
  });

  it('exports stylesEntry so vp pack retains the registration graph', () => {
    const source = readFileSync(new URL('../src/styles.ts', import.meta.url), 'utf8');
    expect(source).toMatch(/export const stylesEntry/);
    expect(source).toMatch(/from ['"]\.\/components['"]/);
    expect(source).toMatch(/from ['"]\.\/theme\/base-styles['"]/);
    expect(source).toMatch(/from ['"]\.\/theme\/register-default['"]/);
  });
});
