import { describe, expect, it } from 'vite-plus/test';
import { codeBlockMarkup } from '../../src/components/codeBlockMarkup';

describe('codeBlockMarkup (#194)', () => {
  it('describes every part with the recipe classes and the copy-script hooks', () => {
    const m = codeBlockMarkup({ code: 'pnpm add x\n', language: 'bash', filename: 'install.sh' });
    expect(m.root).toMatchObject({ 'data-language': 'bash' });
    expect(m.root.class).toContain('var-ui-code-block');
    expect(m.language?.text).toBe('Shell');
    expect(m.filename?.text).toBe('install.sh');
    expect(m.copyButton).toMatchObject({
      type: 'button',
      'data-var-ui-code-copy': '',
      'data-var-ui-error-label': 'Copy failed',
      'aria-label': 'Copy code',
    });
    expect(m.feedback).toMatchObject({ role: 'status', 'aria-live': 'polite' });
    // The copy script reads `pre code`, so the source is not in the HTML twice (#336).
    expect(m.copyButton?.['data-var-ui-code']).toBeUndefined();
  });

  it('puts the source on the copy button only with embedCode', () => {
    const m = codeBlockMarkup({ code: 'pnpm add x\n', embedCode: true });
    expect(m.copyButton?.['data-var-ui-code']).toBe('pnpm add x');
  });

  it('drops the actions when not copyable', () => {
    const m = codeBlockMarkup({ code: 'x', copyable: false });
    expect(m.actions).toBeNull();
    expect(m.copyButton).toBeNull();
    expect(m.language).toBeNull();
  });
});
