import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { Checkbox } from './Checkbox';
import { Fieldset } from './Fieldset';
import { TextField } from './TextField';

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <DesignSystemProvider applyToDocument>
      <div dir={dir}>{children}</div>
    </DesignSystemProvider>
  );
}

describe('Fieldset (browser)', () => {
  test('a disabled fieldset disables its controls and Tab skips them', async () => {
    render(
      <Wrap>
        <button type="button">before</button>
        <Fieldset legend="Profile" disabled>
          <TextField label="Name" />
          <Checkbox>Subscribe</Checkbox>
        </Fieldset>
        <button type="button">after</button>
      </Wrap>,
    );
    const input = document.querySelector<HTMLInputElement>(
      'input[type="text"], input:not([type])',
    )!;
    const box = document.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(input.matches(':disabled')).toBe(true);
    expect(box.matches(':disabled')).toBe(true);

    const [before, after] = Array.from(document.querySelectorAll<HTMLElement>('button'));
    before.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(after);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(before);
  });

  test('an enabled fieldset keeps its controls in the Tab order', async () => {
    render(
      <Wrap>
        <Fieldset legend="Profile">
          <TextField label="Name" />
          <Checkbox>Subscribe</Checkbox>
        </Fieldset>
      </Wrap>,
    );
    const input = document.querySelector<HTMLInputElement>('input:not([type="checkbox"])')!;
    await userEvent.tab();
    expect(document.activeElement).toBe(input);
    await userEvent.tab();
    expect(document.activeElement).toBe(document.querySelector('input[type="checkbox"]'));
  });

  test('the disabled fieldset is dimmed and the legend keeps its place', () => {
    render(
      <Wrap>
        <Fieldset legend="Profile" disabled data-testid="fs">
          <span>x</span>
        </Fieldset>
      </Wrap>,
    );
    const el = document.querySelector<HTMLElement>('fieldset')!;
    expect(getComputedStyle(el).opacity).toBe('0.6');
    expect(getComputedStyle(el).borderTopWidth).toBe('0px');
  });

  test('horizontal orientation lays controls in a row; vertical in a column; RTL mirrors', () => {
    const { rerender } = render(
      <Wrap>
        <Fieldset legend="L" orientation="horizontal">
          <span>a</span>
          <span>b</span>
        </Fieldset>
      </Wrap>,
    );
    const content = () => document.querySelector<HTMLElement>('fieldset > div')!;
    const [a, b] = Array.from(content().children) as HTMLElement[];
    expect(a.getBoundingClientRect().top).toBe(b.getBoundingClientRect().top);
    expect(a.getBoundingClientRect().left).toBeLessThan(b.getBoundingClientRect().left);
    rerender(
      <Wrap dir="rtl">
        <Fieldset legend="L" orientation="horizontal">
          <span>a</span>
          <span>b</span>
        </Fieldset>
      </Wrap>,
    );
    const [ra, rb] = Array.from(content().children) as HTMLElement[];
    expect(ra.getBoundingClientRect().left).toBeGreaterThan(rb.getBoundingClientRect().left);
    rerender(
      <Wrap>
        <Fieldset legend="L" orientation="vertical">
          <span>a</span>
          <span>b</span>
        </Fieldset>
      </Wrap>,
    );
    const [va, vb] = Array.from(content().children) as HTMLElement[];
    expect(va.getBoundingClientRect().top).toBeLessThan(vb.getBoundingClientRect().top);
  });

  test('a hidden legend takes no space but still names the group', () => {
    render(
      <Wrap>
        <Fieldset legend="Secret" legendHidden>
          <span>x</span>
        </Fieldset>
      </Wrap>,
    );
    const legend = document.querySelector<HTMLElement>('legend')!;
    expect(legend.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    expect(document.querySelector('fieldset')!.getAttribute('aria-labelledby')).toBeNull();
  });
});
