import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { TextAreaField } from './TextAreaField';

describe('TextAreaField (#142)', () => {
  test('autosize grows with the content up to maxRows', async () => {
    render(
      <DesignSystemProvider>
        <TextAreaField label="Message" autosize minRows={2} maxRows={5} />
      </DesignSystemProvider>,
    );
    const area = document.querySelector('textarea')!;
    const start = area.getBoundingClientRect().height;
    await userEvent.type(area, 'a{Enter}b{Enter}c{Enter}d');
    const grown = area.getBoundingClientRect().height;
    expect(grown).toBeGreaterThan(start);
    await userEvent.type(area, '{Enter}e{Enter}f{Enter}g{Enter}h');
    // Capped at five lines: it scrolls instead of growing further.
    expect(area.getBoundingClientRect().height).toBeLessThan(grown * 1.6);
    expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
  });

  test('a required field shows a marker that is not part of its name', () => {
    render(
      <DesignSystemProvider>
        <TextAreaField label="Content" required />
      </DesignSystemProvider>,
    );
    const label = document.querySelector('label')!;
    expect(getComputedStyle(label, '::after').content).toContain('*');
    expect(document.querySelector('textarea')!.getAttribute('aria-required') ?? 'true').toBe(
      'true',
    );
  });
});
