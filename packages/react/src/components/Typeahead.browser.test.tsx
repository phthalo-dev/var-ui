import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf, settled } from '../test/browser';
import { Typeahead } from './Typeahead';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 40px; width: 260px; }`;
  document.head.append(style);
});

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <div dir={dir}>{children}</div>
        </IconProvider>
      </DesignSystemProvider>
    </StrictMode>
  );
}

const input = () => document.querySelector<HTMLInputElement>('input[role="combobox"]')!;
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const option = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (o) => o.textContent === label,
  )!;
const isOpen = () => popup().matches(':popover-open');

async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

describe('Typeahead on a native popover', () => {
  const typeahead = () => (
    <Wrap>
      <Typeahead label="Fruit" options={OPTIONS} />
    </Wrap>
  );

  test('filters as you type, selects with a click, and the clear button resets', async () => {
    render(typeahead());
    await userEvent.click(input());
    await userEvent.keyboard('ap');
    await raf();
    expect([...document.querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual([
      'Apple',
      'Apricot',
    ]);
    expect(document.activeElement).toBe(input());
    await userEvent.click(option('Apple'));
    await closed();
    expect(input().value).toBe('Apple');
    await userEvent.click(document.querySelector('button[aria-label="Clear"]')!);
    await raf();
    expect(input().value).toBe('');
  });

  test('Escape closes while typing; the input keeps focus', async () => {
    render(typeahead());
    await userEvent.click(input());
    await userEvent.keyboard('ch');
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(input());
  });
});

describe('Typeahead extra', () => {
  test('flips above near the bottom of the viewport and matches the field width', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 70 }}>
          <Typeahead label="Fruit" options={OPTIONS} />
        </div>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('a');
    await settled(popup());
    const p = popup().getBoundingClientRect();
    expect(p.bottom).toBeLessThanOrEqual(input().getBoundingClientRect().top + 1);
    expect(Math.round(p.width)).toBe(
      Math.round(input().parentElement!.getBoundingClientRect().width),
    );
  });

  test('inside a <form> the value submits', async () => {
    const { container } = render(
      <Wrap>
        <form>
          <Typeahead label="Fruit" name="fruit" options={OPTIONS} />
        </form>
      </Wrap>,
    );
    await userEvent.click(input());
    await userEvent.keyboard('ban');
    await raf();
    await userEvent.click(option('Banana'));
    await closed();
    expect(new FormData(container.querySelector('form')!).get('fruit')).toBe('banana');
  });
});
