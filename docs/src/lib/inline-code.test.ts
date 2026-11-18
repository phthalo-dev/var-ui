import { describe, expect, it } from 'vite-plus/test';
import { inlineCodeHtml } from './inline-code';

describe('inlineCodeHtml', () => {
  it('renders backtick spans as code and escapes markup', () => {
    expect(inlineCodeHtml('Renders an `<a>` from `@var-ui/core`.')).toBe(
      'Renders an <code>&lt;a&gt;</code> from <code>@var-ui/core</code>.',
    );
  });
});
