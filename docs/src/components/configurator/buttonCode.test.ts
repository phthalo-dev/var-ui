import { describe, expect, it } from 'vite-plus/test';
import { generateButtonCode } from './buttonCode';

describe('generateButtonCode', () => {
  const base = {
    appearance: 'subtle' as const,
    tone: 'neutral' as const,
    size: 'md' as const,
    disabled: false,
    elevated: false,
    label: 'Button',
  };

  it('omits default React props', () => {
    const { code } = generateButtonCode('react', base);
    expect(code).toContain('<Button>Button</Button>');
    expect(code).not.toContain('tone=');
    expect(code).not.toContain('appearance=');
  });

  it('includes non-default React props', () => {
    const { code } = generateButtonCode('react', {
      ...base,
      tone: 'accent',
      appearance: 'filled',
      size: 'lg',
      disabled: true,
    });
    expect(code).toContain('tone="accent"');
    expect(code).toContain('appearance="filled"');
    expect(code).toContain('size="lg"');
    expect(code).toMatch(/ disabled/);
  });

  it('generates Astro markup with disabled', () => {
    const { code, filename } = generateButtonCode('astro', {
      ...base,
      tone: 'danger',
      appearance: 'outline',
      disabled: true,
    });
    expect(filename).toBe('Demo.astro');
    expect(code).toContain('@var-ui/astro');
    expect(code).toContain('disabled');
    expect(code).not.toContain('isDisabled');
  });

  it('generates HTML data attributes', () => {
    const { code, language } = generateButtonCode('html', {
      ...base,
      tone: 'success',
      appearance: 'filled',
      size: 'sm',
    });
    expect(language).toBe('html');
    expect(code).toContain('data-tone="success"');
    expect(code).toContain('data-appearance="filled"');
    expect(code).toContain('data-size="sm"');
  });

  it('includes elevated when enabled', () => {
    const elevated = { ...base, elevated: true };
    expect(generateButtonCode('react', elevated).code).toContain('elevated');
    expect(generateButtonCode('astro', elevated).code).toContain('elevated');
    expect(generateButtonCode('html', elevated).code).toContain('data-elevated');
  });
});
